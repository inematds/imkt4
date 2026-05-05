/**
 * Factory GERTRAN nostalgia — gera 20 imgs era-específicas lendo config/profissoes-30.js.
 *
 * Uso: node gen-gertran-nostalgia.js <slug>
 */

const fs = require('fs');
const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');
const { profissoes } = require('./config/profissoes-30');
const { gertranNostalgiaScenes } = require('./gen-lib/scene-templates');

const MODEL = 'flux2-klein';
const RATIO = '1:1';

const slug = process.argv[2];
if (!slug) {
  console.error(`uso: node gen-gertran-nostalgia.js <slug>`);
  console.error(`slugs disponíveis: ${profissoes.map((p) => p.slug).join(', ')}`);
  process.exit(1);
}

const profile = profissoes.find((p) => p.slug === slug);
if (!profile) { console.error(`slug não encontrado: ${slug}`); process.exit(1); }

const DATE = '2026-04-23';
const OUT = path.join(__dirname, `prj/inema/videos/gertran-nostalgia/${slug}_${DATE}/imgs`);
fs.mkdirSync(OUT, { recursive: true });

const scenes = gertranNostalgiaScenes(profile);

(async () => {
  const t0 = Date.now();
  console.log(`\n[gertran-nostalgia:${slug}] ${scenes.length} imagens em ${OUT}\n`);
  let ok = 0, fail = 0;
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    if (fs.existsSync(out) && fs.statSync(out).size > 50000) {
      console.log(`── ${i + 1}/${scenes.length} ── ${s.file} (skip, já existe)`);
      ok += 1;
      continue;
    }
    console.log(`── ${i + 1}/${scenes.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); ok += 1; }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); fail += 1; }
  }
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[gertran-nostalgia:${slug}] ✅ ${ok}/${scenes.length} em ${elapsed}s (fails=${fail})`);
})();
