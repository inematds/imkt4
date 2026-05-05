/**
 * GERTRAN piloto v3 — Fisioterapeuta. Aplicando 3 decisões:
 *   1. Zoom Ken Burns = 0.0022 (padrão das primeiras CriaProf, movimento visível sem tremor)
 *   2. Captions sobrepostas ao vídeo em y=1380 (dentro da área do vídeo, não no rodapé)
 *   3. Padding A: montage relâmpago de 4 imagens (0.5s cada) + hook progressivo linha-a-linha
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const IMG_DIR = path.join(__dirname, 'prj/inema/videos/criaprof/fisioterapeuta_2026-04-22/imgs');
const OUT_DIR = path.join(__dirname, 'prj/inema/videos/gertran/fisioterapeuta_2026-04-23/video');
const OUT_FILE = path.join(OUT_DIR, 'gertran-fisioterapeuta-30s-v3.mp4');
const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = '/tmp/narr/narr-gertran-fisio.mp3';
const WHISPER_JSON = '/tmp/narr/whisper-words-gertran-fisio.json';
const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';
const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/Montserrat-ExtraBold.ttf';

const FPS = 30;
const W = 1080, H = 1920;
const SQ = 1080;
const PAD_DUR = 2.0;
const MAIN_DUR = 25.0;
const BLACK_DUR = 3.0;
const TOTAL_DUR = PAD_DUR + MAIN_DUR + BLACK_DUR; // 30

// === PADDING: 1 imagem estática, 2s, com hook completo ===
const padMontage = ['cena15-fim.png']; // hero shot único
const PAD_CLIP_DUR = PAD_DUR; // 2s na mesma imagem
const PAD_FRAMES = Math.round(PAD_CLIP_DUR * FPS); // 60

// === MAIN: 20 imagens × 1.25s ===
const imgList = [
  'cena01-fim.png', 'cena02-fim.png', 'cena03-ini.png', 'cena04-fim.png',
  'cena05-fim.png', 'cena06-fim.png', 'cena07-fim.png', 'cena08-fim.png',
  'cena09-fim.png', 'cena10-fim.png',
  'cena11-fim.png', 'cena12-fim.png', 'cena13-fim.png', 'cena14-ini.png', 'cena14-fim.png',
  'cena07-ini.png', 'cena09-ini.png', 'cena11-ini.png', 'cena15-ini.png', 'cena15-fim.png',
];
const imgs = imgList.map((f) => path.join(IMG_DIR, f));
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }
const N = imgs.length;
const CLIP_DUR = MAIN_DUR / N; // 1.25s
const CLIP_FRAMES = Math.round(CLIP_DUR * FPS); // ~37

const padImgs = padMontage.map((f) => path.join(IMG_DIR, f));
for (const p of padImgs) if (!fs.existsSync(p)) { console.error(`padding faltando: ${p}`); process.exit(1); }

fs.mkdirSync(OUT_DIR, { recursive: true });

// === Whisper sync ===
const NARR_OFFSET = PAD_DUR + 0.5; // 2.5s
const whisperData = JSON.parse(fs.readFileSync(WHISPER_JSON, 'utf8'));
const capChunks = whisperData.chunks.map((c) => ({
  t0: c.t0 + NARR_OFFSET,
  t1: c.t1 + NARR_OFFSET,
  text: c.text.replace(/inema\.?(cube|clube)/gi, 'INEMA.CLUB').replace(/ponto/gi, '.'),
}));
console.log(`[v3] ${capChunks.length} captions via whisper (offset +${NARR_OFFSET}s)`);

// === helpers ===
const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const TMP = '/tmp/gertran-v3-texts/';
fs.mkdirSync(TMP, { recursive: true });
let tc = 0;
const txt = (s) => { const f = path.join(TMP, `t_${tc++}.txt`); fs.writeFileSync(f, s, 'utf8'); return f; };

function drawtext({ text, t0, t1, y, size, color = 'white', bord = 6, bordColor = 'black@0.85', font = FONT_HOOK, x = '(w-tw)/2' }) {
  const tf = txt(ascii(text));
  return (
    `drawtext=fontfile=${font}:textfile=${tf}:` +
    `fontcolor=${color}:fontsize=${size}:` +
    `borderw=${bord}:bordercolor=${bordColor}:` +
    `x=${x}:y=${y}:` +
    `enable='between(t\\,${t0}\\,${t1})'`
  );
}

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

// === inputs ===
// [0..3]: padding (4 imgs)
// [4..23]: main (20 imgs)
// [24]: music
// [25]: narration
const inputs = [];
padImgs.forEach((p) => inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', p));
imgs.forEach((p) => inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', p));
inputs.push('-i', MUSIC);
inputs.push('-i', NARR);
const musicIdx = padImgs.length + N;
const narrIdx  = padImgs.length + N + 1;

const filters = [];

// PADDING: 1 imagem 2s, zoom bem sutil (0.001) pra não tremer rosto
const padZoomRate = 0.001;
filters.push(
  `[0:v]zoompan=z='min(1.02+on*${padZoomRate},1.08)':d=${PAD_FRAMES}:` +
  `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${SQ}x${SQ}:fps=${FPS},fade=t=in:st=0:d=0.15,` +
  `pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p,setsar=1[vpad]`
);

// MAIN: 20 imgs com zoom 0.0022 (padrão CriaProf), fade-in 0.08s
const zoomRate = 0.0022;
imgs.forEach((_, idx) => {
  const p = presets[idx % presets.length];
  const x = p.x.replace(/FR/g, String(CLIP_FRAMES));
  const y = p.y.replace(/FR/g, String(CLIP_FRAMES));
  const inputStream = padImgs.length + idx;
  filters.push(
    `[${inputStream}:v]zoompan=z='min(1+on*${zoomRate},1.1)':d=${CLIP_FRAMES}:` +
    `x='${x}':y='${y}':s=${SQ}x${SQ}:fps=${FPS},fade=t=in:st=0:d=0.08,` +
    `pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p,setsar=1[c${idx}]`
  );
});
const mainConcat = imgs.map((_, i) => `[c${i}]`).join('');
filters.push(`${mainConcat}concat=n=${N}:v=1:a=0[vmain]`);

// BLACK
filters.push(`color=c=0x050510:s=${W}x${H}:d=${BLACK_DUR}:r=${FPS},format=yuv420p,setsar=1[vblack]`);

// CONCAT 3 segmentos
filters.push(`[vpad][vmain][vblack]concat=n=3:v=1:a=0[vconcat]`);

// === OVERLAYS ===
// Hook padding estático: 4 linhas visíveis durante os 2s inteiros
const hookPadding = [
  drawtext({ text: 'VOCE JA CUROU',     t0: 0, t1: 2.0, y: 680,  size: 118, bord: 10 }),
  drawtext({ text: 'DOR DE UM JEITO',   t0: 0, t1: 2.0, y: 820,  size: 118, bord: 10 }),
  drawtext({ text: 'QUE NINGUEM',       t0: 0, t1: 2.0, y: 960,  size: 118, bord: 10 }),
  drawtext({ text: 'ENSINA MAIS.',      t0: 0, t1: 2.0, y: 1100, size: 118, color: '#FFEB3B', bord: 10 }),
];

// Hook MAIN — 4 atos
const hookMain = [
  drawtext({ text: 'VOCE VIU',          t0: 2.0,   t1: 7.0,   y: 100, size: 108, bord: 8 }),
  drawtext({ text: 'TUDO COMECAR',      t0: 2.0,   t1: 7.0,   y: 230, size: 108, color: '#FFEB3B', bord: 8 }),
  drawtext({ text: 'SE ADAPTOU.',       t0: 7.0,   t1: 14.5,  y: 100, size: 112, bord: 8 }),
  drawtext({ text: 'SEMPRE.',           t0: 7.0,   t1: 14.5,  y: 230, size: 112, color: '#FFEB3B', bord: 8 }),
  drawtext({ text: 'AGORA CHEGOU',      t0: 14.5,  t1: 20.75, y: 100, size: 102, bord: 8 }),
  drawtext({ text: 'A IA.',             t0: 14.5,  t1: 20.75, y: 230, size: 140, color: '#FFEB3B', bord: 10 }),
  drawtext({ text: 'GERACAO DE',        t0: 20.75, t1: 27.0,  y: 100, size: 108, bord: 8 }),
  drawtext({ text: 'TRANSFORMACAO.',    t0: 20.75, t1: 27.0,  y: 230, size: 108, color: '#FFEB3B', bord: 8 }),
];

// Captions whisper-synced em y=1380 (dentro da área do vídeo, rodapé da imagem 1:1 embutida)
const captions = capChunks.map((b) => drawtext({
  text: b.text, t0: b.t0, t1: b.t1, y: 1380, size: 56,
  color: '#FFEB3B', bord: 8, bordColor: 'black@0.95',
}));

// Watermark
const watermark = drawtext({
  text: 'INEMA.CLUB', t0: 0, t1: 27, y: 48, size: 64,
  color: 'white@0.95', bord: 6, bordColor: 'black@0.7', x: '48',
});

// Handle
const handle = drawtext({
  text: '@inema.club', t0: 0.5, t1: 27, y: 1850, size: 40,
  color: 'white@0.85', font: FONT_CAPS, bord: 3, bordColor: 'black@0.6',
});

// CTA final (27-30s)
const cta = [
  drawtext({ text: 'GERACAO DE',             t0: 27.2, t1: 30, y: 420,  size: 72,  bord: 5 }),
  drawtext({ text: 'TRANSFORMACAO',          t0: 27.2, t1: 30, y: 520,  size: 72,  color: '#FFEB3B', bord: 5 }),
  drawtext({ text: 'CONTINUE APRENDENDO EM', t0: 27.2, t1: 30, y: 780,  size: 50,  bord: 3 }),
  drawtext({ text: 'INEMA.CLUB',             t0: 27.2, t1: 30, y: 900,  size: 180, color: '#FFEB3B', bord: 12 }),
  drawtext({ text: 'LINK NA BIO',            t0: 27.2, t1: 30, y: 1200, size: 64,  bord: 4 }),
];

const allOverlays = [watermark, handle, ...hookPadding, ...hookMain, ...captions, ...cta].join(',');
filters.push(`[vconcat]${allOverlays}[vout]`);

// === ÁUDIO ===
filters.push(
  `[${musicIdx}:a]atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS,` +
  `volume='if(between(t\\,2.3\\,20.5)\\,0.05\\,0.32)':eval=frame,` +
  `afade=t=out:st=${TOTAL_DUR - 2}:d=2[music]`
);
filters.push(`[${narrIdx}:a]adelay=2500|2500,volume=1.95[narr]`);
filters.push(`[music][narr]amix=inputs=2:duration=first:dropout_transition=0,atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS[aout]`);

const args = [
  '-y', ...inputs,
  '-filter_complex', filters.join(';'),
  '-map', '[vout]', '-map', '[aout]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '192k',
  '-movflags', '+faststart',
  '-t', String(TOTAL_DUR),
  OUT_FILE,
];

console.log(`[gertran v3] padding montage=${padMontage.length} × ${PAD_CLIP_DUR}s | main N=${N} × ${CLIP_DUR}s | zoom ${zoomRate}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) process.exit(res.status || 1);
const stat = fs.statSync(OUT_FILE);
console.log(`\n[gertran v3] ✅ ${OUT_FILE} — ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
