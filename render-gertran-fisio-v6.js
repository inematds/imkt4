/**
 * GERTRAN v6 — Hook 3s (era 2s) + teste de posição de legenda abaixo do vídeo.
 *
 * Gera 2 versões em um só rodar:
 *   -v6a: legenda logo abaixo do vídeo (y=1520, colada na borda)
 *   -v6b: legenda com 1 linha de espaço abaixo (y=1600)
 *
 * Total: 31s (hook 3 + main 25 + black 3)
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PROFESSION = 'FISIOTERAPEUTA';

const IMG_DIR = path.join(__dirname, 'prj/inema/videos/criaprof/fisioterapeuta_2026-04-22/imgs');
const OUT_DIR = path.join(__dirname, 'prj/inema/videos/gertran/fisioterapeuta_2026-04-23/video');
const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = '/tmp/narr/narr-gertran-fisio.mp3';
const WHISPER_JSON = '/tmp/narr/whisper-words-gertran-fisio.json';
const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';
const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/Montserrat-ExtraBold.ttf';

const FPS = 30;
const W = 1080, H = 1920, SQ = 1080;
const PAD_DUR = 3.0;         // hook agora 3s
const MAIN_DUR = 25.0;
const BLACK_DUR = 3.0;
const TOTAL_DUR = PAD_DUR + MAIN_DUR + BLACK_DUR; // 31

const imgList = [
  'cena01-fim.png', 'cena02-fim.png', 'cena03-ini.png', 'cena04-fim.png',
  'cena05-fim.png', 'cena06-fim.png', 'cena07-fim.png', 'cena08-fim.png',
  'cena09-fim.png', 'cena10-fim.png',
  'cena11-fim.png', 'cena12-fim.png', 'cena13-fim.png', 'cena14-ini.png', 'cena14-fim.png',
  'cena07-ini.png', 'cena09-ini.png', 'cena11-ini.png', 'cena15-ini.png', 'cena15-fim.png',
];
const imgs = imgList.map((f) => path.join(IMG_DIR, f));
for (const p of imgs) if (!fs.existsSync(p)) { console.error(`faltando: ${p}`); process.exit(1); }
const N = imgs.length;
const CLIP_DUR = MAIN_DUR / N;

fs.mkdirSync(OUT_DIR, { recursive: true });

const NARR_OFFSET = PAD_DUR + 0.5; // 3.5s
const whisperData = JSON.parse(fs.readFileSync(WHISPER_JSON, 'utf8'));
const capChunks = whisperData.chunks.map((c) => ({
  t0: c.t0 + NARR_OFFSET,
  t1: c.t1 + NARR_OFFSET,
  text: c.text.replace(/inema\.?(cube|clube)/gi, 'INEMA.CLUB').replace(/ponto/gi, '.'),
}));

const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const TMP = '/tmp/gertran-v6-texts/';
fs.mkdirSync(TMP, { recursive: true });
let tc = 0;
const txt = (s) => { const f = path.join(TMP, `t_${tc++}.txt`); fs.writeFileSync(f, s, 'utf8'); return f; };

function drawtext({ text, t0, t1, y, size, color = 'white', bord = 6, bordColor = 'black@0.85', font = FONT_HOOK, x = '(w-tw)/2' }) {
  const tf = txt(ascii(text));
  return (
    `drawtext=fontfile=${font}:textfile=${tf}:` +
    `fontcolor=${color}:fontsize=${size}:` +
    `borderw=${bord}:bordercolor=${bordColor}:` +
    `x=${x}:y=${y}:` +
    `enable='between(t\\,${t0}\\,${t1})'`
  );
}

function buildRender(captionY, outFile) {
  const inputs = [];
  imgs.forEach((p) => inputs.push('-framerate', String(FPS), '-loop', '1', '-t', String(CLIP_DUR), '-i', p));
  inputs.push('-i', MUSIC);
  inputs.push('-i', NARR);
  const musicIdx = N;
  const narrIdx = N + 1;

  const filters = [];

  // PADDING — fundo sólido 3s
  filters.push(`color=c=0x0A1428:s=${W}x${H}:d=${PAD_DUR}:r=${FPS},format=yuv420p,setsar=1[vpad]`);

  // MAIN — scale lanczos estático
  imgs.forEach((_, idx) => {
    filters.push(
      `[${idx}:v]scale=${SQ}:${SQ}:flags=lanczos,fade=t=in:st=0:d=0.1,` +
      `pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p,setsar=1[c${idx}]`
    );
  });
  const mainConcat = imgs.map((_, i) => `[c${i}]`).join('');
  filters.push(`${mainConcat}concat=n=${N}:v=1:a=0[vmain]`);

  // BLACK
  filters.push(`color=c=0x050510:s=${W}x${H}:d=${BLACK_DUR}:r=${FPS},format=yuv420p,setsar=1[vblack]`);

  // CONCAT
  filters.push(`[vpad][vmain][vblack]concat=n=3:v=1:a=0[vconcat]`);

  // PADDING HOOK (0-3s)
  const hookPadding = [
    drawtext({ text: PROFESSION,         t0: 0, t1: PAD_DUR, y: 280,  size: 82,  color: '#FFEB3B', bord: 6 }),
    drawtext({ text: 'VOCE JA CUROU',    t0: 0, t1: PAD_DUR, y: 640,  size: 124, bord: 10 }),
    drawtext({ text: 'DOR DE UM JEITO',  t0: 0, t1: PAD_DUR, y: 790,  size: 124, bord: 10 }),
    drawtext({ text: 'QUE NINGUEM',      t0: 0, t1: PAD_DUR, y: 940,  size: 124, bord: 10 }),
    drawtext({ text: 'ENSINA MAIS.',     t0: 0, t1: PAD_DUR, y: 1090, size: 124, color: '#FFEB3B', bord: 10 }),
  ];

  // MAIN hooks — 4 atos (recalculados pra 25s dentro de main, offset PAD_DUR=3)
  const T1 = PAD_DUR;         // 3
  const T2 = T1 + 5;          // 8
  const T3 = T1 + 12.5;       // 15.5
  const T4 = T1 + 18.75;      // 21.75
  const T5 = T1 + MAIN_DUR;   // 28
  const hookMain = [
    drawtext({ text: 'VOCE VIU',         t0: T1, t1: T2, y: 100, size: 108, bord: 8 }),
    drawtext({ text: 'TUDO COMECAR',     t0: T1, t1: T2, y: 230, size: 108, color: '#FFEB3B', bord: 8 }),
    drawtext({ text: 'SE ADAPTOU.',      t0: T2, t1: T3, y: 100, size: 112, bord: 8 }),
    drawtext({ text: 'SEMPRE.',          t0: T2, t1: T3, y: 230, size: 112, color: '#FFEB3B', bord: 8 }),
    drawtext({ text: 'AGORA CHEGOU',     t0: T3, t1: T4, y: 100, size: 102, bord: 8 }),
    drawtext({ text: 'A IA.',            t0: T3, t1: T4, y: 230, size: 140, color: '#FFEB3B', bord: 10 }),
    drawtext({ text: 'GERACAO DE',       t0: T4, t1: T5, y: 100, size: 108, bord: 8 }),
    drawtext({ text: 'TRANSFORMACAO.',   t0: T4, t1: T5, y: 230, size: 108, color: '#FFEB3B', bord: 8 }),
  ];

  // Captions em Y parametrizado (teste A/B)
  const captions = capChunks.map((b) => drawtext({
    text: b.text, t0: b.t0, t1: b.t1, y: captionY, size: 56,
    color: '#FFEB3B', bord: 8, bordColor: 'black@0.95',
  }));

  const watermark = drawtext({
    text: 'INEMA.CLUB', t0: 0, t1: T5, y: 48, size: 64,
    color: 'white@0.95', bord: 6, bordColor: 'black@0.7', x: '48',
  });
  const handle = drawtext({
    text: '@inema.club', t0: 0.5, t1: T5, y: 1850, size: 40,
    color: 'white@0.85', font: FONT_CAPS, bord: 3, bordColor: 'black@0.6',
  });
  const cta = [
    drawtext({ text: 'GERACAO DE',             t0: T5 + 0.2, t1: TOTAL_DUR, y: 420,  size: 72,  bord: 5 }),
    drawtext({ text: 'TRANSFORMACAO',          t0: T5 + 0.2, t1: TOTAL_DUR, y: 520,  size: 72,  color: '#FFEB3B', bord: 5 }),
    drawtext({ text: 'CONTINUE APRENDENDO EM', t0: T5 + 0.2, t1: TOTAL_DUR, y: 780,  size: 50,  bord: 3 }),
    drawtext({ text: 'INEMA.CLUB',             t0: T5 + 0.2, t1: TOTAL_DUR, y: 900,  size: 180, color: '#FFEB3B', bord: 12 }),
    drawtext({ text: 'LINK NA BIO',            t0: T5 + 0.2, t1: TOTAL_DUR, y: 1200, size: 64,  bord: 4 }),
  ];

  const allOverlays = [watermark, handle, ...hookPadding, ...hookMain, ...captions, ...cta].join(',');
  filters.push(`[vconcat]${allOverlays}[vout]`);

  // ÁUDIO
  filters.push(
    `[${musicIdx}:a]atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS,` +
    `volume='if(between(t\\,${NARR_OFFSET - 0.2}\\,${NARR_OFFSET + 18})\\,0.05\\,0.32)':eval=frame,` +
    `afade=t=out:st=${TOTAL_DUR - 2}:d=2[music]`
  );
  filters.push(`[${narrIdx}:a]adelay=${NARR_OFFSET * 1000}|${NARR_OFFSET * 1000},volume=1.95[narr]`);
  filters.push(`[music][narr]amix=inputs=2:duration=first:dropout_transition=0,atrim=0:${TOTAL_DUR},asetpts=PTS-STARTPTS[aout]`);

  const args = [
    '-y', ...inputs,
    '-filter_complex', filters.join(';'),
    '-map', '[vout]', '-map', '[aout]',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart',
    '-t', String(TOTAL_DUR),
    outFile,
  ];

  console.log(`[gertran v6] caption y=${captionY} -> ${path.basename(outFile)}`);
  const t0 = Date.now();
  const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
  if (res.status !== 0) { console.error(`ffmpeg exit=${res.status}`); process.exit(res.status || 1); }
  const stat = fs.statSync(outFile);
  console.log(`[gertran v6] ✅ ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
}

// Render 2 versões: A = logo abaixo (y=1520), B = 1 linha de espaço (y=1600)
buildRender(1520, path.join(OUT_DIR, 'gertran-fisioterapeuta-31s-v6a-colado.mp4'));
buildRender(1600, path.join(OUT_DIR, 'gertran-fisioterapeuta-31s-v6b-espaco.mp4'));
