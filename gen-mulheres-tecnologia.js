/**
 * 30 imagens (15 cenas x ini+fim) — menina que cresce com a tecnologia desde os anos 80.
 * Personagem: mulher brasileira de descendência mediterrânea, pele cálida, cabelo escuro
 * ondulado (vai grisalhando), olhos castanhos expressivos, determinada.
 * Envelhece de ~8 (1983) até ~55 (presente/futuro).
 */

const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');

const MODEL = 'flux2-klein';
const RATIO = '1:1';
const OUT = path.join(__dirname, 'prj/inema/outputs/mulheres-tecnologia_2026-04-22/imgs');

const BASE = 'Brazilian woman of Mediterranean descent, warm olive skin, long wavy dark hair, expressive brown eyes, determined thoughtful expression';
const S_OLD = 'shot on 35mm film, cinematic grading, warm tungsten light, film grain, slight vignette, no text, no captions, no logos';
const S_MID = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos';
const S_FUT = 'neo-noir lighting, glassmorphism, teal accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos';

const char = (age, extra = '') => `${BASE}, about ${age} years old${extra ? ', ' + extra : ''}`;

const scenes = [
  // 1 — 1983: menina descobrindo a TV/Atari
  { file: 'cena01-ini.png', prompt: `1980s modest Brazilian living room with an old tube television showing a flickering video game image, Atari-style joystick on the carpet, warm lamp light, nobody in frame yet, ${S_OLD}` },
  { file: 'cena01-fim.png', prompt: `An 8-year-old ${BASE.replace('warm olive','fair olive')} girl with long dark wavy hair, sitting on the carpet of a 1980s living room playing with an Atari-style joystick, eyes wide focused on the TV screen glow, ${S_OLD}` },

  // 2 — 1987: primeiro computador pessoal
  { file: 'cena02-ini.png', prompt: `A beige 1980s personal computer with monochrome CRT monitor on a wooden desk, floppy disks stacked nearby, soft desk lamp light, late-80s bedroom aesthetic, ${S_OLD}` },
  { file: 'cena02-fim.png', prompt: `A 12-year-old version of the ${BASE} girl with long dark hair, sitting on a chair in front of a beige 1980s CRT computer, small hands typing on a mechanical keyboard, face softly illuminated by the monochrome screen, curious concentrated smile, ${S_OLD}` },

  // 3 — 1991: adolescente programando
  { file: 'cena03-ini.png', prompt: `Close-up of a monochrome green CRT monitor with DOS prompt and BASIC code lines, a notebook with handwritten code beside the keyboard, warm lamp light, ${S_OLD}` },
  { file: 'cena03-fim.png', prompt: `${char(16, 'teenager with long dark wavy hair tied loosely, early 1990s fashion')} typing on a CRT computer at night in her bedroom, concentrated frown of focus, monitor glow on her face, ${S_OLD}` },

  // 4 — 1995: universidade, internet discada
  { file: 'cena04-ini.png', prompt: `Mid-1990s university computer lab with rows of beige desktop computers and bulky CRT monitors, fluorescent ceiling light, a few students blurred in background, ${S_OLD}` },
  { file: 'cena04-fim.png', prompt: `${char(20, 'university student, long dark wavy hair, casual 90s clothing, backpack beside her')}, sitting at a university lab computer, face lit by monitor glow, intrigued as a web page loads through dial-up, ${S_OLD}` },

  // 5 — 1999: primeira experiência profissional em tech
  { file: 'cena05-ini.png', prompt: `Late-1990s small tech office, cubicles with CRT monitors, mostly men at desks in background out of focus, soft fluorescent light, ${S_MID}` },
  { file: 'cena05-fim.png', prompt: `${char(24, 'young professional woman, dark wavy hair, smart casual office attire from late 90s, serious determined expression')} at a desk among a team of men in an office, quiet resolve, ${S_MID}` },

  // 6 — 2003: desenvolvedora web, confiança crescente
  { file: 'cena06-ini.png', prompt: `Early 2000s flat-panel LCD monitor showing HTML code and a simple web layout, modern desk setup, ${S_MID}` },
  { file: 'cena06-fim.png', prompt: `${char(28, 'focused developer, dark wavy hair, simple shirt, slight smile of pride')} coding on a modern desktop in a bright office, colleagues in the background, ${S_MID}` },

  // 7 — 2007: primeiro smartphone e mentoria
  { file: 'cena07-ini.png', prompt: `Close-up of a hand holding an early 2007-era touchscreen smartphone, a few colorful icons on screen, outdoor natural light, ${S_MID}` },
  { file: 'cena07-fim.png', prompt: `${char(32, 'smart casual, dark wavy hair, glasses perched on her head')} showing a smartphone to a younger woman, both smiling, outdoor cafe light, mentorship feeling, ${S_MID}` },

  // 8 — 2010: liderança em TI
  { file: 'cena08-ini.png', prompt: `Modern meeting room with a wall of monitors showing dashboards and system architecture diagrams, clean corporate tech aesthetic, ${S_MID}` },
  { file: 'cena08-fim.png', prompt: `${char(35, 'confident leader, dark wavy hair loosely tied, sharp blazer')} standing beside a whiteboard explaining architecture to a mixed team, warm leadership posture, ${S_MID}` },

  // 9 — 2013: hackerspace, ensinando crianças a programar
  { file: 'cena09-ini.png', prompt: `Community hackerspace with laptops open around a big wooden table, colorful wires, maker projects on the walls, warm lights, ${S_MID}` },
  { file: 'cena09-fim.png', prompt: `${char(38, 'warm teacher energy, dark hair with the first silver strands, hoodie')} leaning over a laptop next to a young girl, both smiling at code on the screen, ${S_MID}` },

  // 10 — 2016: cloud engineer
  { file: 'cena10-ini.png', prompt: `Modern control-room style workstation with multiple dark monitors showing cloud infrastructure dashboards and terminal windows, cool ambient light, ${S_MID}` },
  { file: 'cena10-fim.png', prompt: `${char(41, 'architect, dark hair with streaks of silver pulled back, quiet focus')} at a multi-monitor cloud engineering setup, hands on keyboard, confident professional, ${S_FUT}` },

  // 11 — 2019: palestrante em conferência
  { file: 'cena11-ini.png', prompt: `Tech conference stage with a large screen behind, audience silhouettes in darkened auditorium, spotlight on empty stage, ${S_MID}` },
  { file: 'cena11-fim.png', prompt: `${char(44, 'speaker on stage, dark hair with silver streaks, blazer, headset microphone')}, confident mid-speech pose in front of a large screen, silhouetted audience visible, ${S_MID}` },

  // 12 — 2022: machine learning / IA
  { file: 'cena12-ini.png', prompt: `Stylized close-up of a modern AI model training dashboard on a dark monitor, abstract charts and neural network diagram, teal accents, ${S_FUT}` },
  { file: 'cena12-fim.png', prompt: `${char(47, 'senior AI engineer, mostly gray wavy hair, glasses')} analyzing training graphs on a dark monitor, reflective expression, cool monitor light on her face, ${S_FUT}` },

  // 13 — 2024: ensinando IA a outras mulheres
  { file: 'cena13-ini.png', prompt: `Bright modern workshop space with women of diverse ages sitting with laptops, engaged and smiling, soft daylight through large windows, ${S_MID}` },
  { file: 'cena13-fim.png', prompt: `${char(49, 'teacher, mostly gray wavy hair, warm expressive smile, casual professional')} guiding a group of diverse women around a laptop, collaborative atmosphere, ${S_MID}` },

  // 14 — 2026: líder de comunidade tech feminina
  { file: 'cena14-ini.png', prompt: `Group photo energy — a diverse circle of Brazilian women of various ages gathered in a bright coworking space, laughing and talking, warm light, ${S_MID}` },
  { file: 'cena14-fim.png', prompt: `${char(51, 'community leader, silver-gray wavy hair, confident warm smile, casual blazer')} standing in the middle of a group of diverse women, genuine joyful leadership, ${S_MID}` },

  // 15 — futuro: inspirando a próxima geração + hero final
  { file: 'cena15-ini.png', prompt: `Minimalist futuristic space with soft gradient light from warm to cool, floating translucent UI panels, sense of openness and possibility, no people, ${S_FUT}` },
  { file: 'cena15-fim.png', prompt: `Heroic cinematic close-up portrait of the same ${BASE}, about 55 years old, full silver-gray wavy hair elegantly loose, subtle makeup, black blazer, quietly confident smile, looking slightly upward, soft rim light on hair, deep blue futuristic background with faint holographic UI out of focus, editorial quality, ${S_FUT}` },
];

(async () => {
  const t0 = Date.now();
  console.log(`\n[mulheres] Gerando ${scenes.length} imagens em ${OUT}\n`);
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    console.log(`── ${i + 1}/${scenes.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); }
  }
  const wall = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[mulheres] ✅ concluído em ${wall}s`);
})();
