/**
 * Render genérico CriaProf (Criança → Profissional) — v2 com whisper sync.
 *
 * Mudanças vs versões anteriores:
 *   - Legendas sincronizadas automaticamente via Whisper (word-level)
 *   - Legendas posicionadas dentro da imagem (y=940, bottom do 1080x1080)
 *   - Tudo mais preservado (zoom 0.0022, 30 imgs x 1s, música, INEMA.CLUB final)
 *
 * Uso: node render-criaprof.js <profession>
 *   profession: mulheres-tecnologia | saude-tecnologia | crianca-medica |
 *               enfermeira | psicologa | fisioterapeuta
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const profession = process.argv[2];
if (!profession) { console.error('Usage: node render-criaprof.js <profession>'); process.exit(1); }

// CONFIGS legado — só temas autorais sem profile em config/profissoes-30.js.
// fisio/crianca-medica/enfermeira/psicologa migraram pro factory (_2026-04-23).
const CONFIGS = {
  'mulheres-tecnologia': { folder: 'mulheres-tecnologia_2026-04-22', narrKey: 'mulheres', outName: 'mulheres-tecnologia-30s.mp4' },
  'saude-tecnologia':    { folder: 'saude-tecnologia_2026-04-22',    narrKey: 'saude',    outName: 'saude-tecnologia-30s.mp4' },
};

// Auto-config para profissões geradas pelo factory (dentista, etc — pasta _2026-04-23)
let cfg = CONFIGS[profession];
if (!cfg) {
  const autoFolder = `${profession}_2026-04-23`;
  const autoDir = path.join(__dirname, `prj/inema/videos/criaprof/${autoFolder}/imgs`);
  if (fs.existsSync(autoDir)) {
    cfg = { folder: autoFolder, narrKey: `criaprof-${profession}`, outName: `${profession}-criaprof.mp4` };
  } else {
    console.error(`unknown profession: ${profession} (nem em CONFIGS nem em prj/inema/videos/criaprof/${autoFolder})`);
    process.exit(1);
  }
}

const IMG_DIR = path.join(__dirname, `prj/inema/videos/criaprof/${cfg.folder}/imgs`);
const OUT_DIR = path.join(__dirname, `prj/inema/videos/criaprof/${cfg.folder}/video`);
const OUT_FILE = path.join(OUT_DIR, cfg.outName);
const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = `/tmp/narr/narr-${cfg.narrKey}.mp3`;
const WHISPER_JSON = `/tmp/narr/whisper-${cfg.narrKey}.json`;
const FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';

// Detecta N_SCENES automaticamente (15 legado, 25 factory novo)
let N_SCENES = 0;
for (let i = 1; i <= 30; i += 1) {
  const n = String(i).padStart(2, '0');
  if (fs.existsSync(path.join(IMG_DIR, `cena${n}-fim.png`))) N_SCENES = i;
}
if (N_SCENES === 0) { console.error(`nenhuma cena encontrada em ${IMG_DIR}`); process.exit(1); }
console.log(`[${profession}] detectou N_SCENES=${N_SCENES}`);

const FPS = 30, SIZE = 1080;
const TOTAL_DUR = N_SCENES >= 20 ? 45 : 30; // 50 imgs → 45s, 30 imgs → 30s
const DUR_PER_IMG = TOTAL_DUR / (N_SCENES * 2);
const FRAMES = Math.round(DUR_PER_IMG * FPS);

fs.mkdirSync(OUT_DIR, { recursive: true });
const imgs = [];
for (let i = 1; i <= N_SCENES; i += 1) {
  const n = String(i).padStart(2, '0');
  imgs.push(path.join(IMG_DIR, `cena${n}-ini.png`));
  imgs.push(path.join(IMG_DIR, `cena${n}-fim.png`));
}
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }

// --- carrega whisper JSON com offset +0.8s (adelay da narração) ---
const NARR_OFFSET = 0.8;
const whisperData = JSON.parse(fs.readFileSync(WHISPER_JSON, 'utf8'));
const capChunks = whisperData.chunks.map((c) => ({
  t0: c.t0 + NARR_OFFSET,
  t1: c.t1 + NARR_OFFSET,
  text: c.text.replace(/inema\.?(cube|clube)/gi, 'INEMA.CLUB').replace(/ponto/gi, '.'),
}));
console.log(`[${profession}] ${capChunks.length} captions via whisper (offset +${NARR_OFFSET}s)`);

// --- helpers ---
const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const TMP = `/tmp/criaprof-texts-${profession}/`;
fs.mkdirSync(TMP, { recursive: true });
let tc = 0;
const txt = (s) => { const f = path.join(TMP, `t_${tc++}.txt`); fs.writeFileSync(f, s, 'utf8'); return f; };

function drawtext({ text, t0, t1, y, size, color = 'white', bord = 6, bordColor = 'black@0.8', font = FONT_CAPS, x = '(w-tw)/2' }) {
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
  filters.push(
    `[${idx}:v]zoompan=z='min(1+on*${zoomRate},1.1)':d=${FRAMES}:x='${x}':y='${y}':s=${SIZE}x${SIZE}:fps=${FPS},format=yuv420p[v${idx}]`
  );
});
const concatInputs = imgs.map((_, i) => `[v${i}]`).join('');
filters.push(`${concatInputs}concat=n=${imgs.length}:v=1:a=0[vconc]`);

// === OVERLAYS ===
// Captions sincronizadas via whisper (y=940, dentro da imagem, bottom area)
const captions = capChunks.map((b) => drawtext({
  text: b.text, t0: b.t0, t1: b.t1, y: 940, size: 54,
  color: '#FFEB3B', font: FONT_CAPS, bord: 7, bordColor: 'black@0.92',
}));

// Mantém o INEMA.CLUB textão do original (últimos 3s)
const outro = drawtext({
  text: 'INEMA.CLUB',
  t0: TOTAL_DUR - 3, t1: TOTAL_DUR, y: '(h-th)/2', size: 140,
  color: 'white', font: FONT_CAPS, bord: 4, bordColor: 'black@0.5',
});

// enable customizado pra fade in/out do INEMA.CLUB final (se quiser)
// por simplicidade deixo estático entre 27-30

const allOverlays = [...captions, outro].join(',');
filters.push(`[vconc]${allOverlays}[vout]`);

// === ÁUDIO ===
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

console.log(`[${profession}] render -> ${OUT_FILE}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) process.exit(res.status || 1);
const stat = fs.statSync(OUT_FILE);
console.log(`[${profession}] ✅ ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
