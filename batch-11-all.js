/**
 * Batch render 1:1 para CriaProf + GERTRAN nas 90 profissões.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { profissoes } = require('./config/profissoes-30');

const LOG = path.join(__dirname, 'logs/profissoes/_batch-11-all.log');
fs.mkdirSync(path.dirname(LOG), { recursive: true });
fs.writeFileSync(LOG, '');

const tBatch = Date.now();
let ok = { criaprof: 0, gertran: 0 };
let failed = [];

function run(script, slug) {
  const logFd = fs.openSync(LOG, 'a');
  fs.writeSync(logFd, `\n=== ${new Date().toISOString()} ${script} ${slug} ===\n`);
  const res = spawnSync('node', [script, slug], { stdio: ['ignore', logFd, logFd] });
  fs.closeSync(logFd);
  return res.status === 0;
}

for (const p of profissoes) {
  const slug = p.slug;
  const t0 = Date.now();
  const cOk = run('render-criaprof-11.js', slug);
  const gOk = run('render-gertran-11.js', slug);
  if (cOk) ok.criaprof += 1; else failed.push(`${slug}:criaprof`);
  if (gOk) ok.gertran += 1; else failed.push(`${slug}:gertran`);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`${cOk ? '✅' : '❌'} ${gOk ? '✅' : '❌'} [${slug}] em ${dt}s`);
}

const totalMin = ((Date.now() - tBatch) / 1000 / 60).toFixed(1);
console.log(`\n=========== BATCH 1:1 RESUMO ===========`);
console.log(`CriaProf 1:1: ${ok.criaprof}/${profissoes.length}`);
console.log(`GERTRAN 1:1: ${ok.gertran}/${profissoes.length}`);
if (failed.length) console.log(`falhas: ${failed.join(', ')}`);
console.log(`tempo: ${totalMin} min`);
