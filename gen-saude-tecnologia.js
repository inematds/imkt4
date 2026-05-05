/**
 * 30 imagens — profissional de saúde brasileira (afro-brasileira) e sua jornada
 * de 1985 até o presente, acompanhando a evolução da tecnologia em saúde.
 * Envelhece de ~18 até ~63 anos.
 */

const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');

const MODEL = 'flux2-klein';
const RATIO = '1:1';
const OUT = path.join(__dirname, 'prj/inema/outputs/saude-tecnologia_2026-04-22/imgs');

const BASE = 'Brazilian woman of Afro-Brazilian descent, medium brown skin, natural curly dark hair, warm expressive eyes, attentive compassionate expression';
const S_OLD = 'shot on 35mm film, cinematic grading, warm tungsten light, film grain, slight vignette, no text, no captions, no logos';
const S_MID = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos';
const S_FUT = 'neo-noir clinical lighting, clean glassmorphism, teal and soft cyan accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos';

const char = (age, extra = '') => `${BASE}, about ${age} years old${extra ? ', ' + extra : ''}`;

const scenes = [
  // 1 — 1985: estudante, livros e caderno, zero tela
  { file: 'cena01-ini.png', prompt: `1980s study desk with thick medical textbooks open, anatomical diagrams, handwritten notes, old desk lamp with warm glow, no computer, ${S_OLD}` },
  { file: 'cena01-fim.png', prompt: `${char(18, 'young medical student with natural curly dark hair, simple 80s clothing')} reading a heavy anatomy book at night under a warm desk lamp, focused determined expression, ${S_OLD}` },

  // 2 — 1990: primeiro PC no consultório, prontuário em papel
  { file: 'cena02-ini.png', prompt: `Small 1990s clinic office with a beige CRT computer next to a stack of paper patient folders, wooden desk, pastel walls, clinical nostalgia, ${S_OLD}` },
  { file: 'cena02-fim.png', prompt: `${char(23, 'young doctor, white coat, curly dark hair, stethoscope around neck')} typing tentatively on a beige 1990s PC keyboard beside a paper patient chart, curious and careful, ${S_OLD}` },

  // 3 — 1995: raio-X em negatoscópio + primeira imagem digital
  { file: 'cena03-ini.png', prompt: `Close-up of a medical light box (negatoscópio) displaying a chest X-ray film, small bright clinic room, ${S_OLD}` },
  { file: 'cena03-fim.png', prompt: `${char(28, 'doctor in white coat, curly dark hair pulled back, focused clinical gaze')} comparing a paper X-ray on a light box with the same image newly displayed on a CRT monitor, ${S_OLD}` },

  // 4 — 2000: prontuário eletrônico emergindo
  { file: 'cena04-ini.png', prompt: `Early 2000s clinic workstation with a chunky LCD monitor showing an early electronic health record interface, simple forms, ${S_MID}` },
  { file: 'cena04-fim.png', prompt: `${char(33, 'doctor, curly dark hair, navy scrubs')} typing a patient record into an early electronic system, slight smile at seeing it work, ${S_MID}` },

  // 5 — 2005: cirurgia minimamente invasiva, monitores na sala
  { file: 'cena05-ini.png', prompt: `Modern operating room with laparoscopic surgery screens showing internal video feed, bluish clinical lights, sterile ambient, ${S_MID}` },
  { file: 'cena05-fim.png', prompt: `${char(38, 'surgeon in blue scrubs and surgical cap, focused eyes above a mask')} watching a laparoscopic monitor with steady concentration, ${S_MID}` },

  // 6 — 2008: sistemas de imagem (PACS) em radiologia
  { file: 'cena06-ini.png', prompt: `Radiology reading room with multiple large medical displays showing MRI and CT scan series, dimmed ambient light, ${S_MID}` },
  { file: 'cena06-fim.png', prompt: `${char(41, 'radiologist, white coat, curly dark hair, glasses')} studying CT scan slices across three large medical monitors, careful analytical gaze, ${S_MID}` },

  // 7 — 2012: tablet à beira do leito
  { file: 'cena07-ini.png', prompt: `Close-up of a tablet showing a patient vital signs dashboard held in gloved hands next to a hospital bed, soft natural light, ${S_MID}` },
  { file: 'cena07-fim.png', prompt: `${char(45, 'doctor in white coat, curly dark hair starting to gray')} beside a hospital bed, tablet in hand, speaking warmly with an elderly patient, ${S_MID}` },

  // 8 — 2015: telemedicina
  { file: 'cena08-ini.png', prompt: `Monitor showing a clean telemedicine video-call interface with a patient face in a window, medical notes on the side, ${S_MID}` },
  { file: 'cena08-fim.png', prompt: `${char(48, 'doctor in her home office, curly dark hair graying at temples, simple blouse')} in a video consultation, speaking reassuringly to a patient on screen, ${S_MID}` },

  // 9 — 2017: diagnóstico molecular / genômica
  { file: 'cena09-ini.png', prompt: `Close-up of a laboratory bench with a DNA analysis dashboard glowing on a monitor, abstract helix visualization, ${S_FUT}` },
  { file: 'cena09-fim.png', prompt: `${char(50, 'researcher-doctor, lab coat, curly dark hair salt-and-pepper')} analyzing a molecular diagnostics dashboard, reflective serious expression, cool lab lighting, ${S_FUT}` },

  // 10 — 2019: wearables e monitoramento contínuo
  { file: 'cena10-ini.png', prompt: `Close-up of a smartwatch and a smartphone displaying continuous health monitoring graphs, soft daylight, ${S_MID}` },
  { file: 'cena10-fim.png', prompt: `${char(52, 'doctor reviewing data on a tablet, curly salt-and-pepper hair, warm smile of insight')} holding a tablet showing patient wearable data, modern bright clinic, ${S_MID}` },

  // 11 — 2020: pandemia, telemedicina em massa
  { file: 'cena11-ini.png', prompt: `Home setup with a laptop showing a patient grid of multiple telemedicine calls at once, mask and notebook on desk, somber daylight, ${S_MID}` },
  { file: 'cena11-fim.png', prompt: `${char(53, 'tired but resolute doctor in simple shirt and face mask around her neck, salt-and-pepper hair')} in front of a laptop with telemedicine windows open, quiet determination, ${S_MID}` },

  // 12 — 2022: IA auxiliando diagnóstico radiológico
  { file: 'cena12-ini.png', prompt: `Dark radiology monitor with an AI overlay highlighting a region in a CT scan, confidence scores floating beside, futuristic clinical UI, ${S_FUT}` },
  { file: 'cena12-fim.png', prompt: `${char(55, 'radiologist with glasses, mostly gray curly hair')} observing AI-assisted findings on a medical display, thoughtful expression, cool monitor glow, ${S_FUT}` },

  // 13 — 2024: IA guiando plano de tratamento
  { file: 'cena13-ini.png', prompt: `Modern clinic consultation with a large translucent screen showing AI-generated personalized treatment options side by side, clean futuristic room, ${S_FUT}` },
  { file: 'cena13-fim.png', prompt: `${char(57, 'confident senior doctor with silver-gray curly hair, white coat')} explaining AI-assisted treatment options to a patient using a transparent display, warm expression, ${S_FUT}` },

  // 14 — 2026: ensinando a próxima geração
  { file: 'cena14-ini.png', prompt: `Bright modern training room with a diverse group of young healthcare professionals gathered around a large digital display, notebooks open, ${S_MID}` },
  { file: 'cena14-fim.png', prompt: `${char(59, 'mentor, silver-gray curly hair elegantly natural, warm blazer over scrubs')} guiding a group of diverse young healthcare students, pointing at a digital screen, generous teaching smile, ${S_MID}` },

  // 15 — Hero futuro + fundo para INEMA.CLUB
  { file: 'cena15-ini.png', prompt: `Minimalist futuristic medical space with soft warm-cool gradient light, floating translucent UI panels showing anonymized health data, sense of calm and possibility, ${S_FUT}` },
  { file: 'cena15-fim.png', prompt: `Heroic cinematic close-up portrait of the same ${BASE}, about 62 years old, silver-gray curly natural hair, elegant simple blouse with a stethoscope around her neck, quietly confident proud smile, looking slightly upward, deep blue futuristic background with faint medical UI out of focus, soft rim light, editorial quality, ${S_FUT}` },
];

(async () => {
  const t0 = Date.now();
  console.log(`\n[saude] Gerando ${scenes.length} imagens em ${OUT}\n`);
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    console.log(`── ${i + 1}/${scenes.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); }
  }
  const wall = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[saude] ✅ concluído em ${wall}s`);
})();
