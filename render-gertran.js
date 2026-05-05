/**
 * GERTRAN — Geração da Transformação.
 * Render genérico: node render-gertran.js <profession>
 *
 * Layout fixado (v7):
 *   - 31s (padding 3 + main 25 + black 3)
 *   - Padding: fundo sólido, PROFISSÃO gigante (150pt), hook 4 linhas, INEMA.CLUB no topo + rodapé
 *   - Main: 20 imgs estáticas com scale lanczos (sem tremor), captions whisper-sync y=1520
 *   - Black final: CTA INEMA.CLUB 180pt
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const profession = process.argv[2];

// CONFIGS legado vazio — todas as 30 profissões são resolvidas via config/profissoes-30.js
// (ver fallback abaixo).
const CONFIGS = {};

// Mapa CLI-key → slug do config/profissoes-30.js (onde diferirem)
const CLI_TO_SLUG = {
  fisioterapeuta: 'fisioterapeuta',
  medica: 'crianca-medica',
  enfermeira: 'enfermeira',
  psicologa: 'psicologa',
};

let cfg = CONFIGS[profession];
let resolvedSlug = CLI_TO_SLUG[profession] || profession;

// Se tem CONFIGS entry antiga, checa se existe nostalgia dir pro slug e prefere
if (cfg) {
  const nostalgiaDir = `prj/inema/videos/gertran-nostalgia/${resolvedSlug}_2026-04-23/imgs`;
  if (fs.existsSync(path.join(__dirname, nostalgiaDir))) {
    console.log(`[gertran ${profession}] nostalgia dir encontrado, usando: ${nostalgiaDir}`);
    cfg = { ...cfg, imgDir: nostalgiaDir, useNostalgia: true };
  }
} else {
  // Auto-fallback: slug novo do factory (ou CLI key legado mapeado)
  try {
    const { profissoes } = require('./config/profissoes-30');
    const profile = profissoes.find((p) => p.slug === resolvedSlug);
    if (profile) {
      const nostalgiaDir = `prj/inema/videos/gertran-nostalgia/${resolvedSlug}_2026-04-23/imgs`;
      cfg = {
        label: profile.label,
        imgDir: nostalgiaDir,
        hook: profile.gertran_hook,
        narrKey: `gertran-${resolvedSlug}`,
        useNostalgia: true,
      };
    }
  } catch (_) {}
}
if (!cfg) { console.error(`uso: node render-gertran.js <slug>`); process.exit(1); }

const IMG_DIR = path.join(__dirname, cfg.imgDir);
const OUT_DIR = path.join(__dirname, `prj/inema/videos/gertran/${resolvedSlug}_2026-04-23/video`);
const OUT_FILE = path.join(OUT_DIR, `gertran-${resolvedSlug}-31s.mp4`);
const MUSIC = '/tmp/musica_video/mulheres/freesound_719036_Melancholy_Background_Piano__-_bpm_112_l.mp3';
const NARR = `/tmp/narr/narr-${cfg.narrKey}.mp3`;
const WHISPER_JSON = `/tmp/narr/whisper-${cfg.narrKey}.json`;
const FONT_HOOK = '/home/nmaldaner/.local/share/fonts/BebasNeue-Regular.ttf';
const FONT_CAPS = '/home/nmaldaner/.local/share/fonts/Montserrat-ExtraBold.ttf';

const FPS = 30;
const W = 1080, H = 1920, SQ = 1080;
const PAD_DUR = 3.0, MAIN_DUR = 25.0, BLACK_DUR = 3.0;
const TOTAL_DUR = PAD_DUR + MAIN_DUR + BLACK_DUR;

const imgList = cfg.useNostalgia
  ? Array.from({ length: 20 }, (_, i) => `nost${String(i + 1).padStart(2, '0')}.png`)
  : [
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

const NARR_OFFSET = PAD_DUR + 0.5;
const whisperData = JSON.parse(fs.readFileSync(WHISPER_JSON, 'utf8'));
const capChunks = whisperData.chunks.map((c) => ({
  t0: c.t0 + NARR_OFFSET,
  t1: c.t1 + NARR_OFFSET,
  text: c.text.replace(/inema\.?(cube|clube)/gi, 'INEMA.CLUB').replace(/ponto/gi, '.'),
}));

const ascii = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const TMP = `/tmp/gertran-${profession}-texts/`;
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
  filters.push(`[${idx}:v]scale=${SQ}:${SQ}:flags=lanczos,fade=t=in:st=0:d=0.1,pad=${W}:${H}:0:420:color=0x0A1428,format=yuv420p,setsar=1[c${idx}]`);
});
const mainConcat = imgs.map((_, i) => `[c${i}]`).join('');
filters.push(`${mainConcat}concat=n=${N}:v=1:a=0[vmain]`);
filters.push(`color=c=0x050510:s=${W}x${H}:d=${BLACK_DUR}:r=${FPS},format=yuv420p,setsar=1[vblack]`);
filters.push(`[vpad][vmain][vblack]concat=n=3:v=1:a=0[vconcat]`);

// PADDING HOOK
const hookLines = cfg.hook;
const hookY0 = 690; // primeira linha
const hookLineH = 140;
const hookPadding = [
  drawtext({ text: cfg.label, t0: 0, t1: PAD_DUR, y: 230, size: 150, color: '#FFEB3B', bord: 8 }),
  ...hookLines.map((line, i) => drawtext({
    text: line, t0: 0, t1: PAD_DUR, y: hookY0 + i * hookLineH,
    size: 118,
    color: i === hookLines.length - 1 ? '#FFEB3B' : 'white',
    bord: 10,
  })),
];

// MAIN hooks (4 atos fixos)
const T1 = PAD_DUR, T2 = T1 + 5, T3 = T1 + 12.5, T4 = T1 + 18.75, T5 = T1 + MAIN_DUR;
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

const allOverlays = [watermark, rodape, ...hookPadding, ...hookMain, ...captions, ...cta].join(',');
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

console.log(`[gertran ${profession}] render -> ${OUT_FILE}`);
const t0 = Date.now();
const res = spawnSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (res.status !== 0) process.exit(res.status || 1);
const stat = fs.statSync(OUT_FILE);
console.log(`[gertran ${profession}] ✅ ${(stat.size/1024/1024).toFixed(1)} MB em ${((Date.now()-t0)/1000).toFixed(1)}s`);
