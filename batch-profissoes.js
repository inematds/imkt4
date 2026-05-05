/**
 * Batch runner — para cada slug, executa pipeline completo:
 *   1. gen-criaprof.js (50 imgs) — skip se já existe completo
 *   2. gen-gertran-nostalgia.js (20 imgs) — skip se já existe completo
 *   3. TTS narr_criaprof + narr_gertran (chatterbox-vc bella)
 *   4. Whisper word-level em cada narração
 *   5. render-criaprof.js + render-gertran.js
 *
 * Uso: node batch-profissoes.js <slugs_csv | all | new>
 *   all  = todas 30
 *   new  = 26 que ainda não foram renderizadas
 *   csv  = lista separada por vírgula
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { profissoes } = require('./config/profissoes-30');

const arg = process.argv[2] || 'new';

// Fases 1 + 2 já processadas (60 slugs). `new` mode roda apenas a fase 3.
const EXISTING = new Set([
  // Fase 1
  'fisioterapeuta', 'crianca-medica', 'enfermeira', 'psicologa',
  'dentista', 'farmaceutica', 'nutricionista', 'fonoaudiologa', 'terapeuta-ocupacional', 'biomedica',
  'professora-fundamental', 'professora-medio', 'pedagoga', 'educacao-infantil', 'psicopedagoga',
  'contador', 'advogada', 'secretaria', 'administrador', 'analista-rh',
  'eletricista', 'encanador', 'mecanico', 'marceneiro', 'costureira',
  'cabeleireira', 'chef', 'fotografo', 'jornalista', 'arquiteta',
  // Fase 2
  'cardiologista', 'pediatra', 'ginecologista', 'veterinario', 'massoterapeuta', 'parteira',
  'professor-universitario', 'professor-matematica', 'educador-fisico', 'bibliotecaria', 'coordenador-escolar',
  'juiza', 'delegada', 'auditor-fiscal', 'consultor-financeiro',
  'soldador', 'pintor', 'pedreiro', 'sapateiro', 'relojoeiro',
  'caminhoneiro', 'piloto', 'controlador-aereo',
  'maquiadora', 'florista', 'confeiteiro', 'dj-produtor',
  'agronomo', 'biologo-ambiental', 'pescador',
]);

let selected;
if (arg === 'all') selected = profissoes.map((p) => p.slug);
else if (arg === 'new') selected = profissoes.filter((p) => !EXISTING.has(p.slug)).map((p) => p.slug);
else selected = arg.split(',').map((s) => s.trim()).filter(Boolean);

const LOG_DIR = path.join(__dirname, 'logs/profissoes');
fs.mkdirSync(LOG_DIR, { recursive: true });

function run(name, cmd, args, logPath) {
  console.log(`\n▶ [${name}] ${cmd} ${args.join(' ')}`);
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
  console.log(`\n▶ [${name}] sh: ${shellCmd}`);
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

function imgsExist(dir, expected) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter((f) => f.endsWith('.png') && fs.statSync(path.join(dir, f)).size > 20000).length;
}

const tBatch = Date.now();
let successCount = 0;
let skipCount = 0;
const failed = [];

for (const slug of selected) {
  const profile = profissoes.find((p) => p.slug === slug);
  if (!profile) { console.error(`! slug desconhecido: ${slug}`); failed.push(slug); continue; }

  const LOG = path.join(LOG_DIR, `${slug}-batch.log`);
  const t0 = Date.now();
  console.log(`\n=============================================`);
  console.log(`=== [${slug}] começa em ${new Date().toISOString()}`);
  console.log(`=== log: ${LOG}`);
  console.log(`=============================================`);

  // 1. gen-criaprof
  const criaDir = path.join(__dirname, `prj/inema/videos/criaprof/${slug}_2026-04-23/imgs`);
  if (imgsExist(criaDir) >= 50) {
    console.log(`⏭ [${slug}] criaprof já completo (50 imgs)`);
  } else {
    if (!run(`${slug}:gen-criaprof`, 'node', ['gen-criaprof.js', slug], LOG)) { failed.push(slug); continue; }
  }

  // 2. gen-gertran-nostalgia
  const nostalgiaDir = path.join(__dirname, `prj/inema/videos/gertran-nostalgia/${slug}_2026-04-23/imgs`);
  if (imgsExist(nostalgiaDir) >= 20) {
    console.log(`⏭ [${slug}] nostalgia já completo (20 imgs)`);
  } else {
    if (!run(`${slug}:gen-nostalgia`, 'node', ['gen-gertran-nostalgia.js', slug], LOG)) { failed.push(slug); continue; }
  }

  // 3. TTS
  const narrCriaprof = `/tmp/narr/narr-criaprof-${slug}.mp3`;
  const narrGertran = `/tmp/narr/narr-gertran-${slug}.mp3`;
  if (!fs.existsSync(narrCriaprof)) {
    if (!run(`${slug}:tts-criaprof`, 'node', ['pipeline/generate-audio.js', narrCriaprof, profile.narr_criaprof, 'bella'], LOG)) { failed.push(slug); continue; }
  } else console.log(`⏭ [${slug}] tts-criaprof já existe`);
  if (!fs.existsSync(narrGertran)) {
    if (!run(`${slug}:tts-gertran`, 'node', ['pipeline/generate-audio.js', narrGertran, profile.narr_gertran, 'bella'], LOG)) { failed.push(slug); continue; }
  } else console.log(`⏭ [${slug}] tts-gertran já existe`);

  // 4. Whisper — roda em um único shell com conda activate
  const whisperCriaprof = `/tmp/narr/whisper-criaprof-${slug}.json`;
  const whisperGertran = `/tmp/narr/whisper-gertran-${slug}.json`;
  if (!fs.existsSync(whisperCriaprof) || !fs.existsSync(whisperGertran)) {
    const cmd = [
      'source /home/nmaldaner/miniconda3/etc/profile.d/conda.sh',
      'conda activate chatterbox',
      `python3 transcribe-words.py ${narrCriaprof} ${whisperCriaprof}`,
      `python3 transcribe-words.py ${narrGertran} ${whisperGertran}`,
    ].join(' && ');
    if (!runShell(`${slug}:whisper`, cmd, LOG)) { failed.push(slug); continue; }
  } else console.log(`⏭ [${slug}] whispers já existem`);

  // 5. Renders
  if (!run(`${slug}:render-criaprof`, 'node', ['render-criaprof.js', slug], LOG)) { failed.push(slug); continue; }
  if (!run(`${slug}:render-gertran`, 'node', ['render-gertran.js', slug], LOG)) { failed.push(slug); continue; }

  successCount += 1;
  const elapsed = ((Date.now() - t0) / 1000 / 60).toFixed(1);
  console.log(`\n✅ [${slug}] COMPLETO em ${elapsed} min`);
}

const totalMin = ((Date.now() - tBatch) / 1000 / 60).toFixed(1);
console.log(`\n\n================= BATCH RESUMO =================`);
console.log(`total: ${selected.length}`);
console.log(`sucessos: ${successCount}`);
console.log(`skips: ${skipCount}`);
console.log(`falhas: ${failed.length}${failed.length ? ': ' + failed.join(', ') : ''}`);
console.log(`tempo total: ${totalMin} min`);
