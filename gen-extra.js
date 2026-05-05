/**
 * Factory genérico pros 3 templates extras (paired | artifacts | decades).
 * Uso: node gen-extra.js <slug> <template>
 */

const fs = require('fs');
const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');
const { profissoes } = require('./config/profissoes-30');
const {
  pairedChangesScenes,
  artifactTimelineScenes,
  decadeTimelineScenes,
} = require('./gen-lib/scene-templates');

const MODEL = 'flux2-klein';
const RATIO = '1:1';
const DATE = '2026-04-23';

const TEMPLATES = {
  paired:    { fn: pairedChangesScenes,    dir: 'paired' },
  artifacts: { fn: artifactTimelineScenes, dir: 'artifacts' },
  decades:   { fn: decadeTimelineScenes,   dir: 'decades' },
};

const slug = process.argv[2];
const templ = process.argv[3];
if (!slug || !TEMPLATES[templ]) {
  console.error(`uso: node gen-extra.js <slug> <${Object.keys(TEMPLATES).join('|')}>`);
  process.exit(1);
}

const profile = profissoes.find((p) => p.slug === slug);
if (!profile) { console.error(`slug não encontrado: ${slug}`); process.exit(1); }

const OUT = path.join(__dirname, `prj/inema/videos/extras/${TEMPLATES[templ].dir}/${slug}_${DATE}/imgs`);
fs.mkdirSync(OUT, { recursive: true });

const scenes = TEMPLATES[templ].fn(profile);

(async () => {
  const t0 = Date.now();
  console.log(`\n[extra:${templ}:${slug}] ${scenes.length} imagens em ${OUT}\n`);
  let ok = 0, fail = 0;
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    if (fs.existsSync(out) && fs.statSync(out).size > 50000) {
      console.log(`── ${i + 1}/${scenes.length} ── ${s.file} (skip)`);
      ok += 1;
      continue;
    }
    console.log(`── ${i + 1}/${scenes.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); ok += 1; }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); fail += 1; }
  }
  console.log(`\n[extra:${templ}:${slug}] ✅ ${ok}/${scenes.length} em ${((Date.now()-t0)/1000).toFixed(1)}s (fails=${fail})`);
})();
