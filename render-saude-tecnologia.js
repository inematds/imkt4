/**
 * Renderiza "Saúde e Tecnologia — 30s" com narração + música suave + INEMA.CLUB final.
 * 30 imagens x 1s cada = 30s total.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const IMG_DIR = path.join(__dirname, 'prj/inema/outputs/saude-tecnologia_2026-04-22/imgs');
const OUT_DIR = path.join(__dirname, 'prj/inema/outputs/saude-tecnologia_2026-04-22/video');
const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = '/tmp/narr/narr-saude.mp3';
const FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';

const N_SCENES = 15;
const FPS = 30;
const SIZE = 1080;
const TOTAL_DUR = 30;
const DUR_PER_IMG = TOTAL_DUR / (N_SCENES * 2);
const FRAMES = Math.round(DUR_PER_IMG * FPS);

fs.mkdirSync(OUT_DIR, { recursive: true });
const outFile = path.join(OUT_DIR, 'saude-tecnologia-30s.mp4');

const imgs = [];
for (let i = 1; i <= N_SCENES; i += 1) {
  const n = String(i).padStart(2, '0');
  imgs.push(path.join(IMG_DIR, `cena${n}-ini.png`));
  imgs.push(path.join(IMG_DIR, `cena${n}-fim.png`));
}
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }

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
imgs.forEach((p) => { inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', p); });
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
filters.push(
  `[vconc]drawtext=fontfile=${FONT}:text='INEMA.CLUB':fontcolor=white:fontsize=140:borderw=4:bordercolor=black@0.5:x=(w-tw)/2:y=(h-th)/2:alpha='if(lt(t\\,27.5)\\,(t-27)*2\\,if(gt(t\\,29.5)\\,(30-t)*2\\,1))':enable='between(t,27,30)'[vout]`
);

const musicIdx = imgs.length;
const narrIdx = imgs.length + 1;
// Narração começa em 0.8s. Música 0.35 nas bordas, 0.06 durante a fala (0.5–29.3).
filters.push(
  `[${musicIdx}:a]atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS,volume='if(between(t\\,0.5\\,29.3)\\,0.06\\,0.35)':eval=frame,afade=t=out:st=${TOTAL_DUR - 2}:d=2[music]`
);
filters.push(`[${narrIdx}:a]adelay=800|800,volume=1.9[narr]`);
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
  outFile,
];

console.log(`[saude 30s] ${imgs.length} imagens x ${DUR_PER_IMG}s = ${TOTAL_DUR}s @ ${SIZE}x${SIZE} ${FPS}fps`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
const wall = ((Date.now() - t0) / 1000).toFixed(1);
if (res.status !== 0) { console.error(`ffmpeg exit=${res.status}`); process.exit(res.status || 1); }
const stat = fs.statSync(outFile);
console.log(`\n[saude 30s] ✅ ${outFile}`);
console.log(`[saude 30s] tamanho: ${(stat.size / 1024 / 1024).toFixed(1)} MB — render em ${wall}s`);
