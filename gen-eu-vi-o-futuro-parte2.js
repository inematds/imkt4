/**
 * Parte 2 de "Eu Vi o Futuro Chegar": 10 cenas novas (ini+fim) = 20 imagens.
 * Tópicos: n8n, IA imagens, IA vídeo, Claude Code, VIBE CODE.
 * Personagem envelhece de ~45 até ~65 anos, terminando no look da referência:
 * cap escuro, óculos de grau, barba grisalha completa, camiseta escura.
 */

const path = require('path');
const { generateImage } = require('./pipeline/generate-image-inemaimg');

const MODEL = 'flux2-klein';
const RATIO = '1:1';
const OUT = path.join(__dirname, 'prj/inema/outputs/eu-vi-o-futuro-chegar_2026-04-22/imgs');

// Base do personagem e estilo
const CHAR_BASE = 'blond German-descendant Brazilian man, fair skin with light freckles, blue eyes';
const S_MID = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos';
const S_FUT = 'neo-noir lighting, glassmorphism, teal and blue accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos';

// Idades progressivas + estágios da aparência
const AGE_45 = `${CHAR_BASE}, about 45 years old, short tidy beard starting to show salt-and-pepper, hair slightly shorter, thoughtful confident expression`;
const AGE_48 = `${CHAR_BASE}, about 48 years old, salt-and-pepper trimmed beard, short hair, experienced focused look`;
const AGE_52 = `${CHAR_BASE}, about 52 years old, mostly gray trimmed beard, hair graying, intense focused eyes`;
const AGE_55 = `${CHAR_BASE}, about 55 years old, mostly gray well-groomed beard, thin black-framed rectangular glasses, dark t-shirt, contemplative gaze`;
const AGE_58 = `${CHAR_BASE}, about 58 years old, full gray well-groomed beard, black-framed rectangular glasses, dark navy baseball cap, dark t-shirt, intense thoughtful expression`;
const AGE_62 = `${CHAR_BASE}, about 62 years old, full silver-gray well-groomed beard, black-framed rectangular glasses, dark navy baseball cap worn low, dark t-shirt, wise serene expression`;

const scenes = [
  // 21 — n8n intro
  { file: 'cena21-ini.png', prompt: `Wide monitor filling the frame showing an abstract workflow automation canvas with colorful connected nodes and flowing data lines, suggestion of an n8n-like visual pipeline, soft ambient glow, no logos, ${S_FUT}` },
  { file: 'cena21-fim.png', prompt: `${AGE_45} sitting at a modern desk with a large ultrawide monitor displaying a complex node-based automation workflow, hands on keyboard, soft desk light, concentrated focus, ${S_MID}` },

  // 22 — n8n mastery (expandido)
  { file: 'cena22-ini.png', prompt: `Extreme close-up of a node-based automation editor with dozens of interconnected colorful nodes flowing, data lines animating softly, dark UI, teal accents, ${S_FUT}` },
  { file: 'cena22-fim.png', prompt: `${AGE_48} leaning back slightly in his chair with a satisfied smile, in front of two monitors showing automations running, arms crossed confidently, warm ambient office light mixing with blue screen glow, ${S_MID}` },

  // 23 — IA imagens
  { file: 'cena23-ini.png', prompt: `Stylized visualization of an AI image generator: a grid of four photorealistic generated portraits morphing on a dark screen, soft glow between panels, clean futuristic UI, ${S_FUT}` },
  { file: 'cena23-fim.png', prompt: `${AGE_52} watching an AI image interface as a portrait finishes generating on his monitor, hand lightly resting on his beard in contemplation, cool monitor light on his face, ${S_FUT}` },

  // 24 — IA vídeo
  { file: 'cena24-ini.png', prompt: `Stylized view of an AI video generator interface: a timeline with moving AI-generated video clips, thumbnails rendering in sequence, dark futuristic UI, teal highlights, ${S_FUT}` },
  { file: 'cena24-fim.png', prompt: `${AGE_55} watching an AI-generated video play on his monitor, black-framed glasses reflecting the screen light, trimmed gray beard, expression of quiet amazement, ${S_FUT}` },

  // 25 — IA imagens + vídeo em massa
  { file: 'cena25-ini.png', prompt: `Stylized composition of dozens of AI-generated images and video frames tiling across multiple floating holographic panels, vibrant visual abundance, dark background, ${S_FUT}` },
  { file: 'cena25-fim.png', prompt: `${AGE_55} orchestrating multiple screens filled with generated images and video thumbnails, hands gesturing between holographic panels, creative command center feel, ${S_FUT}` },

  // 26 — Claude Code (terminal moderno)
  { file: 'cena26-ini.png', prompt: `Elegant dark terminal interface on a glossy modern monitor, lines of code being written autonomously with a glowing cursor, subtle AI activity indicators, soft teal glow, futuristic minimal, ${S_FUT}` },
  { file: 'cena26-fim.png', prompt: `${AGE_58} in front of a dark terminal with code streaming, black-framed glasses catching the screen reflection, dark navy baseball cap, full gray beard, focused intensity, dark background, ${S_FUT}` },

  // 27 — Claude Code build
  { file: 'cena27-ini.png', prompt: `Close-up of a terminal panel with code generating at high speed, file tree visible on the side, subtle AI presence, teal accents, cinematic dark monitor aesthetic, ${S_FUT}` },
  { file: 'cena27-fim.png', prompt: `${AGE_58} slight smile watching an AI coding assistant complete a task in seconds, relaxed posture, dark navy baseball cap, gray beard, glasses, dark t-shirt, dim cool-lit studio, ${S_FUT}` },

  // 28 — VIBE CODE intro (ambiente integrado)
  { file: 'cena28-ini.png', prompt: `Futuristic minimalist workspace with multiple floating holographic panels showing code, diagrams, images and videos flowing together seamlessly, glass surfaces, atmospheric teal light, sense of effortless creation, ${S_FUT}` },
  { file: 'cena28-fim.png', prompt: `${AGE_62} standing at the center of a futuristic workspace with holographic panels around him, gesturing gently, cap, glasses, silver beard, confident commanding presence, ${S_FUT}` },

  // 29 — VIBE CODE flow
  { file: 'cena29-ini.png', prompt: `Cinematic wide shot of holographic systems, videos, code panels and AI outputs flowing in a synchronized choreography through the air, soft particles, deep teal palette, sense of mastery, ${S_FUT}` },
  { file: 'cena29-fim.png', prompt: `${AGE_62} in dark t-shirt and dark navy baseball cap, full gray beard, glasses, quiet confident smile as systems flow around him, cool ambient blue light, ${S_FUT}` },

  // 30 — Heroic close, igual à referência
  { file: 'cena30-ini.png', prompt: `Cinematic dark environment with out-of-focus code panels glowing faintly in the deep blue background, moody atmospheric negative space on the left, ${S_FUT}` },
  { file: 'cena30-fim.png', prompt: `Heroic cinematic close-up portrait of a ${CHAR_BASE}, about 62 years old, dark navy baseball cap worn low, black-framed rectangular glasses, full well-groomed silver-gray beard, dark navy t-shirt, serious intense contemplative expression looking into the camera, deep blue shadowy background with faint code panels out of focus, strong side rim light, professional editorial portrait, ${S_FUT}` },
];

(async () => {
  const t0 = Date.now();
  console.log(`\n[parte 2] Gerando ${scenes.length} imagens em ${OUT}\n`);
  for (let i = 0; i < scenes.length; i += 1) {
    const s = scenes[i];
    const out = path.join(OUT, s.file);
    console.log(`\n── ${i + 1}/${scenes.length} ── ${s.file}`);
    try { await generateImage(out, s.prompt, MODEL, RATIO); }
    catch (e) { console.error(`❌ ${s.file}: ${e.message}`); }
  }
  const wall = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[parte 2] ✅ concluído em ${wall}s`);
})();
