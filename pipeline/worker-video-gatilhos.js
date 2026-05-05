/**
 * worker-video-gatilhos.js — Template "gatilhos"
 *
 * Reads research_results.json, extracts ad_hooks + video_concepts + marketing_angles,
 * and generates for EACH hook:
 * - 3-5 carousel slides (PNG)
 * - 1 short video (<30s)
 *
 * Each hook gets its own subfolder under gatilhos/
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { renderSlidePNG, resolvePreset, closeBrowser } = require('./render-slide-png');

function slugify(str) {
  return String(str || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 30);
}

/**
 * Concatena N mp3s em um único arquivo, inserindo silêncio entre cada par.
 * Usa filter concat do ffmpeg — normaliza taxa/canais, tolera inputs mistos.
 * @param {string[]} partFiles  mp3s por frase
 * @param {number[]} silencesSec  silêncio após cada parte (length = partFiles.length-1)
 * @param {string} outputFile  mp3 final (24 kHz mono 128k)
 */
function concatPartsWithSilence(partFiles, silencesSec, outputFile) {
  const inputs = [];
  const filters = [];
  const concatLabels = [];
  let idx = 0;

  for (let i = 0; i < partFiles.length; i += 1) {
    inputs.push('-i', partFiles[i]);
    filters.push(`[${idx}:a]aresample=24000,aformat=sample_fmts=s16:channel_layouts=mono[p${i}]`);
    concatLabels.push(`[p${i}]`);
    idx += 1;

    const silence = silencesSec[i];
    if (i < partFiles.length - 1 && silence > 0) {
      inputs.push('-f', 'lavfi', '-t', String(silence), '-i', 'anullsrc=r=24000:cl=mono');
      filters.push(`[${idx}:a]aformat=sample_fmts=s16:channel_layouts=mono[s${i}]`);
      concatLabels.push(`[s${i}]`);
      idx += 1;
    }
  }

  const concatStr = `${concatLabels.join('')}concat=n=${concatLabels.length}:v=0:a=1[out]`;
  const filterComplex = [...filters, concatStr].join(';');

  execFileSync('ffmpeg', [
    '-y',
    ...inputs,
    '-filter_complex', filterComplex,
    '-map', '[out]',
    '-acodec', 'libmp3lame', '-b:a', '128k', '-ar', '24000', '-ac', '1',
    outputFile,
  ], { stdio: 'pipe', timeout: 60000 });
}

/**
 * Generate gatilhos (hooks) carousel + video batch from research data.
 * @param {object} opts - { projectRoot, outputDir, projectDir, taskName, stylePreset, ctaBrand, ctaAction, log }
 */
async function generateGatilhos(opts) {
  const {
    projectRoot, outputDir, projectDir, taskName,
    stylePreset = 'inema_hightech',
    ctaBrand = 'INEMA.CLUB', ctaAction = 'Acesse grátis',
    videoAudio = 'narration', // 'narration' | 'none' | 'music'
    narrator = 'rachel',
    ttsProvider = 'auto',
    log,
  } = opts;

  const researchPath = path.resolve(projectRoot, outputDir, 'research_results.json');
  if (!fs.existsSync(researchPath)) {
    throw new Error(`research_results.json not found at ${researchPath}`);
  }

  const research = JSON.parse(fs.readFileSync(researchPath, 'utf-8'));
  const gatilhosDir = path.resolve(projectRoot, outputDir, 'gatilhos');
  fs.mkdirSync(gatilhosDir, { recursive: true });

  log(outputDir, 'video_pro', 'Template GATILHOS: extracting hooks from research...');

  // ── Fuzzy field resolver (Research Agent varies field names between runs) ──

  /**
   * Find the first non-empty array in `obj` whose key contains `root`.
   * Handles: hooks_de_anuncio, hooks_anuncios, hooks_anuncio, ad_hooks, etc.
   */
  function findArray(obj, ...roots) {
    // 1. Try exact matches first
    for (const root of roots) {
      if (Array.isArray(obj[root]) && obj[root].length > 0) return obj[root];
    }
    // 2. Fuzzy: match any key containing any root (normalized — no accents, lowercase)
    const normalize = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedRoots = roots.map(normalize);
    for (const key of Object.keys(obj)) {
      if (!Array.isArray(obj[key]) || obj[key].length === 0) continue;
      const nk = normalize(key);
      for (const nr of normalizedRoots) {
        if (nk.includes(nr) || nr.includes(nk)) return obj[key];
      }
    }
    return [];
  }

  function findProp(obj, ...keys) {
    for (const k of keys) {
      const v = obj[k];
      if (v != null && v !== '') return v;
    }
    return '';
  }

  // ── Extract hooks from multiple sources ──

  const hooks = [];

  // From ad_hooks / hooks_*anuncio* (strings or objects)
  const adHooks = findArray(research, 'ad_hooks', 'hooks_de_anuncio', 'hooks_anuncios', 'hooks_anuncio', 'hooks');
  for (const hook of adHooks) {
    hooks.push({
      hook: typeof hook === 'string' ? hook : findProp(hook, 'text', 'hook', 'titulo', 'title'),
      source: 'ad_hook',
      emotion: '',
      cta: ctaAction,
    });
  }

  // From video_concepts / conceitos_*video* (objects with hook, format, cta)
  const videoConcepts = findArray(research, 'video_concepts', 'conceitos_de_video', 'conceitos_video', 'conceito_video');
  for (const vc of videoConcepts) {
    const hookText = findProp(vc, 'hook', 'title', 'titulo');
    if (hookText && !hooks.find(h => h.hook === hookText)) {
      hooks.push({
        hook: hookText,
        source: 'video_concept',
        emotion: findProp(vc, 'narrative_framework', 'narrative', 'narrativa'),
        cta: vc.cta || ctaAction,
        format: findProp(vc, 'format', 'formato'),
      });
    }
  }

  // From marketing_angles / angulos_*marketing* (objects with angle, emotion)
  const marketingAngles = findArray(research, 'marketing_angles', 'angulos_de_marketing', 'angulos_marketing', 'angulo_marketing');
  for (const ma of marketingAngles) {
    const hookText = findProp(ma, 'angle', 'angulo', 'titulo', 'title', 'positioning', 'posicionamento');
    if (hookText && !hooks.find(h => h.hook === hookText)) {
      hooks.push({
        hook: hookText.length > 60 ? hookText.slice(0, 60) : hookText,
        source: 'marketing_angle',
        emotion: findProp(ma, 'emotion', 'why_it_works', 'narrativa', 'narrative'),
        cta: ma.cta || ctaAction,
      });
    }
  }

  if (hooks.length === 0) {
    log(outputDir, 'video_pro', 'GATILHOS: no hooks found in research_results.json');
    return { gatilhosDir, count: 0 };
  }

  log(outputDir, 'video_pro', `Found ${hooks.length} hooks to process`);

  // ── Style preset ────────────────────────────────────────────────────

  const styleDictPath = path.resolve(projectRoot, 'skills/video-engineering/style-dictionary.json');
  const preset = resolvePreset(stylePreset, styleDictPath);
  const imgsDir = path.resolve(projectRoot, outputDir, 'imgs');
  const assetsDir = path.resolve(projectRoot, projectDir, 'assets');

  // Collect background images — PRIORITY: campaign images (imgs/) that are about the subject
  // Only fall back to assets/ if no campaign images exist
  // If nothing clean is available, use null (solid bg from preset)
  const imgExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const skipPatterns = /banner|logo_|oficial_|badge_|stats_|apresenta|convite|_texto|texto_|_text|clean_|semcoroa|interno_|premium_|inema_.*v\d|classico|gold_/i;
  const skipDirs = ['logo', 'logos', 'brand', 'icons'];
  const collectImages = (dir) => {
    if (!dir || !fs.existsSync(dir)) return [];
    const results = [];
    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          if (skipDirs.includes(entry.name.toLowerCase())) continue;
          walk(path.join(d, entry.name));
        } else if (imgExts.includes(path.extname(entry.name).toLowerCase())) {
          if (skipPatterns.test(entry.name)) continue;
          results.push(path.join(d, entry.name));
        }
      }
    };
    walk(dir);
    return results;
  };

  // Campaign images ONLY (they match the topic and are clean — no text)
  // NEVER use ads/ (carousels have text baked in — overlay on top = unreadable)
  // assets/ as last resort but filtered (no logos/banners/text)
  // If nothing clean → solid background (no image)
  const campaignImages = collectImages(imgsDir);
  const assetImages = collectImages(assetsDir);
  const bgImages = campaignImages.length > 0
    ? campaignImages
    : assetImages;

  if (bgImages.length === 0) {
    log(outputDir, 'video_pro', '⚠ No images found for gatilhos — using solid background');
  } else {
    log(outputDir, 'video_pro', `Background images: ${campaignImages.length} campaign, ${assetImages.length} assets → using ${bgImages.length}`);
  }

  // ── Extract supporting data for enriching hooks ──────────────────────

  const pains = findArray(research, 'consumer_motivations', 'motivacoes_do_consumidor', 'motivacoes_consumidor', 'motivacao_consumidor', 'pain_points', 'dores')
    .filter(p => findProp(p, 'pain_point', 'motivation', 'dor', 'motivacao'));
  const trends = findArray(research, 'industry_trends', 'tendencias_do_setor', 'tendencias_mercado', 'tendencia_mercado', 'market_trends', 'tendencias')
    .filter(t => findProp(t, 'trend', 'detail', 'tendencia', 'detalhe', 'titulo', 'descricao'));

  log(outputDir, 'video_pro', `Supporting data: ${pains.length} pain points, ${trends.length} trends`);

  // ── Generate each hook ──────────────────────────────────────────────

  const renderScript = path.resolve(projectRoot, 'pipeline/render-video-ffmpeg.js');
  let completed = 0;

  for (let hi = 0; hi < hooks.length; hi++) {
    const h = hooks[hi];
    const hookSlug = slugify(h.hook) || `g${hi + 1}`;
    const gNum = `g${String(hi + 1).padStart(2, '0')}`;
    const hookDir = path.join(gatilhosDir, `${gNum}_${hookSlug}`);
    fs.mkdirSync(hookDir, { recursive: true });

    log(outputDir, 'video_pro', `Gatilho ${hi + 1}/${hooks.length}: "${h.hook.slice(0, 50)}..."`);

    // Match hook to a related pain point (cycle through available)
    const pain = pains[hi % pains.length] || {};
    const painText = findProp(pain, 'pain_point', 'dor', 'motivation', 'motivacao', 'titulo', 'title');
    const painTrigger = findProp(pain, 'emotional_trigger', 'gatilho_emocional', 'description', 'descricao', 'desejo');

    // Match hook to a related data point (cycle through available)
    const trend = trends[hi % trends.length] || {};
    const trendText = findProp(trend, 'trend', 'tendencia', 'titulo', 'title');
    const trendDetail = findProp(trend, 'detail', 'descricao', 'description', 'detalhe');

    // Extract a keyword from the hook (first 2-3 impactful words)
    const hookWords = h.hook.split(/\s+/).filter(w => w.length > 3).slice(0, 2).join(' ').toUpperCase() || 'ATENÇÃO';

    // Build 5 scene mini-plan (<30s) — hook → dor → prova → CTA → hold
    const scenes = [
      // Scene 1: HOOK — frase de impacto (scroll-stopper)
      {
        id: 'hook', type: 'hook', visual_type: 'text_card',
        keyword: hookWords, duration: 4,
        card_title: h.hook.slice(0, 80),
        card_body: '',
        narration: '',
      },
      // Scene 2: PROBLEMA — a dor que o hook endereça
      {
        id: 'problema', type: 'problem', visual_type: 'text_card',
        keyword: painText ? painText.split(' ').slice(0, 2).join(' ').toUpperCase() : 'O PROBLEMA',
        duration: 5,
        card_title: painText.slice(0, 60) || 'O mercado mudou.',
        card_body: painTrigger.slice(0, 100) || '',
        narration: '',
      },
      // Scene 3: PROVA — dado que sustenta (do research trends)
      {
        id: 'prova', type: 'data', visual_type: trendText ? 'text_card' : 'photo',
        keyword: 'OS DADOS',
        duration: 5,
        card_title: trendText.slice(0, 60) || '',
        card_body: trendDetail.slice(0, 100) || '',
        narration: '',
      },
      // Scene 4: CTA — marca + ação clara
      {
        id: 'cta', type: 'cta', visual_type: 'cta',
        keyword: 'COMECE AGORA', duration: 4,
        cta_brand: ctaBrand,
        cta_action: h.cta || ctaAction,
        narration: '',
      },
      // Scene 5: HOLD — CTA silencioso
      {
        id: 'hold', type: 'cta', visual_type: 'cta',
        keyword: ctaBrand, duration: 3,
        cta_brand: ctaBrand,
        cta_action: '',
        narration: '',
      },
    ];

    // ── Narration per hook ──────────────────────────────────────────
    const wantsNarration = videoAudio === 'narration' || videoAudio === 'both';
    let hookNarrationFile = null;

    if (wantsNarration) {
      // Build narration: hook text + pain + trend (short, <30s spoken)
      const scriptParts = [
        h.hook,
        painText ? painText : '',
        trendText ? trendText.slice(0, 80) : '',
        `Acesse ${ctaBrand}.`,
      ].filter((p) => p && p.trim().length > 0).map((p) => p.trim());

      // Set narration text per scene
      scenes[0].narration = h.hook;
      scenes[1].narration = painText || painTrigger || '';
      scenes[2].narration = trendText.slice(0, 80) || '';
      scenes[3].narration = `Acesse ${ctaBrand}.`;
      scenes[4].narration = '';

      hookNarrationFile = path.join(hookDir, 'narration.mp3');
      const totalChars = scriptParts.reduce((sum, p) => sum + p.length, 0);
      if (totalChars > 20) {
        const tmpDir = path.join(hookDir, '_tts_tmp');
        try {
          fs.mkdirSync(tmpDir, { recursive: true });
          const generateAudio = path.resolve(projectRoot, 'pipeline/generate-audio.js');
          const partFiles = [];

          // Generate one mp3 per sentence (respects daemon cache, ~3s each after warmup)
          for (let pi = 0; pi < scriptParts.length; pi += 1) {
            const partFile = path.join(tmpDir, `p${pi}.mp3`);
            const args = [generateAudio, partFile, scriptParts[pi], narrator];
            if (ttsProvider && ttsProvider !== 'auto') args.push('--provider', ttsProvider);
            execFileSync('node', args, { cwd: projectRoot, stdio: 'pipe', timeout: 60000 });
            partFiles.push(partFile);
          }

          // Silence between parts: 0.4s normal, 0.6s before last (CTA beat)
          const silencesSec = [];
          for (let pi = 0; pi < partFiles.length - 1; pi += 1) {
            silencesSec.push(pi === partFiles.length - 2 ? 0.6 : 0.4);
          }

          concatPartsWithSilence(partFiles, silencesSec, hookNarrationFile);
          log(outputDir, 'video_pro', `  Narration generated: ${path.basename(hookDir)}/narration.mp3 (${scriptParts.length} frases + pausas)`);
        } catch (e) {
          log(outputDir, 'video_pro', `  Narration failed: ${e.message.slice(0, 100)}`);
          hookNarrationFile = null;
        } finally {
          try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
        }
      } else {
        hookNarrationFile = null;
      }
    } else {
      for (const s of scenes) s.narration = '';
    }

    const totalDur = scenes.reduce((s, sc) => s + sc.duration, 0);

    const plan = {
      titulo: `Gatilho: ${h.hook.slice(0, 40)}`,
      video_length: totalDur,
      format: '9:16',
      width: 1080, height: 1920,
      voice: wantsNarration ? narrator : null,
      narration_file: hookNarrationFile,
      music: null, music_volume: 0.15,
      scenes,
    };

    // Render slides
    const motionCycle = ['push-in', 'drift', 'breathe', 'zoom_in', 'ken-burns-in'];
    for (let si = 0; si < scenes.length; si++) {
      const scene = scenes[si];
      const bgImage = bgImages.length > 0 ? bgImages[(hi * 5 + si) % bgImages.length] : null;
      const slidePath = path.join(hookDir, `carousel_${String(si + 1).padStart(2, '0')}.png`);

      try {
        await renderSlidePNG(scene, preset, bgImage, 1080, 1920, slidePath, 'narrativo');
        scene.image = slidePath;
        scene._slide = true;
        scene.motion = { type: motionCycle[si % motionCycle.length], intensity: 'moderate' };
      } catch (err) {
        log(outputDir, 'video_pro', `  Slide ${si} failed: ${err.message}`);
      }
    }

    // Save plan
    const planPath = path.join(hookDir, 'scene_plan.json');
    fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), 'utf-8');

    // Render video
    const videoPath = path.join(hookDir, 'video.mp4');
    try {
      execFileSync('node', [renderScript, planPath, videoPath], {
        cwd: projectRoot, stdio: 'pipe', timeout: 120000,
      });
      log(outputDir, 'video_pro', `  Video rendered: ${path.basename(hookDir)}/video.mp4`);
      completed++;
    } catch (e) {
      log(outputDir, 'video_pro', `  Video render failed: ${e.message.slice(0, 150)}`);
    }
  }

  await closeBrowser();

  log(outputDir, 'video_pro', `GATILHOS complete: ${completed}/${hooks.length} videos rendered`);

  return {
    gatilhosDir,
    count: hooks.length,
    completed,
  };
}

module.exports = { generateGatilhos };
