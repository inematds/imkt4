/**
 * Batch 3 templates × 90 profissões (270 unidades).
 * Por profissão: para cada template {paired, artifacts, decades}:
 *   1. gen 50 imgs (skip se já existe)
 *   2. render 31s 9:16
 * Reusa narração gertran existente.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { profissoes } = require('./config/profissoes-30');

const TEMPLATES = ['paired', 'artifacts', 'decades'];
const LOG_DIR = path.join(__dirname, 'logs/profissoes');
fs.mkdirSync(LOG_DIR, { recursive: true });
const MASTER_LOG = path.join(LOG_DIR, '_batch-extras.log');
fs.writeFileSync(MASTER_LOG, '');

function run(cmd, args, log) {
  const fd = fs.openSync(log, 'a');
  fs.writeSync(fd, `\n=== ${new Date().toISOString()} ${cmd} ${args.join(' ')} ===\n`);
  const res = spawnSync(cmd, args, { stdio: ['ignore', fd, fd] });
  fs.closeSync(fd);
  return res.status === 0;
}

function countImgs(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter((f) => f.endsWith('.png') && fs.statSync(path.join(dir, f)).size > 50000).length;
}

const tBatch = Date.now();
let okGen = 0, okRender = 0, failed = [];

for (const p of profissoes) {
  const slug = p.slug;
  for (const templ of TEMPLATES) {
    const imgDir = path.join(__dirname, `prj/inema/videos/extras/${templ}/${slug}_2026-04-23/imgs`);
    const vidFile = path.join(__dirname, `prj/inema/videos/extras/${templ}/videos/${slug}-${templ}-31s.mp4`);
    const t0 = Date.now();

    // 1. Gen
    if (countImgs(imgDir) >= 50) {
      console.log(`⏭ [${slug}:${templ}] gen skip (50 imgs já existem)`);
      okGen += 1;
    } else {
      if (run('node', ['gen-extra.js', slug, templ], MASTER_LOG)) okGen += 1;
      else { failed.push(`${slug}:${templ}:gen`); continue; }
    }

    // 2. Render
    if (fs.existsSync(vidFile) && fs.statSync(vidFile).size > 500000) {
      console.log(`⏭ [${slug}:${templ}] render skip`);
      okRender += 1;
    } else {
      if (run('node', ['render-extra.js', slug, templ], MASTER_LOG)) okRender += 1;
      else { failed.push(`${slug}:${templ}:render`); continue; }
    }

    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`✅ [${slug}:${templ}] em ${dt}s`);
  }
}

const totalMin = ((Date.now() - tBatch) / 1000 / 60).toFixed(1);
console.log(`\n=========== BATCH EXTRAS RESUMO ===========`);
console.log(`gen: ${okGen}/${profissoes.length * TEMPLATES.length}`);
console.log(`render: ${okRender}/${profissoes.length * TEMPLATES.length}`);
if (failed.length) console.log(`falhas (${failed.length}): ${failed.join(', ')}`);
console.log(`tempo: ${totalMin} min`);
