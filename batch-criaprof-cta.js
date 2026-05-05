/**
 * Batch runner para CriaProf-CTA-916 (template 9:16 com hook + CTA pesado).
 *
 * Para cada slug, executa pipeline:
 *   1. TTS prof + generic (Chatterbox VC bella) — narração com prefix "A {profissao} mudou. E agora? <narr_criaprof>"
 *   2. Whisper word-level em cada narração
 *   3. Render prof + generic (render-criaprof-cta-916.js)
 *
 * Reutiliza as 50 imgs CriaProf já existentes em prj/inema/videos/criaprof/<slug>_2026-04-23/imgs/.
 *
 * Uso: node batch-criaprof-cta.js <slugs_csv | all | new>
 *   all      = todas 90 profissões cadastradas
 *   new      = só as que ainda não foram renderizadas (ambas variantes)
 *   <csv>    = lista separada por vírgula
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { profissoes } = require('./config/profissoes-30');
const { getCtaConfig } = require('./config/profissoes-cta');

const arg = process.argv[2] || 'new';

let selected;
if (arg === 'all') selected = profissoes.map((p) => p.slug);
else if (arg === 'new') {
  const today = new Date().toISOString().slice(0, 10);
  selected = profissoes
    .map((p) => p.slug)
    .filter((slug) => {
      const dir = path.join(__dirname, `prj/inema/videos/criaprof-cta-916/${slug}_${today}/video`);
      return !fs.existsSync(path.join(dir, `${slug}-cta-prof-37s.mp4`)) ||
             !fs.existsSync(path.join(dir, `${slug}-cta-generic-37s.mp4`));
    });
} else selected = arg.split(',').map((s) => s.trim()).filter(Boolean);

const VARIANTS = ['prof', 'generic'];
const LOG_DIR = path.join(__dirname, 'logs/criaprof-cta');
fs.mkdirSync(LOG_DIR, { recursive: true });
fs.mkdirSync('/tmp/narr', { recursive: true });

function run(name, cmd, args, logPath) {
  console.log(`\n▶ [${name}] ${cmd} ${args.slice(0, 3).join(' ')}...`);
  const log = fs.openSync(logPath, 'a');
  fs.writeSync(log, `\n=== ${new Date().toISOString()} ${cmd} ${args.join(' ')} ===\n`);
  const res = spawnSync(cmd, args, { stdio: ['ignore', log, log] });
  fs.closeSync(log);
  if (res.status !== 0) {
    console.error(`❌ [${name}] exit ${res.status}`);
    return false;
  }
  console.log(`✅ [${name}] ok`);
  return true;
}

function runShell(name, shellCmd, logPath) {
  console.log(`\n▶ [${name}] sh: ${shellCmd.slice(0, 80)}...`);
  const log = fs.openSync(logPath, 'a');
  fs.writeSync(log, `\n=== ${new Date().toISOString()} ${shellCmd} ===\n`);
  const res = spawnSync('bash', ['-c', shellCmd], { stdio: ['ignore', log, log] });
  fs.closeSync(log);
  if (res.status !== 0) {
    console.error(`❌ [${name}] exit ${res.status}`);
    return false;
  }
  console.log(`✅ [${name}] ok`);
  return true;
}

const tBatch = Date.now();
let successCount = 0;
const failed = [];
const today = new Date().toISOString().slice(0, 10);

for (const slug of selected) {
  const profile = profissoes.find((p) => p.slug === slug);
  if (!profile) { console.error(`! slug desconhecido: ${slug}`); failed.push(slug); continue; }

  const imgCandidates = [
    path.join(__dirname, `prj/inema/videos/criaprof/${slug}_2026-04-23/imgs`),
    path.join(__dirname, `prj/inema/videos/old/criaprof/${slug}_2026-04-23/imgs`),
  ];
  if (!imgCandidates.some((p) => fs.existsSync(p))) {
    console.error(`! imgs criaprof faltando para ${slug} em:\n  ${imgCandidates.join('\n  ')}`);
    failed.push(slug);
    continue;
  }

  const LOG = path.join(LOG_DIR, `${slug}-cta.log`);
  const t0 = Date.now();
  console.log(`\n=============================================`);
  console.log(`=== [${slug}] cta começa em ${new Date().toISOString()}`);
  console.log(`=== log: ${LOG}`);
  console.log(`=============================================`);

  let slugFailed = false;

  for (const variant of VARIANTS) {
    if (slugFailed) break;

    const cta = getCtaConfig(slug, variant);
    const fullNarr = `${cta.narrPrefix} ${profile.narr_criaprof}`;
    const narrFile = `/tmp/narr/narr-criaprof-cta-${variant}-${slug}.mp3`;
    const whisperFile = `/tmp/narr/whisper-criaprof-cta-${variant}-${slug}.json`;
    const outDir = path.join(__dirname, `prj/inema/videos/criaprof-cta-916/${slug}_${today}/video`);
    const outFile = path.join(outDir, `${slug}-cta-${variant}-37s.mp4`);

    // Skip se já renderizado
    if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000000) {
      console.log(`⏭ [${slug}/${variant}] vídeo já existe`);
      continue;
    }

    // 1. TTS
    if (!fs.existsSync(narrFile) || fs.statSync(narrFile).size < 10000) {
      if (!run(`${slug}/${variant}:tts`, 'node', ['pipeline/generate-audio.js', narrFile, fullNarr, 'bella'], LOG)) {
        failed.push(`${slug}/${variant}`);
        slugFailed = true;
        continue;
      }
    } else {
      console.log(`⏭ [${slug}/${variant}] tts já existe`);
    }

    // 2. Whisper
    if (!fs.existsSync(whisperFile)) {
      const cmd = [
        'source /home/nmaldaner/miniconda3/etc/profile.d/conda.sh',
        'conda activate chatterbox',
        `python3 transcribe-words.py ${narrFile} ${whisperFile}`,
      ].join(' && ');
      if (!runShell(`${slug}/${variant}:whisper`, cmd, LOG)) {
        failed.push(`${slug}/${variant}`);
        slugFailed = true;
        continue;
      }
    } else {
      console.log(`⏭ [${slug}/${variant}] whisper já existe`);
    }

    // 3. Render
    if (!run(`${slug}/${variant}:render`, 'node', ['render-criaprof-cta-916.js', slug, variant], LOG)) {
      failed.push(`${slug}/${variant}`);
      slugFailed = true;
      continue;
    }
  }

  if (!slugFailed) {
    successCount += 1;
    const elapsed = ((Date.now() - t0) / 1000 / 60).toFixed(1);
    console.log(`\n✅ [${slug}] CTA COMPLETO (2 variantes) em ${elapsed} min`);
  }
}

const totalMin = ((Date.now() - tBatch) / 1000 / 60).toFixed(1);
console.log(`\n\n================= BATCH CTA RESUMO =================`);
console.log(`total slugs: ${selected.length}`);
console.log(`sucessos: ${successCount}`);
console.log(`falhas: ${failed.length}${failed.length ? ': ' + failed.join(', ') : ''}`);
console.log(`tempo total: ${totalMin} min`);
