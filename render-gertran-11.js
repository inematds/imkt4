/**
 * GERTRAN 1:1 — adaptação do render-gertran.js para canvas quadrado 1080×1080.
 *
 * Layout:
 *   - 3s padding (bg sólido + profissão gigante + hook 3-4 linhas)
 *   - 25s main (20 imgs nostalgia, hook 4 atos no topo com gradiente escuro,
 *     captions whisper-sync na área inferior)
 *   - 3s black outro (CTA INEMA.CLUB)
 *
 * Output: prj/inema/videos/gertran/videos/gertran-<slug>-31s-11.mp4
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { profissoes } = require('./config/profissoes-30');

const profession = process.argv[2];
if (!profession) { console.error('Usage: node render-gertran-11.js <slug>'); process.exit(1); }

const profile = profissoes.find((p) => p.slug === profession);
if (!profile) { console.error(`slug não encontrado: ${profession}`); process.exit(1); }

const IMG_DIR = path.join(__dirname, `prj/inema/videos/gertran-nostalgia/${profession}_2026-04-23/imgs`);
if (!fs.existsSync(IMG_DIR)) { console.error(`imgs: ${IMG_DIR}`); process.exit(1); }

const OUT_DIR = path.join(__dirname, `prj/inema/videos/gertran/videos`);
const OUT_FILE = path.join(OUT_DIR, `gertran-${profession}-31s-11.mp4`);
fs.mkdirSync(OUT_DIR, { recursive: true });

const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = `/tmp/narr/narr-gertran-${profession}.mp3`;
const WHISPER_JSON = `/tmp/narr/whisper-gertran-${profession}.json`;
if (!fs.existsSync(NARR) || !fs.existsSync(WHISPER_JSON)) { console.error('narr/whisper faltando'); process.exit(1); }

const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';

const FPS = 30, W = 1080, H = 1080;
const PAD_DUR = 3.0, MAIN_DUR = 25.0, BLACK_DUR = 3.0;
const TOTAL_DUR = PAD_DUR + MAIN_DUR + BLACK_DUR;

const imgList = Array.from({ length: 20 }, (_, i) => `nost${String(i + 1).padStart(2, '0')}.png`);
const imgs = imgList.map((f) => path.join(IMG_DIR, f));
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }
const N = imgs.length;
const CLIP_DUR = MAIN_DUR / N;

const NARR_OFFSET = PAD_DUR + 0.5;
const whisperData = JSON.parse(fs.readFileSync(WHISPER_JSON, 'utf8'));
const capChunks = whisperData.chunks.map((c) => ({
  t0: c.t0 + NARR_OFFSET,
  t1: c.t1 + NARR_OFFSET,
  text: c.text.replace(/inema\.?(cube|clube)/gi, 'INEMA.CLUB').replace(/ponto/gi, '.'),
}));

const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const TMP = `/tmp/gertran-11-${profession}-texts/`;
fs.mkdirSync(TMP, { recursive: true });
let tc = 0;
const txt = (s) => { const f = path.join(TMP, `t_${tc++}.txt`); fs.writeFileSync(f, s, 'utf8'); return f; };

function drawtext({ text, t0, t1, y, size, color = 'white', bord = 6, bordColor = 'black@0.85', font = FONT_HOOK, x = '(w-tw)/2' }) {
  const tf = txt(ascii(text));
  return `drawtext=fontfile=${font}:textfile=${tf}:fontcolor=${color}:fontsize=${size}:borderw=${bord}:bordercolor=${bordColor}:x=${x}:y=${y}:enable='between(t\\,${t0}\\,${t1})'`;
}

const inputs = [];
imgs.forEach((p) => inputs.push('-framerate', String(FPS), '-loop', '1', '-t', String(CLIP_DUR), '-i', p));
inputs.push('-i', MUSIC); inputs.push('-i', NARR);
const musicIdx = N, narrIdx = N + 1;

const filters = [];
// Padding sólido
filters.push(`color=c=0x0A1428:s=${W}x${H}:d=${PAD_DUR}:r=${FPS},format=yuv420p,setsar=1[vpad]`);
// Main imgs 1080×1080
imgs.forEach((_, idx) => {
  filters.push(`[${idx}:v]scale=${W}:${H}:flags=lanczos,fade=t=in:st=0:d=0.1,format=yuv420p,setsar=1[c${idx}]`);
});
filters.push(`${imgs.map((_, i) => `[c${i}]`).join('')}concat=n=${N}:v=1:a=0[vmain]`);
// Black outro
filters.push(`color=c=0x050510:s=${W}x${H}:d=${BLACK_DUR}:r=${FPS},format=yuv420p,setsar=1[vblack]`);
filters.push(`[vpad][vmain][vblack]concat=n=3:v=1:a=0[vconcat]`);

// === PADDING (0-3s): profissão gigante + hook 3-4 linhas
const hookLines = profile.gertran_hook;
const hookY0 = 430, hookLineH = 120;
const hookPadding = [
  drawtext({ text: profile.label, t0: 0, t1: PAD_DUR, y: 120, size: 130, color: '#FFEB3B', bord: 8 }),
  ...hookLines.map((line, i) => drawtext({
    text: line, t0: 0, t1: PAD_DUR, y: hookY0 + i * hookLineH,
    size: 90, color: i === hookLines.length - 1 ? '#FFEB3B' : 'white', bord: 8,
  })),
  drawtext({ text: 'INEMA.CLUB', t0: 0, t1: PAD_DUR, y: 1000, size: 60, color: 'white@0.9', bord: 4 }),
];

// === MAIN (3-28s): hook 4 atos no topo com faixa escura pra legibilidade
const T1 = PAD_DUR, T2 = T1 + 5, T3 = T1 + 12.5, T4 = T1 + 18.75, T5 = T1 + MAIN_DUR;
// Faixa superior escurecida (top 180px) só durante main
const topBand = `drawbox=x=0:y=0:w=${W}:h=180:color=black@0.45:t=fill:enable='between(t\\,${T1}\\,${T5})'`;
// Faixa inferior para captions (última 160px)
const botBand = `drawbox=x=0:y=920:w=${W}:h=160:color=black@0.45:t=fill:enable='between(t\\,${T1}\\,${T5})'`;

const hookMain = [
  drawtext({ text: 'VOCE VIU',       t0: T1, t1: T2, y: 30,  size: 70, bord: 6 }),
  drawtext({ text: 'TUDO COMECAR',   t0: T1, t1: T2, y: 100, size: 70, color: '#FFEB3B', bord: 6 }),
  drawtext({ text: 'SE ADAPTOU.',    t0: T2, t1: T3, y: 30,  size: 72, bord: 6 }),
  drawtext({ text: 'SEMPRE.',        t0: T2, t1: T3, y: 100, size: 72, color: '#FFEB3B', bord: 6 }),
  drawtext({ text: 'AGORA CHEGOU',   t0: T3, t1: T4, y: 30,  size: 66, bord: 6 }),
  drawtext({ text: 'A IA.',          t0: T3, t1: T4, y: 100, size: 90, color: '#FFEB3B', bord: 8 }),
  drawtext({ text: 'GERACAO DE',     t0: T4, t1: T5, y: 30,  size: 70, bord: 6 }),
  drawtext({ text: 'TRANSFORMACAO.', t0: T4, t1: T5, y: 100, size: 70, color: '#FFEB3B', bord: 6 }),
];

const captions = capChunks.map((b) => drawtext({
  text: b.text, t0: b.t0, t1: b.t1, y: 960, size: 48,
  color: '#FFEB3B', bord: 7, bordColor: 'black@0.95',
}));

const watermark = drawtext({
  text: 'INEMA.CLUB', t0: T1, t1: T5, y: 40, size: 44,
  color: 'white@0.9', bord: 4, bordColor: 'black@0.8', x: '(w-tw)/2',
});

// === BLACK OUTRO (28-31s)
const cta = [
  drawtext({ text: 'GERACAO DE',             t0: T5, t1: TOTAL_DUR, y: 180, size: 60,  bord: 5 }),
  drawtext({ text: 'TRANSFORMACAO',          t0: T5, t1: TOTAL_DUR, y: 260, size: 60,  color: '#FFEB3B', bord: 5 }),
  drawtext({ text: 'CONTINUE APRENDENDO EM', t0: T5, t1: TOTAL_DUR, y: 420, size: 40,  bord: 3 }),
  drawtext({ text: 'INEMA.CLUB',             t0: T5, t1: TOTAL_DUR, y: 510, size: 140, color: '#FFEB3B', bord: 10 }),
  drawtext({ text: 'LINK NA BIO',            t0: T5, t1: TOTAL_DUR, y: 820, size: 50,  bord: 4 }),
];

const allOverlays = [topBand, botBand, watermark, ...hookPadding, ...hookMain, ...captions, ...cta].join(',');
filters.push(`[vconcat]${allOverlays}[vout]`);

// Áudio (mesmo do 9:16)
filters.push(
  `[${musicIdx}:a]atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS,` +
  `volume='if(between(t\\,${NARR_OFFSET - 0.2}\\,${NARR_OFFSET + 18})\\,0.05\\,0.32)':eval=frame,` +
  `afade=t=out:st=${TOTAL_DUR - 2}:d=2[music]`
);
filters.push(`[${narrIdx}:a]adelay=${NARR_OFFSET * 1000}|${NARR_OFFSET * 1000},volume=1.95[narr]`);
filters.push(`[music][narr]amix=inputs=2:duration=first:dropout_transition=0,atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS[aout]`);

const args = [
  '-y', ...inputs, '-filter_complex', filters.join(';'),
  '-map', '[vout]', '-map', '[aout]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', String(TOTAL_DUR), OUT_FILE,
];

console.log(`[gertran-11 ${profession}] render -> ${OUT_FILE}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) process.exit(res.status || 1);
const stat = fs.statSync(OUT_FILE);
console.log(`[gertran-11 ${profession}] ✅ ${(stat.size/1024/1024).toFixed(1)}MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
