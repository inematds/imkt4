/**
 * Gera:
 *   (A) regera 3 cenas do roteiro "Antes do Futuro" com o menino loiro descendente alemão
 *   (B) 40 imagens do novo roteiro "Eu Vi o Futuro Chegar" (20 cenas x ini+fim)
 *
 * Personagem recorrente: blond German-descendant Brazilian boy/man, fair skin,
 * light freckles, blue eyes, tousled light blond hair, thoughtful expression.
 * Envelhece ao longo das 20 cenas (~7 -> ~40 anos).
 */

const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');

const MODEL = 'flux2-klein';
const RATIO = '1:1';

const OUT_OLD = path.join(__dirname, 'prj/inema/outputs/antes-do-futuro_2026-04-22/imgs');
const OUT_NEW = path.join(__dirname, 'prj/inema/outputs/eu-vi-o-futuro-chegar_2026-04-22/imgs');

const CHAR = 'blond German-descendant Brazilian, fair skin with light freckles, blue eyes, tousled light blond hair, thoughtful expression';
const S_OLD = 'shot on 35mm film, cinematic grading, directional tungsten light, deep shadows, film grain, slight vignette, no text, no captions, no logos';
const S_MID = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos';
const S_FUT = 'neo-noir lighting, glassmorphism, teal and blue accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos';

// (A) regera 3 cenas da série anterior ----------------------------------------
const regen = [
  {
    file: path.join(OUT_OLD, 'cena02-ini.png'),
    prompt: `Wide shot of a young ${CHAR}, about 14 years old, alone in a 1990s bedroom, sitting at a wooden desk with a beige CRT computer monitor glowing, posters on the wall, cassette tapes, cable clutter, dim yellow desk lamp, introspective atmosphere, ${S_OLD}`,
  },
  {
    file: path.join(OUT_OLD, 'cena02-fim.png'),
    prompt: `Close-up portrait of a ${CHAR}, about 14 years old, face illuminated by the green-blue glow of an old CRT monitor, reflective blue eyes full of focus and curiosity, subtle smirk, room dark around him, shallow depth of field, ${S_OLD}`,
  },
  {
    file: path.join(OUT_OLD, 'cena03-fim.png'),
    prompt: `Close-up macro of a monochrome green phosphor CRT screen filled with raw BASIC-era computer code lines, reflection of a young ${CHAR} hands typing on a beige mechanical keyboard, nostalgic solitude, ${S_OLD}`,
  },
];

// (B) 20 cenas novas ----------------------------------------------------------
const novo = [
  // 1 — TV antiga com chiado, criança olhando
  { file: 'cena01-ini.png', prompt: `Old tube television from the 1980s switched on in a modest humble living room at night, pure white static noise on the curved screen, faint hum, soft glow illuminating the dark room, nobody in frame yet, ${S_OLD}` },
  { file: 'cena01-fim.png', prompt: `A ${CHAR} child about 7 years old sitting very close to the screen of an old 1980s tube television, face bathed in the flickering white light of TV static, wide mesmerized blue eyes, pajamas, dark room, ${S_OLD}` },

  // 2 — Close rosto refletido na TV
  { file: 'cena02-ini.png', prompt: `Extreme close-up of an old curved CRT television glass reflecting the blurred face of a blond child, static light patterns across the reflection, hypnotic, ${S_OLD}` },
  { file: 'cena02-fim.png', prompt: `Macro shot of the blue eye of a ${CHAR} child, pupil dilated, reflection of CRT television static light dancing inside the iris, pure focus, ${S_OLD}` },

  // 3 — Primeiro computador, tela verde
  { file: 'cena03-ini.png', prompt: `A ${CHAR} preteen about 11 years old sitting at a wooden desk facing an old 1990s beige personal computer with a green phosphor monitor, modest bedroom, cassette tapes and books around, dim lamp light, ${S_OLD}` },
  { file: 'cena03-fim.png', prompt: `Close-up of small hands of a blond preteen typing on a beige mechanical keyboard, green monochrome screen visible showing BASIC commands and a blinking cursor, ${S_OLD}` },

  // 4 — Código simples, testando, errando
  { file: 'cena04-ini.png', prompt: `Close-up of a monochrome green phosphor CRT screen filled with BASIC code lines, a SYNTAX ERROR message highlighted, cursor blinking, nostalgic feel, ${S_OLD}` },
  { file: 'cena04-fim.png', prompt: `Close-up portrait of a ${CHAR} about 12 years old, face lit by a bluish-green monitor glow, brow slightly furrowed in concentration, trace of a hopeful smile, room dark, ${S_OLD}` },

  // 5 — Pessoas desacreditando, ele vê futuro
  { file: 'cena05-ini.png', prompt: `Modest 1990s Brazilian living room, a few middle-aged adults sitting on a couch chatting and glancing sideways with subtle skepticism, in the background a ${CHAR} boy around 13 is absorbed alone at a computer corner, warm tungsten light, documentary feel, ${S_OLD}` },
  { file: 'cena05-fim.png', prompt: `Portrait of a ${CHAR} teenager about 13 years old, looking out of a window toward a golden sunset, determined expression, soft backlight, quiet resolve, ${S_OLD}` },

  // 6 — Internet discada
  { file: 'cena06-ini.png', prompt: `Close-up of a 1990s beige dial-up modem on a desk, LED lights blinking in sequence, tangled phone cable, out-of-focus monitor glow behind, evocative of waiting, ${S_OLD}` },
  { file: 'cena06-fim.png', prompt: `A ${CHAR} teenager about 15 years old wearing bulky headphones, sitting before a CRT monitor with a loading progress bar, face illuminated by screen glow, expression of anxious anticipation, ${S_OLD}` },

  // 7 — Páginas web simples
  { file: 'cena07-ini.png', prompt: `CRT monitor showing a rudimentary late-90s HTML web page with blue underlined links, animated gif icons, gray background, pixelated feel, ${S_OLD}` },
  { file: 'cena07-fim.png', prompt: `A ${CHAR} teenager about 16 years old leaning toward a CRT monitor, face lit with a discovering smile while exploring the early internet, late-90s bedroom around him, ${S_OLD}` },

  // 8 — Ensinando em sala simples
  { file: 'cena08-ini.png', prompt: `Humble Brazilian community classroom at the early 2000s, rows of old desktop computers, diverse students of different ages sitting attentively, chalkboard with simple computer diagrams, natural light from windows, ${S_MID}` },
  { file: 'cena08-fim.png', prompt: `A ${CHAR} young man about 20 years old standing at the front of a classroom, gesturing while teaching, charismatic and warm expression, attentive students in foreground blurred, ${S_MID}` },

  // 9 — Evolução de computadores
  { file: 'cena09-ini.png', prompt: `Still-life composition of a bulky 1990s beige CRT monitor next to a colorful translucent early-2000s all-in-one computer, clean studio lighting, generational contrast, ${S_MID}` },
  { file: 'cena09-fim.png', prompt: `Row of sleek modern thin laptops aligned on a white clean minimalist desk, soft daylight, editorial product photography, ${S_MID}` },

  // 10 — Banda larga / fibra
  { file: 'cena10-ini.png', prompt: `Macro close-up of fiber optic cables with glowing blue light streaming through strands, dark background, technological beauty, ${S_MID}` },
  { file: 'cena10-fim.png', prompt: `A ${CHAR} young man about 25 years old smiling confidently at a laptop screen showing a fast download in progress, modern apartment, warm ambient light, ${S_MID}` },

  // 11 — Redes sociais surgindo
  { file: 'cena11-ini.png', prompt: `Stylized close-up of a laptop screen layered with translucent UI windows suggesting evolving social networks, abstract feeds, friend requests, no real logos, saturated colors, ${S_MID}` },
  { file: 'cena11-fim.png', prompt: `A ${CHAR} man about 28 years old holding a smartphone close, creating content, focused expression, modern cafe or home-office blurred behind, ${S_MID}` },

  // 12 — Pessoas conectadas globalmente
  { file: 'cena12-ini.png', prompt: `Stylized translucent globe of the earth with glowing network lines connecting continents, soft blue and white palette, floating in dark space, ${S_MID}` },
  { file: 'cena12-fim.png', prompt: `Grid of diverse faces from around the world on a video call interface, each person smiling or speaking, warm light, global connection feeling, ${S_MID}` },

  // 13 — Servidores / VPS / cloud
  { file: 'cena13-ini.png', prompt: `Long corridor of a modern data center, tall server racks glowing with blue LED lights, reflective floor, atmospheric haze, wide shot, ${S_FUT}` },
  { file: 'cena13-fim.png', prompt: `A ${CHAR} man about 32 years old sitting at a desk with multiple monitors showing terminal windows and server dashboards, focused expression, cool blue light on his face, ${S_FUT}` },

  // 14 — Cloud computing, deploy
  { file: 'cena14-ini.png', prompt: `Modern cloud dashboard UI with abstract metrics, charts and deployment pipeline diagrams glowing on a dark screen, clean and technical, ${S_FUT}` },
  { file: 'cena14-fim.png', prompt: `A ${CHAR} man about 33 years old smiling quietly as a success confirmation appears on his monitor, soft office light, satisfaction and freedom in his expression, ${S_MID}` },

  // 15 — Criptomoedas / blockchain
  { file: 'cena15-ini.png', prompt: `Close-up of a dark monitor showing abstract cryptocurrency candlestick charts in teal and orange, digital wallet interface in one corner, clean futuristic UI, ${S_FUT}` },
  { file: 'cena15-fim.png', prompt: `A ${CHAR} man about 35 years old analyzing multiple screens filled with charts, serious and thoughtful expression, face lit by cool monitor glow, night office, ${S_FUT}` },

  // 16 — Automação n8n / Make
  { file: 'cena16-ini.png', prompt: `Screenshot-like view of a workflow automation canvas with connected nodes and flowing data lines, abstract and futuristic, soft glow between nodes, ${S_FUT}` },
  { file: 'cena16-fim.png', prompt: `A ${CHAR} man about 37 years old with hands on a keyboard, eyes scanning a large monitor showing a complex automation workflow, satisfied focus, modern workspace, ${S_MID}` },

  // 17 — Explosão de conteúdo
  { file: 'cena17-ini.png', prompt: `Stylized chaotic composition of text blocks, images, and video thumbnails exploding outward from a central point, overwhelming abundance of digital content, vibrant, ${S_MID}` },
  { file: 'cena17-fim.png', prompt: `A ${CHAR} man about 38 years old working across multiple open windows on a wide monitor, rapid creation energy, slight motion blur on hands, intense creative flow, ${S_MID}` },

  // 18 — IA surgindo
  { file: 'cena18-ini.png', prompt: `Clean modern AI chat interface on a dark glass surface, a prompt just typed glowing softly, floating holographic UI elements, minimalist, ${S_FUT}` },
  { file: 'cena18-fim.png', prompt: `A ${CHAR} man about 40 years old typing a prompt, eyes widening with discovery as AI-generated results appear, face softly lit by monitor, sense of revelation, ${S_FUT}` },

  // 19 — Vibe CODE futurista
  { file: 'cena19-ini.png', prompt: `Futuristic clean workspace, glass desk, integrated holographic panels floating around, glassmorphism UI, teal ambient light, sense of power and calm, ${S_FUT}` },
  { file: 'cena19-fim.png', prompt: `A ${CHAR} mature man about 42 years old standing at the center of a futuristic workspace, interacting with floating holographic systems with confident gestures, commanding presence, cinematic wide shot, ${S_FUT}` },

  // 20 — Tela limpa, hero loop
  { file: 'cena20-ini.png', prompt: `Vast minimalist futuristic space with a soft gradient of warm-to-cool light, subtle particles floating, empty composition with strong negative space for hero text, ${S_FUT}` },
  { file: 'cena20-fim.png', prompt: `Heroic portrait of a ${CHAR} man about 42 years old, facing forward into a luminous horizon, confident look of builder and visionary, cool-warm gradient light, cinematic wide shot, ${S_FUT}` },
];

(async () => {
  const t0 = Date.now();
  console.log(`\n[eu-vi-o-futuro] Regerando ${regen.length} imagens do vídeo anterior + gerando ${novo.length} do novo.\n`);

  // (A) regens
  for (let i = 0; i < regen.length; i += 1) {
    const s = regen[i];
    console.log(`\n── regen ${i + 1}/${regen.length} ── ${path.basename(s.file)}`);
    try { await generateImage(s.file, s.prompt, MODEL, RATIO); }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); }
  }

  // (B) novo roteiro
  for (let i = 0; i < novo.length; i += 1) {
    const s = novo[i];
    const out = path.join(OUT_NEW, s.file);
    console.log(`\n── novo ${i + 1}/${novo.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); }
  }

  const wall = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[eu-vi-o-futuro] ✅ concluído em ${wall}s`);
  console.log(`  regens -> ${OUT_OLD}`);
  console.log(`  novo   -> ${OUT_NEW}`);
})();
