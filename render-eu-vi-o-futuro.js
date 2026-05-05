/**
 * Monta o video "Eu Vi o Futuro Chegar" a partir das 40 imagens (20 cenas ini+fim)
 * com Ken Burns + crossfade, musica de fundo (inemavox/freesound) e fade out.
 *
 * Target: 1080x1080, 60s total, 30fps.
 * 20 cenas x 3s = 60s; cada cena = ini(1.5s) + fim(1.5s) com zoompan.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const IMG_DIR = path.join(__dirname, 'prj/inema/outputs/eu-vi-o-futuro-chegar_2026-04-22/imgs');
const OUT_DIR = path.join(__dirname, 'prj/inema/outputs/eu-vi-o-futuro-chegar_2026-04-22/video');
const MUSIC = '/tmp/musica_video/freesound_748406_Inspiring_Orchestral_Music_with_Majestic.mp3';

const N_SCENES = 30; // cena01..cena30 (ini + fim = 60 imgs)
const FPS = 30;
const SIZE = 1080;
const TOTAL_DUR = 60; // mantém duração da música
// distribui uniformemente o tempo entre todas as imagens (60 / 60 = 1s cada)
const DUR_PER_IMG = TOTAL_DUR / (N_SCENES * 2);
const FRAMES = Math.round(DUR_PER_IMG * FPS); // 30 frames = 1s

fs.mkdirSync(OUT_DIR, { recursive: true });
const outFile = path.join(OUT_DIR, 'eu-vi-o-futuro-chegar.mp4');

// Build ordered list: cena01-ini, cena01-fim, cena02-ini, cena02-fim, ...
const imgs = [];
for (let i = 1; i <= N_SCENES; i += 1) {
  const n = String(i).padStart(2, '0');
  imgs.push(path.join(IMG_DIR, `cena${n}-ini.png`));
  imgs.push(path.join(IMG_DIR, `cena${n}-fim.png`));
}
for (const p of imgs) {
  if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }
}

// Ken Burns presets — alternate directions for visual variety
// Each preset defines the zoompan x/y expressions
const presets = [
  // center -> slight zoom in centered
  { x: 'iw/2-(iw/zoom/2)',           y: 'ih/2-(ih/zoom/2)' },
  // top-left -> zoom in
  { x: '0',                          y: '0' },
  // top-right
  { x: 'iw-iw/zoom',                 y: '0' },
  // bottom-left
  { x: '0',                          y: 'ih-ih/zoom' },
  // bottom-right
  { x: 'iw-iw/zoom',                 y: 'ih-ih/zoom' },
  // slow pan right
  { x: 'on/45*(iw-iw/zoom)',         y: 'ih/2-(ih/zoom/2)' },
  // slow pan left
  { x: '(iw-iw/zoom)*(1-on/45)',     y: 'ih/2-(ih/zoom/2)' },
  // slow pan down
  { x: 'iw/2-(iw/zoom/2)',           y: 'on/45*(ih-ih/zoom)' },
];

const inputs = [];
imgs.forEach((p) => {
  // Use -framerate 1 -t 1 to force exactly 1 input frame per image — avoids
  // zoompan's d=N multiplying per input frame (bug that produces only the
  // first image repeating for the whole output).
  inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', p);
});
inputs.push('-i', MUSIC);

// Filter: zoompan per image + concat
const zoomRate = 0.0018; // ~0.0018 per frame * 45 frames = 0.081 (8% zoom over 1.5s)
const filters = [];
imgs.forEach((_, idx) => {
  const p = presets[idx % presets.length];
  filters.push(
    `[${idx}:v]zoompan=z='min(1+on*${zoomRate},1.1)':d=${FRAMES}:x='${p.x}':y='${p.y}':s=${SIZE}x${SIZE}:fps=${FPS},format=yuv420p[v${idx}]`
  );
});

// Concat all 40 video streams
const concatInputs = imgs.map((_, i) => `[v${i}]`).join('');
filters.push(`${concatInputs}concat=n=${imgs.length}:v=1:a=0[vout]`);

// Audio: trim to exact duration, fade out last 2s
const totalDur = imgs.length * DUR_PER_IMG; // 60
const audioIdx = imgs.length; // 40
filters.push(
  `[${audioIdx}:a]atrim=0:${totalDur},asetpts=PTS-STARTPTS,afade=t=out:st=${totalDur - 2}:d=2,volume=0.85[aout]`
);

const filterComplex = filters.join(';');

const args = [
  '-y',
  ...inputs,
  '-filter_complex', filterComplex,
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

console.log(`[video] ${imgs.length} imagens x ${DUR_PER_IMG}s = ${totalDur}s @ ${SIZE}x${SIZE} ${FPS}fps`);
console.log(`[video] rendering -> ${outFile}`);

const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
const wall = ((Date.now() - t0) / 1000).toFixed(1);

if (res.status !== 0) {
  console.error(`ffmpeg exit=${res.status}`);
  process.exit(res.status || 1);
}
const stat = fs.statSync(outFile);
console.log(`\n[video] ✅ ${outFile}`);
console.log(`[video] tamanho: ${(stat.size / 1024 / 1024).toFixed(1)} MB — render em ${wall}s`);
