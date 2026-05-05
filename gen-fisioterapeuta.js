/**
 * 30 imagens — jornada de criança (7) até fisioterapeuta experiente (~45)
 * que alivia dor com as mãos e com tecnologia.
 */

const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');

const MODEL = 'flux2-klein';
const RATIO = '1:1';
const OUT = path.join(__dirname, 'prj/inema/videos/fisioterapeuta_2026-04-22/imgs');

const BASE = 'Brazilian woman with warm tan skin, long straight dark brown hair usually pulled back into a practical ponytail, strong caring focused eyes, athletic build, warm practical presence';
const S_OLD = 'shot on 35mm film, cinematic grading, warm tungsten light, film grain, slight vignette, no text, no captions, no logos';
const S_MID = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos';
const S_FUT = 'neo-noir clinical lighting, soft glassmorphism, teal accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos';

const char = (age, extra = '') => `${BASE}, about ${age} years old${extra ? ', ' + extra : ''}`;

const scenes = [
  // 1 — 7 anos: massageando a avó que está com dor
  { file: 'cena01-ini.png', prompt: `Cozy 1980s Brazilian living room, an elderly woman sitting on an armchair rubbing her shoulder as if sore, warm afternoon light, no children visible yet, ${S_OLD}` },
  { file: 'cena01-fim.png', prompt: `${char(7, 'little girl with tanned skin and dark brown hair in a ponytail, simple clothes')} carefully massaging her grandmother's shoulders with small hands, tender focused expression, warm lamp light, ${S_OLD}` },

  // 2 — 10 anos: praticando esporte, entendendo o corpo
  { file: 'cena02-ini.png', prompt: `Early 1990s Brazilian schoolyard with children playing volleyball or running, warm afternoon sun, casual school uniforms, ${S_OLD}` },
  { file: 'cena02-fim.png', prompt: `${char(10, 'child with tanned skin, dark ponytail, school uniform')} stretching her arms athletically before a game, bright confident expression, sunny daylight, ${S_OLD}` },

  // 3 — 14 anos: aula de educação física, curiosa com anatomia
  { file: 'cena03-ini.png', prompt: `Classroom poster of the human muscular system on a school wall, wooden desk in foreground, notebook open, afternoon light through a window, ${S_OLD}` },
  { file: 'cena03-fim.png', prompt: `${char(14, 'teenager with tanned skin, dark brown hair, school outfit')} studying a muscular anatomy poster with fascinated concentrated eyes, pointing at a muscle group, ${S_OLD}` },

  // 4 — 17 anos: ajudando amiga com torção
  { file: 'cena04-ini.png', prompt: `Late 1990s park scene with a twisted ankle bag of ice on a bench, soft dusk natural light, no people in frame, ${S_MID}` },
  { file: 'cena04-fim.png', prompt: `${char(17, 'teenager with tanned skin, dark ponytail, sporty clothes')} gently showing a friend how to stretch her injured ankle, caring instructive smile, outdoor natural light, ${S_MID}` },

  // 5 — 20 anos: entrando na faculdade de fisioterapia
  { file: 'cena05-ini.png', prompt: `University hallway with young students walking, notebooks in hand, morning light through tall windows, ${S_MID}` },
  { file: 'cena05-fim.png', prompt: `${char(20, 'university student, tanned skin, dark ponytail, backpack, practical casual clothing')} standing in front of a physiotherapy department sign, proud determined smile, ${S_MID}` },

  // 6 — 22 anos: estudando anatomia avançada
  { file: 'cena06-ini.png', prompt: `Anatomy study room with a full skeleton model, open anatomy atlas on a table, colored pencils, clean daylight, ${S_MID}` },
  { file: 'cena06-fim.png', prompt: `${char(22, 'physiotherapy student, tanned skin, dark ponytail, lab coat over casual clothing')} pointing at a muscle group on a skeleton model, concentrated studious expression, ${S_MID}` },

  // 7 — 25 anos: primeiro estágio, paciente com dor lombar
  { file: 'cena07-ini.png', prompt: `Small physiotherapy clinic treatment room with a padded exam table, a heating pad and basic equipment visible, soft neutral daylight, ${S_MID}` },
  { file: 'cena07-fim.png', prompt: `${char(25, 'young physio intern, tanned skin, dark ponytail, clinic uniform')} gently guiding a patient lying on an exam table through a low-back stretch with calm reassuring hands, ${S_MID}` },

  // 8 — 28 anos: formada, clínica pequena, atendimento manual
  { file: 'cena08-ini.png', prompt: `Warm cozy physiotherapy office with a rolled yoga mat, a foam roller and a resistance band on a chair, natural morning light, ${S_MID}` },
  { file: 'cena08-fim.png', prompt: `${char(28, 'physiotherapist, tanned skin, dark ponytail, white clinic shirt')} performing a manual shoulder mobilization on a seated patient, focused compassionate expression, ${S_MID}` },

  // 9 — 31 anos: pilates/bola terapêutica
  { file: 'cena09-ini.png', prompt: `A bright pilates studio with reformer machines, a therapy ball, and gymnastic mats, soft daylight, ${S_MID}` },
  { file: 'cena09-fim.png', prompt: `${char(31, 'physiotherapist, tanned skin, dark ponytail')} guiding a patient through a therapy ball balance exercise, warm encouraging smile, ${S_MID}` },

  // 10 — 34 anos: equipamentos eletrônicos (TENS, ultrassom)
  { file: 'cena10-ini.png', prompt: `Close-up of a modern TENS electrical stimulation unit with electrode pads on a padded exam surface, clean clinical setup, ${S_MID}` },
  { file: 'cena10-fim.png', prompt: `${char(34, 'physio professional, tanned skin, dark ponytail with first subtle silver strands')} calmly applying TENS electrodes to a patient's knee, careful attentive expression, ${S_MID}` },

  // 11 — 37 anos: vídeos de exercício para pacientes via celular
  { file: 'cena11-ini.png', prompt: `Close-up of a smartphone playing a short home-exercise video beside a foam roller on a living-room floor, soft daylight, ${S_MID}` },
  { file: 'cena11-fim.png', prompt: `${char(37, 'physiotherapist, tanned skin, dark ponytail with a few silver strands')} filming a short stretch tutorial on a tripod smartphone in her clinic, kind instructional smile, ${S_MID}` },

  // 12 — 40 anos: teleconsulta (pandemia)
  { file: 'cena12-ini.png', prompt: `Home office setup with a laptop showing a video-call physio session, a patient in their living room demonstrating an exercise on screen, soft daylight, ${S_MID}` },
  { file: 'cena12-fim.png', prompt: `${char(40, 'physiotherapist at her home office, tanned skin, dark ponytail with growing silver streaks, simple casual shirt')} guiding a patient through an exercise over a video call, attentive patient smile, ${S_MID}` },

  // 13 — 42 anos: sensores vestíveis / análise de movimento
  { file: 'cena13-ini.png', prompt: `Close-up of wearable motion-capture sensors strapped to a knee, a monitor in the background showing a 3D skeleton motion graph, futuristic clinical UI, teal accents, ${S_FUT}` },
  { file: 'cena13-fim.png', prompt: `${char(42, 'senior physiotherapist, tanned skin, dark ponytail with clear silver streaks, modern clinic uniform')} analyzing a patient's 3D motion capture on a big monitor, reflective analytical expression, ${S_FUT}` },

  // 14 — 44 anos: IA sugerindo protocolo personalizado
  { file: 'cena14-ini.png', prompt: `Clean modern clinic display showing an AI-assisted personalized rehabilitation protocol with progress charts and exercise plan, soft teal UI accents, ${S_FUT}` },
  { file: 'cena14-fim.png', prompt: `${char(44, 'veteran physiotherapist, tanned skin, dark ponytail elegantly streaked with silver')} reviewing an AI-suggested rehabilitation protocol on a tablet, thoughtful experienced face, ${S_FUT}` },

  // 15 — hero + fundo para INEMA.CLUB
  { file: 'cena15-ini.png', prompt: `Bright modern physiotherapy clinic space with pilates equipment and a therapy ball in soft out-of-focus background, warm-cool gradient ambient light, no people, ${S_FUT}` },
  { file: 'cena15-fim.png', prompt: `Heroic cinematic close-up portrait of the same ${BASE}, about 45 years old, dark brown hair with elegant silver streaks in a loose natural ponytail, modern clinic polo or professional top, quietly confident warm smile looking slightly upward, soft rim light, blurred clinic background, editorial quality, ${S_FUT}` },
];

(async () => {
  const t0 = Date.now();
  console.log(`\n[fisioterapeuta] Gerando ${scenes.length} imagens em ${OUT}\n`);
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    console.log(`── ${i + 1}/${scenes.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); }
  }
  console.log(`\n[fisioterapeuta] ✅ concluído em ${((Date.now() - t0) / 1000).toFixed(1)}s`);
})();
