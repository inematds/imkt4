/**
 * Gera imagens inicial + final para cada cena do roteiro "Antes do Futuro" (60s).
 * Usa inemaimg (flux2-klein, fast, 1:1). Sem texto embutido nas imagens.
 * Estilo: 35mm film (80s/90s) → neo-noir / glassmorphism (moderno/futurista).
 */

const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');

const OUT_DIR = path.join(__dirname, 'prj/inema/outputs/antes-do-futuro_2026-04-22/imgs');
const MODEL = 'flux2-klein';
const RATIO = '1:1';

const BASE_STYLE_OLD = 'shot on 35mm film, cinematic grading, directional light, warm tungsten highlights, deep shadows, grain, slight vignette, no text, no captions, no typography, no logos';
const BASE_STYLE_MODERN = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no typography, no logos';
const BASE_STYLE_FUTURE = 'neo-noir lighting, glassmorphism, teal and blue accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no typography, no logos';

const scenes = [
  // Cena 1 — Tela preta / estática
  {
    file: 'cena01-ini.png',
    prompt: `Pure black screen with dense CRT television static noise, faint scan lines, subtle analog interference, soft blue glow barely visible in the corner, sense of forgotten signal, ${BASE_STYLE_OLD}`,
  },
  {
    file: 'cena01-fim.png',
    prompt: `Dark void with emerging faint radial glow in the center, trace of TV static dissolving, subtle lens flare hinting at something about to appear, cinematic transition frame, ${BASE_STYLE_OLD}`,
  },

  // Cena 2 — Jovem anos 80/90 no computador antigo
  {
    file: 'cena02-ini.png',
    prompt: `Wide shot of a teenage boy alone in a 1990s bedroom, sitting at a wooden desk with a beige CRT computer monitor glowing, posters on the wall, cassette tapes, cable clutter, dim yellow desk lamp, introspective atmosphere, ${BASE_STYLE_OLD}`,
  },
  {
    file: 'cena02-fim.png',
    prompt: `Close-up portrait of a young man's face illuminated by the green-blue glow of an old CRT monitor, reflective eyes full of focus and curiosity, subtle smirk, room dark around him, shallow depth of field, ${BASE_STYLE_OLD}`,
  },

  // Cena 3 — Pessoas desacreditando / códigos antigos
  {
    file: 'cena03-ini.png',
    prompt: `Group of skeptical middle-aged adults in a modest 1990s living room, giving subtle disapproving glances and faint smirks toward something off-frame, period clothing, warm but judgmental atmosphere, documentary feel, ${BASE_STYLE_OLD}`,
  },
  {
    file: 'cena03-fim.png',
    prompt: `Close-up macro shot of a monochrome green phosphor CRT screen filled with raw BASIC-era computer code lines, reflection of young hands typing on a beige mechanical keyboard, nostalgic solitude, ${BASE_STYLE_OLD}`,
  },

  // Cena 4 — Montagem: aulas, palestras, redes, pessoas aprendendo
  {
    file: 'cena04-ini.png',
    prompt: `Early 2000s Brazilian community classroom with a diverse group of young students and adults learning computers together, humble environment, chalkboard with basic computing diagrams, natural window light, hopeful atmosphere, documentary photography, ${BASE_STYLE_MODERN}`,
  },
  {
    file: 'cena04-fim.png',
    prompt: `Wide shot of a packed auditorium during a tech lecture, speaker gesturing on stage in front of a large projected screen showing growing network nodes, audience silhouettes engaged, warm stage light contrasting cool projector glow, sense of momentum and scale, ${BASE_STYLE_MODERN}`,
  },

  // Cena 5 — Close em rostos diversos / "+100 mil pessoas"
  {
    file: 'cena05-ini.png',
    prompt: `Emotional close-up portrait of a middle-aged Brazilian woman with tears of pride and joy, diverse background, soft golden natural light, shallow depth of field, deeply human moment, ${BASE_STYLE_MODERN}`,
  },
  {
    file: 'cena05-fim.png',
    prompt: `Composite portrait mosaic feel: four diverse Brazilian faces side by side — young Black man smiling proudly, elderly woman with hopeful eyes, teenage girl with quiet confidence, middle-aged man looking forward — each lit with warm cinematic light, editorial poster style, ${BASE_STYLE_MODERN}`,
  },

  // Cena 6 — Pessoas criando, trabalhando, evoluindo
  {
    file: 'cena06-ini.png',
    prompt: `Group of diverse young Brazilian professionals working together in a bright modern coworking space, hands on laptops, animated conversation, visible creativity and purpose, soft daylight through large windows, ${BASE_STYLE_MODERN}`,
  },
  {
    file: 'cena06-fim.png',
    prompt: `Intimate scene of an older mentor leaning over to guide a younger student in front of a laptop, pointing at the screen, both smiling softly, warm ambient light, sense of knowledge being passed forward, ${BASE_STYLE_MODERN}`,
  },

  // Cena 7 — Transição para IA e interfaces futuristas
  {
    file: 'cena07-ini.png',
    prompt: `Close-up of human hands interacting with a translucent holographic AI interface floating above a glass desk, soft teal and blue glow, data points and geometric UI elements hovering, shallow depth of field, ${BASE_STYLE_FUTURE}`,
  },
  {
    file: 'cena07-fim.png',
    prompt: `Futuristic urban scene at dusk, silhouette of a person walking through a corridor of glass panels displaying abstract AI visualizations, volumetric blue light, reflections on wet floor, cinematic wide shot, ${BASE_STYLE_FUTURE}`,
  },

  // Cena 8 — Tela limpa futurista / "Você vai assistir ou construir?"
  {
    file: 'cena08-ini.png',
    prompt: `Minimalist futuristic architectural space with a large empty glass wall glowing softly from within, clean geometric lines, cool blue ambient light, sense of openness and possibility, no people, ${BASE_STYLE_FUTURE}`,
  },
  {
    file: 'cena08-fim.png',
    prompt: `Powerful hero shot: silhouette of a single person standing at the edge of a luminous horizon, vast open futuristic landscape ahead, warm-cool gradient sky, atmospheric haze, cinematic wide shot conveying choice and determination, ${BASE_STYLE_FUTURE}`,
  },
];

(async () => {
  const t0 = Date.now();
  console.log(`\n[antes-do-futuro] Gerando ${scenes.length} imagens em ${OUT_DIR}\n`);
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT_DIR, s.file);
    console.log(`\n── ${i + 1}/${scenes.length} ── ${s.file}`);
    try {
      await generateImage(out, s.prompt, MODEL, RATIO);
    } catch (e) {
      console.error(`❌ ${s.file}: ${e.message}`);
    }
  }
  const wall = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[antes-do-futuro] ✅ concluído em ${wall}s — pasta: ${OUT_DIR}\n`);
})();
