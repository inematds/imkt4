/**
 * Reels 9:16 (1080x1920) do fisioterapeuta:
 *  - Topo (0-420px): watermark INEMA.CLUB + hook cronometrado (Bebas Neue)
 *  - Meio (420-1500px): video 1:1 original (sem modificar)
 *  - Rodapé (1500-1920px): legendas cronometradas + CTA (Montserrat Black)
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const IN_VIDEO = path.join(__dirname, 'prj/inema/videos/fisioterapeuta_2026-04-22/video/fisioterapeuta-30s.mp4');
const OUT_DIR = path.join(__dirname, 'prj/inema/videos/fisioterapeuta_2026-04-22/video');
const OUT_FILE = path.join(OUT_DIR, 'fisioterapeuta-30s-reels.mp4');
const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';
const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/Montserrat-Black.ttf';

// Escapa vírgula e dois-pontos para drawtext
const esc = (s) => s
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/:/g, '\\:')
  .replace(/,/g, '\\,');

// Blocos de texto: texto, tStart, tEnd, y, fontsize, color, font
function dt({ text, t0, t1, y, size, color = 'white', bord = 6, bordColor = 'black@0.65', font = FONT_CAPS, x = '(w-tw)/2' }) {
  return (
    `drawtext=fontfile=${font}:text='${esc(text)}':` +
    `fontcolor=${color}:fontsize=${size}:` +
    `borderw=${bord}:bordercolor=${bordColor}:` +
    `x=${x}:y=${y}:` +
    `enable='between(t\\,${t0}\\,${t1})'`
  );
}

// Hook principal (topo) — mudança em 5 blocos
const hookY = '180'; // dentro do topo 420
const hookSize = 96;
const hookBlocks = [
  { t0: 0,    t1: 2.0,  text: 'Ela tinha 7 anos.' },
  { t0: 2.0,  t1: 10.5, text: 'E já entendia de dor.' },
  { t0: 10.5, t1: 19.0, text: 'Duvidaram. Ela persistiu.' },
  { t0: 19.0, t1: 27.0, text: 'Hoje alivia dor com IA.' },
  { t0: 27.0, t1: 30.0, text: 'LINK NA BIO' },
];

// Legendas (rodapé) — pedaços curtos sincronizados com narração (~0.8–28.3s)
const capY = '1620'; // dentro do rodapé 1500-1920
const capSize = 58;
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
  { t0: 26.0, t1: 28.3, text: 'pacientes mais perto do bem-estar' },
  { t0: 28.3, t1: 30.0, text: 'Alívio virou ciência' },
];

// Watermark INEMA.CLUB constante no topo-esquerda (dentro do topo 420)
const watermark = `drawtext=fontfile=${FONT_HOOK}:text='INEMA.CLUB':fontcolor=white@0.85:fontsize=42:borderw=3:bordercolor=black@0.6:x=48:y=48`;

// Handle fixo no rodapé-centro
const handle = `drawtext=fontfile=${FONT_CAPS}:text='@inema.club':fontcolor=white@0.78:fontsize=38:x=(w-tw)/2:y=1810`;

// Monta cadeia de drawtext
const drawtexts = [
  watermark,
  handle,
  ...hookBlocks.map((b) => dt({
    text: b.text, t0: b.t0, t1: b.t1, y: hookY, size: hookSize,
    color: 'white', font: FONT_HOOK, bord: 8, bordColor: 'black@0.75',
  })),
  ...capBlocks.map((b) => dt({
    text: b.text, t0: b.t0, t1: b.t1, y: capY, size: capSize,
    color: '#FFEB3B', font: FONT_CAPS, bord: 6, bordColor: 'black@0.85',
  })),
].join(',');

// Filtro: pad vertical + drawtext stack
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

console.log(`[reels] input=${IN_VIDEO}`);
console.log(`[reels] output=${OUT_FILE}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) { console.error(`ffmpeg exit=${res.status}`); process.exit(res.status || 1); }
const stat = fs.statSync(OUT_FILE);
console.log(`\n[reels] ✅ ${OUT_FILE} — ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
