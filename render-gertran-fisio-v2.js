/**
 * GERTRAN piloto v2 — Fisioterapeuta.
 * Correções vs v1:
 *   - SEM xfade (tremedeira vinha do overlap de 2 imagens durante transição)
 *   - Zoom Ken Burns imperceptível (0.0008) — quase estático
 *   - Cortes limpos entre imagens com micro fade-in (0.08s)
 *   - Legendas sincronizadas via Whisper (word-level timestamps)
 *   - Salva em prj/inema/videos/gertran/ (novo diretório)
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// --- paths ---
const IMG_DIR = path.join(__dirname, 'prj/inema/videos/criaprof/fisioterapeuta_2026-04-22/imgs'); // reuso do criaprof enquanto não há imgs gertran próprias
const OUT_DIR = path.join(__dirname, 'prj/inema/videos/gertran/fisioterapeuta_2026-04-23/video');
const OUT_FILE = path.join(OUT_DIR, 'gertran-fisioterapeuta-30s.mp4');
const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = '/tmp/narr/narr-gertran-fisio.mp3';
const WHISPER_JSON = '/tmp/narr/whisper-words-gertran-fisio.json';
const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';
const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/Montserrat-ExtraBold.ttf';

// --- config ---
const FPS = 30;
const W = 1080, H = 1920;
const SQ = 1080;
const PAD_DUR = 2.0;
const MAIN_DUR = 25.0;
const BLACK_DUR = 3.0;
const TOTAL_DUR = PAD_DUR + MAIN_DUR + BLACK_DUR; // 30

// --- imagens do main (20, reuso do CriaProf fisio) ---
const imgList = [
  'cena01-fim.png', 'cena02-fim.png', 'cena03-ini.png', 'cena04-fim.png',
  'cena05-fim.png', 'cena06-fim.png', 'cena07-fim.png', 'cena08-fim.png',
  'cena09-fim.png', 'cena10-fim.png',
  'cena11-fim.png', 'cena12-fim.png', 'cena13-fim.png', 'cena14-ini.png', 'cena14-fim.png',
  'cena07-ini.png', 'cena09-ini.png', 'cena11-ini.png', 'cena15-ini.png', 'cena15-fim.png',
];
const imgs = imgList.map((f) => path.join(IMG_DIR, f));
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }
const PAD_IMG = path.join(IMG_DIR, 'cena15-fim.png');

const N = imgs.length;
const CLIP_DUR = MAIN_DUR / N; // 1.25s
const CLIP_FRAMES = Math.round(CLIP_DUR * FPS);
const PAD_FRAMES = Math.round(PAD_DUR * FPS);

fs.mkdirSync(OUT_DIR, { recursive: true });

// --- carrega legendas sincronizadas do whisper (offset = PAD_DUR + 0.5s) ---
const NARR_OFFSET = PAD_DUR + 0.5; // narração começa 0.5s após padding terminar (adelay no audio)
const whisperData = JSON.parse(fs.readFileSync(WHISPER_JSON, 'utf8'));
const capChunks = whisperData.chunks.map((c) => {
  // Corrige transcrições erradas ("Inema.cube" -> "INEMA.CLUB")
  let text = c.text
    .replace(/inema\.?cube/gi, 'INEMA.CLUB')
    .replace(/inema\.club/gi, 'INEMA.CLUB')
    .replace(/ponto/gi, '.');
  return {
    t0: c.t0 + NARR_OFFSET,
    t1: c.t1 + NARR_OFFSET,
    text,
  };
});
console.log(`[v2] ${capChunks.length} captions carregados do whisper (offset +${NARR_OFFSET}s)`);

// --- helpers ---
const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const TMP = '/tmp/gertran-texts-v2/';
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

// --- inputs ---
const inputs = [];
inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', PAD_IMG);
imgs.forEach((p) => inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', p));
inputs.push('-i', MUSIC);
inputs.push('-i', NARR);
const musicIdx = 1 + N;
const narrIdx = 1 + N + 1;

// --- filtros ---
const filters = [];

// PADDING: zoom bem suave (0.0015) + pad 9:16
filters.push(
  `[0:v]zoompan=z='min(1.04+on*0.0015,1.11)':d=${PAD_FRAMES}:` +
  `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${SQ}x${SQ}:fps=${FPS},` +
  `pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p,setsar=1[vpad]`
);

// MAIN: zoom imperceptível (0.0008) + micro fade-in 0.08s por clipe (suaviza corte)
const zoomRate = 0.0008;
const fadeIn = 0.08;
imgs.forEach((_, idx) => {
  filters.push(
    `[${idx + 1}:v]zoompan=z='min(1.02+on*${zoomRate},1.06)':d=${CLIP_FRAMES}:` +
    `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${SQ}x${SQ}:fps=${FPS},` +
    `fade=t=in:st=0:d=${fadeIn},` +
    `pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p,setsar=1[c${idx}]`
  );
});

// Concat HARD CUT (sem xfade)
const mainConcat = imgs.map((_, i) => `[c${i}]`).join('');
filters.push(`${mainConcat}concat=n=${N}:v=1:a=0[vmain]`);

// BLACK
filters.push(`color=c=0x050510:s=${W}x${H}:d=${BLACK_DUR}:r=${FPS},format=yuv420p,setsar=1[vblack]`);

// CONCAT TRÊS SEGMENTOS
filters.push(`[vpad][vmain][vblack]concat=n=3:v=1:a=0[vconcat]`);

// === OVERLAYS ===

// Hook PADDING (0-2s)
const hookPadding = [
  drawtext({ text: 'VOCE JA CUROU',      t0: 0, t1: PAD_DUR, y: 680,  size: 118, bord: 10 }),
  drawtext({ text: 'DOR DE UM JEITO',    t0: 0, t1: PAD_DUR, y: 820,  size: 118, bord: 10 }),
  drawtext({ text: 'QUE NINGUEM',        t0: 0, t1: PAD_DUR, y: 960,  size: 118, bord: 10 }),
  drawtext({ text: 'ENSINA MAIS.',       t0: 0, t1: PAD_DUR, y: 1100, size: 118, color: '#FFEB3B', bord: 10 }),
];

// Hook MAIN — 4 atos
const hookMain = [
  drawtext({ text: 'VOCE VIU',           t0: 2.0,   t1: 7.0,   y: 100, size: 108, bord: 8 }),
  drawtext({ text: 'TUDO COMECAR',       t0: 2.0,   t1: 7.0,   y: 230, size: 108, color: '#FFEB3B', bord: 8 }),
  drawtext({ text: 'SE ADAPTOU.',        t0: 7.0,   t1: 14.5,  y: 100, size: 112, bord: 8 }),
  drawtext({ text: 'SEMPRE.',            t0: 7.0,   t1: 14.5,  y: 230, size: 112, color: '#FFEB3B', bord: 8 }),
  drawtext({ text: 'AGORA CHEGOU',       t0: 14.5,  t1: 20.75, y: 100, size: 102, bord: 8 }),
  drawtext({ text: 'A IA.',              t0: 14.5,  t1: 20.75, y: 230, size: 140, color: '#FFEB3B', bord: 10 }),
  drawtext({ text: 'GERACAO DE',         t0: 20.75, t1: 27.0,  y: 100, size: 108, bord: 8 }),
  drawtext({ text: 'TRANSFORMACAO.',     t0: 20.75, t1: 27.0,  y: 230, size: 108, color: '#FFEB3B', bord: 8 }),
];

// Captions sincronizadas via Whisper
const captions = capChunks.map((b) => drawtext({
  text: b.text, t0: b.t0, t1: b.t1, y: 1680, size: 58,
  color: '#FFEB3B', bord: 7, bordColor: 'black@0.9',
}));

// Watermark INEMA.CLUB
const watermark = drawtext({
  text: 'INEMA.CLUB', t0: 0, t1: 27, y: 48, size: 64,
  color: 'white@0.95', bord: 6, bordColor: 'black@0.7', x: '48',
});

const handle = drawtext({
  text: '@inema.club', t0: 0.5, t1: 27, y: 1850, size: 40,
  color: 'white@0.85', font: FONT_CAPS, bord: 3, bordColor: 'black@0.6',
});

// CTA final (27-30s)
const cta = [
  drawtext({ text: 'GERACAO DE',              t0: 27.2, t1: 30, y: 420,  size: 72,  bord: 5 }),
  drawtext({ text: 'TRANSFORMACAO',           t0: 27.2, t1: 30, y: 520,  size: 72,  color: '#FFEB3B', bord: 5 }),
  drawtext({ text: 'CONTINUE APRENDENDO EM',  t0: 27.2, t1: 30, y: 780,  size: 50,  bord: 3 }),
  drawtext({ text: 'INEMA.CLUB',              t0: 27.2, t1: 30, y: 900,  size: 180, color: '#FFEB3B', bord: 12 }),
  drawtext({ text: 'LINK NA BIO',             t0: 27.2, t1: 30, y: 1200, size: 64,  bord: 4 }),
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

console.log(`[gertran v2] N=${N} imgs × ${CLIP_DUR}s (sem xfade, zoom ${zoomRate}, fade-in ${fadeIn}s)`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) process.exit(res.status || 1);
const stat = fs.statSync(OUT_FILE);
console.log(`\n[gertran v2] ✅ ${OUT_FILE} — ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
