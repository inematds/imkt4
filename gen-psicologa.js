/**
 * 30 imagens — jornada de criança (7) até psicóloga experiente (~45).
 */

const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');

const MODEL = 'flux2-klein';
const RATIO = '1:1';
const OUT = path.join(__dirname, 'prj/inema/outputs/psicologa_2026-04-22/imgs');

const BASE = 'Brazilian woman with fair olive skin, long dark auburn hair, observant green-hazel eyes, gentle empathetic thoughtful expression';
const S_OLD = 'shot on 35mm film, cinematic grading, warm tungsten light, film grain, slight vignette, no text, no captions, no logos';
const S_MID = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos';
const S_FUT = 'neo-noir ambient lighting, soft glassmorphism, warm amber and muted teal accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos';

const char = (age, extra = '') => `${BASE}, about ${age} years old${extra ? ', ' + extra : ''}`;

const scenes = [
  { file: 'cena01-ini.png', prompt: `A late-80s Brazilian living room with two children — one visibly sad on a couch — afternoon warm sunlight through a window, soft nostalgic feel, ${S_OLD}` },
  { file: 'cena01-fim.png', prompt: `${char(7, 'little girl with dark auburn hair, simple dress')} sitting close to a crying friend, arm gently around her, listening attentively with huge caring eyes, ${S_OLD}` },

  { file: 'cena02-ini.png', prompt: `A child's wooden desk with illustrated psychology-for-kids books open, colored pencils, a small notebook with handwritten reflections, warm lamp light, ${S_OLD}` },
  { file: 'cena02-fim.png', prompt: `${char(10, 'child with dark auburn hair, glasses on the tip of her nose')} reading a children's book about emotions, concentrated curious smile, ${S_OLD}` },

  { file: 'cena03-ini.png', prompt: `A teen's bedroom desk with an open journal full of handwritten notes and small doodles, a mug of tea beside it, soft lamp light at night, ${S_OLD}` },
  { file: 'cena03-fim.png', prompt: `${char(14, 'teenager, dark auburn hair, pajamas, soft contemplative expression')} writing thoughtfully in her personal journal at night, ${S_OLD}` },

  { file: 'cena04-ini.png', prompt: `Late-90s community center room with a small group of teens seated in a circle on simple chairs, warm afternoon light, ${S_MID}` },
  { file: 'cena04-fim.png', prompt: `${char(17, 'young volunteer, dark auburn hair tied back, casual shirt')} leading a small discussion circle of peers at a community center, warm active listening posture, ${S_MID}` },

  { file: 'cena05-ini.png', prompt: `University lecture hall with a psychology professor speaking in front of a whiteboard, notebooks open in the foreground blurred, ${S_MID}` },
  { file: 'cena05-fim.png', prompt: `${char(19, 'psychology student, dark auburn hair, backpack beside her, simple t-shirt')} taking detailed notes during a psychology lecture, bright focused expression, ${S_MID}` },

  { file: 'cena06-ini.png', prompt: `Desk in a student apartment covered with classic psychology books by well-known authors, sticky notes, warm evening light, ${S_MID}` },
  { file: 'cena06-fim.png', prompt: `${char(22, 'student, dark auburn hair, glasses, cozy sweater')} reading psychology texts with a tender serious expression, marking passages with a pencil, ${S_MID}` },

  { file: 'cena07-ini.png', prompt: `A community clinic waiting room, simple warm decor, two chairs and a box of tissues on a small table, soft daylight, ${S_MID}` },
  { file: 'cena07-fim.png', prompt: `${char(24, 'early psychology intern, dark auburn hair, simple blouse, attentive soft gaze')} sitting across from a patient (not visible), empathetic listening posture, ${S_MID}` },

  { file: 'cena08-ini.png', prompt: `Small cozy therapy office with two armchairs, a plant, a tissue box, bookshelf of psychology books, warm lamp light, ${S_MID}` },
  { file: 'cena08-fim.png', prompt: `${char(26, 'young psychologist, dark auburn hair, calm professional blouse')} sitting in her small new therapy office, warm inviting presence, ${S_MID}` },

  { file: 'cena09-ini.png', prompt: `A neat modern therapy office with two armchairs facing each other, plant, tasteful art on the wall, soft natural light, ${S_MID}` },
  { file: 'cena09-fim.png', prompt: `${char(30, 'psychologist, dark auburn hair, simple elegant blouse, relaxed attentive gaze')} in a therapy session, leaning slightly forward, empathetic listening, ${S_MID}` },

  { file: 'cena10-ini.png', prompt: `A laptop on a wooden desk at home showing a simple tele-therapy video-call interface, a notebook and a mug of tea beside, soft daylight, ${S_MID}` },
  { file: 'cena10-fim.png', prompt: `${char(34, 'psychologist in her home office, dark auburn hair, simple blouse, glasses')} conducting an online therapy session, soft concerned caring smile, ${S_MID}` },

  { file: 'cena11-ini.png', prompt: `Modern minimal workspace with a laptop showing a clean tele-therapy interface and a schedule with several video-session slots, afternoon light, ${S_MID}` },
  { file: 'cena11-fim.png', prompt: `${char(37, 'established psychologist, dark auburn hair with slight gray strands, elegant blouse')} smiling warmly during an online session, natural office light, ${S_MID}` },

  { file: 'cena12-ini.png', prompt: `Close-up of a smartphone on a desk showing a modern mental-health tracking app with mood charts and reflective prompts, soft daylight, ${S_MID}` },
  { file: 'cena12-fim.png', prompt: `${char(40, 'mature psychologist, dark auburn hair with gray streaks, glasses, blazer')} looking at a patient's mood-tracking app on a tablet with thoughtful focus, ${S_MID}` },

  { file: 'cena13-ini.png', prompt: `A clean dashboard on a monitor showing an AI-assisted triage tool with color-coded emotional indicators and suggestions, soft teal and amber UI, ${S_FUT}` },
  { file: 'cena13-fim.png', prompt: `${char(42, 'experienced psychologist, dark auburn hair with silver strands, glasses')} reviewing AI-assisted triage suggestions on a tablet with a reflective careful expression, ${S_FUT}` },

  { file: 'cena14-ini.png', prompt: `Bright teaching room with a diverse group of young psychology students sitting in a semi-circle, natural daylight through large windows, ${S_MID}` },
  { file: 'cena14-fim.png', prompt: `${char(44, 'mentor psychologist, dark auburn hair with elegant silver streaks, warm blazer')} supervising a group of young psychology trainees, generous teaching smile, ${S_MID}` },

  { file: 'cena15-ini.png', prompt: `Minimalist warmly lit therapy space with soft gradient light from amber to cool blue, an empty armchair suggesting quiet presence, ${S_FUT}` },
  { file: 'cena15-fim.png', prompt: `Heroic cinematic close-up portrait of the same ${BASE}, about 45 years old, dark auburn hair with elegant silver streaks, simple elegant blazer, quiet warm confident smile, soft rim light, softly blurred warm therapy-room background, editorial quality, ${S_FUT}` },
];

(async () => {
  const t0 = Date.now();
  console.log(`\n[psicologa] Gerando ${scenes.length} imagens em ${OUT}\n`);
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    console.log(`── ${i + 1}/${scenes.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); }
  }
  console.log(`\n[psicologa] ✅ concluído em ${((Date.now() - t0) / 1000).toFixed(1)}s`);
})();
