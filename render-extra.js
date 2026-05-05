/**
 * Render genérico pros 3 templates extras em 9:16, 31s, estilo GERTRAN.
 * Reusa narração gertran + whisper da profissão (já existentes).
 *
 * Layout: 3s padding (bg sólido + label + hook) + 25s main (50 imgs × 0.5s)
 *         + 3s black outro (CTA INEMA.CLUB).
 *
 * Uso: node render-extra.js <slug> <paired|artifacts|decades>
 * Output: prj/inema/videos/extras/<template>/videos/<slug>-<template>-31s.mp4
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { profissoes } = require('./config/profissoes-30');

const TEMPLATES = {
  paired:    { dir: 'paired',    nImgs: 50, fileFmt: (i) => `par${String(Math.floor(i/2)+1).padStart(2,'0')}${i%2===0?'a':'b'}.png` },
  artifacts: { dir: 'artifacts', nImgs: 50, fileFmt: (i) => `art${String(i+1).padStart(2,'0')}.png` },
  decades:   { dir: 'decades',   nImgs: 50, fileFmt: (i) => `dec${String(i+1).padStart(2,'0')}.png` },
};

const slug = process.argv[2];
const templ = process.argv[3];
if (!slug || !TEMPLATES[templ]) {
  console.error(`uso: node render-extra.js <slug> <${Object.keys(TEMPLATES).join('|')}>`);
  process.exit(1);
}

const profile = profissoes.find((p) => p.slug === slug);
if (!profile) { console.error(`slug não encontrado: ${slug}`); process.exit(1); }

const IMG_DIR = path.join(__dirname, `prj/inema/videos/extras/${TEMPLATES[templ].dir}/${slug}_2026-04-23/imgs`);
if (!fs.existsSync(IMG_DIR)) { console.error(`imgs: ${IMG_DIR}`); process.exit(1); }

const OUT_DIR = path.join(__dirname, `prj/inema/videos/extras/${TEMPLATES[templ].dir}/videos`);
const OUT_FILE = path.join(OUT_DIR, `${slug}-${templ}-31s.mp4`);
fs.mkdirSync(OUT_DIR, { recursive: true });

const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = `/tmp/narr/narr-gertran-${slug}.mp3`;
const WHISPER_JSON = `/tmp/narr/whisper-gertran-${slug}.json`;
if (!fs.existsSync(NARR) || !fs.existsSync(WHISPER_JSON)) { console.error('narr/whisper gertran faltando'); process.exit(1); }

const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';
const FPS = 30, W = 1080, H = 1920, SQ = 1080;
const PAD_DUR = 3.0, MAIN_DUR = 25.0, BLACK_DUR = 3.0;
const TOTAL_DUR = PAD_DUR + MAIN_DUR + BLACK_DUR;

const N = TEMPLATES[templ].nImgs;
const CLIP_DUR = MAIN_DUR / N; // 0.5s por img

const imgs = [];
for (let i = 0; i < N; i += 1) imgs.push(path.join(IMG_DIR, TEMPLATES[templ].fileFmt(i)));
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }

const NARR_OFFSET = PAD_DUR + 0.5;
const whisperData = JSON.parse(fs.readFileSync(WHISPER_JSON, 'utf8'));
const capChunks = whisperData.chunks.map((c) => ({
  t0: c.t0 + NARR_OFFSET, t1: c.t1 + NARR_OFFSET,
  text: c.text.replace(/inema\.?(cube|clube)/gi, 'INEMA.CLUB').replace(/ponto/gi, '.'),
}));

const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const TMP = `/tmp/extra-${templ}-${slug}-texts/`;
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
filters.push(`color=c=0x0A1428:s=${W}x${H}:d=${PAD_DUR}:r=${FPS},format=yuv420p,setsar=1[vpad]`);
imgs.forEach((_, idx) => {
  filters.push(`[${idx}:v]scale=${SQ}:${SQ}:flags=lanczos,pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p,setsar=1[c${idx}]`);
});
filters.push(`${imgs.map((_, i) => `[c${i}]`).join('')}concat=n=${N}:v=1:a=0[vmain]`);
filters.push(`color=c=0x050510:s=${W}x${H}:d=${BLACK_DUR}:r=${FPS},format=yuv420p,setsar=1[vblack]`);
filters.push(`[vpad][vmain][vblack]concat=n=3:v=1:a=0[vconcat]`);

// Padding com hook
const hook = profile.gertran_hook;
const hookY0 = 690, hookLineH = 140;
const hookPad = [
  drawtext({ text: profile.label, t0: 0, t1: PAD_DUR, y: 230, size: 150, color: '#FFEB3B', bord: 8 }),
  ...hook.map((line, i) => drawtext({
    text: line, t0: 0, t1: PAD_DUR, y: hookY0 + i * hookLineH,
    size: 118, color: i === hook.length - 1 ? '#FFEB3B' : 'white', bord: 10,
  })),
];

// Label do template no topo (sub-identificador visual)
const templLabel = { paired: 'ANTES E DEPOIS', artifacts: 'O QUE MUDOU', decades: 'DECADAS DE MUDANÇA' };
const T1 = PAD_DUR, T5 = T1 + MAIN_DUR;
const topLabel = drawtext({
  text: templLabel[templ], t0: T1, t1: T5, y: 130, size: 56, color: '#FFEB3B', bord: 6,
});

const captions = capChunks.map((b) => drawtext({
  text: b.text, t0: b.t0, t1: b.t1, y: 1520, size: 56,
  color: '#FFEB3B', bord: 8, bordColor: 'black@0.95',
}));

const watermark = drawtext({
  text: 'INEMA.CLUB', t0: 0, t1: T5, y: 48, size: 64,
  color: 'white@0.95', bord: 6, bordColor: 'black@0.7', x: '48',
});
const rodape = drawtext({
  text: 'INEMA.CLUB', t0: 0, t1: T5, y: '1500+(420-th)/2', size: 80,
  color: 'white', bord: 5, bordColor: 'black@0.7',
});
const cta = [
  drawtext({ text: 'GERACAO DE',             t0: T5 + 0.2, t1: TOTAL_DUR, y: 420,  size: 72,  bord: 5 }),
  drawtext({ text: 'TRANSFORMACAO',          t0: T5 + 0.2, t1: TOTAL_DUR, y: 520,  size: 72,  color: '#FFEB3B', bord: 5 }),
  drawtext({ text: 'CONTINUE APRENDENDO EM', t0: T5 + 0.2, t1: TOTAL_DUR, y: 780,  size: 50,  bord: 3 }),
  drawtext({ text: 'INEMA.CLUB',             t0: T5 + 0.2, t1: TOTAL_DUR, y: 900,  size: 180, color: '#FFEB3B', bord: 12 }),
  drawtext({ text: 'LINK NA BIO',            t0: T5 + 0.2, t1: TOTAL_DUR, y: 1200, size: 64,  bord: 4 }),
];

const allOverlays = [watermark, rodape, ...hookPad, topLabel, ...captions, ...cta].join(',');
filters.push(`[vconcat]${allOverlays}[vout]`);

filters.push(`[${musicIdx}:a]atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS,volume='if(between(t\\,${NARR_OFFSET - 0.2}\\,${NARR_OFFSET + 18})\\,0.05\\,0.32)':eval=frame,afade=t=out:st=${TOTAL_DUR - 2}:d=2[music]`);
filters.push(`[${narrIdx}:a]adelay=${NARR_OFFSET * 1000}|${NARR_OFFSET * 1000},volume=1.95[narr]`);
filters.push(`[music][narr]amix=inputs=2:duration=first:dropout_transition=0,atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS[aout]`);

const args = [
  '-y', ...inputs, '-filter_complex', filters.join(';'),
  '-map', '[vout]', '-map', '[aout]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', String(TOTAL_DUR), OUT_FILE,
];

console.log(`[extra:${templ}:${slug}] render -> ${OUT_FILE}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) process.exit(res.status || 1);
const stat = fs.statSync(OUT_FILE);
console.log(`[extra:${templ}:${slug}] ✅ ${(stat.size/1024/1024).toFixed(1)}MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
