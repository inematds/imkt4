/**
 * Factory CriaProf — versão Comic Style A (Calvin & Hobbes).
 *
 * Reusa criaProfScenes() de gen-lib/scene-templates.js, mas substitui o
 * estilo fotográfico (S_OLD/S_MID/S_FUT) pelo prompt suffix Calvin & Hobbes.
 * A estrutura narrativa das 25 cenas × 2 momentos (50 imgs) é a mesma.
 *
 * Output: prj/inema/videos/criaprof-comic-A/<slug>_<date>/imgs/
 *
 * Uso: node gen-criaprof-comic-A.js <slug>
 */

const fs = require('fs');
const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');
const { profissoes } = require('./config/profissoes-30');
const { criaProfScenes } = require('./gen-lib/scene-templates');
const { getDiverseProfile } = require('./config/profissoes-diverse');

const MODEL = 'flux2-klein';
const RATIO = '1:1';

const COMIC_A = 'newspaper comic strip illustration in the style of Bill Watterson Calvin and Hobbes, expressive ink linework with light watercolor wash, hand-drawn aesthetic, soft warm tones, no text, no captions, no logos';

const STYLE_REPLACEMENTS = [
  ['shot on 35mm film, cinematic grading, warm tungsten light, film grain, slight vignette, no text, no captions, no logos', COMIC_A],
  ['cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos', COMIC_A],
  ['neo-noir clinical lighting, soft glassmorphism, teal accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos', COMIC_A],
];

function transformPrompt(p) {
  let out = p;
  for (const [from, to] of STYLE_REPLACEMENTS) out = out.split(from).join(to);
  return out;
}

const slug = process.argv[2];
if (!slug) {
  console.error(`uso: node gen-criaprof-comic-A.js <slug>`);
  console.error(`slugs disponíveis: ${profissoes.map((p) => p.slug).join(', ')}`);
  process.exit(1);
}

const originalProfile = profissoes.find((p) => p.slug === slug);
if (!originalProfile) { console.error(`slug não encontrado: ${slug}`); process.exit(1); }

// Aplica overlay de diversidade brasileira (override character/pronoun/hair_style)
const profile = getDiverseProfile(originalProfile);
if (profile._diversity) {
  console.log(`[diverse] ${slug}: ${profile._diversity.region} ${profile._diversity.gender} (${profile._diversity.variant})`);
}

const DATE = new Date().toISOString().slice(0, 10);
const OUT = path.join(__dirname, `prj/inema/videos/criaprof-comic-A/${slug}_${DATE}/imgs`);
fs.mkdirSync(OUT, { recursive: true });

const scenes = criaProfScenes(profile).map((s) => ({ file: s.file, prompt: transformPrompt(s.prompt) }));

(async () => {
  const t0 = Date.now();
  console.log(`\n[criaprof-comic-A:${slug}] ${scenes.length} imagens em ${OUT}\n`);
  let ok = 0, fail = 0;
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    if (fs.existsSync(out) && fs.statSync(out).size > 50000) {
      console.log(`── ${i + 1}/${scenes.length} ── ${s.file} (skip, já existe)`);
      ok += 1;
      continue;
    }
    process.stdout.write(`── ${i + 1}/${scenes.length} ── ${s.file} ... `);
    try { await generateImage(out, s.prompt, MODEL, RATIO); ok += 1; process.stdout.write('✅\n'); }
    catch (e) { console.error(`❌ ${e.message}`); fail += 1; }
  }
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[criaprof-comic-A:${slug}] ✅ ${ok}/${scenes.length} em ${elapsed}s (fails=${fail})`);
})();
