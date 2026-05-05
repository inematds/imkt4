/**
 * Batch renderizar todos os 90 slugs CriaProf em 9:16 estilo GERTRAN.
 * Uso: node batch-criaprof-916.js
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { profissoes } = require('./config/profissoes-30');

const LOG = path.join(__dirname, 'logs/profissoes/_batch-criaprof-916.log');
fs.mkdirSync(path.dirname(LOG), { recursive: true });
fs.writeFileSync(LOG, '');

const tBatch = Date.now();
let ok = 0;
const failed = [];

for (const p of profissoes) {
  const slug = p.slug;
  const outFile = path.join(__dirname, `prj/inema/videos/criaprof/videos/${slug}-criaprof.mp4`);
  const t0 = Date.now();
  console.log(`▶ [${slug}] render 9:16`);
  const logFd = fs.openSync(LOG, 'a');
  fs.writeSync(logFd, `\n=== ${new Date().toISOString()} ${slug} ===\n`);
  const res = spawnSync('node', ['render-criaprof-916.js', slug], { stdio: ['ignore', logFd, logFd] });
  fs.closeSync(logFd);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  if (res.status !== 0) {
    console.log(`❌ [${slug}] falhou (exit ${res.status}) em ${dt}s`);
    failed.push(slug);
    continue;
  }
  const size = (fs.statSync(outFile).size / 1024 / 1024).toFixed(1);
  console.log(`✅ [${slug}] ${size}MB em ${dt}s`);
  ok += 1;
}

const totalMin = ((Date.now() - tBatch) / 1000 / 60).toFixed(1);
console.log(`\n=========== BATCH 9:16 RESUMO ===========`);
console.log(`total: ${profissoes.length}`);
console.log(`sucessos: ${ok}`);
console.log(`falhas: ${failed.length}${failed.length ? ': ' + failed.join(', ') : ''}`);
console.log(`tempo: ${totalMin} min`);
