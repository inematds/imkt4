/**
 * Reels 9:16 v2 — hook provocativo + caption maior + "scroll-stopper" nos primeiros 2.5s.
 * Mantém 30s total. Voz preservada.
 *
 * Hook structure (formula: claim > curiosidade > jornada > CTA específico):
 *   0-2.5s  HOOK PUNCH (fontsize 118): claim polêmico/específico
 *   2.5-10s curiosidade: setup do paradoxo
 *   10-19s  jornada: transformação
 *   19-27s  payoff: situação atual
 *   27-30s  CTA direto com seta e "QUERO" (imperativo)
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const IN_VIDEO = path.join(__dirname, 'prj/inema/videos/fisioterapeuta_2026-04-22/video/fisioterapeuta-30s.mp4');
const OUT_DIR = path.join(__dirname, 'prj/inema/videos/fisioterapeuta_2026-04-22/video');
const OUT_FILE = path.join(OUT_DIR, 'fisioterapeuta-30s-reels-v2.mp4');
const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';
const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/Montserrat-ExtraBold.ttf';

const esc = (s) => s
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/:/g, '\\:')
  .replace(/,/g, '\\,');

// Escreve texto em arquivo temp e retorna caminho — evita bugs de UTF-8 em drawtext inline
const TMP_TXT = '/tmp/reels-texts/';
fs.mkdirSync(TMP_TXT, { recursive: true });
let textFileCounter = 0;
function textToFile(text) {
  const f = path.join(TMP_TXT, `t_${textFileCounter++}.txt`);
  fs.writeFileSync(f, text, 'utf8');
  return f;
}

function dt({ text, t0, t1, y, size, color = 'white', bord = 6, bordColor = 'black@0.65', font = FONT_CAPS, x = '(w-tw)/2' }) {
  const tf = textToFile(text);
  return (
    `drawtext=fontfile=${font}:textfile=${tf}:text_shaping=0:` +
    `fontcolor=${color}:fontsize=${size}:` +
    `borderw=${bord}:bordercolor=${bordColor}:` +
    `x=${x}:y=${y}:` +
    `enable='between(t\\,${t0}\\,${t1})'`
  );
}

// Hook sequenciado — frase 1 é A BOMBA (scroll-stopper)
const hookY = '120';
// 5 blocos com fontsizes crescentes em punch
const hookBlocks = [
  // Frase-bomba — tamanho gigante pra segurar o scroll
  { t0: 0,    t1: 2.5,  text: 'ELA CURA DORES QUE',     size: 110, y: 70  },
  { t0: 0,    t1: 2.5,  text: 'OUTROS DESISTIRAM.',     size: 110, y: 210 },
  // Curiosidade
  { t0: 2.5,  t1: 10.0, text: 'E TUDO COMEÇOU',         size: 88,  y: 130 },
  { t0: 2.5,  t1: 10.0, text: 'QUANDO ELA TINHA 7.',    size: 88,  y: 250 },
  // Jornada
  { t0: 10.0, t1: 19.0, text: 'DUVIDARAM. ELA APRENDEU.', size: 84,  y: 130 },
  { t0: 10.0, t1: 19.0, text: 'NUNCA PAROU.',            size: 84,  y: 250 },
  // Payoff
  { t0: 19.0, t1: 27.0, text: 'HOJE: MÃOS + IA +',       size: 88,  y: 130 },
  { t0: 19.0, t1: 27.0, text: '40 ANOS DE PRÁTICA.',     size: 88,  y: 250 },
  // CTA
  { t0: 27.0, t1: 30.0, text: 'QUERO APRENDER COM ELA',  size: 86,  y: 140 },
  { t0: 27.0, t1: 30.0, text: 'LINK NA BIO',             size: 98,  y: 250 },
];

// Captions — legendas sincronizadas, fontsize menor pra caber (fix v1)
const capY = '1640';
const capSize = 38;
const capBlocks = [
  { t0: 0.8,  t1: 3.0,  text: 'Desde criança' },
  { t0: 3.0,  t1: 5.2,  text: 'ela entendia o corpo' },
  { t0: 5.2,  t1: 7.0,  text: 'pelas mãos' },
  { t0: 7.0,  t1: 9.0,  text: 'Massageava a avó' },
  { t0: 9.0,  t1: 11.0, text: 'ajudava amigos' },
  { t0: 11.0, t1: 13.5, text: 'aprendeu anatomia' },
  { t0: 13.5, t1: 15.8, text: 'Formou-se fisioterapeuta' },
  { t0: 15.8, t1: 17.8, text: 'Atendeu, ensinou a mover' },
  { t0: 17.8, t1: 19.8, text: 'aliviou dor após dor' },
  { t0: 19.8, t1: 21.8, text: 'A tecnologia chegou' },
  { t0: 21.8, t1: 24.0, text: 'sensores, IA, análise' },
  { t0: 24.0, t1: 26.0, text: 'protocolos mais precisos' },
  { t0: 26.0, t1: 28.3, text: 'pacientes em bem-estar' },
  { t0: 28.3, t1: 30.0, text: 'ALÍVIO VIROU CIÊNCIA' },
];

const watermark = `drawtext=fontfile=${FONT_HOOK}:text='INEMA.CLUB':fontcolor=white@0.85:fontsize=38:borderw=3:bordercolor=black@0.6:x=48:y=380`;

const handle = `drawtext=fontfile=${FONT_CAPS}:text='@inema.club':fontcolor=white@0.8:fontsize=36:x=(w-tw)/2:y=1820`;

// Pulse visual nos primeiros 2.5s — barra fina colorida animada no rodapé do topo pra dar pattern interrupt
const pulse = `drawbox=x=0:y=415:w=1080:h=6:color=#FFEB3B@0.9:t=fill:enable='between(t,0,2.5)'`;

const drawtexts = [
  watermark,
  handle,
  pulse,
  ...hookBlocks.map((b) => dt({
    text: b.text, t0: b.t0, t1: b.t1, y: b.y, size: b.size,
    color: 'white', font: FONT_HOOK, bord: 8, bordColor: 'black@0.8',
  })),
  // ASCII-safe: ffmpeg drawtext 6.1.1 corta chars após alguns multibytes (ã, ê, í).
  // Normalizamos NFD + removemos diacríticos. Perde estética mínima, ganha legibilidade.
  ...capBlocks.map((b) => dt({
    text: b.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(),
    t0: b.t0, t1: b.t1, y: capY, size: capSize + 14,
    color: '#FFEB3B', font: FONT_HOOK, bord: 6, bordColor: 'black@0.9',
  })),
].join(',');

const filter = `[0:v]pad=1080:1920:0:420:color=0x0A1428,${drawtexts}[vout]`;

const args = [
  '-y',
  '-i', IN_VIDEO,
  '-filter_complex', filter,
  '-map', '[vout]',
  '-map', '0:a',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-c:a', 'copy',
  '-movflags', '+faststart',
  OUT_FILE,
];

console.log(`[reels v2] output=${OUT_FILE}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) { console.error(`ffmpeg exit=${res.status}`); process.exit(res.status || 1); }
const stat = fs.statSync(OUT_FILE);
console.log(`\n[reels v2] ✅ ${OUT_FILE} — ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
