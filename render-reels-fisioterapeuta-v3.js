/**
 * Reels v3 — 30s com padding hook + main compressed + black outro com CTA grande.
 *
 * Estrutura:
 *   0–2s   : Padding (hero frame com zoom + hook bomba pra segurar scroll)
 *   2–27s  : Main (25s, 30 imagens ken-burns + narração com CTA embutido)
 *   27–30s : Tela preta + INEMA.CLUB enorme + "APRENDA COM ELA"
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const IMG_DIR = path.join(__dirname, 'prj/inema/videos/fisioterapeuta_2026-04-22/imgs');
const OUT_DIR = path.join(__dirname, 'prj/inema/videos/fisioterapeuta_2026-04-22/video');
const OUT_FILE = path.join(OUT_DIR, 'fisioterapeuta-30s-reels-v3.mp4');
const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = '/tmp/narr/narr-fisio-v3.mp3';
const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';
const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/Montserrat-ExtraBold.ttf';

const FPS = 30;
const W = 1080, H = 1920;       // reels 9:16
const SQ = 1080;                 // tamanho do 1:1 interno
const PAD_DUR = 2.0;             // padding
const MAIN_DUR = 25.0;           // main
const BLACK_DUR = 3.0;           // CTA final
const TOTAL_DUR = PAD_DUR + MAIN_DUR + BLACK_DUR; // 30

const MAIN_N_IMGS = 30;
const MAIN_DUR_PER_IMG = MAIN_DUR / MAIN_N_IMGS;      // 0.833s
const MAIN_FRAMES = Math.round(MAIN_DUR_PER_IMG * FPS); // 25 frames
const PAD_FRAMES = Math.round(PAD_DUR * FPS);           // 60 frames

fs.mkdirSync(OUT_DIR, { recursive: true });

// --- imagens do main ---
const imgs = [];
for (let i = 1; i <= 15; i += 1) {
  const n = String(i).padStart(2, '0');
  imgs.push(path.join(IMG_DIR, `cena${n}-ini.png`));
  imgs.push(path.join(IMG_DIR, `cena${n}-fim.png`));
}
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }

const PAD_IMG = path.join(IMG_DIR, 'cena15-fim.png'); // hero shot pro padding

// --- UTF-8 safe helper (ffmpeg drawtext 6.1.1 corta chars após ã/ê/í) ---
const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Escrever textos em arquivo evita inferno de escape
const TMP = '/tmp/reels-texts-v3/';
fs.mkdirSync(TMP, { recursive: true });
let tc = 0;
const txt = (s) => { const f = path.join(TMP, `t_${tc++}.txt`); fs.writeFileSync(f, s, 'utf8'); return f; };

function drawtext({ text, t0, t1, y, size, color = 'white', bord = 6, bordColor = 'black@0.8', font = FONT_HOOK, x = '(w-tw)/2' }) {
  const tf = txt(ascii(text));
  return (
    `drawtext=fontfile=${font}:textfile=${tf}:` +
    `fontcolor=${color}:fontsize=${size}:` +
    `borderw=${bord}:bordercolor=${bordColor}:` +
    `x=${x}:y=${y}:` +
    `enable='between(t\\,${t0}\\,${t1})'`
  );
}

// --- presets de ken burns ---
const presets = [
  { x: 'iw/2-(iw/zoom/2)',       y: 'ih/2-(ih/zoom/2)' },
  { x: '0',                      y: '0' },
  { x: 'iw-iw/zoom',             y: '0' },
  { x: '0',                      y: 'ih-ih/zoom' },
  { x: 'iw-iw/zoom',             y: 'ih-ih/zoom' },
  { x: 'on/FR*(iw-iw/zoom)',     y: 'ih/2-(ih/zoom/2)' },
  { x: '(iw-iw/zoom)*(1-on/FR)', y: 'ih/2-(ih/zoom/2)' },
  { x: 'iw/2-(iw/zoom/2)',       y: 'on/FR*(ih-ih/zoom)' },
];

// --- inputs ---
const inputs = [];
// [0]: padding hero image
inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', PAD_IMG);
// [1..30]: main images
imgs.forEach((p) => inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', p));
// [31]: music
inputs.push('-i', MUSIC);
// [32]: narration
inputs.push('-i', NARR);

const musicIdx = 1 + imgs.length;       // 31
const narrIdx  = 1 + imgs.length + 1;   // 32

// --- filtros ---
const filters = [];

// PADDING segment: hero 1:1 com zoom forte, pad a 9:16
const padZoomRate = 0.0035;
filters.push(
  `[0:v]zoompan=z='min(1.1+on*${padZoomRate},1.25)':d=${PAD_FRAMES}:` +
  `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${SQ}x${SQ}:fps=${FPS},` +
  `pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p[vpad]`
);

// MAIN segment: 30 ken burns 1:1, concat, pad a 9:16
const mainZoomRate = 0.003;
imgs.forEach((_, idx) => {
  const p = presets[idx % presets.length];
  const x = p.x.replace(/FR/g, String(MAIN_FRAMES));
  const y = p.y.replace(/FR/g, String(MAIN_FRAMES));
  const inputStream = idx + 1; // input index (padding é [0])
  filters.push(
    `[${inputStream}:v]zoompan=z='min(1+on*${mainZoomRate},1.1)':d=${MAIN_FRAMES}:` +
    `x='${x}':y='${y}':s=${SQ}x${SQ}:fps=${FPS},format=yuv420p[m${idx}]`
  );
});
const mainConcat = imgs.map((_, i) => `[m${i}]`).join('');
filters.push(`${mainConcat}concat=n=${imgs.length}:v=1:a=0,pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p[vmain]`);

// BLACK segment: color preto 9:16, 3s
filters.push(`color=c=0x050510:s=${W}x${H}:d=${BLACK_DUR}:r=${FPS},format=yuv420p[vblack]`);

// CONCAT dos 3 segmentos
filters.push(`[vpad][vmain][vblack]concat=n=3:v=1:a=0[vconcat]`);

// ===== DRAWTEXT OVERLAYS =====
// Hook padding (0-2s): bomba scroll-stopper em 2 linhas
const hookPadding = [
  drawtext({ text: 'ELA CURA DORES',       t0: 0, t1: PAD_DUR, y: 650,  size: 128, font: FONT_HOOK, bord: 10 }),
  drawtext({ text: 'QUE OUTROS',           t0: 0, t1: PAD_DUR, y: 790,  size: 128, font: FONT_HOOK, bord: 10 }),
  drawtext({ text: 'DESISTIRAM.',          t0: 0, t1: PAD_DUR, y: 930,  size: 128, color: '#FFEB3B', font: FONT_HOOK, bord: 10 }),
];

// Hook main (2-27s): muda em 3 blocos sincronizados
const hookMain = [
  drawtext({ text: 'DESDE OS 7 ANOS',          t0: 2.0,  t1: 9.0,  y: 100, size: 98, font: FONT_HOOK, bord: 8 }),
  drawtext({ text: 'ELA ENTENDIA DOR',         t0: 2.0,  t1: 9.0,  y: 220, size: 98, color: '#FFEB3B', font: FONT_HOOK, bord: 8 }),

  drawtext({ text: 'DUVIDARAM.',               t0: 9.0,  t1: 18.0, y: 100, size: 98, font: FONT_HOOK, bord: 8 }),
  drawtext({ text: 'ELA SEGUIU.',              t0: 9.0,  t1: 18.0, y: 220, size: 98, color: '#FFEB3B', font: FONT_HOOK, bord: 8 }),

  drawtext({ text: 'HOJE: MAOS + IA +',        t0: 18.0, t1: 27.0, y: 100, size: 88, font: FONT_HOOK, bord: 8 }),
  drawtext({ text: '40 ANOS DE PRATICA',       t0: 18.0, t1: 27.0, y: 220, size: 88, color: '#FFEB3B', font: FONT_HOOK, bord: 8 }),
];

// Captions (sincronizadas à narração que começa em ~2.3s, fim ~21.2s)
// Narração: "Desde criança, ela entendia o corpo pelas mãos. Massageava a avó, ajudava amigos, aprendeu anatomia. Formou-se fisioterapeuta, aliviou dor após dor. Hoje mistura mãos experientes, sensores e inteligência artificial para tratar o que outros desistiram. Aprenda com ela no INEMA ponto CLUB."
const capBlocks = [
  { t0: 2.3,  t1: 4.2,  text: 'Desde crianca' },
  { t0: 4.2,  t1: 6.2,  text: 'ela entendia o corpo' },
  { t0: 6.2,  t1: 7.8,  text: 'pelas maos' },
  { t0: 7.8,  t1: 9.2,  text: 'Massageava a avo' },
  { t0: 9.2,  t1: 10.8, text: 'ajudava amigos' },
  { t0: 10.8, t1: 12.6, text: 'aprendeu anatomia' },
  { t0: 12.6, t1: 14.4, text: 'Formou-se fisioterapeuta' },
  { t0: 14.4, t1: 16.2, text: 'aliviou dor apos dor' },
  { t0: 16.2, t1: 17.8, text: 'Mistura maos + sensores + IA' },
  { t0: 17.8, t1: 19.6, text: 'trata o que outros desistiram' },
  { t0: 19.6, t1: 22.2, text: 'APRENDA COM ELA' },
  { t0: 22.2, t1: 27.0, text: 'NO INEMA.CLUB' },
];
const captions = capBlocks.map((b) => drawtext({
  text: b.text, t0: b.t0, t1: b.t1, y: 1680, size: 56,
  color: '#FFEB3B', font: FONT_HOOK, bord: 7, bordColor: 'black@0.9',
}));

// Watermark INEMA.CLUB maior durante padding e main (não no black end porque CTA toma a tela)
const watermark = drawtext({
  text: 'INEMA.CLUB', t0: 0, t1: 27, y: 48, size: 64,
  color: 'white@0.92', font: FONT_HOOK, bord: 5, bordColor: 'black@0.7', x: '48',
});

// Handle @inema.club no rodapé só main
const handle = drawtext({
  text: '@inema.club', t0: 2.0, t1: 27.0, y: 1840, size: 40,
  color: 'white@0.85', font: FONT_CAPS, bord: 3, bordColor: 'black@0.6',
});

// CTA final (27-30s) — tela preta + INEMA.CLUB gigante + subline
const cta = [
  drawtext({ text: 'APRENDA COM HISTORIAS', t0: 27.2, t1: 30, y: 600,  size: 68,  font: FONT_HOOK, bord: 4 }),
  drawtext({ text: 'COMO ESSA EM',          t0: 27.2, t1: 30, y: 700,  size: 68,  font: FONT_HOOK, bord: 4 }),
  drawtext({ text: 'INEMA.CLUB',            t0: 27.2, t1: 30, y: 880,  size: 170, font: FONT_HOOK, color: '#FFEB3B', bord: 10 }),
  drawtext({ text: 'LINK NA BIO',           t0: 27.2, t1: 30, y: 1180, size: 70,  font: FONT_HOOK, bord: 4 }),
];

const allOverlays = [
  watermark,
  handle,
  ...hookPadding,
  ...hookMain,
  ...captions,
  ...cta,
].join(',');

filters.push(`[vconcat]${allOverlays}[vout]`);

// ===== AUDIO =====
// Música: volume 0.32 até narração começar, 0.05 durante narração (2.3–21.5), 0.32 depois, fade out nos últimos 2s
// Narração: delay 2300ms, volume 1.95
filters.push(
  `[${musicIdx}:a]atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS,` +
  `volume='if(between(t\\,2.0\\,21.5)\\,0.05\\,0.32)':eval=frame,` +
  `afade=t=out:st=${TOTAL_DUR - 2}:d=2[music]`
);
filters.push(`[${narrIdx}:a]adelay=2300|2300,volume=1.95[narr]`);
filters.push(`[music][narr]amix=inputs=2:duration=first:dropout_transition=0,atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS[aout]`);

const args = [
  '-y',
  ...inputs,
  '-filter_complex', filters.join(';'),
  '-map', '[vout]',
  '-map', '[aout]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '192k',
  '-movflags', '+faststart',
  '-t', String(TOTAL_DUR),
  OUT_FILE,
];

console.log(`[reels v3] render -> ${OUT_FILE}`);
console.log(`[reels v3] padding=${PAD_DUR}s + main=${MAIN_DUR}s + black=${BLACK_DUR}s = ${TOTAL_DUR}s`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) { console.error(`ffmpeg exit=${res.status}`); process.exit(res.status || 1); }
const stat = fs.statSync(OUT_FILE);
console.log(`\n[reels v3] ✅ ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
