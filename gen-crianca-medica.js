/**
 * 30 imagens — jornada de criança (6) até médica adulta (45).
 * Personagem: brasileira de descendência mista, pele castanha clara,
 * cabelo ondulado castanho, olhos castanhos vivos.
 */

const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');

const MODEL = 'flux2-klein';
const RATIO = '1:1';
const OUT = path.join(__dirname, 'prj/inema/outputs/crianca-medica_2026-04-22/imgs');

const BASE = 'Brazilian girl/woman of mixed descent, warm light brown skin, wavy brown hair, curious bright brown eyes, expressive warm face';
const S_OLD = 'shot on 35mm film, cinematic grading, warm tungsten light, film grain, slight vignette, no text, no captions, no logos';
const S_MID = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos';
const S_FUT = 'neo-noir clinical lighting, glassmorphism, soft teal and cyan accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos';

const char = (age, extra = '') => `${BASE}, about ${age} years old${extra ? ', ' + extra : ''}`;

const scenes = [
  // 1 — 6 anos: brincando de médica
  { file: 'cena01-ini.png', prompt: `Soft warm home scene, a toy stethoscope and a teddy bear lying on a child's bed, child's room from late 1980s, no people in frame, ${S_OLD}` },
  { file: 'cena01-fim.png', prompt: `${char(6, 'little girl in pajamas, wavy brown hair in pigtails')} pretending to examine a teddy bear with a toy stethoscope, bright imaginative smile, warm lamp light, ${S_OLD}` },

  // 2 — 9 anos: lendo livro de anatomia infantil
  { file: 'cena02-ini.png', prompt: `A children's illustrated anatomy book open on a desk with colored diagrams of the human body, warm desk lamp, colored pencils scattered, ${S_OLD}` },
  { file: 'cena02-fim.png', prompt: `${char(9, 'child in casual 90s clothing, wavy brown hair, slightly braces smile')} leaning over a children's anatomy book, pointing at a heart diagram, fascinated expression, ${S_OLD}` },

  // 3 — 13 anos: microscópio e experiências
  { file: 'cena03-ini.png', prompt: `Close-up of a simple student microscope and a small slide prep on a desk, curious science books beside it, warm desk light, ${S_OLD}` },
  { file: 'cena03-fim.png', prompt: `${char(13, 'teenager, wavy brown hair tied back, casual 90s/2000s outfit')} peering into a microscope, one eye closed, concentrated curious expression, ${S_OLD}` },

  // 4 — 17 anos: pré-vestibular, sonhando com medicina
  { file: 'cena04-ini.png', prompt: `Teenage bedroom desk piled with study books, flashcards, a mug of coffee, late-night lamp light, notebook with diagrams, ${S_MID}` },
  { file: 'cena04-fim.png', prompt: `${char(17, 'teenager, wavy brown hair, tired but determined gaze, hoodie')} studying late at night surrounded by books, rubbing her eyes but smiling faintly at her goal, ${S_MID}` },

  // 5 — 20 anos: aulas na faculdade
  { file: 'cena05-ini.png', prompt: `University medical classroom amphitheater with students seen from behind taking notes, a skeleton model on a table, sunlight through tall windows, ${S_MID}` },
  { file: 'cena05-fim.png', prompt: `${char(20, 'medical student, wavy brown hair, simple shirt with a university bag, backpack')} sitting in the front row taking notes, focused determined, warm classroom light, ${S_MID}` },

  // 6 — 22 anos: aula prática de anatomia
  { file: 'cena06-ini.png', prompt: `Anatomy lab bench with open anatomy atlas and medical instruments, clinical fluorescent light, serious quiet atmosphere, no person in frame, ${S_MID}` },
  { file: 'cena06-fim.png', prompt: `${char(22, 'medical student in white lab coat, wavy brown hair tied, a notebook in hand')} studying an anatomy atlas in a lab, mask hanging on ear, focused respectful expression, ${S_MID}` },

  // 7 — 25 anos: primeiros atendimentos, hospital escola
  { file: 'cena07-ini.png', prompt: `Hospital hallway with soft morning light, gurneys and blurred nurses in background, calm clinical ambience, ${S_MID}` },
  { file: 'cena07-fim.png', prompt: `${char(25, 'young doctor in training, white coat, stethoscope around neck, wavy brown hair')} standing attentively at a hospital bedside, gentle reassuring gaze toward a patient, ${S_MID}` },

  // 8 — 27 anos: formatura / jaleco branco
  { file: 'cena08-ini.png', prompt: `A crisp new white doctor coat hanging on a wood hanger beside a window with soft daylight, simple and proud setup, ${S_MID}` },
  { file: 'cena08-fim.png', prompt: `${char(27, 'recently graduated doctor, wavy brown hair, wearing a brand new white coat over professional clothing, stethoscope around neck')} smiling proudly in a hospital corridor, soft light, ${S_MID}` },

  // 9 — 29 anos: residência, plantões intensos
  { file: 'cena09-ini.png', prompt: `Hospital break room at night with a rumpled coat on a chair, an empty coffee cup, soft fluorescent light through the glass door, quiet exhaustion, no person visible, ${S_MID}` },
  { file: 'cena09-fim.png', prompt: `${char(29, 'resident doctor, wavy brown hair slightly messy, wearing scrubs, dark circles but resolute')} walking through a dim hospital corridor holding a tablet, focused under pressure, ${S_MID}` },

  // 10 — 31 anos: especialização
  { file: 'cena10-ini.png', prompt: `Medical imaging review room with multiple large displays showing MRI and CT slices, dimmed ambient light, ${S_MID}` },
  { file: 'cena10-fim.png', prompt: `${char(31, 'specialist doctor, wavy brown hair neatly tied, white coat, glasses')} studying medical scans across multiple screens, analytical focused expression, ${S_MID}` },

  // 11 — 34 anos: primeira transição para prontuário eletrônico
  { file: 'cena11-ini.png', prompt: `Modern consultation room desk with a laptop showing an electronic health record form, a paper folder being set aside, daylight through window, ${S_MID}` },
  { file: 'cena11-fim.png', prompt: `${char(34, 'doctor with wavy brown hair, professional blouse, comfortable expression')} typing into an electronic health record while glancing warmly at a patient out of frame, ${S_MID}` },

  // 12 — 37 anos: consulta moderna com tablet
  { file: 'cena12-ini.png', prompt: `Close-up of gloved hand holding a tablet displaying a clean modern patient dashboard, hospital bed blurred behind, ${S_MID}` },
  { file: 'cena12-fim.png', prompt: `${char(37, 'experienced doctor, wavy brown hair with a few subtle gray strands, white coat')} at a hospital bedside with a tablet, warmly explaining results to an older patient, ${S_MID}` },

  // 13 — 40 anos: telemedicina
  { file: 'cena13-ini.png', prompt: `Home office setup with a laptop showing a clean telemedicine video-call interface, a patient's face visible on screen, soft daylight, notebook with handwritten notes beside, ${S_MID}` },
  { file: 'cena13-fim.png', prompt: `${char(40, 'mature doctor, wavy brown hair with some gray strands, simple professional blouse, stethoscope on desk')} conducting a video consultation from her home office, attentive reassuring smile, ${S_MID}` },

  // 14 — 43 anos: IA auxiliando diagnóstico
  { file: 'cena14-ini.png', prompt: `Dark radiology screen showing an AI-assisted diagnostic overlay highlighting a region in a medical scan, clean futuristic clinical UI, teal accents, ${S_FUT}` },
  { file: 'cena14-fim.png', prompt: `${char(43, 'senior doctor with glasses, wavy brown hair with clear gray streaks, white coat')} observing AI-assisted findings on a modern medical display, thoughtful expression, cool monitor glow, ${S_FUT}` },

  // 15 — presente (~45): hero final médica realizada
  { file: 'cena15-ini.png', prompt: `Clean modern hospital corridor with soft warm-cool gradient light, shallow depth of field, no people, sense of care and possibility, ${S_FUT}` },
  { file: 'cena15-fim.png', prompt: `Heroic cinematic close-up portrait of the same ${BASE}, about 45 years old, wavy brown hair with elegant gray streaks loosely down, crisp white doctor coat with stethoscope, confident warm smile looking slightly upward, soft rim light, blurred medical background, editorial quality, ${S_FUT}` },
];

(async () => {
  const t0 = Date.now();
  console.log(`\n[crianca-medica] Gerando ${scenes.length} imagens em ${OUT}\n`);
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    console.log(`── ${i + 1}/${scenes.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); }
  }
  const wall = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[crianca-medica] ✅ concluído em ${wall}s`);
})();
