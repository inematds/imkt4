/**
 * Render CriaProf em formato 9:16 com estilo GERTRAN.
 *
 * Mesma narrativa (50 imgs × 0.9s zoompan, 45s total), mas canvas 1080×1920
 * com bandas pretas top/bottom, INEMA.CLUB watermark topo + rodapé, captions
 * y=1520 (na banda inferior, estilo GERTRAN).
 *
 * Output: prj/inema/videos/criaprof/videos/<slug>-criaprof.mp4 (sobrescreve 1:1).
 *
 * Uso: node render-criaprof-916.js <slug>
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const profession = process.argv[2];
if (!profession) { console.error('Usage: node render-criaprof-916.js <slug>'); process.exit(1); }

const folder = `${profession}_2026-04-23`;
const IMG_DIR = path.join(__dirname, `prj/inema/videos/criaprof/${folder}/imgs`);
if (!fs.existsSync(IMG_DIR)) { console.error(`imgs não encontradas: ${IMG_DIR}`); process.exit(1); }

const OUT_DIR = path.join(__dirname, `prj/inema/videos/criaprof/videos`);
const OUT_FILE = path.join(OUT_DIR, `${profession}-criaprof.mp4`);
fs.mkdirSync(OUT_DIR, { recursive: true });

const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = `/tmp/narr/narr-criaprof-${profession}.mp3`;
const WHISPER_JSON = `/tmp/narr/whisper-criaprof-${profession}.json`;
if (!fs.existsSync(NARR)) { console.error(`narr faltando: ${NARR}`); process.exit(1); }
if (!fs.existsSync(WHISPER_JSON)) { console.error(`whisper faltando: ${WHISPER_JSON}`); process.exit(1); }

const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';

// Detecta N_SCENES
let N_SCENES = 0;
for (let i = 1; i <= 30; i += 1) {
  const n = String(i).padStart(2, '0');
  if (fs.existsSync(path.join(IMG_DIR, `cena${n}-fim.png`))) N_SCENES = i;
}
if (N_SCENES === 0) { console.error(`nenhuma cena em ${IMG_DIR}`); process.exit(1); }

const FPS = 30, W = 1080, H = 1920, SQ = 1080, PAD_Y = 420;
const TOTAL_DUR = N_SCENES >= 20 ? 45 : 30;
const DUR_PER_IMG = TOTAL_DUR / (N_SCENES * 2);
const FRAMES = Math.round(DUR_PER_IMG * FPS);

const imgs = [];
for (let i = 1; i <= N_SCENES; i += 1) {
  const n = String(i).padStart(2, '0');
  imgs.push(path.join(IMG_DIR, `cena${n}-ini.png`));
  imgs.push(path.join(IMG_DIR, `cena${n}-fim.png`));
}
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }

// Whisper com offset +0.8s
const NARR_OFFSET = 0.8;
const whisperData = JSON.parse(fs.readFileSync(WHISPER_JSON, 'utf8'));
const capChunks = whisperData.chunks.map((c) => ({
  t0: c.t0 + NARR_OFFSET,
  t1: c.t1 + NARR_OFFSET,
  text: c.text.replace(/inema\.?(cube|clube)/gi, 'INEMA.CLUB').replace(/ponto/gi, '.'),
}));

const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const TMP = `/tmp/criaprof-916-${profession}-texts/`;
fs.mkdirSync(TMP, { recursive: true });
let tc = 0;
const txt = (s) => { const f = path.join(TMP, `t_${tc++}.txt`); fs.writeFileSync(f, s, 'utf8'); return f; };

function drawtext({ text, t0, t1, y, size, color = 'white', bord = 6, bordColor = 'black@0.85', font = FONT_CAPS, x = '(w-tw)/2' }) {
  const tf = txt(ascii(text));
  return `drawtext=fontfile=${font}:textfile=${tf}:fontcolor=${color}:fontsize=${size}:borderw=${bord}:bordercolor=${bordColor}:x=${x}:y=${y}:enable='between(t\\,${t0}\\,${t1})'`;
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

const inputs = [];
imgs.forEach((p) => inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', p));
inputs.push('-i', MUSIC);
inputs.push('-i', NARR);

const zoomRate = 0.0022;
const filters = [];
imgs.forEach((_, idx) => {
  const p = presets[idx % presets.length];
  const x = p.x.replace(/FR/g, String(FRAMES));
  const y = p.y.replace(/FR/g, String(FRAMES));
  // zoompan para 1080×1080, depois pad para 1080×1920 com offset y=420 (fundo GERTRAN #0A1428)
  filters.push(
    `[${idx}:v]zoompan=z='min(1+on*${zoomRate},1.1)':d=${FRAMES}:x='${x}':y='${y}':s=${SQ}x${SQ}:fps=${FPS},` +
    `pad=${W}:${H}:0:${PAD_Y}:color=0x0A1428,format=yuv420p,setsar=1[v${idx}]`
  );
});
const concatInputs = imgs.map((_, i) => `[v${i}]`).join('');
filters.push(`${concatInputs}concat=n=${imgs.length}:v=1:a=0[vconc]`);

// === OVERLAYS estilo GERTRAN ===
// Captions y=1520 (banda inferior)
const captions = capChunks.map((b) => drawtext({
  text: b.text, t0: b.t0, t1: b.t1, y: 1520, size: 56,
  color: '#FFEB3B', bord: 8, bordColor: 'black@0.95',
}));

// Watermark topo
const watermark = drawtext({
  text: 'INEMA.CLUB', t0: 0, t1: TOTAL_DUR - 3, y: 48, size: 64,
  color: 'white@0.95', bord: 6, bordColor: 'black@0.7', x: '48',
});

// Rodapé centralizado na banda inferior (1500-1920)
const rodape = drawtext({
  text: 'INEMA.CLUB', t0: 0, t1: TOTAL_DUR - 3, y: '1500+(420-th)/2', size: 80,
  color: 'white', bord: 5, bordColor: 'black@0.7',
});

// Outro 3s: INEMA.CLUB 180pt centralizado (estilo GERTRAN black outro, mas overlay)
const outro = [
  drawtext({ text: 'GERACAO DE',             t0: TOTAL_DUR - 3, t1: TOTAL_DUR, y: 420,  size: 72,  bord: 5 }),
  drawtext({ text: 'TRANSFORMACAO',          t0: TOTAL_DUR - 3, t1: TOTAL_DUR, y: 520,  size: 72,  color: '#FFEB3B', bord: 5 }),
  drawtext({ text: 'CONTINUE APRENDENDO EM', t0: TOTAL_DUR - 3, t1: TOTAL_DUR, y: 780,  size: 50,  bord: 3 }),
  drawtext({ text: 'INEMA.CLUB',             t0: TOTAL_DUR - 3, t1: TOTAL_DUR, y: 900,  size: 180, color: '#FFEB3B', bord: 12 }),
  drawtext({ text: 'LINK NA BIO',            t0: TOTAL_DUR - 3, t1: TOTAL_DUR, y: 1200, size: 64,  bord: 4 }),
];

// Cobrir último trecho com faixa escura pra destacar o CTA (overlay black@0.7 nos últimos 3s)
// Na verdade usamos drawbox para escurecer
const darkBox = `drawbox=x=0:y=0:w=${W}:h=${H}:color=black@0.75:t=fill:enable='between(t\\,${TOTAL_DUR - 3}\\,${TOTAL_DUR})'`;

const allOverlays = [watermark, rodape, ...captions, darkBox, ...outro].join(',');
filters.push(`[vconc]${allOverlays}[vout]`);

// Áudio
const musicIdx = imgs.length, narrIdx = imgs.length + 1;
filters.push(
  `[${musicIdx}:a]atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS,` +
  `volume='if(between(t\\,0.5\\,${TOTAL_DUR - 3})\\,0.06\\,0.35)':eval=frame,` +
  `afade=t=out:st=${TOTAL_DUR - 2}:d=2[music]`
);
filters.push(`[${narrIdx}:a]adelay=800|800,volume=1.9[narr]`);
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

console.log(`[criaprof-916 ${profession}] render -> ${OUT_FILE}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) process.exit(res.status || 1);
const stat = fs.statSync(OUT_FILE);
console.log(`[criaprof-916 ${profession}] ✅ ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
