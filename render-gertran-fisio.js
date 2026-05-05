/**
 * GERTRAN — Geração da Transformação (piloto: Fisioterapeuta)
 *
 * Template para apelo emocional a profissionais 35+ que viveram múltiplas
 * ondas de tecnologia na carreira. Mensagem: "você sempre se adaptou. Faça de novo."
 *
 * Estrutura 30s:
 *   0–2s   PADDING: hero shot + hook bomba universal
 *   2–7s   ATO 1 (Reconhecimento): onde tudo começou — 4 imgs
 *   7–14.5s  ATO 2 (Orgulho/Adaptação): as transformações passadas — 6 imgs
 *   14.5–20.75s ATO 3 (Nova onda IA): o presente — 5 imgs
 *   20.75–27s  ATO 4 (Convite): callback emocional + hero — 5 imgs
 *   27–30s BLACK: CTA gigante INEMA.CLUB
 *
 * Técnica:
 *   - Ken Burns sutil (zoom rate 0.0015 — sem "tremer")
 *   - Crossfade 0.25s entre imagens (xfade chain)
 *   - Narração com CTA embutido + música piano suave duckada
 *   - Watermark INEMA.CLUB 64pt constante (segmentos 1 e 2)
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const IMG_DIR = path.join(__dirname, 'prj/inema/videos/fisioterapeuta_2026-04-22/imgs');
const OUT_DIR = path.join(__dirname, 'prj/inema/videos/fisioterapeuta_2026-04-22/video');
const OUT_FILE = path.join(OUT_DIR, 'gertran-fisioterapeuta-30s.mp4');
const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = '/tmp/narr/narr-gertran-fisio.mp3';
const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';
const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/Montserrat-ExtraBold.ttf';

const FPS = 30;
const W = 1080, H = 1920;
const SQ = 1080;

const PAD_DUR = 2.0;
const MAIN_DUR = 25.0;
const BLACK_DUR = 3.0;
const TOTAL_DUR = PAD_DUR + MAIN_DUR + BLACK_DUR; // 30

// --- imagens selecionadas por narrativa (20 imagens) ---
const imgList = [
  // Ato 1: Recognição (origem)
  'cena01-fim.png', // criança + avó
  'cena02-fim.png', // criança esporte
  'cena03-ini.png', // livro anatomia
  'cena04-fim.png', // adolescente estudando
  // Ato 2: Orgulho/Adaptação
  'cena05-fim.png', // entrou faculdade
  'cena06-fim.png', // estudante lab
  'cena07-fim.png', // primeiro paciente
  'cena08-fim.png', // manual mobilization
  'cena09-fim.png', // pilates ball
  'cena10-fim.png', // TENS
  // Ato 3: Nova onda
  'cena11-fim.png', // tutorial celular
  'cena12-fim.png', // teleconsulta
  'cena13-fim.png', // 3D motion
  'cena14-ini.png', // dashboard IA
  'cena14-fim.png', // revisando IA
  // Ato 4: Convite (callbacks + hero)
  'cena07-ini.png', // callback hospital amb
  'cena09-ini.png', // callback pilates
  'cena11-ini.png', // callback tutorial
  'cena15-ini.png', // ambiente futuro
  'cena15-fim.png', // hero final
];
const imgs = imgList.map((f) => path.join(IMG_DIR, f));
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }

const PAD_IMG = path.join(IMG_DIR, 'cena15-fim.png'); // hero shot no padding

const N = imgs.length; // 20
const CLIP_DUR = 1.5;                          // duração de cada clipe
const XFADE = 0.25;                            // overlap de crossfade
const STEP = CLIP_DUR - XFADE;                 // 1.25s efetivo por clipe no output
// Total natural = CLIP_DUR + (N-1)*STEP = 1.5 + 19*1.25 = 25.25s -> corta p/ 25
const CLIP_FRAMES = Math.round(CLIP_DUR * FPS); // 45
const PAD_FRAMES  = Math.round(PAD_DUR * FPS);  // 60

fs.mkdirSync(OUT_DIR, { recursive: true });

// Escape de UTF-8 sem diacríticos (drawtext ffmpeg 6.1.1 corta chars após multibyte)
const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const TMP = '/tmp/reels-texts-gertran/';
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

// --- inputs ---
// [0]: padding hero
// [1..N]: main imgs
// [N+1]: music
// [N+2]: narration
const inputs = [];
inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', PAD_IMG);
imgs.forEach((p) => inputs.push('-framerate', '1', '-loop', '1', '-t', '1', '-i', p));
inputs.push('-i', MUSIC);
inputs.push('-i', NARR);

const musicIdx = 1 + N;
const narrIdx  = 1 + N + 1;

const filters = [];

// PADDING segment
filters.push(
  `[0:v]zoompan=z='min(1.08+on*0.003,1.22)':d=${PAD_FRAMES}:` +
  `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${SQ}x${SQ}:fps=${FPS},` +
  `pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p,setsar=1[vpad]`
);

// MAIN: cada imagem -> zoompan 1:1 -> pad 9:16 -> xfade chain
const mainZoomRate = 0.0015;
imgs.forEach((_, idx) => {
  const p = presets[idx % presets.length];
  const x = p.x.replace(/FR/g, String(CLIP_FRAMES));
  const y = p.y.replace(/FR/g, String(CLIP_FRAMES));
  const inputStream = idx + 1;
  filters.push(
    `[${inputStream}:v]zoompan=z='min(1+on*${mainZoomRate},1.07)':d=${CLIP_FRAMES}:` +
    `x='${x}':y='${y}':s=${SQ}x${SQ}:fps=${FPS},` +
    `pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p,setsar=1[c${idx}]`
  );
});

// xfade chain: [c0][c1] xfade offset=STEP -> [x1]; [x1][c2] offset=2*STEP -> [x2]; ...
let prev = 'c0';
for (let i = 1; i < N; i += 1) {
  const offset = i * STEP; // offset no stream acumulado
  const label = (i === N - 1) ? 'vmain' : `x${i}`;
  filters.push(
    `[${prev}][c${i}]xfade=transition=fade:duration=${XFADE}:offset=${offset.toFixed(3)}[${label}]`
  );
  prev = label;
}

// BLACK segment
filters.push(`color=c=0x050510:s=${W}x${H}:d=${BLACK_DUR}:r=${FPS},format=yuv420p,setsar=1[vblack]`);

// Trim main pra cortar o excedente (25.25s -> 25s)
filters.push(`[vmain]trim=duration=${MAIN_DUR},setpts=PTS-STARTPTS[vmaintrim]`);

// CONCAT dos 3 segmentos
filters.push(`[vpad][vmaintrim][vblack]concat=n=3:v=1:a=0[vconcat]`);

// ===== OVERLAYS =====
// Hook PADDING (0-2s): bomba scroll-stopper
const hookPadding = [
  drawtext({ text: 'VOCE JA CUROU',               t0: 0, t1: PAD_DUR, y: 680,  size: 118, font: FONT_HOOK, bord: 10 }),
  drawtext({ text: 'DOR DE UM JEITO',             t0: 0, t1: PAD_DUR, y: 820,  size: 118, font: FONT_HOOK, bord: 10 }),
  drawtext({ text: 'QUE NINGUEM',                 t0: 0, t1: PAD_DUR, y: 960,  size: 118, font: FONT_HOOK, bord: 10 }),
  drawtext({ text: 'ENSINA MAIS.',                t0: 0, t1: PAD_DUR, y: 1100, size: 118, color: '#FFEB3B', font: FONT_HOOK, bord: 10 }),
];

// Hook MAIN — 4 atos
const hookMain = [
  // Ato 1: 2-7s — Reconhecimento
  drawtext({ text: 'VOCE VIU',                    t0: 2.0,  t1: 7.0,  y: 100, size: 108, font: FONT_HOOK, bord: 8 }),
  drawtext({ text: 'TUDO COMEÇAR',                t0: 2.0,  t1: 7.0,  y: 230, size: 108, color: '#FFEB3B', font: FONT_HOOK, bord: 8 }),
  // Ato 2: 7-14.5s — Adaptação
  drawtext({ text: 'SE ADAPTOU.',                 t0: 7.0,  t1: 14.5, y: 100, size: 112, font: FONT_HOOK, bord: 8 }),
  drawtext({ text: 'SEMPRE.',                     t0: 7.0,  t1: 14.5, y: 230, size: 112, color: '#FFEB3B', font: FONT_HOOK, bord: 8 }),
  // Ato 3: 14.5-20.75s — Nova onda IA
  drawtext({ text: 'AGORA CHEGOU',                t0: 14.5, t1: 20.75, y: 100, size: 102, font: FONT_HOOK, bord: 8 }),
  drawtext({ text: 'A IA.',                       t0: 14.5, t1: 20.75, y: 230, size: 140, color: '#FFEB3B', font: FONT_HOOK, bord: 10 }),
  // Ato 4: 20.75-27s — Convite
  drawtext({ text: 'GERAÇÃO DE',                  t0: 20.75, t1: 27,  y: 100, size: 108, font: FONT_HOOK, bord: 8 }),
  drawtext({ text: 'TRANSFORMAÇÃO.',              t0: 20.75, t1: 27,  y: 230, size: 108, color: '#FFEB3B', font: FONT_HOOK, bord: 8 }),
];

// Captions sincronizadas com narração (0.5s delay após padding = começa 2.5s; narração 17.3s)
const capBlocks = [
  { t0: 2.5,  t1: 4.2,  text: 'Você viu o manual' },
  { t0: 4.2,  t1: 5.6,  text: 'virar TENS' },
  { t0: 5.6,  t1: 7.0,  text: 'A bola virar pilates' },
  { t0: 7.0,  t1: 9.0,  text: 'A videochamada' },
  { t0: 9.0,  t1: 11.0, text: 'salvou sua profissão' },
  { t0: 11.0, t1: 13.0, text: 'Você se adaptou sempre' },
  { t0: 13.0, t1: 15.0, text: 'Agora chegou a IA' },
  { t0: 15.0, t1: 17.5, text: 'E você sabe o que fazer' },
  { t0: 17.5, t1: 20.0, text: 'Você é da geração' },
  { t0: 20.0, t1: 22.5, text: 'que TRANSFORMA' },
  { t0: 22.5, t1: 26.5, text: 'Continue no INEMA.CLUB' },
];
const captions = capBlocks.map((b) => drawtext({
  text: b.text, t0: b.t0, t1: b.t1, y: 1680, size: 58,
  color: '#FFEB3B', font: FONT_HOOK, bord: 7, bordColor: 'black@0.9',
}));

// Watermark INEMA.CLUB 64pt — constante nos segmentos 1 e 2 (0-27s)
const watermark = drawtext({
  text: 'INEMA.CLUB', t0: 0, t1: 27, y: 48, size: 64,
  color: 'white@0.95', font: FONT_HOOK, bord: 6, bordColor: 'black@0.7', x: '48',
});

// Handle rodapé segmentos 1 e 2
const handle = drawtext({
  text: '@inema.club', t0: 0.5, t1: 27, y: 1850, size: 40,
  color: 'white@0.85', font: FONT_CAPS, bord: 3, bordColor: 'black@0.6',
});

// CTA final (27-30s) — tela preta com GERTRAN + INEMA.CLUB gigante
const cta = [
  drawtext({ text: 'GERAÇÃO DE',                t0: 27.2, t1: 30, y: 420,  size: 72,  font: FONT_HOOK, bord: 5 }),
  drawtext({ text: 'TRANSFORMAÇÃO',             t0: 27.2, t1: 30, y: 520,  size: 72,  color: '#FFEB3B', font: FONT_HOOK, bord: 5 }),
  drawtext({ text: 'CONTINUE APRENDENDO EM',    t0: 27.2, t1: 30, y: 780,  size: 50,  font: FONT_HOOK, bord: 3 }),
  drawtext({ text: 'INEMA.CLUB',                t0: 27.2, t1: 30, y: 900,  size: 180, color: '#FFEB3B', font: FONT_HOOK, bord: 12 }),
  drawtext({ text: 'LINK NA BIO',               t0: 27.2, t1: 30, y: 1200, size: 64,  font: FONT_HOOK, bord: 4 }),
];

const allOverlays = [
  watermark,
  handle,
  ...hookPadding,
  ...hookMain,
  ...captions,
  ...cta,
].join(',');

filters.push(`[vconcat]${allOverlays}[vout]`);

// ===== AUDIO =====
// Música: 0.32 fora da narração, 0.05 durante (2.5-20.5), fade out 2s
// Narração: delay 2500ms, volume 1.95
filters.push(
  `[${musicIdx}:a]atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS,` +
  `volume='if(between(t\\,2.3\\,20.5)\\,0.05\\,0.32)':eval=frame,` +
  `afade=t=out:st=${TOTAL_DUR - 2}:d=2[music]`
);
filters.push(`[${narrIdx}:a]adelay=2500|2500,volume=1.95[narr]`);
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
  OUT_FILE,
];

console.log(`[gertran fisio] N=${N} imgs, clip=${CLIP_DUR}s, xfade=${XFADE}s`);
console.log(`[gertran fisio] render -> ${OUT_FILE}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) { console.error(`ffmpeg exit=${res.status}`); process.exit(res.status || 1); }
const stat = fs.statSync(OUT_FILE);
console.log(`\n[gertran fisio] ✅ ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
