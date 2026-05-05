/**
 * Render Carousels — c0096-mudanca_paradigma_jarvis_llm
 * Campanha: O Fim do If/Else — O Paradigma Jarvis
 * 5 slides 1080×1080, dark-tech, cinematic
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname);
const CAMPAIGN = 'c0096-mudanca_paradigma_jarvis_llm';
const IMGS_DIR = path.join(BASE, `prj/inema/outputs/${CAMPAIGN}/imgs`);
const ADS_DIR  = path.join(BASE, `prj/inema/outputs/${CAMPAIGN}/ads`);

if (!fs.existsSync(ADS_DIR)) fs.mkdirSync(ADS_DIR, { recursive: true });

function imgPath(n) {
  const num = String(n).padStart(2, '0');
  return path.join(IMGS_DIR, `${CAMPAIGN}_generated_${num}_carousel_1080x1080.jpg`);
}

function fileUrl(p) { return 'file://' + p; }

// Brand colors
const C = {
  bg:       '#0D0D0D',
  bg2:      '#1A1A2E',
  blue:     '#0099FF',
  green:    '#00FF88',
  white:    '#FFFFFF',
  grey:     '#8892A4',
  dark:     'rgba(0,0,0,0.72)',
  darkStrong: 'rgba(0,0,0,0.88)',
};

function baseHtml(content) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080,height=1080">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1080px; overflow: hidden; font-family: 'Space Grotesk', sans-serif; background: ${C.bg}; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(0.88); }     to { opacity:1; transform:scale(1); } }
  @keyframes fadeIn   { from { opacity:0; }                            to { opacity:1; } }
  .anim-up    { animation: fadeUp  0.5s ease both; }
  .anim-scale { animation: scaleIn 0.5s ease both; }
  .anim-fade  { animation: fadeIn  0.6s ease both; }
  .delay1 { animation-delay: 0.10s; }
  .delay2 { animation-delay: 0.20s; }
  .delay3 { animation-delay: 0.35s; }
</style>
</head>
<body>${content}</body>
</html>`;
}

// ─────────────────────────────────────────────
// SLIDE DEFINITIONS
// ─────────────────────────────────────────────

const slides = [

  // ── SLIDE 1 — HOOK ──
  {
    filename: `${CAMPAIGN}_carousel_01.png`,
    htmlFile: `${CAMPAIGN}_carousel_01.html`,
    concept:  'Hook — paradigma',
    copy_source: 'narrative.json → carousel_texts[0] + headlines[0]',
    images_used: [imgPath(1)],
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};overflow:hidden;">

  <!-- Background image -->
  <img src="${fileUrl(imgPath(1))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.55) contrast(1.15) saturate(1.25);" />

  <!-- Cinematic overlay -->
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.65) 0%,rgba(13,0,26,0.2) 45%,rgba(0,0,0,0.85) 100%);"></div>

  <!-- Top accent bar -->
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${C.blue},${C.green});"></div>

  <!-- Brand pill top-left -->
  <div class="anim-fade" style="position:absolute;top:54px;left:60px;background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.45);backdrop-filter:blur(12px);border-radius:9999px;padding:9px 22px;color:${C.blue};font-size:22px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
    INEMA.CLUB
  </div>

  <!-- Code label top-right -->
  <div class="anim-fade delay1" style="position:absolute;top:60px;right:60px;font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:500;color:rgba(0,255,136,0.65);letter-spacing:0.05em;">
    // if/else → deprecated
  </div>

  <!-- Main text block — bottom -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:64px 64px 72px;background:linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.7) 55%,transparent 100%);">

    <!-- Eyebrow -->
    <div class="anim-fade delay1" style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600;color:${C.green};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:18px;">
      ⚡ O FIM DO PARADIGMA
    </div>

    <!-- Headline -->
    <div class="anim-up" style="font-size:108px;font-weight:800;color:${C.white};line-height:0.96;letter-spacing:-0.025em;text-shadow:0 4px 24px rgba(0,0,0,0.8);margin-bottom:28px;">
      O if/else<br><span style="color:${C.blue};">chegou ao fim.</span>
    </div>

    <!-- Subtext -->
    <div class="anim-up delay2" style="font-size:38px;font-weight:500;color:rgba(255,255,255,0.82);line-height:1.45;text-shadow:0 2px 12px rgba(0,0,0,0.7);max-width:880px;">
      Enquanto você depurava, o agente já fechou o PR.<br>
      <span style="color:rgba(255,255,255,0.55);">O paradigma mudou — e poucos devs perceberam ainda.</span>
    </div>
  </div>

  <!-- Slide counter -->
  <div style="position:absolute;bottom:28px;right:60px;font-family:'JetBrains Mono',monospace;font-size:19px;color:rgba(255,255,255,0.35);letter-spacing:0.08em;">
    01 / 05
  </div>

</div>
`)
  },

  // ── SLIDE 2 — CONTRASTE / ARQUITETURA ──
  {
    filename: `${CAMPAIGN}_carousel_02.png`,
    htmlFile: `${CAMPAIGN}_carousel_02.html`,
    concept:  'Contraste — hard-coded vs raciocínio dinâmico',
    copy_source: 'narrative.json → carousel_texts[1] + headlines[2]',
    images_used: [imgPath(2)],
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg2};overflow:hidden;">

  <!-- Background image -->
  <img src="${fileUrl(imgPath(2))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.45) contrast(1.2) saturate(1.15);" />

  <!-- Deep overlay -->
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,13,26,0.82) 0%,rgba(0,0,0,0.4) 60%,rgba(0,0,0,0.75) 100%);"></div>

  <!-- Top bar -->
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${C.green},${C.blue});"></div>

  <!-- INEMA tag -->
  <div class="anim-fade" style="position:absolute;top:54px;left:60px;background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.35);backdrop-filter:blur(12px);border-radius:9999px;padding:9px 22px;color:${C.green};font-size:22px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
    INEMA.CLUB
  </div>

  <!-- Split visual label -->
  <div class="anim-fade delay1" style="position:absolute;top:60px;right:60px;font-family:'JetBrains Mono',monospace;font-size:18px;color:rgba(0,153,255,0.6);letter-spacing:0.04em;">
    // paradigma 2030
  </div>

  <!-- Left neon line -->
  <div style="position:absolute;top:50%;left:60px;transform:translateY(-50%);width:5px;height:320px;background:linear-gradient(to bottom,transparent,${C.green},transparent);border-radius:4px;"></div>

  <!-- Center text block -->
  <div style="position:absolute;top:50%;left:110px;right:60px;transform:translateY(-50%);">

    <!-- Label -->
    <div class="anim-fade delay1" style="font-family:'JetBrains Mono',monospace;font-size:20px;color:rgba(0,255,136,0.75);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:20px;">
      🧠 ARQUITETURA DE AGORA
    </div>

    <!-- Main headline -->
    <div class="anim-up" style="font-size:90px;font-weight:800;color:${C.white};line-height:0.98;letter-spacing:-0.02em;text-shadow:0 4px 24px rgba(0,0,0,0.9);margin-bottom:32px;">
      Lógica<br>hard-coded<br><span style="color:${C.blue};">é passado.</span>
    </div>

    <!-- Divider -->
    <div class="anim-fade delay2" style="width:80px;height:3px;background:linear-gradient(90deg,${C.green},transparent);margin-bottom:28px;"></div>

    <!-- Subtext lines -->
    <div class="anim-up delay2" style="font-size:42px;font-weight:600;color:${C.white};line-height:1.3;text-shadow:0 2px 12px rgba(0,0,0,0.7);margin-bottom:14px;">
      Raciocínio dinâmico<br>é a arquitetura de agora.
    </div>
    <div class="anim-up delay3" style="font-size:32px;font-weight:400;color:rgba(255,255,255,0.5);line-height:1.4;font-style:italic;">
      If/else não vai te levar para 2030.
    </div>
  </div>

  <!-- Slide counter -->
  <div style="position:absolute;bottom:28px;right:60px;font-family:'JetBrains Mono',monospace;font-size:19px;color:rgba(255,255,255,0.35);letter-spacing:0.08em;">
    02 / 05
  </div>

</div>
`)
  },

  // ── SLIDE 3 — PROVA SOCIAL / STATS ──
  {
    filename: `${CAMPAIGN}_carousel_03.png`,
    htmlFile: `${CAMPAIGN}_carousel_03.html`,
    concept:  'Prova social — números GreenIQ',
    copy_source: 'narrative.json → carousel_texts[2]',
    images_used: [imgPath(3)],
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};overflow:hidden;">

  <!-- Background image -->
  <img src="${fileUrl(imgPath(3))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.35) contrast(1.3) saturate(1.1);" />

  <!-- Overlay -->
  <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(0,0,0,0.88) 0%,rgba(0,20,40,0.65) 50%,rgba(0,0,0,0.9) 100%);"></div>

  <!-- Top bar -->
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${C.blue},${C.green});"></div>

  <!-- INEMA tag -->
  <div class="anim-fade" style="position:absolute;top:54px;left:60px;background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.4);backdrop-filter:blur(12px);border-radius:9999px;padding:9px 22px;color:${C.blue};font-size:22px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
    INEMA.CLUB
  </div>

  <!-- Stats grid -->
  <div style="position:absolute;top:50%;left:60px;right:60px;transform:translateY(-50%);">

    <!-- Eyebrow -->
    <div class="anim-fade delay1" style="font-family:'JetBrains Mono',monospace;font-size:22px;color:${C.green};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:48px;">
      📈 ISSO JÁ ESTÁ ACONTECENDO
    </div>

    <!-- Big stat 1 -->
    <div class="anim-scale" style="margin-bottom:48px;">
      <div style="font-size:140px;font-weight:800;color:${C.green};line-height:1.0;letter-spacing:-0.03em;text-shadow:0 0 60px rgba(0,255,136,0.4);">99,2%</div>
      <div style="font-size:36px;font-weight:500;color:rgba(255,255,255,0.8);line-height:1.3;margin-top:4px;">menos tempo de pesquisa</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:rgba(0,255,136,0.5);margin-top:8px;letter-spacing:0.06em;">— GreenIQ</div>
    </div>

    <!-- Divider -->
    <div class="anim-fade delay2" style="width:100%;height:1px;background:linear-gradient(90deg,${C.blue},transparent);margin-bottom:40px;opacity:0.4;"></div>

    <!-- Big stat 2 -->
    <div class="anim-up delay2">
      <div style="font-size:56px;font-weight:800;color:${C.white};line-height:1.1;letter-spacing:-0.01em;text-shadow:0 4px 24px rgba(0,0,0,0.8);">
        <span style="color:${C.blue};">1 operador + 11 agentes</span>
      </div>
      <div style="font-size:44px;font-weight:600;color:rgba(255,255,255,0.85);line-height:1.2;margin-top:8px;">
        = volume de <span style="color:${C.green};">10 devs</span>
      </div>
    </div>

  </div>

  <!-- Slide counter -->
  <div style="position:absolute;bottom:28px;right:60px;font-family:'JetBrains Mono',monospace;font-size:19px;color:rgba(255,255,255,0.35);letter-spacing:0.08em;">
    03 / 05
  </div>

</div>
`)
  },

  // ── SLIDE 4 — EMPODERAMENTO / JARVIS ──
  {
    filename: `${CAMPAIGN}_carousel_04.png`,
    htmlFile: `${CAMPAIGN}_carousel_04.html`,
    concept:  'Empoderamento — dev → arquiteto de agentes',
    copy_source: 'narrative.json → carousel_texts[3] + key_phrases[3]',
    images_used: [imgPath(4)],
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg2};overflow:hidden;">

  <!-- Background image -->
  <img src="${fileUrl(imgPath(4))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.5) contrast(1.1) saturate(1.2);" />

  <!-- Overlay -->
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.25) 45%,rgba(0,0,0,0.88) 100%);"></div>

  <!-- Top bar -->
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${C.green},${C.blue});"></div>

  <!-- INEMA tag -->
  <div class="anim-fade" style="position:absolute;top:54px;left:60px;background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.4);backdrop-filter:blur(12px);border-radius:9999px;padding:9px 22px;color:${C.blue};font-size:22px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
    INEMA.CLUB
  </div>

  <!-- Code label -->
  <div class="anim-fade delay1" style="position:absolute;top:60px;right:60px;font-family:'JetBrains Mono',monospace;font-size:18px;color:rgba(0,255,136,0.6);">
    🤖 jarvis_real = True
  </div>

  <!-- Bottom text block -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:72px 64px 80px;background:linear-gradient(to top,rgba(0,0,0,0.94) 0%,rgba(0,0,0,0.65) 55%,transparent 100%);">

    <!-- Eyebrow -->
    <div class="anim-fade delay1" style="font-family:'JetBrains Mono',monospace;font-size:22px;color:${C.green};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:20px;">
      🤖 O JARVIS REAL É HOJE
    </div>

    <!-- Headline -->
    <div class="anim-up" style="font-size:92px;font-weight:800;color:${C.white};line-height:0.98;letter-spacing:-0.02em;text-shadow:0 4px 24px rgba(0,0,0,0.8);margin-bottom:28px;">
      Não é<br>ficção<br><span style="color:${C.blue};">científica.</span>
    </div>

    <!-- Subtext -->
    <div class="anim-up delay2" style="font-size:37px;font-weight:500;color:rgba(255,255,255,0.82);line-height:1.45;text-shadow:0 2px 12px rgba(0,0,0,0.7);max-width:860px;margin-bottom:16px;">
      É o que você vai usar segunda-feira.
    </div>

    <!-- Question callout -->
    <div class="anim-up delay3" style="display:inline-block;font-size:30px;font-weight:600;color:rgba(255,255,255,0.6);line-height:1.4;border-left:3px solid ${C.blue};padding-left:20px;margin-top:4px;">
      Você vai orquestrá-lo — ou competir com ele?
    </div>

  </div>

  <!-- Slide counter -->
  <div style="position:absolute;bottom:28px;right:60px;font-family:'JetBrains Mono',monospace;font-size:19px;color:rgba(255,255,255,0.35);letter-spacing:0.08em;">
    04 / 05
  </div>

</div>
`)
  },

  // ── SLIDE 5 — CTA / BRAND ──
  {
    filename: `${CAMPAIGN}_carousel_05.png`,
    htmlFile: `${CAMPAIGN}_carousel_05.html`,
    concept:  'CTA final — INEMA.CLUB brand, curso gratuito',
    copy_source: 'narrative.json → carousel_texts[6] + approved_ctas[0]',
    images_used: [imgPath(5)],
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};overflow:hidden;">

  <!-- Background image -->
  <img src="${fileUrl(imgPath(5))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.3) contrast(1.2) saturate(1.0);" />

  <!-- Strong overlay — CTA slide needs max readability -->
  <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(0,10,20,0.95) 0%,rgba(0,20,40,0.8) 40%,rgba(0,0,0,0.95) 100%);"></div>

  <!-- Top bar + glow -->
  <div style="position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,${C.blue},${C.green},${C.blue});box-shadow:0 0 24px rgba(0,255,136,0.5);"></div>

  <!-- Decorative neon ring -->
  <div style="position:absolute;top:-200px;right:-200px;width:600px;height:600px;border:2px solid rgba(0,153,255,0.12);border-radius:50%;pointer-events:none;"></div>
  <div style="position:absolute;top:-160px;right:-160px;width:500px;height:500px;border:1px solid rgba(0,255,136,0.08);border-radius:50%;pointer-events:none;"></div>

  <!-- Full center layout -->
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;">

    <!-- Label -->
    <div class="anim-fade" style="font-family:'JetBrains Mono',monospace;font-size:20px;color:rgba(0,255,136,0.7);letter-spacing:0.14em;text-transform:uppercase;text-align:center;margin-bottom:32px;">
      🚀 A TRILHA ESTÁ PRONTA
    </div>

    <!-- MEGA brand URL -->
    <div class="anim-scale" style="font-size:132px;font-weight:800;background:linear-gradient(135deg,${C.blue},${C.green});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.0;letter-spacing:-0.03em;text-align:center;margin-bottom:36px;filter:drop-shadow(0 0 40px rgba(0,153,255,0.4));">
      INEMA.CLUB
    </div>

    <!-- Course name -->
    <div class="anim-up delay1" style="font-size:38px;font-weight:700;color:${C.white};text-align:center;line-height:1.2;margin-bottom:16px;text-shadow:0 2px 12px rgba(0,0,0,0.8);">
      Engenharia Agentic Masterclass
    </div>

    <!-- Details pills row -->
    <div class="anim-fade delay2" style="display:flex;gap:16px;align-items:center;justify-content:center;margin-bottom:52px;flex-wrap:wrap;">
      <div style="background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.4);border-radius:9999px;padding:8px 22px;font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600;color:${C.blue};letter-spacing:0.04em;">6 trilhas</div>
      <div style="color:rgba(255,255,255,0.3);font-size:24px;">·</div>
      <div style="background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.4);border-radius:9999px;padding:8px 22px;font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600;color:${C.blue};">42 módulos</div>
      <div style="color:rgba(255,255,255,0.3);font-size:24px;">·</div>
      <div style="background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.35);border-radius:9999px;padding:8px 22px;font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600;color:${C.green};">100% grátis</div>
      <div style="color:rgba(255,255,255,0.3);font-size:24px;">·</div>
      <div style="background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.35);border-radius:9999px;padding:8px 22px;font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600;color:${C.green};">PT-BR</div>
    </div>

    <!-- CTA button -->
    <div class="anim-scale delay3" style="background:linear-gradient(135deg,${C.blue},#0066CC);border-radius:9999px;padding:24px 64px;box-shadow:0 8px 40px rgba(0,153,255,0.5);cursor:pointer;">
      <div style="font-size:36px;font-weight:800;color:${C.white};letter-spacing:0.08em;text-transform:uppercase;text-align:center;">
        Comece grátis agora →
      </div>
    </div>

    <!-- Tagline -->
    <div class="anim-fade delay3" style="margin-top:28px;font-size:24px;color:rgba(255,255,255,0.4);letter-spacing:0.04em;text-align:center;">
      Trilha completa. 100% gratuita. Sem truques.
    </div>

  </div>

  <!-- Slide counter -->
  <div style="position:absolute;bottom:28px;right:60px;font-family:'JetBrains Mono',monospace;font-size:19px;color:rgba(255,255,255,0.3);letter-spacing:0.08em;">
    05 / 05
  </div>

</div>
`)
  },

];

// ─────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────

async function render() {
  const browser = await chromium.launch();
  const rendered = [];

  for (const slide of slides) {
    const htmlContent = slide.html();
    const htmlPath    = path.join(ADS_DIR, slide.htmlFile);
    const pngPath     = path.join(ADS_DIR, slide.filename);

    // Write HTML
    fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

    // Render via Playwright
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.goto(fileUrl(htmlPath));
    await page.waitForTimeout(700); // fonts + animations settle
    await page.screenshot({ path: pngPath });
    await page.close();

    console.log(`✅ ${slide.filename}`);

    rendered.push({
      filename:    slide.filename,
      html_file:   slide.htmlFile,
      dimensions:  '1080x1080',
      format:      'carousel',
      platform:    ['instagram', 'threads'],
      concept:     slide.concept,
      copy_source: slide.copy_source,
      images_used: slide.images_used.map(p => path.basename(p)),
    });
  }

  await browser.close();

  // layout.json
  const layout = {
    campaign_id:  CAMPAIGN,
    campaign_date: '2026-04-26',
    generated_at: new Date().toISOString(),
    format:       'carousel',
    dimensions:   '1080x1080',
    slide_count:  slides.length,
    brand_url:    'INEMA.CLUB',
    typography:   'Space Grotesk + JetBrains Mono',
    color_palette: { bg: C.bg, primary: C.blue, accent: C.green, text: C.white },
    slides:       rendered,
  };
  fs.writeFileSync(path.join(ADS_DIR, 'layout.json'), JSON.stringify(layout, null, 2));
  console.log(`\n📄 layout.json saved → ${ADS_DIR}/layout.json`);
  console.log(`\n🎨 ${slides.length} slides rendered to ${ADS_DIR}`);
}

render().catch(err => { console.error(err); process.exit(1); });
