const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { captureScreenshots, extractUrlsFromFiles } = require('./capture-screenshots');
const { getEnv, hasEnv } = require('../config/env');
const { writeVideoApprovalTimeout } = require('../telegram/approval-utils');
const {
  normalizeTtsProvider,
  hasConfiguredTtsProvider,
  hasAnyTtsProvider,
  validateNarrationFile,
} = require('./video-audio');
const { markAudioMissing } = require('./video-audio');
const { validateScenePlan } = require('./scene-plan-validator');
const { renderAllSlides, resolvePreset, closeBrowser: closeSlideBrowser } = require('./render-slide-png');
const { generateReport } = require('./worker-video-report');
const { generateGatilhos } = require('./worker-video-gatilhos');

function shouldAllowEmptyOverlay(scene, plan, index) {
  const narration = String(scene?.narration || '').trim();
  const totalScenes = Array.isArray(plan?.scenes) ? plan.scenes.length : 0;
  const isLastScene = totalScenes > 0 && index === totalScenes - 1;
  const isSilentClosing = isLastScene && !narration;
  return isSilentClosing || Number(scene?.duration || 0) < 0.8;
}

function inferRequestedFormats(platformTargets = [], explicitFormats = []) {
  const rawExplicit = Array.isArray(explicitFormats) ? explicitFormats.map((item) => String(item || '').trim()).filter(Boolean) : [];
  if (rawExplicit.length > 0) return rawExplicit;

  const targets = Array.isArray(platformTargets) ? platformTargets.map((item) => String(item || '').toLowerCase()) : [];
  const hasExplicitWide = targets.some((target) => ['youtube_feed', 'youtube_wide', 'widescreen', 'landscape', '16:9'].includes(target));
  const hasExplicitSquare = targets.some((target) => ['instagram_feed_square', 'feed_square', 'square', '1:1'].includes(target));
  if (hasExplicitWide) return ['16:9'];
  if (hasExplicitSquare) return ['1:1'];
  return ['9:16'];
}

function createWorkerVideoProHandler({
  projectRoot,
  imageProviderName,
  defaultModel,
  renderFfmpeg,
  renderRemotion,
  getVideoRenderer,
  log,
  runClaude,
  waitForFile,
  resolveImageSource,
  getFreeImageProvider,
  getFolderAssets,
  getImageDimensions,
  getProjectAssets,
  formatAssetList,
  getImageProvider,
  readBrandContext,
  videoTimestamp,
  backupIfExists,
  resolveImageReference,
}) {
  return async function handleVideoPro(job) {
    const {
      task_name, task_date, output_dir, project_dir, platform_targets,
      language, campaign_brief,
      video_count = 1, video_briefs = [],
      tts_provider = 'auto',
      video_formats = [],
      video_template = 'auto',
      image_source: rawImageSource = 'brand',
      image_folder = null,
      image_background_color = null,
    } = job.data;
    const proNarrator = job.data.pro_narrator || job.data.narrator || 'rachel';
    const proTtsProvider = job.data.pro_tts_provider || tts_provider;
    const proVideoAudio = job.data.pro_video_audio || job.data.video_audio || 'narration';
    const proDuration = Math.max(10, Number(job.data.pro_duration || job.data.video_duration || 60));
    const proWordsPerSecond = Math.max(1, Number(job.data.pro_words_per_second || 2.5));
    const proNarrationWords = Math.max(30, Number(job.data.pro_narration_words || Math.round(proDuration * proWordsPerSecond)));
    const proNarrationSource = job.data.pro_narration_source || 'creative_brief';
    const proExistingNarrationFile = job.data.pro_existing_narration_file || job.data.existing_narration_file || '';
    const proSourceInstruction = {
      creative_brief: 'Use creative_brief.json + brand_identity.md as the primary source for the Pro script.',
      copywriter_video_narration: 'Use narrative.json -> video_narration as the base and expand/refine it for the Pro duration.',
      research_brief: 'Use research_results.json/research_brief.md + creative_brief.json as the source for the Pro script.',
      manual_existing: 'Prefer the existing narration file when provided; otherwise create a Pro script from the campaign context.',
    }[proNarrationSource] || 'Use creative_brief.json + brand_identity.md as the primary source for the Pro script.';
    const selectedTtsProvider = normalizeTtsProvider(proTtsProvider);
    const hasNarrationProvider = selectedTtsProvider
      ? hasConfiguredTtsProvider(selectedTtsProvider)
      : hasAnyTtsProvider();
    const ttsProviderLabel = selectedTtsProvider || 'auto-fallback';
    const requestedFormats = inferRequestedFormats(platform_targets, video_formats);
    const { source: image_source, folder: imageFolder, color: solidBackgroundColor } = resolveImageSource(
      rawImageSource,
      image_folder,
      image_background_color,
    );
    const absVideoDir = path.resolve(projectRoot, output_dir, 'video');

    // ── Special templates: report and gatilhos (bypass normal flow) ────
    if (video_template === 'report') {
      try {
        const result = await generateReport({
          projectRoot, outputDir: output_dir, projectDir: project_dir,
          taskName: task_name, stylePreset: job.data.style_preset || 'inema_hightech',
          videoAudio: proVideoAudio,
          narrator: proNarrator,
          ttsProvider: proTtsProvider,
          log,
        });
        log(output_dir, 'video_pro', `Report complete: ${result.carousels} carousels, video: ${result.video ? 'yes' : 'no'}`);
        log(output_dir, 'video_pro', 'Completed successfully.');
        return { status: 'completed', type: 'report', ...result };
      } catch (e) {
        log(output_dir, 'video_pro', `Report failed: ${e.message}`);
        return { status: 'failed', reason: e.message };
      }
    }

    if (video_template === 'gatilhos') {
      try {
        // Read brand from research_results.json or brand_identity
        let ctaBrandName = '';
        const resPath = path.resolve(projectRoot, output_dir, 'research_results.json');
        if (fs.existsSync(resPath)) {
          try { ctaBrandName = JSON.parse(fs.readFileSync(resPath, 'utf-8')).brand || ''; } catch {}
        }
        if (!ctaBrandName) {
          const brandCtx = (readBrandContext ? readBrandContext(projectRoot, project_dir) : null) || {};
          ctaBrandName = brandCtx.brand || '';
        }
        // Default CTA brand: project folder name cleaned up, or brand from research
        const ctaBrand = ctaBrandName ? `${ctaBrandName.toUpperCase()}.CLUB` : 'INEMA.CLUB';

        const result = await generateGatilhos({
          projectRoot, outputDir: output_dir, projectDir: project_dir,
          taskName: task_name, stylePreset: job.data.style_preset || 'inema_hightech',
          videoAudio: proVideoAudio,
          narrator: proNarrator,
          ttsProvider: proTtsProvider,
          ctaBrand,
          ctaAction: 'Acesse grátis',
          log,
        });
        log(output_dir, 'video_pro', `Gatilhos complete: ${result.completed}/${result.count} hooks rendered`);
        log(output_dir, 'video_pro', 'Completed successfully.');
        return { status: 'completed', type: 'gatilhos', ...result };
      } catch (e) {
        log(output_dir, 'video_pro', `Gatilhos failed: ${e.message}`);
        return { status: 'failed', reason: e.message };
      }
    }

    const collectFallbackVisualAssets = () => {
      if (image_source === 'solid') return [];
      const seen = new Set();
      const assets = [];
      const addAssets = (items) => {
        for (const item of items || []) {
          if (!item?.path) continue;
          if (seen.has(item.path)) continue;
          if (item.imageType === 'clip') continue;
          seen.add(item.path);
          assets.push(item);
        }
      };

      if (image_source === 'folder' && imageFolder) {
        addAssets(getFolderAssets(imageFolder));
      }

      const absImgsDir = path.resolve(projectRoot, output_dir, 'imgs');
      if (fs.existsSync(absImgsDir)) {
        addAssets(
          fs.readdirSync(absImgsDir)
            .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .map((file) => {
              const fullPath = path.join(absImgsDir, file);
              return { path: fullPath, imageType: 'raw', ...(getImageDimensions(fullPath) || {}) };
            }),
        );
      }

      addAssets(getProjectAssets(project_dir));
      return assets;
    };

    const pickFallbackAssetForScene = (fallbackAssets, sceneIndex) => {
      if (!fallbackAssets.length) return null;
      const portrait = fallbackAssets.filter((asset) => asset.orientation === 'portrait');
      const rawPortrait = portrait.filter((asset) => asset.imageType !== 'banner');
      const preferred = rawPortrait.length > 0 ? rawPortrait : (portrait.length > 0 ? portrait : fallbackAssets);
      return preferred[sceneIndex % preferred.length]?.path || fallbackAssets[sceneIndex % fallbackAssets.length]?.path || null;
    };
    const buildFallbackPhotographyPlan = (narrationTimings) => {
      const fallbackAssets = collectFallbackVisualAssets();
      const maxAudioDuration = narrationTimings.length > 0
        ? Math.max(...narrationTimings.map((timing) => timing.audioDuration || 0))
        : proDuration;
      const totalDuration = Math.max(Math.ceil(maxAudioDuration) + 3, proDuration);
      const shots = [];
      const shotCount = Math.max(video_count * 6, 8);
      const baseDuration = Math.max(3, parseFloat((totalDuration / shotCount).toFixed(1)));
      let cursor = 0;

      for (let index = 0; index < shotCount; index += 1) {
        const isLast = index === shotCount - 1;
        const duration = isLast ? Math.max(3, parseFloat((totalDuration - cursor).toFixed(1))) : baseDuration;
        const imagePath = pickFallbackAssetForScene(fallbackAssets, index);
        shots.push({
          timing: `${cursor.toFixed(1)}s-${(cursor + duration).toFixed(1)}s`,
          start_s: parseFloat(cursor.toFixed(1)),
          end_s: parseFloat((cursor + duration).toFixed(1)),
          duration_s: duration,
          framing: index === 0 ? 'close-up' : index % 3 === 0 ? 'wide-shot' : 'medium-shot',
          motion: ['push-in', 'drift', 'ken-burns-in', 'pan-right'][index % 4],
          image: imagePath,
          image_has_text: !!(imagePath && /(_post|_stories|carousel_|oficial_|logo_|instagram|facebook|_ad\.|banner|calendar)/i.test(imagePath)),
          face_position: 'center',
          text_overlay: isLast ? 'inema.club' : null,
          text_position: 'top',
          image_reason: imagePath ? 'Fallback local após timeout do Photography Director' : 'Sem asset fallback disponível',
          background_color: !imagePath ? (solidBackgroundColor || '#0D0D0D') : undefined,
        });
        cursor += duration;
      }

      return {
        campaign_id: task_name,
        generated_at: new Date().toISOString().slice(0, 10),
        style_preset: 'corporate_clean',
        formats: ['9:16'],
        color_palette: {
          primary: '#0099FF',
          background: '#0D0D0D',
          accent: '#00FF88',
          warning: '#FF6B00',
          text: '#FFFFFF',
        },
        typography: {
          headline_font: 'Lora',
          body_font: 'Inter',
        },
        sections: [
          {
            name: 'Fallback Coverage',
            start_s: 0,
            end_s: totalDuration,
            mood: 'executivo objetivo',
            default_framing: 'medium-shot',
            default_motion: 'push-in',
            overlay: 'dark',
            overlay_opacity: 0.45,
          },
        ],
        shots,
      };
    };

    const vf = (idx, suffix) => `${task_name}_video_${idx}${suffix}`;
    const vfFind = (idx, suffix) => {
      // Template-named scene plans first: e.g. task_video_01_data_story_scene_plan_motion.json
      const tplName = job.data.video_template || 'auto';
      if (tplName !== 'auto') {
        const tplPrefixed = path.resolve(projectRoot, output_dir, 'video', `${task_name}_video_${idx}_${tplName}${suffix}`);
        if (fs.existsSync(tplPrefixed)) return tplPrefixed;
      }
      const prefixed = path.resolve(projectRoot, output_dir, 'video', vf(idx, suffix));
      if (fs.existsSync(prefixed)) return prefixed;
      const legacy = path.resolve(projectRoot, output_dir, 'video', `video_${idx}${suffix}`);
      if (fs.existsSync(legacy)) return legacy;
      return tplName !== 'auto'
        ? path.resolve(projectRoot, output_dir, 'video', `${task_name}_video_${idx}_${tplName}${suffix}`)
        : prefixed;
    };
    fs.mkdirSync(absVideoDir, { recursive: true });

    if (job.data.skip_completed) {
      const hasPro = fs.existsSync(absVideoDir) && fs.readdirSync(absVideoDir).some(f => f.startsWith(`${task_name}_pro_`) && f.endsWith('.mp4'));
      if (hasPro) {
        log(output_dir, 'video_pro', 'Skipping — final video already exists');
        return { status: 'skipped', reason: 'already completed' };
      }
    }

    const lang = language || 'en';
    const langInstruction = lang === 'pt-BR'
      ? 'IMPORTANT: All text overlays, narration and copy MUST be in Brazilian Portuguese (pt-BR).'
      : '';
    const briefInstruction = campaign_brief
      ? `\nCampaign Brief: ${campaign_brief}`
      : '';

    const videoBriefsText = video_briefs.length > 0
      ? video_briefs.map((b, i) => `  ${i + 1}. ${b}`).join('\n')
      : Array.from({ length: video_count }, (_, i) =>
          `  ${i + 1}. Video ${i + 1} — 60 seconds, professional edit with 30-50 rapid cuts`
        ).join('\n');

    const musicDirs = [
      path.resolve(projectRoot, project_dir, 'assets', 'music'),
      path.resolve(projectRoot, project_dir, 'assets', 'audio'),
      path.resolve(projectRoot, project_dir, 'assets'),
    ];
    let musicFiles = [];
    for (const musicDir of musicDirs) {
      if (fs.existsSync(musicDir)) {
        const files = fs.readdirSync(musicDir).filter(f => /\.(mp3|wav|aac|m4a)$/i.test(f) && !f.includes('narration'));
        if (files.length > 0) {
          musicFiles = files.map(f => path.relative(projectRoot, path.join(musicDir, f)));
          break;
        }
      }
    }
    if (musicFiles.length === 0 && hasEnv('FREESOUND_API_KEY')) {
      log(output_dir, 'video_pro', 'No local music found — searching Freesound...');
      try {
        const { searchMusic, downloadPreview } = require('./search-music-freesound');
        const briefText = job.data.campaign_brief || task_name;
        const moodKeywords = briefText.includes('tech') || briefText.includes('ia') ? 'ambient electronic' : 'corporate background';
        const sound = await searchMusic(moodKeywords, '', 30, 120);
        if (sound) {
          const audioDir = path.resolve(projectRoot, output_dir, 'audio');
          const musicPath = await downloadPreview(sound, audioDir);
          if (musicPath) {
            musicFiles = [path.relative(projectRoot, musicPath)];
            log(output_dir, 'video_pro', `Freesound music downloaded: ${path.basename(musicPath)} (${sound.duration.toFixed(1)}s)`);
          }
        } else {
          log(output_dir, 'video_pro', 'No suitable music found on Freesound.');
        }
      } catch (e) {
        log(output_dir, 'video_pro', `Freesound search error: ${e.message}`);
      }
    }

    const musicInstructions = musicFiles.length > 0 ? `
BACKGROUND MUSIC (available files):
${musicFiles.map(f => `  - ${f}`).join('\n')}
- Set "music" in the scene plan to the chosen file path
- Set "music_volume" to 0.10–0.20 (default 0.15)
` : `
BACKGROUND MUSIC: No music files found. Set "music": null in the scene plan.
`;

    const audioInstructions = hasNarrationProvider ? `
AUDIO NARRATION (${ttsProviderLabel} available):
- Source rule: ${proSourceInstruction}
- Write a narration script (${Math.round(proDuration * 0.85)}-${Math.round(proDuration * 0.95)} seconds of natural speech for ${proDuration}s video, about ${proNarrationWords} words)
- Generate narration: node pipeline/generate-audio.js <output.mp3> "<script>" [rachel|bella|domi|antoni|josh|arnold]${selectedTtsProvider ? ` --provider ${selectedTtsProvider}` : ''}
- Save as: ${output_dir}/audio/${task_name}_video_0N_narration.mp3
- Recommended voices: rachel (warm/emotional), bella (clear/friendly), domi (confident), antoni (professional), josh (deep/warm), arnold (bold/energetic)

NARRATION SCRIPT RULES (TTS reads exactly what you write):
- NEVER use currency symbols: "R$ 10" → "dez reais" or just "dez"
- NEVER use abbreviations: "%" → "por cento", "R$" → "reais", "US$" → "dólares"
- Write numbers by extenso: "16%" → "dezesseis por cento", "3x" → "três vezes"
- Write URLs spoken form: "inema.club" → "inema ponto club"
- Avoid special characters the TTS might misread: &, @, #, /, etc.
${musicInstructions}` : `
AUDIO: no TTS provider configured. Generate silent videos. Narration scripts only.
${musicInstructions}`;

    const providerNameEditor = job.data.image_provider || imageProviderName;
    let imageSourceSection = '';
    if (image_source === 'api') {
      imageSourceSection = `
IMAGE SOURCE: ${providerNameEditor} API (images will be generated AFTER you write the scene plan)
- Set "image": null for all scenes
- Add "image_prompt" field per scene: concise English description (max 200 chars)
- The pipeline generates one image per UNIQUE prompt, then maps it to multiple cuts
- Output a "unique_images" field listing distinct prompts (max 15)
- Multiple cuts can share the same generated image with different crop_focus and motion`;
    } else if (image_source === 'free') {
      const freeProvider = getFreeImageProvider(job.data.free_image_provider);
      if (freeProvider) {
        const authNote = freeProvider.authHeader
          ? `Header: ${freeProvider.authHeader}: ${freeProvider.key}`
          : `Parameter: key=${freeProvider.key}`;
        imageSourceSection = `
IMAGE SOURCE: ${freeProvider.name.toUpperCase()} (free stock photos)
- Search: GET ${freeProvider.searchUrl}?query=<theme>&per_page=10&orientation=portrait
  ${authNote}
- Download 10-15 unique photos to ${output_dir}/imgs/
- Map multiple cuts to the same photo with different crop_focus and motion`;
      } else {
        imageSourceSection = `
IMAGE SOURCE: no free provider configured (set PEXELS_API_KEY, UNSPLASH_ACCESS_KEY, or PIXABAY_API_KEY in .env)`;
      }
    } else if (image_source === 'folder') {
      const folderAssets = imageFolder ? getFolderAssets(imageFolder) : [];
      const folderList = formatAssetList(folderAssets);
      if (folderAssets.length > 0) {
        imageSourceSection = `
FOLDER IMAGES (study dimensions — reuse creatively across 30-50 cuts):
${folderList}

REUSE STRATEGY (with ${folderAssets.length} images for 30-50 cuts):
- Same image + different crop_focus = visually distinct
- Same image + different motion = feels new
- Same image + different overlay = different mood
- Maximum 5 uses per image
- Never assign same image to 2 CONSECUTIVE cuts`;
      } else {
        imageSourceSection = `
IMAGE SOURCE: folder "${imageFolder || '(not specified)'}" — no images found`;
      }
    } else if (image_source === 'screenshot') {
      const briefPath = path.resolve(projectRoot, output_dir, 'creative', 'creative_brief.json');
      const researchPath = path.resolve(projectRoot, output_dir, 'research_results.json');
      const productPath = path.resolve(projectRoot, project_dir, 'knowledge', 'product_campaign.md');
      const extractedUrls = extractUrlsFromFiles([briefPath, researchPath, productPath]);
      const explicitUrls = job.data.screenshot_urls || [];
      const allUrls = [...new Set([...explicitUrls, ...extractedUrls])];
      log(output_dir, 'video_pro', `Capturing screenshots from ${allUrls.length} URLs: ${allUrls.join(', ')}`);
      const screenshotAssets = await captureScreenshots(allUrls, path.resolve(projectRoot, output_dir));
      const brandAssets = getProjectAssets(project_dir);
      const combinedAssets = [...screenshotAssets, ...brandAssets];
      const assetList = formatAssetList(combinedAssets);
      imageSourceSection = `
SCREENSHOT + BRAND IMAGES (${screenshotAssets.length} screenshots + ${brandAssets.length} brand assets):
${assetList}

Screenshots are real captures of the brand's website/product. Prioritize them for:
- Showing the actual product interface
- Social proof (real content, real community)
- Visual reference for brand style
Combine with brand photos (Nei, logos, banners) for variety.

REUSE STRATEGY (with ${combinedAssets.length} images for 30-50 cuts):
- Same image + different crop_focus = visually distinct
- Same image + different motion = feels new
- Same image + different overlay = different mood
- Maximum 5 uses per image
- Never assign same image to 2 CONSECUTIVE cuts`;
      log(output_dir, 'video_pro', `Screenshots captured: ${screenshotAssets.length}, brand: ${brandAssets.length}`);
    } else if (image_source === 'solid') {
      imageSourceSection = `
SOLID BACKGROUND ONLY
- Do not use image assets in any cut
- Set "image": null in every cut
- Set "image_prompt": null in every cut
- Set "background_color": "${solidBackgroundColor || '#0D0D0D'}" in every cut
- Use motion, transitions, typography, particles, overlays, and composition changes to create variation
- The video must feel premium and kinetic even without photography`;
    } else {
      const brandAssets = getProjectAssets(project_dir);
      const assetList = formatAssetList(brandAssets);
      imageSourceSection = `
BRAND IMAGES (study dimensions — reuse creatively across 30-50 cuts):
${assetList}

REUSE STRATEGY (with ${brandAssets.length} images for 30-50 cuts):
- Same image + different crop_focus = visually distinct (center-top vs center-bottom vs left)
- Same image + different motion = feels new (zoom_in intimate vs pan_right discovery)
- Same image + different overlay = different mood (dark vs warm vs cool)
- Maximum 5 uses per image
- Never assign same image to 2 CONSECUTIVE cuts`;
    }

    const absAudioDir = path.resolve(projectRoot, output_dir, 'audio');
    fs.mkdirSync(absAudioDir, { recursive: true });
    if (proVideoAudio !== 'none' && proExistingNarrationFile) {
      const absExistingNarration = path.resolve(projectRoot, proExistingNarrationFile);
      if (fs.existsSync(absExistingNarration)) {
        for (let i = 1; i <= video_count; i++) {
          const idx = String(i).padStart(2, '0');
          const targetPath = path.resolve(absAudioDir, `${task_name}_video_${idx}_narration.mp3`);
          if (path.resolve(absExistingNarration) !== path.resolve(targetPath) && !fs.existsSync(targetPath)) {
            fs.copyFileSync(absExistingNarration, targetPath);
          }
        }
        log(output_dir, 'video_pro', `Using existing Pro narration: ${proExistingNarrationFile}`);
      } else {
        log(output_dir, 'video_pro', `Configured Pro narration not found: ${proExistingNarrationFile}`);
      }
    }
    let narrationExists = false;
    for (let i = 1; i <= video_count; i++) {
      const idx = String(i).padStart(2, '0');
      const narPath = path.resolve(absAudioDir, `${task_name}_video_${idx}_narration.mp3`);
      if (fs.existsSync(narPath)) { narrationExists = true; break; }
    }

    if (proVideoAudio !== 'none' && !narrationExists && !hasNarrationProvider) {
      log(output_dir, 'video_pro', `Audio required but no TTS provider is available for stage 3 (provider=${ttsProviderLabel}).`);
      markAudioMissing(projectRoot, output_dir, 'no_tts_provider');
      process.stdout.write(`[STAGE3_AUDIO_REQUIRED] ${output_dir} pro provider=${ttsProviderLabel}\n`);
      return { status: 'failed', reason: `audio required for video_pro: ${ttsProviderLabel}` };
    }

    if (!narrationExists && hasNarrationProvider) {
      log(output_dir, 'video_pro', 'Phase 1: Generating narration (Sonnet)...');
      const narrationPrompt = `You are a professional copywriter creating narration for a video ad.

Read these files to understand the campaign:
- ${project_dir}/knowledge/brand_identity.md
- ${output_dir}/creative/creative_brief.json
${langInstruction}${briefInstruction}

For each of the ${video_count} video(s), write a narration script.
Source rule: ${proSourceInstruction}
Target duration: ${proDuration} seconds (${proNarrationWords} words for pt-BR at ~${proWordsPerSecond} words/sec).
Then generate the audio using: node pipeline/generate-audio.js <output.mp3> "<script>" ${proNarrator}${selectedTtsProvider ? ` --provider ${selectedTtsProvider}` : ''}
Save narration to: ${output_dir}/audio/${task_name}_video_0N_narration.mp3
Voice: ${proNarrator} — use this EXACT Pro voice
Preferred TTS provider: ${ttsProviderLabel}

IMPORTANT: ONLY generate narration audio files. Do NOT create scene plans or any other files.
After generating all narrations, print: [NARRATION_DONE]`;

      await runClaude(narrationPrompt, 'video_pro', output_dir, 300000, { model: 'sonnet' });
      log(output_dir, 'video_pro', 'Narration generated.');
    } else {
      log(output_dir, 'video_pro', 'Narration already exists, skipping.');
    }

    if (proVideoAudio !== 'none') {
      for (let i = 1; i <= video_count; i++) {
        const idx = String(i).padStart(2, '0');
        const narPath = path.resolve(absAudioDir, `${task_name}_video_${idx}_narration.mp3`);
        if (!fs.existsSync(narPath)) {
          const reason = `missing narration audio for video ${idx}`;
          log(output_dir, 'video_pro', reason);
          process.stdout.write(`[STAGE3_AUDIO_REQUIRED] ${output_dir} pro video_${idx} reason=${reason}\n`);
          return { status: 'failed', reason };
        }
        const validation = validateNarrationFile(narPath);
        if (!validation.ok) {
          const reason = `invalid narration audio for video ${idx}: ${validation.reason}`;
          log(output_dir, 'video_pro', reason);
          markAudioMissing(projectRoot, output_dir, validation.reason);
          process.stdout.write(`[STAGE3_AUDIO_REQUIRED] ${output_dir} pro video_${idx} reason=${validation.reason}\n`);
          return { status: 'failed', reason };
        }
      }
    }

    log(output_dir, 'video_pro', 'Phase 1.5: Analyzing narration audio timing...');

    const narrationFiles = [];
    const narrationTimings = [];
    for (let i = 1; i <= video_count; i++) {
      const idx = String(i).padStart(2, '0');
      const narPath = `${output_dir}/audio/${task_name}_video_${idx}_narration.mp3`;
      const absNarPath = path.resolve(projectRoot, narPath);
      if (!fs.existsSync(absNarPath)) continue;
      narrationFiles.push(narPath);

      let audioDuration = 0;
      try {
        const probe = execFileSync('ffprobe', [
          '-v', 'quiet', '-show_entries', 'format=duration',
          '-of', 'csv=p=0', absNarPath,
        ], { encoding: 'utf-8', timeout: 10000 }).trim();
        audioDuration = parseFloat(probe) || 0;
        log(output_dir, 'video_pro', `Audio ${idx} duration: ${audioDuration.toFixed(1)}s`);
      } catch (e) {
        log(output_dir, 'video_pro', `ffprobe failed for ${narPath}: ${e.message.slice(0, 100)}`);
      }

      const timingPath = path.resolve(projectRoot, output_dir, 'audio', `${task_name}_video_${idx}_timing.json`);
      if (fs.existsSync(timingPath) && audioDuration > 0) {
        try {
          const saved = JSON.parse(fs.readFileSync(timingPath, 'utf-8'));
          if (saved.segments && saved.segments.length > 0) {
            narrationTimings.push({ video: idx, audioDuration, totalWords: saved.totalWords, segments: saved.segments });
            log(output_dir, 'video_pro', `Audio timing loaded from file: ${saved.segments.length} segments, ${saved.totalWords} words in ${audioDuration.toFixed(1)}s`);
            continue;
          }
        } catch {}
      }

      let narrationScript = '';
      try {
        const proLog = fs.readFileSync(path.resolve(projectRoot, output_dir, 'logs', 'video_pro.log'), 'utf-8');
        const scriptMatch = proLog.match(/Script utilizado.*?\n\n?>\s*\*?"?([\s\S]*?)\*?"?\n\n/);
        if (scriptMatch) narrationScript = scriptMatch[1].replace(/\*/g, '').trim();
      } catch {}

      if (audioDuration > 0 && narrationScript) {
        const sentences = narrationScript.split(/(?<=[.?!])\s+/).filter(s => s.trim());
        const totalWords = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0);
        let currentTime = 0;
        const segments = sentences.map(sentence => {
          const wordCount = sentence.split(/\s+/).length;
          const duration = (wordCount / totalWords) * audioDuration;
          const segment = {
            text: sentence.trim(),
            start: parseFloat(currentTime.toFixed(2)),
            end: parseFloat((currentTime + duration).toFixed(2)),
            duration: parseFloat(duration.toFixed(2)),
            words: wordCount,
          };
          currentTime += duration;
          return segment;
        });

        narrationTimings.push({ video: idx, audioDuration, totalWords, segments });
        fs.writeFileSync(timingPath, JSON.stringify({ audioDuration, totalWords, segments }, null, 2));
        log(output_dir, 'video_pro', `Audio timing: ${segments.length} segments, ${totalWords} words in ${audioDuration.toFixed(1)}s`);
      } else if (audioDuration > 0) {
        narrationTimings.push({ video: idx, audioDuration, totalWords: 0, segments: [] });
        log(output_dir, 'video_pro', `Audio timing (duration only, no script): ${audioDuration.toFixed(1)}s`);
      }
    }

    let narrationNote = '';
    if (narrationFiles.length > 0 && narrationTimings.length > 0) {
      const t = narrationTimings[0];
      const timingTable = t.segments.map(s =>
        `  ${s.start.toFixed(1)}s-${s.end.toFixed(1)}s (${s.duration.toFixed(1)}s): "${s.text.slice(0, 80)}${s.text.length > 80 ? '...' : ''}"`
      ).join('\n');
      narrationNote = `Narration audio already generated:
${narrationFiles.map(f => `  - ${f}`).join('\n')}

CRITICAL — EXACT AUDIO TIMING (from ffprobe analysis):
Total audio duration: ${t.audioDuration.toFixed(1)}s
video_length MUST be ${Math.ceil(t.audioDuration) + 3}s (audio + 3s breathing room at end — NEVER shorter than audio)

Sentence-by-sentence timing (your scene cuts MUST align with these):
${timingTable}

RULES:
- The sum of all scene durations MUST equal ${Math.ceil(t.audioDuration) + 3}s (audio + 3s)
- The last 3s should be a silent closing shot (CTA visual, logo, or URL)
- Each scene MUST have a "narration" field with the EXACT transcript segment spoken during that scene
- Scene transitions must happen at sentence boundaries (±0.3s tolerance)
- text_overlay must reinforce the sentence being spoken at that moment — NOT generic text
- Scenes during silent portions (intro flash, closing): narration = ""
- Do NOT invent text_overlay that contradicts or ignores what the narrator is saying`;
    } else if (narrationFiles.length > 0) {
      narrationNote = `Narration audio already generated:\n${narrationFiles.map(f => `  - ${f}`).join('\n')}\nDo NOT regenerate narration. Use it as timing reference.`;
    } else {
      narrationNote = 'No narration audio available.';
    }

    const photoQuality = job.data.photo_quality || 'simples';
    const photoplanPath = path.resolve(projectRoot, output_dir, 'video', 'photography_plan.json');
    if (!fs.existsSync(photoplanPath) && photoQuality === 'simples') {
      // Simples mode: skip Photography Director agent, use automatic plan
      log(output_dir, 'video_pro', 'Phase 1.6: Auto photography plan (simples mode)...');
      const fallbackPlan = buildFallbackPhotographyPlan(narrationTimings);
      fallbackPlan.style_preset = job.data.style_preset || 'inema_hightech';
      fs.writeFileSync(photoplanPath, JSON.stringify(fallbackPlan, null, 2), 'utf-8');
      log(output_dir, 'video_pro', 'Photography plan created (auto/simples).');
    } else if (!fs.existsSync(photoplanPath)) {
      const photoModel = photoQuality === 'premium' ? 'opus' : 'sonnet';
      const photoLabel = photoQuality === 'premium' ? 'Premium/Opus' : 'Simples/Sonnet';
      log(output_dir, 'video_pro', `Phase 1.6: Photography Director (${photoLabel})...`);
      process.stdout.write(`[VIDEO_PRO_PROGRESS] ${output_dir} photography_director\n`);

      const absImgsDir2 = path.resolve(projectRoot, output_dir, 'imgs');
      const absAssetsDir = path.resolve(projectRoot, project_dir, 'assets');
      const proImageDir = job.data.pro_image_dir ? path.resolve(projectRoot, job.data.pro_image_dir) : null;
      const imgExts = ['.jpg', '.jpeg', '.png', '.webp'];
      const listImages = (dir, label) => {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir)
          .filter(f => imgExts.includes(path.extname(f).toLowerCase()))
          .map(f => `  - ${path.relative(projectRoot, path.join(dir, f))} [${label}]`);
      };
      const campaignImages = [
        ...listImages(absImgsDir2, 'CAMPANHA/imgs — PRIORIDADE 1'),
        ...(proImageDir ? listImages(proImageDir, 'DIRETÓRIO CUSTOMIZADO — PRIORIDADE 1') : []),
      ];
      const brandImages = listImages(absAssetsDir, 'MARCA/assets — PRIORIDADE 2');
      const imageListForPhoto = `
PRIORITY 1 — Campaign images (USE THESE FIRST):
${campaignImages.length > 0 ? campaignImages.join('\n') : '  (nenhuma imagem da campanha disponível)'}

PRIORITY 2 — Brand assets (use only if campaign images are insufficient):
${brandImages.length > 0 ? brandImages.join('\n') : '  (nenhum asset da marca)'}

NOTE: ads/ (carousel/static ad images) are NOT included — video pro uses raw images, not pre-composed ads.

CRITICAL RULES:
- ALWAYS prioritize campaign images (imgs/) over brand assets
- Classify EACH image as "clean" (no embedded text) or "has_text" (has text/logo)
- NEVER put text_overlay on images classified as "has_text"
- Images with _post, _stories, oficial_, logo_, instagram, facebook in name → likely has_text
- If using a brand asset instead of campaign image, explain WHY in "image_reason"`;

      let photoDirPrompt;
      if (photoQuality === 'premium') {
        photoDirPrompt = `You are the Photography Director (Diretor de Fotografia). Follow the skill defined in skills/photography-director/SKILL.md exactly.

You think like a CINEMATOGRAPHER. You define the complete visual language BEFORE the editor creates the scene plan.

Task: Create the photography plan for ${video_count} video(s) — "${task_name}" campaign.
Platforms: ${platform_targets.join(', ')}
${langInstruction}

STEP 1 — Read ALL these files:
- ${project_dir}/knowledge/brand_identity.md
- ${output_dir}/creative/creative_brief.json
- skills/photography-director/SKILL.md
- skills/video-engineering/style-dictionary.json — CRITICAL: exact spring/easing/color values per style
- skills/video-engineering/SKILL.md — engineering manual
- skills/video-art-direction/SKILL.md
- skills/typography-on-image/SKILL.md
- skills/image-generation/model-profiles.json — prompt guidelines per image model (when image_source=api)

STEP 2 — Audio timing:
${narrationNote}

STEP 3 — Available images (READ THE PRIORITY RULES):
${imageListForPhoto}

STEP 4 — Create the photography plan following SKILL.md exactly.
Save to: ${output_dir}/video/photography_plan.json

The plan must define: style_preset, formats, color_palette, typography, sections with mood/framing/motion, and individual shots covering 100% of the narration timing.

For EACH shot, you MUST specify:
- Which specific image file to use (full path)
- Whether the image has embedded text (image_has_text: true/false)
- If image_has_text is true, set text_overlay to null (no text on this shot)
- The typography (font, size, weight, position) — the Scene Plan MUST follow these exactly

CONTENT FILTER (MANDATORY):
- REJECT images containing: weapons, violence, nudity, drugs, controversial symbols
- Context: Brazilian professionals 25-45 years old
- Images must reflect Brazilian diversity
- When using image_source=api, include in prompts: "Brazilian professionals, diverse, modern, technology"
- Avoid clearly American/European settings without Brazilian context
- Classify unsuitable images as "unsuitable" — never use them

IMPORTANT: Output ONLY the photography_plan.json file. Do NOT create scene plans or render anything.`;
      } else {
        const readFileCompact = (filePath) => {
          const abs = path.resolve(projectRoot, filePath);
          if (!fs.existsSync(abs)) return '(arquivo não encontrado)';
          return fs.readFileSync(abs, 'utf-8').slice(0, 4000);
        };
        const brandIdentity = readFileCompact(`${project_dir}/knowledge/brand_identity.md`);
        const creativeBrief = readFileCompact(`${output_dir}/creative/creative_brief.json`);
        let styleDict = '';
        try {
          const sd = JSON.parse(fs.readFileSync(path.resolve(projectRoot, 'skills/video-engineering/style-dictionary.json'), 'utf-8'));
          const compact = Object.fromEntries(Object.entries(sd).map(([k, v]) => [k, { color: v.color, motion: v.motion, typography: v.typography }]));
          styleDict = JSON.stringify(compact, null, 1);
        } catch { styleDict = readFileCompact('skills/video-engineering/style-dictionary.json'); }

        photoDirPrompt = `You are the Photography Director. Create the photography plan for ${video_count} video(s) — "${task_name}" campaign.
Platforms: ${platform_targets.join(', ')}. ${langInstruction}

═══ BRAND IDENTITY ═══
${brandIdentity}

═══ CREATIVE BRIEF ═══
${creativeBrief}

═══ STYLE DICTIONARY (color/motion/typography per preset) ═══
${styleDict}

═══ AUDIO TIMING ═══
${narrationNote}

═══ AVAILABLE IMAGES ═══
${imageListForPhoto}

═══ PHOTOGRAPHY PLAN RULES ═══
1. Choose 1 of 12 style presets: neon_futurista, warm_lifestyle, corporate_clean, bold_pop, minimal_zen, dark_cinematic, pastel_soft, retro_vintage, nature_organic, urban_street, luxury_gold, editorial_documentary
2. Default format is 9:16. Only use 1:1 or 16:9 if explicitly requested in the payload/platform plan.
3. For each shot define: framing (extreme-close-up/close-up/medium-shot/wide-shot/detail-shot/overhead), motion (push-in/pull-out/pan-right/drift/ken-burns-in/zoom-in/breathe/parallax-zoom), mood, image file, text_overlay (max 6 words)
4. Classify each image: "clean" (no text) or "has_text" (has text/logo) or "unsuitable"
5. image_has_text:true → text_overlay:null. NEVER text on images with embedded text
6. Never same framing 3x in row. Never same motion 2x in row
7. FACE DETECTION — for each shot, analyze the image and set "face_position": "top" | "center" | "bottom" | "none". Then set text_position to AVOID the face:
   - face_position: "top" → text_position: "center" (text below the face)
   - face_position: "center" → text_position: "top" (text above the face)
   - face_position: "bottom" → text_position: "top"
   - face_position: "none" → text_position: "top" (default)
   - NEVER "bottom" for text — mobile UI covers bottom area
8. First shot ≤1.5s. Last shot ≥3s. Cover 100% of narration timing
9. Typography: Oswald 96-140px for hooks, Montserrat 72-96px for body, Playfair 64-80px for editorial
10. Energy curve: Hook(5)→Problem(3)→Solution(4-5)→Proof(4)→CTA(3)

Save to: ${output_dir}/video/photography_plan.json
Output ONLY the JSON file. Do NOT create scene plans or render anything.`;
      }

      const photoTimeout = photoQuality === 'premium' ? 600000 : 300000;
      try {
        await runClaude(photoDirPrompt, 'video_pro', output_dir, photoTimeout, { model: photoModel });
        log(output_dir, 'video_pro', `Photography plan created (${photoLabel}).`);
      } catch (error) {
        const fallbackPlan = buildFallbackPhotographyPlan(narrationTimings);
        fs.writeFileSync(photoplanPath, JSON.stringify(fallbackPlan, null, 2), 'utf-8');
        log(output_dir, 'video_pro', `Photography Director timed out — using fallback plan: ${error.message.slice(0, 200)}`);
        log(output_dir, 'video_pro', 'Photography plan created via fallback assets.');
        process.stdout.write(`[VIDEO_PRO_FALLBACK] ${output_dir} photography_director_timeout\n`);
      }
    } else {
      log(output_dir, 'video_pro', 'Photography plan already exists, skipping.');
    }

    await job.extendLock(job.token, 900000).catch(() => {});

    let photographyNote = '';
    if (fs.existsSync(photoplanPath)) {
      try {
        const photoPlan = JSON.parse(fs.readFileSync(photoplanPath, 'utf-8'));
        photographyNote = `
PHOTOGRAPHY PLAN (from Photography Director — FOLLOW THESE DECISIONS):
Style: ${photoPlan.style_preset || 'not set'}
Formats: ${requestedFormats.join(', ')}
Colors: ${JSON.stringify(photoPlan.color_palette || {})}
Typography: headline=${photoPlan.typography?.headline_font || 'Montserrat'}, body=${photoPlan.typography?.body_font || 'Inter'}

Sections:
${(photoPlan.sections || []).map(s => `  ${s.name} (${s.start_s || '?'}s-${s.end_s || '?'}s): mood=${s.mood || '?'}, framing=${s.default_framing || '?'}, motion=${s.default_motion || '?'}, overlay=${s.overlay || 'dark'} ${s.overlay_opacity || 0.45}`).join('\n')}

Shots (${(photoPlan.shots || photoPlan.scenes || []).length} defined):
${(photoPlan.shots || photoPlan.scenes || []).slice(0, 10).map(s => `  ${s.timing || s.start_s + 's'}: ${s.framing} + ${s.motion} | face:${s.face_position || '?'} → text:${s.text_position || '?'} | "${(s.text_overlay || '').slice(0, 30)}" | img: ${(s.image || s.image_prompt || '').split('/').pop().slice(0, 40)}`).join('\n')}
${(photoPlan.shots || photoPlan.scenes || []).length > 10 ? `  ... (${(photoPlan.shots || photoPlan.scenes).length} total — read the full file)` : ''}

CRITICAL: You MUST follow the Photography Director's decisions. Do NOT override style, framing, motion, or color choices. Your job is ONLY to create the edit timeline (scene plan) using these visual decisions.
Read the full photography_plan.json for all shots.`;
      } catch (e) {
        log(output_dir, 'video_pro', `Could not parse photography_plan.json: ${e.message}`);
      }
    }

    const sceneQuality = job.data.scene_quality || 'simples';
    const sceneModel = sceneQuality === 'premium' ? 'opus' : 'sonnet';
    const sceneLabel = sceneQuality === 'premium' ? 'Premium/Opus' : 'Simples/Sonnet';
    log(output_dir, 'video_pro', `Phase 2: Creating scene plan (${sceneLabel})...`);

    let photoPlanContent = '';
    const photoPlanPath2 = path.resolve(projectRoot, output_dir, 'video', 'photography_plan.json');
    if (fs.existsSync(photoPlanPath2)) {
      try {
        const fullPlan = JSON.parse(fs.readFileSync(photoPlanPath2, 'utf-8'));
        const compact = {
          style_preset: fullPlan.style_preset,
          color_palette: fullPlan.color_palette,
          video_length: fullPlan.video_length || proDuration,
          typography: fullPlan.typography,
          shots: (fullPlan.shots || fullPlan.scenes || []).map(s => ({
            timing: s.timing || `${s.start_s || s.start_time || 0}s`,
            start_s: s.start_s || s.start_time || 0,
            end_s: s.end_s || s.end_time || ((s.start_s || s.start_time || 0) + (s.duration_s || s.duration || 0)),
            dur: s.duration_s || s.duration || 0,
            image: s.image || s.image_file,
            has_text: s.image_has_text || false,
            face_position: s.face_position || 'none',
            framing: s.framing,
            motion: s.motion,
            text: s.text_overlay,
            text_position: s.text_position,
            section: s.section || s.label,
          })),
        };
        photoPlanContent = JSON.stringify(compact, null, 2);
      } catch {
        photoPlanContent = fs.readFileSync(photoPlanPath2, 'utf-8');
      }
    }

    let videoDur = proDuration;
    if (narrationTimings.length > 0 && narrationTimings[0].audioDuration) {
      const audioDur = narrationTimings[0].audioDuration;
      const audioBasedDur = Math.ceil(audioDur) + 3;
      if (audioBasedDur > videoDur) {
        log(output_dir, 'video_pro', `Adjusting video_length: ${videoDur}s → ${audioBasedDur}s (audio ${audioDur.toFixed(1)}s + 3s)`);
        videoDur = audioBasedDur;
      }
    }

    // ── Template instructions ──────────────────────────────────────────────
    const templateName = video_template || 'auto';
    log(output_dir, 'video_pro', `Template: ${templateName}`);

    const VISUAL_TYPE_SCHEMA = `
VISUAL_TYPE — each scene MUST have a "visual_type" field. Available types:
  - "photo": Raw photographic image + text overlay + camera motion (DEFAULT, current behavior)
  - "chart": Data visualization. Required fields: "chart_type" (bar|line|pie|donut), "chart_title", "chart_data" (array of {label, value, color?}). Optional: "visual_colors" {bg, primary, accent, text, grid}. NO motion, NO image.
  - "text_card": Typography card with styled background. Required: "card_title", "card_body". Optional: "card_bg" (color/gradient), "card_text_color", "card_accent". NO motion, NO image.
  - "list": Numbered/bulleted items. Required: "list_title", "list_items" (array of strings or {text}). Optional: "list_numbered" (bool), "visual_colors". NO motion, NO image.
  - "split": Side-by-side comparison. Required: "split_left" (image path), "split_right" (image path), "split_label_left", "split_label_right". Optional: "visual_colors". NO motion.

RULES for visual_type:
- "photo" scenes follow ALL existing rules (motion, text_overlay, image_has_text, etc.)
- Non-photo scenes: do NOT include "image", "motion", or "image_has_text" fields
- Non-photo scenes CAN have "text_overlay" for ASS subtitle (rendered separately from the visual)
- chart_data example: [{"label":"Manual","value":30,"color":"#FF4444"},{"label":"Auto","value":70,"color":"#00C851"}]
- When narration mentions a NUMBER, PERCENTAGE, or COMPARISON → prefer "chart" or "text_card" over "photo"
- When narration lists steps or features → prefer "list"
- When narration describes before/after → prefer "split"

TEMPLATE OVERRIDE — text_overlay on photo scenes:
- IGNORE the rule "image_has_text:true → text_overlay empty" when using a template
- ALL photo scenes MUST have text_overlay with max 6 words (key phrase from narration)
- Set image_has_text: false for ALL photo scenes
- Text overlay must reinforce what the narrator is saying at that moment
- This ensures every scene has visible content, even over carousel/banner images
`;

    const TEMPLATE_INSTRUCTIONS = {
      auto: '', // No extra instructions — agent decides freely
      data_story: `
TEMPLATE: data_story — Data as the protagonist
Your scene plan MUST follow this visual_type distribution:
- ~60% of scenes: "chart" (bar, line, pie — show the data the narrator mentions)
- ~20% of scenes: "text_card" (key insights, impact statements)
- ~20% of scenes: "photo" (opening hook, transitions, CTA)
Structure: hook (photo) → data point 1 (chart) → insight (text_card) → data point 2 (chart) → comparison (chart) → CTA (photo)
CRITICAL: Every time the narrator mentions a number, percentage, or statistic, that scene MUST be visual_type "chart" with the actual data.`,
      explainer: `
TEMPLATE: explainer — Explain concepts and processes
Your scene plan MUST follow this visual_type distribution:
- ~40% of scenes: "list" or "text_card" (steps, definitions, key points)
- ~30% of scenes: "photo" (context, examples, lifestyle)
- ~30% of scenes: "chart" (supporting data)
Structure: hook (photo) → problem (text_card) → step 1 (list) → evidence (chart) → step 2 (list) → benefit (text_card) → CTA (photo)
CRITICAL: Process steps should use "list" type. Definitions and impact statements use "text_card".`,
      narrativo: `
TEMPLATE: narrativo — Visual narrative sequence
Your scene plan MUST follow this visual_type distribution:
- ~50% of scenes: "text_card" (large impactful text, quotes, key phrases)
- ~30% of scenes: "photo" (emotional imagery, lifestyle, product)
- ~20% of scenes: "chart" (data that supports the narrative)
Structure: hook (text_card) → context (photo) → point 1 (text_card) → evidence (chart) → point 2 (text_card) → photo → CTA (text_card)
CRITICAL: Text cards should have large, bold typography that carries the story forward. Each card = one impactful statement.`,
      brand_film: `
TEMPLATE: brand_film — Cinematic, photo-dominant
Your scene plan MUST follow this visual_type distribution:
- ~70% of scenes: "photo" (cinematic photography with strong motion)
- ~20% of scenes: "text_card" (minimal, elegant text moments)
- ~10% of scenes: "chart" (only when critical data is narrated)
Structure: hook (photo) → story sequence (photo × 4-6) → insight (text_card) → data (chart) → story (photo × 3-4) → CTA (text_card)
CRITICAL: This is a cinematic template — photos MUST have varied motion (zoom_in, pan_right, ken-burns, etc.). Text cards should be minimal and elegant.`,
    };

    const templateBlock = TEMPLATE_INSTRUCTIONS[templateName] || TEMPLATE_INSTRUCTIONS.auto;
    const visualTypeInstructions = templateName === 'auto' ? '' : VISUAL_TYPE_SCHEMA + templateBlock;

    let scenePlanPrompt;
    if (sceneQuality === 'premium') {
      scenePlanPrompt = `You are the Video Editor Agent (Diretor de Edição). Follow the skill defined in skills/video-editor-agent/SKILL.md exactly.

You think like a PROFESSIONAL VIDEO EDITOR. You create 30-50 rapid cuts — NOT a 5-scene slideshow.
The Photography Director has already defined the visual language. Your job is to create the EDIT TIMELINE following those decisions.

STRICT RULES — DO NOT OVERRIDE THE PHOTOGRAPHY PLAN:
- Use EXACTLY the images specified by the Photography Director for each shot
- Use EXACTLY the fonts, sizes, and positions defined in the photography plan
- Use EXACTLY the transitions defined between sections (NOT 100% cut)
- If a shot has "image_has_text": true, do NOT add text_overlay (set it to null/empty)
- If you need to split a shot into multiple cuts, keep the same image/font/motion
- You decide TIMING only — the Photography Director decided everything else

TIMESTAMP ANCHORING (CRITICAL):
- Each shot in the photography plan has start_time → end_time. You MUST respect these windows.
- When splitting a shot into multiple cuts, all cuts MUST fit within the shot's time window.
- text_overlay for each cut must match what the NARRATOR is saying during that time.
- Every scene MUST include a "narration" field with the EXACT transcript segment spoken during that scene (or "" for silent scenes).
- The last 3s of the video should be a silent closing shot (narration: "", text_overlay: URL/logo).
- Sum of all scene durations MUST equal video_length (${videoDur}s).

Task: Create professional edit plans for ${video_count} videos — "${task_name}" campaign.
Date: ${task_date}
Platforms: ${platform_targets.join(', ')}
${langInstruction}${briefInstruction}

STEP 1 — Read these knowledge files:
- ${project_dir}/knowledge/brand_identity.md
- ${project_dir}/knowledge/product_campaign.md
- ${output_dir}/creative/creative_brief.json
- ${output_dir}/video/photography_plan.json — CRITICAL: the Photography Director's visual decisions
- skills/video-editor-agent/SKILL.md
- skills/typography-on-image/SKILL.md

STEP 2 — Image assets:
${imageSourceSection}

STEP 3 — Video briefs:
${videoBriefsText}
${photographyNote}

STEP 4 — Audio:
${narrationNote}
${musicInstructions}

STEP 5 — Create the scene plan JSON following the Photography Director's visual decisions:

Phase A: Analyze inputs, select narrative framework
Phase B: Create Edit Decision List with 30-50 cuts (MANDATORY minimum 25 cuts for 60s)
Phase C: Assign images to cuts (reuse creatively — same image, different treatment)
Phase D: Assign motion, text animation, transitions per cut

CRITICAL RULES (enforced — plan will be rejected if violated):
- MINIMUM 25 cuts for a 60s video (target 30-50)
- NEVER same motion.type on 2 consecutive cuts
- NEVER same text_layout.position on 3 consecutive cuts
- First cut duration ≤ 1.5s (hook must be fast) with LARGE text (font_size 120-140px, bold, impactful)
- Last cut duration ≥ 3s (CTA needs reading time)
- Cuts < 0.8s: NO text_overlay (too fast to read)
- Cuts with text_overlay ≥ 2.0s (minimum reading time)
- Max 6 words per text_overlay
- Text overlay COMPLEMENTS narration, never repeats it
- Sum of all durations must equal video_length (tolerance ±2s)

AUDIO-VISUAL SYNC (CRITICAL):
- Each scene's "narration" field must contain the EXACT transcript segment spoken during that scene
- Scene timing MUST match narration pacing — if narrator says 3 words in 1.5s, that scene is 1.5s
- text_overlay must REINFORCE what narrator is saying (visual keyword, not the full sentence)
- If narration file exists, estimate word timing (~2.5 words/second for pt-BR) and distribute scenes accordingly
- Hook scene text appears BEFORE narrator speaks (visual lead)
- CTA scene text stays visible AFTER narrator finishes (reading time)

CAROUSEL/BANNER BAN (CRITICAL):
- NEVER use images from ads/ (carousel, banner, static ad images) in video pro
- Video pro is CINEMATIC — use ONLY raw photographic images (imgs/, assets/, API-generated)
- If photography_plan references an ads/ image, SKIP it and use a photographic alternative
- Only exception: payload contains "carousel_in_video": true explicitly

TYPOGRAPHY — MAGAZINE EDITORIAL STYLE:
- text_layout.position: "top" is the DEFAULT. Use "center" ONLY when face_position is "top" (to avoid covering the face). NEVER "bottom"
- text_layout.font_size: hook 120-140px, headlines 96-120px, body 80-96px. NEVER below 80px
- text_layout.font_weight: 900 for headlines, 700 for body
- text_layout.font_family: "Lora" or "DM Serif Display" (DEFAULT — editorial serif), "Oswald" or "Bebas Neue" ONLY for hooks (max 2-3 scenes), "Montserrat" for data/numbers
- text_layout.line_height: 1.0 for tight headlines, 1.15 for body
- text_layout.color: "#FFFFFF" on dark overlays, "#0D0D0D" on light — NEVER gray
- Every scene with text MUST have text_layout with ALL fields (font_size, font_weight, font_family, position, color, line_height)

GLOBAL VIDEO SETTINGS — include these top-level fields in the scene plan JSON:
- "color_grading": { "gamma": 1.05, "saturate": 1.1, "contrast": 1.15, "hueRotate": 10 } — unified color across ALL scenes ("same camera, same day")
- "film_grain": { "intensity": 0, "monochromatic": true, "lightLeak": false } — cinematic grain + light leaks
- "organic_shake": { "amplitude": 2, "frequency": 1 } — subtle hand-held feel (set amplitude 1-2 for premium, 3-5 for UGC)
- Adjust values based on style_preset from Photography Director. For tech/futuristic: higher contrast, bluer hue. For warm/lifestyle: lower contrast, warmer grain.

ADVANCED SCENE FIELDS (per scene):
- "hud_text": { "brackets": true, "scanLine": true, "dataPoints": true, "accentColor": "#0099FF" } — for tech/futuristic scenes (hook, data, CTA)
- "motion.speed_ramp_stages": [0, 0.8, 0.2, 1.0] — speed ramp (input%, output% pairs)
- "lens_transition": "chromatic-glitch" — types: rack-focus, whip-blur, defocus-refocus, chromatic-glitch

Save each plan to: ${output_dir}/video/${task_name}_video_0N${templateName !== 'auto' ? '_' + templateName : ''}_scene_plan_motion.json

The JSON schema is defined in SKILL.md — follow it exactly.
${visualTypeInstructions}
IMPORTANT: ONLY generate scene plan JSON files. Do NOT generate audio or run any render scripts.
After saving all plans, print exactly: [VIDEO_APPROVAL_NEEDED] ${output_dir}`;
    } else {
      scenePlanPrompt = `Create a CONTENT-FOCUSED scene plan for a ${videoDur}s video.

Campaign: "${task_name}". Format: 9:16 (1080x1920). ${langInstruction}

YOU DECIDE ONLY CONTENT. The system handles layout, fonts, colors, and motion automatically.

AUDIO: ${narrationNote}
${musicInstructions}

For EACH scene, provide:
- "visual_type": "photo" | "chart" | "text_card" | "list" | "cta" (what kind of slide)
- "keyword": 1-3 words in CAPS (main topic/trigger — appears large at top of slide)
- "duration": seconds (5-8s for chart/list, 2-3s for photo, ≥3s for CTA)
- "narration": exact transcript spoken during this scene (or "" for silence)

Per visual_type, also provide:
- photo: no extra fields needed (system picks background image automatically)
- cta: "cta_brand" (brand URL or name, e.g. "INEMA.CLUB"), "cta_action" (call to action text, e.g. "Agende sua análise gratuita")
- chart: "chart_type" (bar/line/pie/donut), "chart_title", "chart_data" [{label,value}]
- text_card: "card_title" (main phrase), "card_body" (supporting text)
- list: "list_title", "list_items" (array of strings), "list_numbered" (true/false)

DO NOT include: motion, text_layout, text_overlay, font_size, font_family, position, overlay, image, image_has_text. The system handles ALL rendering.

JSON structure:
{
  "titulo": "...", "video_length": ${videoDur}, "format": "9:16",
  "width": 1080, "height": 1920,
  "voice": "${proNarrator}",
  "narration_file": "${narrationTimings[0]?.file || 'null'}", "music": null, "music_volume": 0.15,
  "scenes": [
    { "id": "hook_01", "type": "hook", "visual_type": "photo",
      "keyword": "TRANSFORMAÇÃO", "duration": 1.5,
      "narration": "E se sua empresa pudesse crescer enquanto você dorme?" },
    { "id": "data_01", "type": "data", "visual_type": "chart",
      "keyword": "ROI DE IA", "duration": 6,
      "chart_type": "bar", "chart_title": "Retorno por setor",
      "chart_data": [{"label":"Atendimento","value":31},{"label":"Vendas","value":24}],
      "narration": "O ROI médio de IA hoje está em dezesseis por cento." },
    { "id": "insight_01", "type": "insight", "visual_type": "text_card",
      "keyword": "AUTOMAÇÃO", "duration": 5,
      "card_title": "Cada gargalo é uma automação vendável",
      "card_body": "O mercado já está pagando por isso.",
      "narration": "Cada gargalo que você enxerga é uma automação vendável." }
  ]
}

RULES:
- 15-25 scenes. Sum of durations MUST equal ${videoDur}s exactly
- First scene: "photo" with impactful keyword, ≤1.5s
- Second-to-last scene: visual_type "cta" with cta_brand (URL/marca) + cta_action (texto de ação), ≥3s
- Last scene: silent hold, visual_type "cta" with same cta_brand, duration 3s, narration ""
- When narration mentions numbers/percentages → use "chart"
- When narration lists steps/features → use "list"
- When narration makes an impact statement → use "text_card"
- When narration describes visually → use "photo"
- chart/list scenes: 5-8s minimum (time to read)
- photo scenes: 2-3s (visual rhythm)
- Every scene MUST have "narration" field written for TTS:
  - NEVER currency symbols: "R$ 10" → "dez reais" or "dez"
  - NEVER abbreviations: "%" → "por cento", "3x" → "três vezes"
  - Numbers by extenso: "16%" → "dezesseis por cento"
  - URLs: "inema.club" → "inema ponto club"
- keyword must be related to what's being said (1-3 words, impactful)
${visualTypeInstructions}

Save to: ${output_dir}/video/${task_name}_video_0N${templateName !== 'auto' ? '_' + templateName : ''}_scene_plan_motion.json
Then print: [VIDEO_APPROVAL_NEEDED] ${output_dir}`;
    }

    const sceneTimeout = sceneQuality === 'premium' ? 900000 : 600000;
    await runClaude(scenePlanPrompt, 'video_pro', output_dir, sceneTimeout, { model: sceneModel });
    await job.extendLock(job.token, 900000).catch(() => {});

    const missingPlans = [];
    for (let i = 1; i <= video_count; i++) {
      const idx = String(i).padStart(2, '0');
      const planPath = vfFind(idx, '_scene_plan_motion.json');
      if (!fs.existsSync(planPath)) missingPlans.push(idx);
    }
    if (missingPlans.length > 0) {
      const message = `missing motion plans for videos: ${missingPlans.join(', ')}`;
      log(output_dir, 'video_pro', `Validation failed: ${message}`);
      process.stdout.write(`[STAGE3_VIDEO_PLAN_INVALID] ${output_dir} ${message}\n`);
      return { status: 'failed', reason: message };
    }

    if (image_source === 'solid') {
      for (let i = 1; i <= video_count; i++) {
        const idx = String(i).padStart(2, '0');
        const planPath = vfFind(idx, '_scene_plan_motion.json');
        if (!fs.existsSync(planPath)) continue;
        try {
          const plan = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
          let changed = false;
          for (const scene of plan.scenes || []) {
            if (scene.image !== null) {
              scene.image = null;
              changed = true;
            }
            if (scene.image_prompt !== null) {
              scene.image_prompt = null;
              changed = true;
            }
            if (!scene.background_color) {
              scene.background_color = solidBackgroundColor || '#0D0D0D';
              changed = true;
            }
          }
          if (changed) fs.writeFileSync(planPath, JSON.stringify(plan, null, 2));
        } catch (e) {
          log(output_dir, 'video_pro', `Could not normalize solid background plan ${idx}: ${e.message}`);
        }
      }
    }

    process.stdout.write(`[VIDEO_PRO_PROGRESS] ${output_dir} plan_ready\n`);
    const wantDraft = job.data.video_draft === true;
    if (wantDraft) {
      log(output_dir, 'video_pro', 'Rendering draft video(s) with placeholder backgrounds...');
      for (let i = 1; i <= video_count; i++) {
        const idx = String(i).padStart(2, '0');
        const planPath = vfFind(idx, '_scene_plan_motion.json');
        if (!fs.existsSync(planPath)) continue;

        try {
          const plan = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
          const draftPlan = JSON.parse(JSON.stringify(plan));
          const brandColors = ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560'];
          draftPlan.scenes.forEach((scene, si) => {
            if (!scene.image || !fs.existsSync(scene.image)) {
              scene.image = null;
              scene.background_color = scene.background_color || (image_source === 'solid'
                ? (solidBackgroundColor || '#0D0D0D')
                : brandColors[si % brandColors.length]);
            }
          });
          const draftPlanPath = path.resolve(projectRoot, output_dir, 'video', vf(idx, '_draft.json'));
          fs.writeFileSync(draftPlanPath, JSON.stringify(draftPlan, null, 2));

          const draftOutput = path.resolve(projectRoot, output_dir, 'video', vf(idx, '_draft.mp4'));
          try {
            execFileSync('node', [
              renderFfmpeg,
              `${output_dir}/video/${vf(idx, '_draft.json')}`,
              `${output_dir}/video/${vf(idx, '_draft.mp4')}`,
            ], { cwd: projectRoot, stdio: 'pipe', timeout: 300000 });
            log(output_dir, 'video_pro', `Draft ${idx} rendered: ${draftOutput}`);
            process.stdout.write(`[STAGE3_DRAFT_READY] ${output_dir} ${draftOutput}\n`);
          } catch (draftErr) {
            log(output_dir, 'video_pro', `Draft render failed: ${draftErr.message.slice(0, 200)}`);
          }
        } catch (e) {
          log(output_dir, 'video_pro', `Draft prep failed for video ${idx}: ${e.message}`);
        }
      }
    } else {
      log(output_dir, 'video_pro', 'Draft skipped (default). Use video_draft:true to enable.');
    }

    await job.extendLock(job.token, 900000).catch(() => {});
    process.stdout.write(`[VIDEO_PRO_PROGRESS] ${output_dir} images_start\n`);
    if (image_source === 'api') {
      const jobProvider = job.data.image_provider || imageProviderName;
      const imageProvider = getImageProvider(jobProvider);
      const genImage = imageProvider.generateImage;
      const model = job.data.image_model || imageProvider.DEFAULT_MODEL || getEnv('KIE_DEFAULT_MODEL', defaultModel);
      const useBrand = job.data.use_brand_overlay !== false;
      const brand = useBrand ? readBrandContext(project_dir) : null;
      if (brand) log(output_dir, 'video_pro', `Brand context: ${brand.brandName} | provider: ${jobProvider}`);

      // Resolve reference images
      const refImages = resolveImageReference ? resolveImageReference(project_dir, job.data.image_reference) : [];
      if (refImages.length > 0) log(output_dir, 'video_pro', `Reference images: ${refImages.map((r) => path.basename(r)).join(', ')}`);

      for (let i = 1; i <= video_count; i++) {
        const idx = String(i).padStart(2, '0');
        const planPath = vfFind(idx, '_scene_plan_motion.json');
        if (!fs.existsSync(planPath)) continue;

        let plan;
        try { plan = JSON.parse(fs.readFileSync(planPath, 'utf-8')); }
        catch (e) { log(output_dir, 'video_pro', `Could not parse scene plan ${idx}: ${e.message}`); continue; }

        const absImgsDir = path.resolve(projectRoot, output_dir, 'imgs');
        fs.mkdirSync(absImgsDir, { recursive: true });
        const promptMap = new Map();
        let planChanged = false;

        for (let s = 0; s < plan.scenes.length; s++) {
          const scene = plan.scenes[s];
          if (!scene.image_prompt) continue;
          if (scene.image && fs.existsSync(scene.image)) continue;

          if (promptMap.has(scene.image_prompt)) {
            scene.image = promptMap.get(scene.image_prompt);
            planChanged = true;
            continue;
          }

          const filename = `${task_name}_video_${idx}_img_${String(promptMap.size + 1).padStart(2, '0')}.jpg`;
          const outputPath = path.join(absImgsDir, filename);
          const sceneType = scene.type || scene.id || 'solution';
          const colorHint = brand?.colors?.length ? ` Colors: ${brand.colors.slice(0, 2).join(', ')}.` : '';
          const moodMap = {
            hook: 'dramatic tension, high contrast, strong impact',
            tension: 'emotional challenge, aspiration, desire to change',
            solution: 'transformation, empowerment, positive energy',
            social_proof: 'community, people achieving, belonging',
            cta: 'optimistic, inviting, forward momentum',
          };
          const mood = moodMap[sceneType] || moodMap.solution;
          const refGuide = refImages.length > 0 ? 'Based on the reference image, transform and adapt: ' : '';
          const refSuffix = refImages.length > 0 ? ' Maintain core visual elements and color palette from reference.' : '';
          const rawPrompt = `${refGuide}${scene.image_prompt}. ${mood}. vertical 9:16.${colorHint} Cinematic lighting, photorealistic.${refSuffix} No text, no words, no watermark.`;
          const finalPrompt = rawPrompt.length > 490 ? rawPrompt.slice(0, 487) + '...' : rawPrompt;

          log(output_dir, 'video_pro', `Generating image ${promptMap.size + 1} for video_${idx}: ${scene.image_prompt.slice(0, 80)}`);
          try {
            await genImage(outputPath, finalPrompt, model, '9:16', refImages);
            scene.image = outputPath;
            promptMap.set(scene.image_prompt, outputPath);
            planChanged = true;
            const promptTxtPath = outputPath.replace(/\.[^.]+$/, '_prompt.txt');
            fs.writeFileSync(promptTxtPath, finalPrompt, 'utf-8');
          } catch (err) {
            log(output_dir, 'video_pro', `Failed image gen: ${err.message}`);
          }
        }

        if (planChanged) {
          for (const scene of plan.scenes) {
            if (scene.image_prompt && !scene.image && promptMap.has(scene.image_prompt)) {
              scene.image = promptMap.get(scene.image_prompt);
            }
          }
          fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), 'utf-8');
          log(output_dir, 'video_pro', `Updated plan with ${promptMap.size} unique images for ${plan.scenes.length} cuts`);

          const promptsLog = [];
          for (const [prompt, imgPath] of promptMap.entries()) {
            promptsLog.push({ prompt, image: path.basename(imgPath) });
          }
          const promptsPath = path.resolve(absImgsDir, `${task_name}_video_${idx}_prompts.json`);
          fs.writeFileSync(promptsPath, JSON.stringify(promptsLog, null, 2), 'utf-8');
          log(output_dir, 'video_pro', `Saved ${promptsLog.length} image prompts to ${promptsPath}`);
        }
      }
    }

    // ── Phase 2.5: Validation loop (replaces auto-fix) ─────────────────
    // Validates scene plan rules and sends violations back to the agent for correction.
    // Max 3 attempts. No side effects — the agent decides how to fix.
    log(output_dir, 'video_pro', 'Phase 2.5: Validation loop...');

    // Read global error memory for prompt enrichment
    const globalErrorsPath = path.resolve(projectRoot, project_dir, 'video_error_patterns.json');
    let errorPatternsHint = '';
    try {
      if (fs.existsSync(globalErrorsPath)) {
        const patterns = JSON.parse(fs.readFileSync(globalErrorsPath, 'utf-8'));
        const top5 = (patterns.patterns || [])
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map(p => `- ${p.error} (ocorreu ${p.count}x)`);
        if (top5.length > 0) {
          errorPatternsHint = `\n\nERROS FREQUENTES EM CAMPANHAS ANTERIORES (evite estes):\n${top5.join('\n')}`;
        }
      }
    } catch {}

    const validationHistoryPath = path.resolve(projectRoot, output_dir, 'video', 'validation_history.json');
    const validationHistory = { attempts: [] };

    for (let i = 1; i <= video_count; i++) {
      const idx = String(i).padStart(2, '0');
      const planPath = vfFind(idx, '_scene_plan_motion.json');
      if (!fs.existsSync(planPath)) continue;

      const MAX_VALIDATION_ATTEMPTS = 3;

      for (let attempt = 1; attempt <= MAX_VALIDATION_ATTEMPTS; attempt++) {
        let plan;
        try {
          plan = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
        } catch (e) {
          log(output_dir, 'video_pro', `Validation: cannot parse scene plan ${idx}: ${e.message}`);
          break;
        }

        const { valid, violations } = validateScenePlan(plan, {
          videoDur,
          projectRoot,
          outputDir: output_dir,
          simplesMode: sceneQuality === 'simples',
        });

        // Save to validation history
        validationHistory.attempts.push({
          attempt,
          video: idx,
          violations: violations.slice(0, 20),
          timestamp: new Date().toISOString(),
        });

        const totalDur = plan.scenes.reduce((sum, s) => sum + (s.duration || 0), 0);
        log(output_dir, 'video_pro', `Validation attempt ${attempt}: ${violations.length} violations, ${plan.scenes.length} cuts, ${totalDur.toFixed(1)}s`);

        if (valid) {
          log(output_dir, 'video_pro', `Plan validated — ${plan.scenes.length} cuts, ${totalDur.toFixed(1)}s (target: ${videoDur}s)`);
          process.stdout.write(`[VIDEO_PRO_VALIDATION] ${output_dir} validated attempt:${attempt}\n`);
          break;
        }

        // Log violations
        for (const v of violations.slice(0, 10)) {
          log(output_dir, 'video_pro', `  ⚠ ${v}`);
        }
        if (violations.length > 10) {
          log(output_dir, 'video_pro', `  ... e mais ${violations.length - 10} violações`);
        }

        process.stdout.write(`[VIDEO_PRO_VALIDATION] ${output_dir} attempt:${attempt} violations:${violations.length}\n`);

        if (attempt === MAX_VALIDATION_ATTEMPTS) {
          log(output_dir, 'video_pro', `Validation: max attempts reached with ${violations.length} remaining violations — proceeding with current plan`);
          break;
        }

        // Send violations back to the agent for correction
        log(output_dir, 'video_pro', `Sending ${violations.length} violations to agent for correction (attempt ${attempt + 1})...`);
        const violationsList = violations.slice(0, 15).map((v, j) => `${j + 1}. ${v}`).join('\n');
        const fixPrompt = `O scene plan em ${planPath} tem ${violations.length} violações que DEVEM ser corrigidas:

${violationsList}
${violations.length > 15 ? `\n... e mais ${violations.length - 15} violações.\n` : ''}
INSTRUÇÕES:
1. Leia o arquivo ${planPath}
2. Corrija CADA violação listada acima
3. Salve o arquivo corrigido no MESMO path
4. NÃO mude cenas que não têm violação
5. Mantenha a estrutura JSON intacta
${errorPatternsHint}

Salve o JSON corrigido em: ${planPath}`;

        try {
          await runClaude(fixPrompt, 'video_pro', output_dir, 300000, { model: 'sonnet' });
          await job.extendLock(job.token, 900000).catch(() => {});
        } catch (e) {
          log(output_dir, 'video_pro', `Validation fix attempt ${attempt + 1} failed: ${e.message}`);
          break;
        }
      }
    }

    // Save validation history
    try {
      fs.writeFileSync(validationHistoryPath, JSON.stringify(validationHistory, null, 2), 'utf-8');
    } catch {}

    // Update global error patterns
    try {
      let globalPatterns = { patterns: [] };
      if (fs.existsSync(globalErrorsPath)) {
        globalPatterns = JSON.parse(fs.readFileSync(globalErrorsPath, 'utf-8'));
      }
      const allViolations = validationHistory.attempts.flatMap(a => a.violations);
      for (const v of allViolations) {
        // Normalize violation to pattern (remove scene-specific IDs)
        const pattern = v.replace(/Cena \d+ "[^"]+"/g, 'Cena N').replace(/"[^"]+"/g, '"..."').replace(/\d+\.?\d*s/g, 'Xs').replace(/\d+px/g, 'Xpx');
        const existing = globalPatterns.patterns.find(p => p.error === pattern);
        if (existing) {
          existing.count += 1;
          existing.last_seen = new Date().toISOString().slice(0, 10);
        } else {
          globalPatterns.patterns.push({ error: pattern, count: 1, last_seen: new Date().toISOString().slice(0, 10) });
        }
      }
      // Keep only top 20 patterns
      globalPatterns.patterns.sort((a, b) => b.count - a.count);
      globalPatterns.patterns = globalPatterns.patterns.slice(0, 20);
      fs.writeFileSync(globalErrorsPath, JSON.stringify(globalPatterns, null, 2), 'utf-8');
    } catch {}

    const approvalPath = path.resolve(projectRoot, output_dir, 'video', 'approved.json');
    const rejectedPath = path.resolve(projectRoot, output_dir, 'video', 'rejected.json');

    log(output_dir, 'video_pro', '[VIDEO_APPROVAL_NEEDED] Waiting for approval (30 min timeout)...');
    process.stdout.write(`[VIDEO_APPROVAL_NEEDED] ${output_dir}\n`);
    fs.writeFileSync(path.resolve(projectRoot, output_dir, 'video', 'approval_needed.json'),
      JSON.stringify({ type: 'video_editor', output_dir, ts: Date.now() }));

    const approved = await waitForFile(approvalPath, 1800000);
    if (!approved) {
      if (fs.existsSync(rejectedPath)) {
        log(output_dir, 'video_pro', 'User rejected the video plan. Skipping render.');
        return { status: 'skipped', reason: 'rejected by user' };
      }
      writeVideoApprovalTimeout(projectRoot, output_dir);
      log(output_dir, 'video_pro', 'Approval timeout. Skipping video render.');
      return { status: 'skipped', reason: 'approval timeout' };
    }

    await job.extendLock(job.token, 900000).catch(() => {});
    process.stdout.write(`[VIDEO_PRO_PROGRESS] ${output_dir} render_start\n`);
    log(output_dir, 'video_pro', 'Starting video render...');

    // ── Ensure narration_file is set in all scene plans ────────────────────
    // Agent in simples mode often leaves narration_file:null
    for (let i = 1; i <= video_count; i++) {
      const idx = String(i).padStart(2, '0');
      const planPath = vfFind(idx, '_scene_plan_motion.json');
      if (!fs.existsSync(planPath)) continue;
      try {
        const plan = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
        const videoIdx = i - 1;
        if (!plan.narration_file && !plan.audio && narrationTimings[videoIdx]?.file) {
          plan.narration_file = narrationTimings[videoIdx].file;
          fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), 'utf-8');
          log(output_dir, 'video_pro', `Injected narration_file into video ${idx}: ${narrationTimings[videoIdx].file}`);
        }
      } catch {}
    }

    // ── Slide rendering (simples mode) ────────────────────────────────────
    // Render all scenes as designed slides (HTML+CSS → Playwright → PNG)
    // These PNGs replace the raw images — FFmpeg composites them into video
    const useSlideSystem = sceneQuality === 'simples';
    const slidePNGMaps = {}; // videoIdx → { sceneIdx → pngPath }

    if (useSlideSystem) {
      const styleDictPath = path.resolve(projectRoot, 'skills/video-engineering/style-dictionary.json');
      const presetName = job.data.style_preset || 'inema_hightech';
      const preset = resolvePreset(presetName, styleDictPath);
      const absImgsDir = path.resolve(projectRoot, output_dir, 'imgs');
      const absAssetsDir = path.resolve(projectRoot, project_dir, 'assets');

      log(output_dir, 'video_pro', `Rendering slides (preset: ${presetName})...`);
      process.stdout.write(`[VIDEO_PRO_PROGRESS] ${output_dir} rendering_slides\n`);

      for (let i = 1; i <= video_count; i++) {
        const idx = String(i).padStart(2, '0');
        const planPath = vfFind(idx, '_scene_plan_motion.json');
        if (!fs.existsSync(planPath)) continue;

        try {
          const plan = JSON.parse(fs.readFileSync(planPath, 'utf-8'));

          const vidW = plan.width || 1080;
          const vidH = plan.height || 1920;
          const tmpSlideDir = path.join(absVideoDir, `slides_${idx}`);
          fs.mkdirSync(tmpSlideDir, { recursive: true });

          const pngMap = await renderAllSlides(plan, preset, absImgsDir, absAssetsDir, vidW, vidH, tmpSlideDir, templateName);
          slidePNGMaps[idx] = pngMap;

          // Update scene plan: point each scene.image to the slide PNG
          // and mark as slide (so FFmpeg skips ASS subtitles and uses static display)
          for (const [sceneIdx, pngPath] of Object.entries(pngMap)) {
            plan.scenes[sceneIdx].image = pngPath;
            plan.scenes[sceneIdx]._slide = true; // flag for FFmpeg
          }
          // Assign automatic motion cycling
          const motionCycle = ['zoom_in', 'pan_right', 'drift', 'ken-burns-in', 'push-in', 'breathe'];
          for (let s = 0; s < plan.scenes.length; s++) {
            if (!plan.scenes[s].motion) {
              plan.scenes[s].motion = { type: motionCycle[s % motionCycle.length], intensity: 'moderate' };
            }
          }
          fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), 'utf-8');
          log(output_dir, 'video_pro', `Slides rendered for video ${idx}: ${Object.keys(pngMap).length} slides`);
        } catch (e) {
          log(output_dir, 'video_pro', `Slide rendering failed for video ${idx}: ${e.message}`);
        }
      }
      await closeSlideBrowser();
    }

    for (let i = 1; i <= video_count; i++) {
      const idx = String(i).padStart(2, '0');
      const ts = videoTimestamp();
      const tplSuffix = templateName !== 'auto' ? `_${templateName}` : '';
      const proFilename = `${task_name}_pro_${idx}${tplSuffix}_${ts}.mp4`;
      const videoOutput = path.resolve(projectRoot, output_dir, 'video', proFilename);
      backupIfExists(videoOutput);
      const absScenePlan = vfFind(idx, '_scene_plan_motion.json');
      const planToRender = path.relative(projectRoot, absScenePlan);

      if (!fs.existsSync(absScenePlan)) {
        log(output_dir, 'video_pro', `Scene plan not found for video ${i}, skipping: ${absScenePlan}`);
        continue;
      }

      // Simples mode with slides: always FFmpeg (slides are pre-rendered PNGs)
      // Premium or visual_types: also FFmpeg (Remotion doesn't support visual_types yet)
      let renderer = getVideoRenderer('pro');
      if (useSlideSystem) {
        renderer = renderFfmpeg;
        log(output_dir, 'video_pro', `Simples mode — using ffmpeg with slide PNGs`);
      } else {
        try {
          const planData = JSON.parse(fs.readFileSync(absScenePlan, 'utf-8'));
          const hasVisualTypes = (planData.scenes || []).some(s => s.visual_type && s.visual_type !== 'photo');
          if (hasVisualTypes) {
            renderer = renderFfmpeg;
            log(output_dir, 'video_pro', `Scene plan has visual_types — using ffmpeg renderer`);
          }
        } catch {}
      }
      const rendererName = renderer === renderRemotion ? 'Remotion' : 'ffmpeg';
      log(output_dir, 'video_pro', `Rendering video ${i}/${video_count} via ${rendererName}...`);
      try {
        execFileSync('node', [
          renderer,
          planToRender,
          `${output_dir}/video/${proFilename}`,
        ], {
          cwd: projectRoot,
          stdio: 'pipe',
          timeout: 600000,
        });
        log(output_dir, 'video_pro', `Video ${i} rendered via ${rendererName}: ${videoOutput}`);
      } catch (renderErr) {
        const message = renderErr.message.slice(0, 200);
        if (renderer === renderRemotion) {
          log(output_dir, 'video_pro', `Remotion render ${i} failed, falling back to ffmpeg: ${message}`);
          process.stdout.write(`[VIDEO_PRO_FALLBACK] ${output_dir} remotion_render_failed\n`);
          let fallbackReason = '';
          let fallbackFailed = false;
          try {
            execFileSync('node', [renderFfmpeg, planToRender, `${output_dir}/video/${proFilename}`], {
              cwd: projectRoot, stdio: 'pipe', timeout: 300000,
            });
            log(output_dir, 'video_pro', `Video ${i} rendered via ffmpeg (fallback): ${videoOutput}`);
          } catch (fbErr) {
            fallbackFailed = true;
            fallbackReason = fbErr.message.slice(0, 200);
            log(output_dir, 'video_pro', `ffmpeg fallback ${i} also failed: ${fallbackReason}`);
          }
          if (fallbackFailed) {
            return { status: 'failed', reason: `render_failed: remotion:${message} ffmpeg:${fallbackReason}` };
          }
        } else {
          log(output_dir, 'video_pro', `ffmpeg render ${i} failed: ${message}`);
          return { status: 'failed', reason: `render_failed:${message}` };
        }
      }
    }

    return { status: 'complete', output: `${output_dir}/video/` };
  };
}

module.exports = { createWorkerVideoProHandler };
