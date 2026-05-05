/**
 * Render CriaProf-CTA-916 versão Comic Style A (Calvin & Hobbes).
 *
 * Mesmo render que render-criaprof-cta-916.js mas lê imgs de
 * prj/inema/videos/criaprof-comic-A/<slug>_<date>/imgs/ e escreve em
 * prj/inema/videos/criaprof-comic-A-cta-916/<slug>_<date>/video/.
 *
 * Reutiliza TTS+Whisper já existentes (texto narração não muda).
 *
 * Uso: node render-criaprof-comic-A-cta-916.js <slug> <prof|generic>
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { getCtaConfig, NOUNS, getMusicForVariant } = require('./config/profissoes-cta');

const slug = process.argv[2];
const variant = process.argv[3] || 'prof';
if (!slug || !['prof', 'generic'].includes(variant)) {
  console.error('Usage: node render-criaprof-comic-A-cta-916.js <slug> <prof|generic>');
  process.exit(1);
}

const cta = getCtaConfig(slug, variant);

// Procura imgs em qualquer pasta criaprof-comic-A/<slug>_*/imgs (data variável)
const COMIC_BASE = path.join(__dirname, 'prj/inema/videos/criaprof-comic-A');
let IMG_DIR = null;
if (fs.existsSync(COMIC_BASE)) {
  const candidates = fs.readdirSync(COMIC_BASE)
    .filter((d) => d.startsWith(`${slug}_`))
    .map((d) => path.join(COMIC_BASE, d, 'imgs'))
    .filter((p) => fs.existsSync(p));
  IMG_DIR = candidates[0] || null;
}
if (!IMG_DIR) {
  console.error(`imgs comic-A não encontradas para ${slug} em ${COMIC_BASE}`);
  console.error(`gere primeiro: node gen-criaprof-comic-A.js ${slug}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const OUT_DIR = path.join(__dirname, `prj/inema/videos/criaprof-comic-A-cta-916/${slug}_${today}/video`);
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_FILE = path.join(OUT_DIR, `${slug}-comicA-cta-${variant}-37s.mp4`);

const MUSIC = getMusicForVariant(variant);
if (!MUSIC) console.warn(`! música não encontrada — renderizando sem música de fundo`);

const NARR = `/tmp/narr/narr-criaprof-cta-${variant}-${slug}.mp3`;
const WHISPER_JSON = `/tmp/narr/whisper-criaprof-cta-${variant}-${slug}.json`;
if (!fs.existsSync(NARR)) { console.error(`narr faltando: ${NARR} (rode batch-criaprof-cta.js antes pra gerar TTS)`); process.exit(1); }
if (!fs.existsSync(WHISPER_JSON)) { console.error(`whisper faltando: ${WHISPER_JSON}`); process.exit(1); }

const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';

let N_SCENES = 0;
for (let i = 1; i <= 30; i += 1) {
  const n = String(i).padStart(2, '0');
  if (fs.existsSync(path.join(IMG_DIR, `cena${n}-fim.png`))) N_SCENES = i;
}
if (N_SCENES === 0) { console.error(`nenhuma cena em ${IMG_DIR}`); process.exit(1); }

const FPS = 30, W = 1080, H = 1920, SQ = 1080, PAD_Y = 420;
const HOOK_DUR = 3;
const CTA_DUR = 4;
const IMG_TOTAL = 30;
const TOTAL_DUR = HOOK_DUR + IMG_TOTAL + CTA_DUR;
const N_IMGS = N_SCENES * 2;
const DUR_PER_IMG = IMG_TOTAL / N_IMGS;
const FRAMES = Math.round(DUR_PER_IMG * FPS);

const imgs = [];
for (let i = 1; i <= N_SCENES; i += 1) {
  const n = String(i).padStart(2, '0');
  imgs.push(path.join(IMG_DIR, `cena${n}-ini.png`));
  imgs.push(path.join(IMG_DIR, `cena${n}-fim.png`));
}
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }

const whisperData = JSON.parse(fs.readFileSync(WHISPER_JSON, 'utf8'));
const capChunks = whisperData.chunks
  .map((c) => ({
    t0: c.t0,
    t1: c.t1,
    text: c.text.replace(/inema\.?(cube|clube)/gi, 'INEMA.CLUB').replace(/ponto/gi, '.'),
  }))
  .filter((c) => c.t0 >= HOOK_DUR - 0.2);

const ascii = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const TMP = `/tmp/criaprof-comicA-cta-916-${slug}-${variant}-texts/`;
fs.rmSync(TMP, { recursive: true, force: true });
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
inputs.push('-f', 'lavfi', '-t', String(HOOK_DUR), '-i', `color=black:size=${W}x${H}:rate=${FPS}`);
imgs.forEach((p) => inputs.push('-framerate', '1', '-loop', '1', '-t', String(DUR_PER_IMG), '-i', p));
inputs.push('-f', 'lavfi', '-t', String(CTA_DUR), '-i', `color=black:size=${W}x${H}:rate=${FPS}`);
if (MUSIC) inputs.push('-i', MUSIC);
inputs.push('-i', NARR);

const HOOK_IDX = 0;
const IMG_IDX_START = 1;
const CTA_IDX = 1 + N_IMGS;
const MUSIC_IDX = MUSIC ? CTA_IDX + 1 : -1;
const NARR_IDX = MUSIC ? MUSIC_IDX + 1 : CTA_IDX + 1;

const zoomRate = 0.0022;
const filters = [];
filters.push(`[${HOOK_IDX}:v]format=yuv420p,setsar=1[vhook]`);
imgs.forEach((_, idx) => {
  const inputIdx = IMG_IDX_START + idx;
  const p = presets[idx % presets.length];
  const x = p.x.replace(/FR/g, String(FRAMES));
  const y = p.y.replace(/FR/g, String(FRAMES));
  filters.push(
    `[${inputIdx}:v]zoompan=z='min(1+on*${zoomRate},1.1)':d=${FRAMES}:x='${x}':y='${y}':s=${SQ}x${SQ}:fps=${FPS},` +
    `pad=${W}:${H}:0:${PAD_Y}:color=0x0A1428,format=yuv420p,setsar=1[v${idx}]`
  );
});
filters.push(`[${CTA_IDX}:v]format=yuv420p,setsar=1[vcta]`);
const concatInputs = ['[vhook]', ...imgs.map((_, i) => `[v${i}]`), '[vcta]'].join('');
filters.push(`${concatInputs}concat=n=${N_IMGS + 2}:v=1:a=0[vconc]`);

const hookSize1 = cta.hookLine1.length > 14 ? 130 : 180;
const hookOverlays = [
  drawtext({ text: cta.hookLine1, t0: 0, t1: HOOK_DUR, y: 700, size: hookSize1, color: '#FFEB3B', bord: 12 }),
  drawtext({ text: cta.hookLine2, t0: 0, t1: HOOK_DUR, y: 1000, size: 110, color: 'white', bord: 10 }),
];

const captions = capChunks
  .filter((b) => b.t0 < HOOK_DUR + IMG_TOTAL + 0.5)
  .map((b) => drawtext({
    text: b.text, t0: b.t0, t1: Math.min(b.t1, HOOK_DUR + IMG_TOTAL),
    y: 1520, size: 56, color: '#FFEB3B', bord: 8, bordColor: 'black@0.95',
  }));

const topoText = (NOUNS[slug] && NOUNS[slug].noun) || cta.hookLine1;
const topoSize = topoText.length > 14 ? 60 : 80;
const watermark = drawtext({
  text: topoText, t0: HOOK_DUR, t1: HOOK_DUR + IMG_TOTAL, y: 140, size: topoSize,
  color: 'white@0.98', bord: 7, bordColor: 'black@0.9',
});

const rodape = drawtext({
  text: 'INEMA.CLUB', t0: HOOK_DUR, t1: HOOK_DUR + IMG_TOTAL, y: '1500+(420-th)/2', size: 80,
  color: 'white', bord: 5, bordColor: 'black@0.7',
});

const ctaT0 = HOOK_DUR + IMG_TOTAL;
const ctaOverlays = [
  drawtext({ text: 'TRANSFORME',          t0: ctaT0, t1: TOTAL_DUR, y: 480,  size: 110, color: 'white', bord: 8 }),
  drawtext({ text: 'SUA CARREIRA',        t0: ctaT0, t1: TOTAL_DUR, y: 620,  size: 110, color: '#FFEB3B', bord: 8 }),
  drawtext({ text: 'INEMA.CLUB',          t0: ctaT0, t1: TOTAL_DUR, y: 900,  size: 200, color: '#FFEB3B', bord: 14 }),
  drawtext({ text: 'LINK NA BIO',         t0: ctaT0, t1: TOTAL_DUR, y: 1280, size: 80,  color: 'white', bord: 5 }),
];

const allOverlays = [...hookOverlays, watermark, rodape, ...captions, ...ctaOverlays].join(',');
filters.push(`[vconc]${allOverlays}[vout]`);

filters.push(
  `[${NARR_IDX}:a]volume='if(lt(t\\,${HOOK_DUR})\\,2.8\\,2.0)':eval=frame,` +
  `apad,atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS[narr]`
);
if (MUSIC) {
  filters.push(
    `[${MUSIC_IDX}:a]aloop=loop=-1:size=2e9,atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS,` +
    `volume='if(lt(t\\,${HOOK_DUR})\\,0\\,if(lt(t\\,${ctaT0})\\,0.22\\,0.40))':eval=frame,` +
    `afade=t=out:st=${TOTAL_DUR - 1.5}:d=1.5[music]`
  );
  filters.push(`[music][narr]amix=inputs=2:duration=first:dropout_transition=0,atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS[aout]`);
} else {
  filters.push(`[narr]acopy[aout]`);
}

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

console.log(`[criaprof-comicA-cta-916 ${slug}/${variant}] hook="${cta.hookLine1}" -> ${OUT_FILE}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) process.exit(res.status || 1);
const stat = fs.statSync(OUT_FILE);
console.log(`[criaprof-comicA-cta-916 ${slug}/${variant}] ✅ ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
