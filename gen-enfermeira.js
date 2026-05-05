/**
 * 30 imagens — jornada de criança (7) até enfermeira experiente (~45).
 */

const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');

const MODEL = 'flux2-klein';
const RATIO = '1:1';
const OUT = path.join(__dirname, 'prj/inema/outputs/enfermeira_2026-04-22/imgs');

const BASE = 'Brazilian woman with light-medium skin, long straight chestnut brown hair, kind attentive hazel eyes, gentle determined expression';
const S_OLD = 'shot on 35mm film, cinematic grading, warm tungsten light, film grain, slight vignette, no text, no captions, no logos';
const S_MID = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos';
const S_FUT = 'neo-noir clinical lighting, soft glassmorphism, teal accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos';

const char = (age, extra = '') => `${BASE}, about ${age} years old${extra ? ', ' + extra : ''}`;

const scenes = [
  { file: 'cena01-ini.png', prompt: `A child's bedroom with a doll wrapped in a small bandage on a bed, toy first-aid kit open beside it, warm late-80s ambient light, no people, ${S_OLD}` },
  { file: 'cena01-fim.png', prompt: `${char(7, 'little girl, chestnut hair in two braids, simple cotton clothes')} pretending to bandage the arm of her doll with great care, focused tender expression, ${S_OLD}` },

  { file: 'cena02-ini.png', prompt: `A modest late-80s/early-90s bedroom with an elderly woman lying gently in bed under a warm blanket, a glass of water on the nightstand, afternoon window light, ${S_OLD}` },
  { file: 'cena02-fim.png', prompt: `${char(10, 'child with chestnut braids, simple clothes')} sitting beside her grandmother's bed, adjusting the blanket, quiet loving smile, ${S_OLD}` },

  { file: 'cena03-ini.png', prompt: `1990s hospital lobby, polished floor, a reception desk, soft fluorescent light, people walking blurred in background, ${S_OLD}` },
  { file: 'cena03-fim.png', prompt: `${char(13, 'teenager, chestnut brown hair, school backpack')} walking through a hospital corridor, curious wide eyes looking around, respectful posture, ${S_OLD}` },

  { file: 'cena04-ini.png', prompt: `Teen bedroom study desk with nursing vocational books open, notebooks, a simple desk lamp, late-night warm light, ${S_MID}` },
  { file: 'cena04-fim.png', prompt: `${char(17, 'teen, chestnut hair tied, casual t-shirt')} studying nursing textbooks late at night at her desk, determined focus, ${S_MID}` },

  { file: 'cena05-ini.png', prompt: `Nursing school practical classroom with mannequins, syringes, and bandages on a table, warm daylight through windows, ${S_MID}` },
  { file: 'cena05-fim.png', prompt: `${char(19, 'nursing student, chestnut hair tied back, white and blue uniform top')} practicing inserting an IV on a training mannequin, concentrated careful expression, ${S_MID}` },

  { file: 'cena06-ini.png', prompt: `Hospital bedside with morning sunlight, folded linens and a vital signs monitor, serene clinical atmosphere, ${S_MID}` },
  { file: 'cena06-fim.png', prompt: `${char(21, 'nursing intern in blue scrubs, chestnut hair tied, stethoscope around neck')} attentively checking a vital signs monitor beside a patient bed, ${S_MID}` },

  { file: 'cena07-ini.png', prompt: `A new nursing cap and a starched white uniform top laid carefully on a bed, morning light, sense of pride, ${S_MID}` },
  { file: 'cena07-fim.png', prompt: `${char(24, 'newly graduated nurse in crisp white uniform and nursing cap, chestnut brown hair')} smiling with emotional pride, holding a diploma, ${S_MID}` },

  { file: 'cena08-ini.png', prompt: `ICU corridor at night with soft blue-green monitor glow coming from rooms, quiet intensity, ${S_MID}` },
  { file: 'cena08-fim.png', prompt: `${char(27, 'ICU nurse in teal scrubs, chestnut hair tied, tired but resolute eyes')} at an ICU bedside monitor at night, steady composed presence, ${S_MID}` },

  { file: 'cena09-ini.png', prompt: `Hospital team meeting room with a small group of nurses gathered around a whiteboard with shift plans, morning light, ${S_MID}` },
  { file: 'cena09-fim.png', prompt: `${char(30, 'head nurse in scrubs, chestnut hair neatly tied, confident expression')} leading a quick nursing team briefing, warm leadership posture, ${S_MID}` },

  { file: 'cena10-ini.png', prompt: `Nursing station with a desktop computer showing an early electronic patient chart interface, paper charts stacked to one side, ${S_MID}` },
  { file: 'cena10-fim.png', prompt: `${char(33, 'experienced nurse in scrubs, chestnut hair tied, glasses')} typing a patient note into an electronic system, slight smile of relief, ${S_MID}` },

  { file: 'cena11-ini.png', prompt: `Close-up of a tablet held in gloved hands showing a patient vital dashboard, bedside blurred behind, ${S_MID}` },
  { file: 'cena11-fim.png', prompt: `${char(36, 'nurse in scrubs, chestnut hair with a few silver strands')} at a hospital bedside with a tablet, warmly reassuring an elderly patient, ${S_MID}` },

  { file: 'cena12-ini.png', prompt: `Central nurses' monitor wall showing multiple remote patient telemetry feeds in real-time, cool ambient clinical light, ${S_FUT}` },
  { file: 'cena12-fim.png', prompt: `${char(40, 'senior nurse, chestnut hair with gray streaks, glasses, scrubs')} monitoring multiple patient telemetry streams on a wall of screens, calm focused analysis, ${S_FUT}` },

  { file: 'cena13-ini.png', prompt: `Clinical workstation with an AI triage dashboard highlighting patient priority levels, soft teal UI accents, ${S_FUT}` },
  { file: 'cena13-fim.png', prompt: `${char(42, 'veteran nurse, chestnut hair with notable gray streaks, scrubs')} reviewing AI-assisted triage recommendations on a tablet, thoughtful experienced face, ${S_FUT}` },

  { file: 'cena14-ini.png', prompt: `Bright hospital teaching room with a diverse group of young nurses gathered, notebooks open, a mannequin on the training bed, natural light, ${S_MID}` },
  { file: 'cena14-fim.png', prompt: `${char(44, 'mentor nurse, chestnut and silver hair tied elegantly, scrubs with a small pin')} teaching a diverse group of young nurses, warm guiding smile, ${S_MID}` },

  { file: 'cena15-ini.png', prompt: `Modern hospital corridor with soft warm-cool gradient light, shallow depth of field, sense of care and calm, no people, ${S_FUT}` },
  { file: 'cena15-fim.png', prompt: `Heroic cinematic close-up portrait of the same ${BASE}, about 45 years old, chestnut hair with elegant silver streaks loosely down, clean scrubs and a stethoscope, quietly confident warm smile looking slightly upward, soft rim light, blurred hospital background, editorial quality, ${S_FUT}` },
];

(async () => {
  const t0 = Date.now();
  console.log(`\n[enfermeira] Gerando ${scenes.length} imagens em ${OUT}\n`);
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    console.log(`── ${i + 1}/${scenes.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); }
  }
  console.log(`\n[enfermeira] ✅ concluído em ${((Date.now() - t0) / 1000).toFixed(1)}s`);
})();
