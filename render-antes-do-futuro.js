/**
 * Monta o video "Antes do Futuro" (60s) a partir das 16 imagens (8 cenas ini+fim).
 * Respeita os timings do roteiro por cena. Ken Burns + musica de fundo + fade out.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const IMG_DIR = path.join(__dirname, 'prj/inema/outputs/antes-do-futuro_2026-04-22/imgs');
const OUT_DIR = path.join(__dirname, 'prj/inema/outputs/antes-do-futuro_2026-04-22/video');
const MUSIC = '/tmp/musica_video/freesound_748406_Inspiring_Orchestral_Music_with_Majestic.mp3';
const FPS = 30;
const SIZE = 1080;

// Timings do roteiro (segundos por cena) — total 60s
const sceneDurations = [5, 7, 8, 10, 10, 8, 7, 5];

// ini/fim dividem a duracao da cena meio a meio
const clips = [];
sceneDurations.forEach((dur, i) => {
  const n = String(i + 1).padStart(2, '0');
  const half = dur / 2;
  clips.push({ file: path.join(IMG_DIR, `cena${n}-ini.png`), dur: half });
  clips.push({ file: path.join(IMG_DIR, `cena${n}-fim.png`), dur: half });
});

fs.mkdirSync(OUT_DIR, { recursive: true });
const outFile = path.join(OUT_DIR, 'antes-do-futuro.mp4');

for (const c of clips) {
  if (!fs.existsSync(c.file)) { console.error(`faltando: ${c.file}`); process.exit(1); }
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
clips.forEach((c) => {
  // -framerate 1 -t 1 = exatamente 1 input frame; zoompan d=frames controla a duração de saída.
  inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', c.file);
});
inputs.push('-i', MUSIC);

const zoomRate = 0.0018;
const filters = [];
clips.forEach((c, idx) => {
  const p = presets[idx % presets.length];
  const frames = Math.round(c.dur * FPS);
  const x = p.x.replace(/FR/g, String(frames));
  const y = p.y.replace(/FR/g, String(frames));
  filters.push(
    `[${idx}:v]zoompan=z='min(1+on*${zoomRate},1.12)':d=${frames}:x='${x}':y='${y}':s=${SIZE}x${SIZE}:fps=${FPS},format=yuv420p[v${idx}]`
  );
});

const concatInputs = clips.map((_, i) => `[v${i}]`).join('');
filters.push(`${concatInputs}concat=n=${clips.length}:v=1:a=0[vout]`);

const totalDur = sceneDurations.reduce((a, b) => a + b, 0); // 60
const audioIdx = clips.length; // 16
filters.push(
  `[${audioIdx}:a]atrim=0:${totalDur},asetpts=PTS-STARTPTS,afade=t=out:st=${totalDur - 2}:d=2,volume=0.85[aout]`
);

const args = [
  '-y',
  ...inputs,
  '-filter_complex', filters.join(';'),
  '-map', '[vout]',
  '-map', '[aout]',
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '20',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-movflags', '+faststart',
  '-t', String(totalDur),
  outFile,
];

console.log(`[video] ${clips.length} clips, ${totalDur}s total @ ${SIZE}x${SIZE} ${FPS}fps`);
console.log(`[video] timings: ${sceneDurations.map((d, i) => `c${i + 1}=${d}s`).join(' ')}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
const wall = ((Date.now() - t0) / 1000).toFixed(1);

if (res.status !== 0) { console.error(`ffmpeg exit=${res.status}`); process.exit(res.status || 1); }
const stat = fs.statSync(outFile);
console.log(`\n[video] ✅ ${outFile}`);
console.log(`[video] tamanho: ${(stat.size / 1024 / 1024).toFixed(1)} MB — render em ${wall}s`);
