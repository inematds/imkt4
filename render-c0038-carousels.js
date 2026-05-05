/**
 * Render script — c0038-pascoa_2026 Carousel Slides
 * 14 slides: Carousel 1 (slides 01–07) + Carousel 2 (slides 08–14)
 * Output: prj/inema/outputs/c0038-pascoa_2026/ads/
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('prj/inema/outputs/c0038-pascoa_2026/ads');
fs.mkdirSync(OUT_DIR, { recursive: true });

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
`;

const BASE_STYLES = `
@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1080px; overflow:hidden; font-family:'Space Grotesk','Arial Black',Arial,sans-serif; color:#FFFFFF; background:#0D0D0D; }
`;

function wrap(content) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${BASE_STYLES}</style></head><body>${content}</body></html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL 1 — "O Líder Maestro: 7 Competências da Era Agentic"
// Theme: Azul Elétrico (#0099FF dominant)
// ─────────────────────────────────────────────────────────────────────────────

function slide01() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px;overflow:hidden;text-align:center;">
  <!-- Background decorative 2026 -->
  <div style="position:absolute;font-size:340px;font-weight:900;color:#141414;letter-spacing:-12px;top:50%;left:50%;transform:translate(-50%,-50%);z-index:0;user-select:none;pointer-events:none;">2026</div>
  <!-- Gold top/bottom lines -->
  <div style="position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(to right,transparent,#C8A04A,transparent);z-index:2;"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(to right,transparent,#C8A04A,transparent);z-index:2;"></div>
  <!-- Gold ambient glow -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(circle,rgba(200,160,74,0.09) 0%,transparent 65%);pointer-events:none;"></div>
  <!-- Content -->
  <div style="position:relative;z-index:1;animation:fadeUp 0.5s both;">
    <!-- Badge -->
    <div style="display:inline-block;border:1px solid rgba(200,160,74,0.45);padding:10px 28px;border-radius:9999px;margin-bottom:44px;animation:scaleIn 0.5s 0.1s both;">
      <span style="font-size:16px;font-weight:700;color:#C8A04A;letter-spacing:0.2em;text-transform:uppercase;">PÁSCOA 2026 · INEMA</span>
    </div>
    <!-- Main headline -->
    <h1 style="font-size:96px;font-weight:900;line-height:0.95;letter-spacing:-0.03em;text-transform:uppercase;margin-bottom:36px;">
      A PÁSCOA<br><span style="color:#C8A04A;">DO LÍDER</span><br>QUE LIDERA
    </h1>
    <!-- Gold rule -->
    <div style="width:80px;height:3px;background:#C8A04A;margin:0 auto 36px;"></div>
    <!-- Subtext -->
    <p style="font-size:32px;font-weight:400;line-height:1.55;color:rgba(255,255,255,0.65);max-width:760px;margin:0 auto 52px;animation:fadeUp 0.5s 0.2s both;">
      Renascer na era da IA não é espiritual —<br>é estratégico.
    </p>
    <!-- INEMA dot marker -->
    <div style="display:inline-flex;align-items:center;gap:12px;animation:fadeIn 0.5s 0.3s both;">
      <div style="width:8px;height:8px;background:#C8A04A;border-radius:50%;"></div>
      <span style="font-size:18px;font-weight:700;letter-spacing:0.15em;color:rgba(255,255,255,0.3);">INEMA.VIP</span>
      <div style="width:8px;height:8px;background:#C8A04A;border-radius:50%;"></div>
    </div>
  </div>
</div>`);
}

function slide02() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;align-items:center;padding:80px 80px 80px 96px;overflow:hidden;">
  <!-- Vertical blue accent bar left -->
  <div style="position:absolute;left:0;top:0;bottom:0;width:6px;background:linear-gradient(to bottom,transparent,#0099FF 30%,#0099FF 70%,transparent);"></div>
  <!-- Blue glow left -->
  <div style="position:absolute;left:-250px;top:50%;transform:translateY(-50%);width:700px;height:700px;background:radial-gradient(circle,rgba(0,153,255,0.13) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- Abstract music staff lines right (subtle) -->
  <div style="position:absolute;right:60px;top:50%;transform:translateY(-50%);width:280px;opacity:0.06;">
    <div style="height:2px;background:white;margin-bottom:40px;"></div>
    <div style="height:2px;background:white;margin-bottom:40px;"></div>
    <div style="height:2px;background:white;margin-bottom:40px;"></div>
    <div style="height:2px;background:white;margin-bottom:40px;"></div>
    <div style="height:2px;background:white;"></div>
  </div>
  <!-- Content -->
  <div style="position:relative;z-index:1;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:32px;">02 · METÁFORA CENTRAL</div>
    <h1 style="font-size:108px;font-weight:900;line-height:0.92;letter-spacing:-0.03em;text-transform:uppercase;margin-bottom:44px;">
      MAESTRO<br>NÃO TOCA.<br><span style="color:#0099FF;">ELE CONDUZ.</span>
    </h1>
    <div style="width:56px;height:3px;background:#0099FF;margin-bottom:32px;animation:scaleIn 0.5s 0.2s both;"></div>
    <p style="font-size:30px;font-weight:400;line-height:1.6;color:rgba(255,255,255,0.65);max-width:620px;animation:fadeUp 0.5s 0.2s both;">
      O líder moderno orquestra agentes de IA —<br>não os opera.
    </p>
    <div style="margin-top:64px;font-size:15px;font-weight:700;color:rgba(255,255,255,0.2);letter-spacing:0.15em;">INEMA.VIP</div>
  </div>
</div>`);
}

function slide03() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;overflow:hidden;text-align:center;">
  <!-- Blue corner glow -->
  <div style="position:absolute;top:-100px;right:-100px;width:500px;height:500px;background:radial-gradient(circle at top right,rgba(0,153,255,0.2) 0%,transparent 60%);pointer-events:none;"></div>
  <div style="position:absolute;bottom:-100px;left:-100px;width:400px;height:400px;background:radial-gradient(circle at bottom left,rgba(0,153,255,0.1) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- Source label -->
  <div style="position:absolute;top:56px;width:100%;text-align:center;font-size:14px;font-weight:600;color:rgba(255,255,255,0.25);letter-spacing:0.25em;text-transform:uppercase;animation:fadeIn 0.5s both;">ESTUDO OUTSYSTEMS / KPMG · 2026</div>
  <!-- Stat hero -->
  <div style="animation:scaleIn 0.5s both;">
    <div style="font-size:260px;font-weight:900;line-height:0.82;color:#0099FF;letter-spacing:-0.05em;text-shadow:0 0 80px rgba(0,153,255,0.35);">93%</div>
    <div style="font-size:38px;font-weight:600;color:rgba(255,255,255,0.8);margin-top:20px;letter-spacing:0.04em;text-transform:uppercase;">das empresas terão agentes de IA</div>
  </div>
  <!-- Divider -->
  <div style="width:100px;height:2px;background:rgba(255,255,255,0.15);margin:44px auto;"></div>
  <!-- Question -->
  <div style="animation:fadeUp 0.5s 0.2s both;">
    <div style="font-size:56px;font-weight:900;color:#FFFFFF;margin-bottom:20px;letter-spacing:-0.01em;text-transform:uppercase;">E VOCÊ VAI LIDERAR?</div>
    <div style="font-size:28px;font-weight:400;color:rgba(255,255,255,0.5);line-height:1.6;">A questão não é se sua empresa vai ter.<br>É se <strong style="color:white;font-weight:700;">você</strong> vai orquestrar.</div>
  </div>
  <div style="position:absolute;bottom:48px;font-size:14px;font-weight:700;color:rgba(255,255,255,0.18);letter-spacing:0.15em;">INEMA</div>
</div>`);
}

function slide04() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:grid;grid-template-columns:1fr 1fr;align-items:center;overflow:hidden;">
  <!-- Green glow top-right -->
  <div style="position:absolute;right:-100px;top:-100px;width:600px;height:600px;background:radial-gradient(circle,rgba(0,255,136,0.1) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- Green glow bottom-left -->
  <div style="position:absolute;left:-100px;bottom:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(0,255,136,0.06) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- Left panel -->
  <div style="padding:80px 56px 80px 80px;z-index:1;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#00FF88;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:28px;">VIBE CODING</div>
    <h1 style="font-size:76px;font-weight:900;line-height:1.0;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:32px;">
      CRIAR<br>SEM<br><span style="color:#00FF88;">PROGRAMAR</span>
    </h1>
    <div style="width:48px;height:3px;background:#00FF88;margin-bottom:28px;"></div>
    <p style="font-size:26px;font-weight:400;line-height:1.6;color:rgba(255,255,255,0.6);">
      O novo superpoder<br>do C-level.<br>Sem linha de código.
    </p>
    <div style="margin-top:48px;font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.VIP</div>
  </div>
  <!-- Center divider -->
  <div style="position:absolute;top:10%;bottom:10%;left:50%;width:1px;background:linear-gradient(to bottom,transparent,rgba(0,255,136,0.2),transparent);"></div>
  <!-- Right panel: terminal -->
  <div style="padding:80px 80px 80px 48px;z-index:1;animation:scaleIn 0.5s 0.2s both;">
    <div style="background:#060F06;border:1px solid rgba(0,255,136,0.25);border-radius:14px;padding:28px;box-shadow:0 0 48px rgba(0,255,136,0.08);">
      <!-- Title bar -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(0,255,136,0.12);">
        <div style="width:12px;height:12px;border-radius:50%;background:#FF5F57;"></div>
        <div style="width:12px;height:12px;border-radius:50%;background:#FFBD2E;"></div>
        <div style="width:12px;height:12px;border-radius:50%;background:#28C840;"></div>
        <span style="font-size:13px;color:rgba(255,255,255,0.3);margin-left:8px;font-family:'Space Grotesk',sans-serif;">vibe_coding.ai</span>
      </div>
      <!-- Terminal content -->
      <div style="font-family:'Courier New',monospace;font-size:19px;line-height:1.9;color:rgba(0,255,136,0.85);">
        <div><span style="color:rgba(255,255,255,0.3);">→ </span><span style="color:#00FF88;">"Crie um relatório<br>&nbsp;&nbsp;&nbsp;de vendas Q1"</span></div>
        <div style="margin-top:16px;padding:14px;background:rgba(0,255,136,0.07);border-left:2px solid #00FF88;border-radius:4px;">
          <span style="color:rgba(255,255,255,0.55);font-size:17px;">✓ Dados coletados<br>✓ Análise feita<br>✓ Insights gerados<br>✓ Apresentação pronta</span>
        </div>
        <div style="margin-top:16px;color:rgba(255,255,255,0.25);font-size:15px;">// zero código escrito</div>
      </div>
    </div>
    <div style="margin-top:20px;font-size:20px;font-weight:500;color:rgba(255,255,255,0.4);font-family:'Space Grotesk',sans-serif;text-align:center;">Linguagem natural → solução completa</div>
  </div>
</div>`);
}

function slide05() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;overflow:hidden;">
  <!-- Top section: headline -->
  <div style="padding:72px 80px 44px;border-bottom:1px solid rgba(255,255,255,0.07);flex:0 0 auto;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:0.22em;text-transform:uppercase;margin-bottom:18px;">ORQUESTRAÇÃO VS DELEGAÇÃO</div>
    <h1 style="font-size:68px;font-weight:900;line-height:0.97;letter-spacing:-0.02em;text-transform:uppercase;">
      VOCÊ DELEGA<br>TECNOLOGIA —<br><span style="color:#0099FF;">OU A ORQUESTRA?</span>
    </h1>
  </div>
  <!-- Bottom split comparison -->
  <div style="flex:1;display:grid;grid-template-columns:1fr 1px 1fr;">
    <!-- Left: ANTES -->
    <div style="padding:52px 60px;display:flex;flex-direction:column;justify-content:center;background:rgba(255,255,255,0.018);animation:fadeUp 0.5s 0.15s both;">
      <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.2);letter-spacing:0.3em;margin-bottom:18px;text-transform:uppercase;">ANTES</div>
      <div style="font-size:48px;font-weight:900;color:rgba(255,255,255,0.3);margin-bottom:24px;text-transform:uppercase;text-decoration:line-through;text-decoration-color:rgba(255,255,255,0.15);">DELEGAR<br>AO TI</div>
      <p style="font-size:24px;font-weight:400;color:rgba(255,255,255,0.3);line-height:1.55;">Como delegar sua<br>estratégia para<br>o contador.</p>
    </div>
    <!-- Divider -->
    <div style="background:rgba(255,255,255,0.08);"></div>
    <!-- Right: AGORA -->
    <div style="padding:52px 60px;display:flex;flex-direction:column;justify-content:center;background:rgba(0,153,255,0.04);animation:fadeUp 0.5s 0.25s both;">
      <div style="font-size:12px;font-weight:700;color:#0099FF;letter-spacing:0.3em;margin-bottom:18px;text-transform:uppercase;">AGORA</div>
      <div style="font-size:48px;font-weight:900;color:#0099FF;margin-bottom:24px;text-transform:uppercase;">ORQUESTRAR<br>COM IA</div>
      <p style="font-size:24px;font-weight:400;color:rgba(255,255,255,0.65);line-height:1.55;">Decisões que os<br>outros simplesmente<br>não conseguem ver.</p>
    </div>
  </div>
  <div style="position:absolute;bottom:28px;right:56px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.18);letter-spacing:0.12em;">INEMA.VIP</div>
</div>`);
}

function slide06() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;align-items:center;padding:72px 80px;overflow:hidden;text-align:center;">
  <!-- Network ambient glow -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;background:radial-gradient(circle,rgba(0,153,255,0.07) 0%,transparent 65%);pointer-events:none;"></div>
  <!-- Central node -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;background:#0099FF;box-shadow:0 0 28px rgba(0,153,255,0.9);z-index:1;"></div>
  <!-- Orbit ring -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:380px;height:380px;border-radius:50%;border:1px dashed rgba(0,153,255,0.14);"></div>
  <!-- Ring nodes - 6 around -->
  <div style="position:absolute;top:calc(50% - 190px);left:50%;transform:translateX(-50%);width:18px;height:18px;border-radius:50%;background:rgba(0,153,255,0.55);"></div>
  <div style="position:absolute;top:calc(50% - 95px);left:calc(50% + 165px);transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:rgba(0,153,255,0.5);"></div>
  <div style="position:absolute;top:calc(50% + 95px);left:calc(50% + 165px);transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:rgba(0,255,136,0.5);"></div>
  <div style="position:absolute;top:calc(50% + 190px);left:50%;transform:translateX(-50%);width:14px;height:14px;border-radius:50%;background:rgba(0,255,136,0.45);"></div>
  <div style="position:absolute;top:calc(50% + 95px);left:calc(50% - 165px);transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:rgba(200,160,74,0.6);"></div>
  <div style="position:absolute;top:calc(50% - 95px);left:calc(50% - 165px);transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:rgba(200,160,74,0.55);"></div>
  <!-- Outer ring nodes -->
  <div style="position:absolute;top:50%;left:calc(50% + 270px);transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.2);"></div>
  <div style="position:absolute;top:50%;left:calc(50% - 270px);transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.2);"></div>
  <div style="position:absolute;top:calc(50% - 250px);left:calc(50% + 120px);transform:translate(-50%,-50%);width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.15);"></div>
  <div style="position:absolute;top:calc(50% - 250px);left:calc(50% - 120px);transform:translate(-50%,-50%);width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.15);"></div>
  <!-- Top content -->
  <div style="position:relative;z-index:10;width:100%;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:18px;">INEMA VIP</div>
    <h1 style="font-size:70px;font-weight:900;line-height:1.02;letter-spacing:-0.02em;text-transform:uppercase;max-width:880px;margin:0 auto 0;">
      A COMUNIDADE DOS<br>LÍDERES QUE<br><span style="color:#0099FF;">ENTENDERAM</span>
    </h1>
  </div>
  <div style="flex:1;"></div>
  <!-- Bottom stats -->
  <div style="position:relative;z-index:10;display:flex;gap:56px;align-items:center;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);width:100%;justify-content:center;animation:fadeUp 0.5s 0.2s both;">
    <div style="text-align:center;">
      <div style="font-size:60px;font-weight:900;color:#0099FF;line-height:1;">30+</div>
      <div style="font-size:17px;font-weight:600;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.1em;margin-top:6px;">grupos especializados</div>
    </div>
    <div style="width:1px;height:56px;background:rgba(255,255,255,0.1);"></div>
    <div style="text-align:left;">
      <div style="font-size:30px;font-weight:700;color:rgba(255,255,255,0.8);line-height:1.35;">A elite da<br>transformação digital</div>
    </div>
  </div>
</div>`);
}

function slide07() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px;overflow:hidden;text-align:center;">
  <!-- Gold radial glow -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);width:560px;height:560px;background:radial-gradient(ellipse 60% 75%,rgba(200,160,74,0.16) 0%,rgba(200,160,74,0.04) 45%,transparent 70%);pointer-events:none;"></div>
  <!-- CSS Egg shape -->
  <div style="position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:230px;height:295px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;border:2px solid rgba(200,160,74,0.13);"></div>
  <div style="position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:175px;height:230px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;border:1px solid rgba(200,160,74,0.08);"></div>
  <!-- Crack light -->
  <div style="position:absolute;top:13%;left:50%;transform:translateX(-50%);width:2px;height:180px;background:linear-gradient(to bottom,transparent,rgba(200,160,74,0.75),transparent);box-shadow:0 0 20px rgba(200,160,74,0.4);"></div>
  <!-- Gold top/bottom lines -->
  <div style="position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(to right,transparent,#C8A04A,transparent);"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(to right,transparent,#C8A04A,transparent);"></div>
  <!-- Content -->
  <div style="position:relative;z-index:1;animation:fadeUp 0.5s both;">
    <div style="font-size:15px;font-weight:700;color:rgba(200,160,74,0.75);letter-spacing:0.25em;text-transform:uppercase;margin-bottom:32px;">INEMA VIP · PÁSCOA 2026</div>
    <h1 style="font-size:104px;font-weight:900;line-height:0.93;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:20px;text-shadow:0 0 60px rgba(200,160,74,0.25);">
      RENASÇA.<br><span style="color:#C8A04A;">ORQUESTRE.</span><br>LIDERE.
    </h1>
    <div style="width:60px;height:2px;background:#C8A04A;margin:36px auto 36px;opacity:0.55;"></div>
    <p style="font-size:28px;font-weight:400;color:rgba(255,255,255,0.55);margin-bottom:52px;line-height:1.55;">
      O menor custo para a maior virada<br>da sua carreira executiva.
    </p>
    <!-- CTA -->
    <div style="animation:scaleIn 0.5s 0.2s both;">
      <div style="display:inline-block;background:#C8A04A;color:#0D0D0D;padding:22px 68px;border-radius:9999px;font-size:26px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;box-shadow:0 4px 36px rgba(200,160,74,0.5);">INEMA.VIP</div>
      <div style="margin-top:16px;font-size:19px;font-weight:600;color:rgba(255,255,255,0.35);">R$ 35/mês · Sem desculpas para ficar para trás</div>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL 2 — "Páscoa e IA: A Transformação que Ninguém Estava Esperando"
// Theme: Verde Neon + simbolismo pascal — distinct from Carousel 1
// ─────────────────────────────────────────────────────────────────────────────

function slide08() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;align-items:center;padding:80px;overflow:hidden;text-align:center;">
  <!-- Archway at top -->
  <div style="position:absolute;top:-140px;left:50%;transform:translateX(-50%);z-index:0;">
    <!-- Outer arch -->
    <div style="width:560px;height:560px;border-radius:50% 50% 0 0 / 50% 50% 0 0;border:2px solid rgba(200,160,74,0.28);border-bottom:none;position:relative;">
      <!-- Inner arch -->
      <div style="position:absolute;top:22px;left:22px;right:22px;bottom:0;border-radius:50% 50% 0 0 / 50% 50% 0 0;border:1px solid rgba(200,160,74,0.13);border-bottom:none;"></div>
      <!-- Gold glow from inside -->
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse 60% 80% at 50% 100%,rgba(200,160,74,0.22) 0%,transparent 55%);border-radius:inherit;"></div>
    </div>
  </div>
  <!-- Side pillars -->
  <div style="position:absolute;top:278px;left:calc(50% - 280px);width:2px;height:200px;background:linear-gradient(to bottom,rgba(200,160,74,0.25),transparent);"></div>
  <div style="position:absolute;top:278px;right:calc(50% - 280px);width:2px;height:200px;background:linear-gradient(to bottom,rgba(200,160,74,0.25),transparent);"></div>
  <!-- Content -->
  <div style="position:relative;z-index:1;margin-top:200px;animation:fadeUp 0.5s both;width:100%;">
    <div style="font-size:13px;font-weight:700;color:rgba(200,160,74,0.75);letter-spacing:0.25em;text-transform:uppercase;margin-bottom:28px;">CARROSSEL 2 · PASSAGEM</div>
    <h1 style="font-size:80px;font-weight:900;line-height:0.97;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:36px;">
      PÁSCOA SEMPRE FOI<br>SOBRE <span style="color:#C8A04A;">PASSAGEM</span>
    </h1>
    <div style="height:2px;width:72px;background:rgba(200,160,74,0.5);margin:0 auto 36px;"></div>
    <div style="animation:fadeUp 0.5s 0.2s both;">
      <p style="font-size:30px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.65;max-width:800px;margin:0 auto;">
        Da escravidão para a liberdade.<br>
        Do analógico para o digital.<br>
        <span style="color:rgba(200,160,74,0.9);font-weight:600;">Do usuário para o maestro.</span>
      </p>
    </div>
    <div style="margin-top:52px;font-size:15px;font-weight:700;color:rgba(255,255,255,0.18);letter-spacing:0.15em;">INEMA.VIP</div>
  </div>
</div>`);
}

function slide09() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;padding:80px;overflow:hidden;">
  <!-- Blue ambient -->
  <div style="position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);width:900px;height:500px;background:radial-gradient(ellipse,rgba(0,153,255,0.07) 0%,transparent 65%);pointer-events:none;"></div>
  <!-- Top content -->
  <div style="animation:fadeUp 0.5s both;margin-bottom:auto;">
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;">EVOLUÇÃO DA LIDERANÇA</div>
    <h1 style="font-size:72px;font-weight:900;line-height:1.02;letter-spacing:-0.02em;text-transform:uppercase;max-width:920px;">
      A VIRADA ENTRE USAR IA<br>E <span style="color:#0099FF;">LIDERAR COM IA</span>
    </h1>
  </div>
  <div style="flex:1;"></div>
  <!-- Timeline -->
  <div style="animation:fadeUp 0.5s 0.2s both;">
    <!-- Track with nodes -->
    <div style="position:relative;display:flex;align-items:flex-end;padding:0 20px;margin-bottom:36px;">
      <!-- Line -->
      <div style="position:absolute;left:60px;right:60px;bottom:18px;height:2px;background:linear-gradient(to right,rgba(255,255,255,0.1),#0099FF);"></div>
      <!-- Era 1 -->
      <div style="flex:1;text-align:center;position:relative;z-index:1;padding-bottom:0;">
        <div style="font-size:38px;font-weight:800;color:rgba(255,255,255,0.28);">2005</div>
        <div style="font-size:17px;font-weight:500;color:rgba(255,255,255,0.28);margin-top:6px;text-transform:uppercase;letter-spacing:0.08em;">Tecnófobo</div>
        <div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.18);border:2px solid rgba(255,255,255,0.3);margin:16px auto 0;"></div>
      </div>
      <!-- Era 2 -->
      <div style="flex:1;text-align:center;position:relative;z-index:1;">
        <div style="font-size:38px;font-weight:800;color:rgba(0,153,255,0.55);">2025</div>
        <div style="font-size:17px;font-weight:600;color:rgba(0,153,255,0.55);margin-top:6px;text-transform:uppercase;letter-spacing:0.08em;">Usuário de IA</div>
        <div style="width:28px;height:28px;border-radius:50%;background:rgba(0,153,255,0.25);border:2px solid rgba(0,153,255,0.5);margin:16px auto 0;"></div>
      </div>
      <!-- Era 3 (active) -->
      <div style="flex:1;text-align:center;position:relative;z-index:1;">
        <div style="font-size:48px;font-weight:900;color:#0099FF;text-shadow:0 0 24px rgba(0,153,255,0.5);">2026</div>
        <div style="font-size:20px;font-weight:700;color:#0099FF;margin-top:6px;text-transform:uppercase;letter-spacing:0.08em;">Maestro de IA</div>
        <div style="width:36px;height:36px;border-radius:50%;background:#0099FF;margin:16px auto 0;box-shadow:0 0 24px rgba(0,153,255,0.8);position:relative;top:-4px;"></div>
      </div>
    </div>
    <!-- Bottom line -->
    <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:32px;">
      <p style="font-size:30px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.6;text-align:center;">
        O líder de 2025 usa IA como ferramenta.<br>
        <strong style="color:rgba(255,255,255,0.9);font-weight:700;">O líder de 2026 orquestra sistemas inteiros com ela.</strong>
      </p>
    </div>
  </div>
</div>`);
}

function slide10() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;align-items:center;padding:72px;overflow:hidden;text-align:center;">
  <!-- Green ambient -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:650px;height:650px;background:radial-gradient(circle,rgba(0,255,136,0.05) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- Orbit rings -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:420px;height:420px;border-radius:50%;border:1px dashed rgba(0,255,136,0.12);"></div>
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:260px;height:260px;border-radius:50%;border:1px dashed rgba(0,255,136,0.1);"></div>
  <!-- Central VOCÊ node -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;">
    <div style="width:112px;height:112px;border-radius:50%;background:rgba(0,255,136,0.14);border:2px solid rgba(0,255,136,0.6);display:flex;align-items:center;justify-content:center;box-shadow:0 0 36px rgba(0,255,136,0.28);">
      <span style="font-size:16px;font-weight:900;color:#00FF88;letter-spacing:0.06em;text-transform:uppercase;">VOCÊ</span>
    </div>
  </div>
  <!-- Agent nodes (6, spaced around orbit) -->
  <!-- Pesquisa - top -->
  <div style="position:absolute;top:calc(50% - 226px);left:50%;transform:translateX(-50%);z-index:2;">
    <div style="background:rgba(0,255,136,0.09);border:1px solid rgba(0,255,136,0.32);border-radius:9px;padding:11px 20px;font-size:17px;font-weight:700;color:#00FF88;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;">Pesquisa</div>
  </div>
  <!-- Análise - top right -->
  <div style="position:absolute;top:calc(50% - 118px);left:calc(50% + 192px);transform:translate(-50%,-50%);z-index:2;">
    <div style="background:rgba(0,255,136,0.09);border:1px solid rgba(0,255,136,0.32);border-radius:9px;padding:11px 20px;font-size:17px;font-weight:700;color:#00FF88;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;">Análise</div>
  </div>
  <!-- Criação - bottom right -->
  <div style="position:absolute;top:calc(50% + 118px);left:calc(50% + 192px);transform:translate(-50%,-50%);z-index:2;">
    <div style="background:rgba(0,255,136,0.09);border:1px solid rgba(0,255,136,0.32);border-radius:9px;padding:11px 20px;font-size:17px;font-weight:700;color:#00FF88;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;">Criação</div>
  </div>
  <!-- Distribuição - bottom -->
  <div style="position:absolute;top:calc(50% + 226px);left:50%;transform:translateX(-50%);z-index:2;">
    <div style="background:rgba(0,255,136,0.09);border:1px solid rgba(0,255,136,0.32);border-radius:9px;padding:11px 20px;font-size:17px;font-weight:700;color:#00FF88;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;">Distribuição</div>
  </div>
  <!-- Planejamento - bottom left -->
  <div style="position:absolute;top:calc(50% + 118px);left:calc(50% - 192px);transform:translate(-50%,-50%);z-index:2;">
    <div style="background:rgba(0,255,136,0.09);border:1px solid rgba(0,255,136,0.32);border-radius:9px;padding:11px 20px;font-size:17px;font-weight:700;color:#00FF88;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;">Planejamento</div>
  </div>
  <!-- Estratégia - top left -->
  <div style="position:absolute;top:calc(50% - 118px);left:calc(50% - 192px);transform:translate(-50%,-50%);z-index:2;">
    <div style="background:rgba(0,255,136,0.09);border:1px solid rgba(0,255,136,0.32);border-radius:9px;padding:11px 20px;font-size:17px;font-weight:700;color:#00FF88;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;">Estratégia</div>
  </div>
  <!-- Top headline -->
  <div style="position:relative;z-index:10;animation:fadeUp 0.5s both;width:100%;">
    <div style="font-size:13px;font-weight:700;color:#00FF88;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:14px;">ERA AGENTIC</div>
    <h1 style="font-size:60px;font-weight:900;line-height:1.02;letter-spacing:-0.02em;text-transform:uppercase;">
      SEUS AGENTES:<br><span style="color:#00FF88;">OS NOVOS MÚSICOS</span>
    </h1>
  </div>
  <div style="flex:1;"></div>
  <!-- Bottom text -->
  <div style="position:relative;z-index:10;animation:fadeUp 0.5s 0.2s both;margin-top:48px;">
    <p style="font-size:26px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.6;">
      Tudo em paralelo, conduzido por você.<br>
      <strong style="color:rgba(255,255,255,0.85);">Você é o maestro da orquestra.</strong>
    </p>
    <div style="margin-top:18px;font-size:14px;font-weight:600;color:rgba(255,255,255,0.18);letter-spacing:0.12em;">INEMA.VIP</div>
  </div>
</div>`);
}

function slide11() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px;overflow:hidden;text-align:center;">
  <!-- Amber glow -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:750px;height:550px;background:radial-gradient(ellipse,rgba(200,100,0,0.09) 0%,transparent 55%);pointer-events:none;"></div>
  <!-- Amber top bar -->
  <div style="position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(to right,transparent,#FF8C00,transparent);"></div>
  <!-- Stat hero -->
  <div style="animation:scaleIn 0.5s both;margin-bottom:16px;">
    <div style="font-size:236px;font-weight:900;line-height:0.82;color:#FF8C00;letter-spacing:-0.05em;text-shadow:0 0 80px rgba(255,140,0,0.28);">62%</div>
  </div>
  <!-- Context -->
  <div style="animation:fadeUp 0.5s 0.1s both;margin-bottom:40px;">
    <div style="font-size:34px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.03em;text-transform:uppercase;">das grandes empresas brasileiras</div>
    <div style="font-size:26px;font-weight:400;color:rgba(255,255,255,0.45);margin-top:8px;">já usam agentes de IA</div>
  </div>
  <!-- Amber divider -->
  <div style="width:100px;height:2px;background:rgba(255,140,0,0.38);margin:0 auto 40px;"></div>
  <!-- Warning headline -->
  <div style="animation:fadeUp 0.5s 0.2s both;">
    <div style="font-size:50px;font-weight:900;color:#FFFFFF;text-transform:uppercase;letter-spacing:-0.01em;margin-bottom:16px;line-height:1.0;">NEM TODO LÍDER VAI<br>FAZER ESSA PASSAGEM</div>
    <div style="font-size:30px;font-weight:800;color:#FF8C00;text-transform:uppercase;letter-spacing:0.05em;">O GAP ESTÁ CRESCENDO.</div>
  </div>
  <div style="position:absolute;bottom:44px;font-size:14px;font-weight:600;color:rgba(255,255,255,0.15);letter-spacing:0.15em;">INEMA.VIP</div>
</div>`);
}

function slide12() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:grid;grid-template-columns:280px 1fr;overflow:hidden;">
  <!-- Gold left panel -->
  <div style="background:rgba(200,160,74,0.04);border-right:1px solid rgba(200,160,74,0.14);padding:80px 40px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;animation:fadeIn 0.5s both;">
    <div style="position:relative;display:flex;flex-direction:column;gap:0;width:100%;">
      <!-- Timeline line -->
      <div style="position:absolute;left:10px;top:10px;bottom:10px;width:2px;background:linear-gradient(to bottom,rgba(200,160,74,0.25),#C8A04A 60%,rgba(200,160,74,0.25));"></div>
      <!-- Era items -->
      <div style="display:flex;align-items:flex-start;padding:0 0 44px 32px;position:relative;">
        <div style="position:absolute;left:5px;width:12px;height:12px;border-radius:50%;background:rgba(200,160,74,0.35);border:1px solid rgba(200,160,74,0.4);"></div>
        <div>
          <div style="font-size:14px;font-weight:700;color:rgba(200,160,74,0.45);text-transform:uppercase;letter-spacing:0.08em;">Anos 90</div>
          <div style="font-size:17px;font-weight:500;color:rgba(255,255,255,0.35);margin-top:4px;">Computadores</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;padding:0 0 44px 32px;position:relative;">
        <div style="position:absolute;left:5px;width:12px;height:12px;border-radius:50%;background:rgba(200,160,74,0.5);border:1px solid rgba(200,160,74,0.6);"></div>
        <div>
          <div style="font-size:14px;font-weight:700;color:rgba(200,160,74,0.6);text-transform:uppercase;letter-spacing:0.08em;">Anos 2000</div>
          <div style="font-size:17px;font-weight:500;color:rgba(255,255,255,0.45);margin-top:4px;">Internet</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;padding:0 0 44px 32px;position:relative;">
        <div style="position:absolute;left:5px;width:12px;height:12px;border-radius:50%;background:rgba(200,160,74,0.65);border:1px solid #C8A04A;"></div>
        <div>
          <div style="font-size:14px;font-weight:700;color:rgba(200,160,74,0.8);text-transform:uppercase;letter-spacing:0.08em;">Anos 2010</div>
          <div style="font-size:17px;font-weight:500;color:rgba(255,255,255,0.55);margin-top:4px;">Mobile / Cloud</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;padding:0 0 0 32px;position:relative;">
        <div style="position:absolute;left:3px;width:16px;height:16px;border-radius:50%;background:#C8A04A;box-shadow:0 0 16px rgba(200,160,74,0.75);"></div>
        <div>
          <div style="font-size:16px;font-weight:800;color:#C8A04A;text-transform:uppercase;letter-spacing:0.08em;">2026</div>
          <div style="font-size:20px;font-weight:800;color:#C8A04A;margin-top:4px;">IA Agentic</div>
        </div>
      </div>
    </div>
  </div>
  <!-- Right content -->
  <div style="padding:80px 80px 80px 60px;display:flex;flex-direction:column;justify-content:center;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:rgba(200,160,74,0.75);letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;">NEI MALDANER · FUNDADOR</div>
    <h1 style="font-size:68px;font-weight:900;line-height:0.97;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:36px;">
      40 ANOS<br>ANTECIPANDO<br>CADA ONDA.<br><span style="color:#C8A04A;">ESSA É A MAIOR.</span>
    </h1>
    <div style="width:48px;height:3px;background:#C8A04A;margin-bottom:28px;"></div>
    <p style="font-size:26px;font-weight:400;line-height:1.65;color:rgba(255,255,255,0.55);animation:fadeUp 0.5s 0.2s both;">
      Acompanhou cada onda:<br>internet, mobile, cloud.<br>Agora, <strong style="color:rgba(255,255,255,0.85);">IA agentic</strong>.<br>
      Quem construiu do zero<br>sabe o que está vindo.
    </p>
    <div style="margin-top:44px;display:flex;align-items:center;gap:16px;animation:fadeIn 0.5s 0.3s both;">
      <div style="width:44px;height:44px;border-radius:50%;background:rgba(200,160,74,0.18);border:1px solid rgba(200,160,74,0.4);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#C8A04A;">N</div>
      <div>
        <div style="font-size:17px;font-weight:700;color:rgba(255,255,255,0.75);">Nei Maldaner</div>
        <div style="font-size:14px;font-weight:400;color:rgba(255,255,255,0.3);">Fundador da INEMA · inema.vip</div>
      </div>
    </div>
  </div>
</div>`);
}

function slide13() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;padding:80px;overflow:hidden;">
  <!-- Blue ambient glow -->
  <div style="position:absolute;top:-200px;left:-200px;width:700px;height:700px;background:radial-gradient(circle,rgba(0,153,255,0.09) 0%,transparent 55%);pointer-events:none;"></div>
  <!-- Headline -->
  <div style="position:relative;z-index:1;animation:fadeUp 0.5s both;margin-bottom:40px;flex:0 0 auto;">
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.25em;text-transform:uppercase;margin-bottom:20px;">ACESSO EXCLUSIVO</div>
    <h1 style="font-size:76px;font-weight:900;line-height:0.97;letter-spacing:-0.02em;text-transform:uppercase;">
      A ELITE QUE JÁ<br>ESTÁ DO<br><span style="color:#0099FF;">OUTRO LADO</span>
    </h1>
  </div>
  <!-- Cards grid -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:1;animation:scaleIn 0.5s 0.15s both;">
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(0,153,255,0.2);border-radius:16px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;">
      <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px;">IA & AGENTES</div>
      <div style="font-size:22px;font-weight:600;color:rgba(255,255,255,0.78);line-height:1.4;">Vibe Coding +<br>Sistemas Agentic</div>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(0,153,255,0.2);border-radius:16px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;">
      <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px;">NETWORKING</div>
      <div style="font-size:22px;font-weight:600;color:rgba(255,255,255,0.78);line-height:1.4;">C-level &<br>Executivos Sênior</div>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(0,153,255,0.2);border-radius:16px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;">
      <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px;">TRANSFORMAÇÃO</div>
      <div style="font-size:22px;font-weight:600;color:rgba(255,255,255,0.78);line-height:1.4;">Digital + Estratégia<br>Executiva</div>
    </div>
    <div style="background:rgba(0,153,255,0.1);border:1px solid rgba(0,153,255,0.35);border-radius:16px;padding:28px;display:flex;flex-direction:column;justify-content:center;text-align:center;">
      <div style="font-size:72px;font-weight:900;color:#0099FF;line-height:0.9;">30+</div>
      <div style="font-size:17px;font-weight:700;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.1em;margin-top:8px;">grupos VIP</div>
    </div>
  </div>
  <!-- Bottom row -->
  <div style="margin-top:28px;display:flex;align-items:center;justify-content:space-between;flex:0 0 auto;animation:fadeUp 0.5s 0.3s both;">
    <div style="font-size:22px;font-weight:600;color:rgba(255,255,255,0.45);">Networking com líderes que já estão do outro lado</div>
    <div style="font-size:16px;font-weight:800;color:rgba(0,153,255,0.7);letter-spacing:0.1em;white-space:nowrap;">INEMA.VIP →</div>
  </div>
</div>`);
}

function slide14() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;background:#0D0D0D;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px;overflow:hidden;text-align:center;">
  <!-- Radiating lines -->
  <div style="position:absolute;top:50%;left:50%;width:2px;height:600px;background:linear-gradient(to bottom,transparent,rgba(200,160,74,0.14),transparent);transform-origin:center;transform:translate(-50%,-50%) rotate(0deg);"></div>
  <div style="position:absolute;top:50%;left:50%;width:2px;height:600px;background:linear-gradient(to bottom,transparent,rgba(200,160,74,0.11),transparent);transform-origin:center;transform:translate(-50%,-50%) rotate(30deg);"></div>
  <div style="position:absolute;top:50%;left:50%;width:2px;height:600px;background:linear-gradient(to bottom,transparent,rgba(200,160,74,0.11),transparent);transform-origin:center;transform:translate(-50%,-50%) rotate(60deg);"></div>
  <div style="position:absolute;top:50%;left:50%;width:2px;height:600px;background:linear-gradient(to bottom,transparent,rgba(200,160,74,0.11),transparent);transform-origin:center;transform:translate(-50%,-50%) rotate(90deg);"></div>
  <div style="position:absolute;top:50%;left:50%;width:2px;height:600px;background:linear-gradient(to bottom,transparent,rgba(200,160,74,0.11),transparent);transform-origin:center;transform:translate(-50%,-50%) rotate(120deg);"></div>
  <div style="position:absolute;top:50%;left:50%;width:2px;height:600px;background:linear-gradient(to bottom,transparent,rgba(200,160,74,0.11),transparent);transform-origin:center;transform:translate(-50%,-50%) rotate(150deg);"></div>
  <!-- Gold radial glow -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:640px;height:640px;background:radial-gradient(circle,rgba(200,160,74,0.14) 0%,rgba(200,160,74,0.04) 40%,transparent 65%);pointer-events:none;"></div>
  <!-- Concentric rings -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:740px;height:740px;border-radius:50%;border:1px solid rgba(200,160,74,0.07);"></div>
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:540px;height:540px;border-radius:50%;border:1px solid rgba(200,160,74,0.09);"></div>
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:320px;height:320px;border-radius:50%;border:1px solid rgba(200,160,74,0.13);"></div>
  <!-- Gold top/bottom lines -->
  <div style="position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(to right,transparent,#C8A04A,transparent);"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(to right,transparent,#C8A04A,transparent);"></div>
  <!-- Content -->
  <div style="position:relative;z-index:1;animation:fadeUp 0.5s both;">
    <div style="font-size:14px;font-weight:700;color:rgba(200,160,74,0.65);letter-spacing:0.3em;text-transform:uppercase;margin-bottom:28px;">PÁSCOA 2026 · INEMA</div>
    <h1 style="font-size:92px;font-weight:900;line-height:0.93;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:24px;text-shadow:0 0 60px rgba(200,160,74,0.18);">
      RENASÇA<br>COMO<br><span style="color:#C8A04A;">LÍDER</span>
    </h1>
    <div style="width:80px;height:2px;background:rgba(200,160,74,0.55);margin:32px auto 32px;"></div>
    <p style="font-size:28px;font-weight:400;color:rgba(255,255,255,0.5);line-height:1.65;margin-bottom:52px;">
      O próximo ciclo começa<br>antes que você perceba.
    </p>
    <!-- Mega URL CTA -->
    <div style="animation:scaleIn 0.5s 0.2s both;">
      <div style="font-size:56px;font-weight:900;color:#C8A04A;text-transform:uppercase;letter-spacing:0.05em;text-shadow:0 0 32px rgba(200,160,74,0.4);">INEMA.VIP</div>
      <div style="font-size:20px;font-weight:600;color:rgba(255,255,255,0.32);margin-top:14px;letter-spacing:0.06em;text-transform:uppercase;">Entre agora · R$ 35/mês</div>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide metadata
// ─────────────────────────────────────────────────────────────────────────────

const slides = [
  { id: '01', fn: slide01, carousel: 1, concept: 'Hook sazonal — Páscoa 2026 para líderes (Gold accent, 2026 background, centered)', copy_source: 'carousel_texts[0] / headlines[0]' },
  { id: '02', fn: slide02, carousel: 1, concept: 'Metáfora do maestro — left-aligned editorial, blue accent, staff lines', copy_source: 'carousel_texts[1] / headlines[1]' },
  { id: '03', fn: slide03, carousel: 1, concept: 'Dado urgência 93% — hero number, blue, centered typographic', copy_source: 'carousel_texts[2] / headlines[2]' },
  { id: '04', fn: slide04, carousel: 1, concept: 'Vibe Coding — split grid, terminal CSS, green neon', copy_source: 'carousel_texts[3] / headlines[3]' },
  { id: '05', fn: slide05, carousel: 1, concept: 'Delegação vs Orquestração — top headline + bottom split panel', copy_source: 'carousel_texts[4] / headlines[4]' },
  { id: '06', fn: slide06, carousel: 1, concept: 'Comunidade VIP — network nodes CSS, blue, stats bar', copy_source: 'carousel_texts[5] / headlines[8]' },
  { id: '07', fn: slide07, carousel: 1, concept: 'CTA Renascimento — egg CSS, gold, pill CTA button', copy_source: 'carousel_texts[6] / approved_ctas[0]' },
  { id: '08', fn: slide08, carousel: 2, concept: 'Hook simbólico — archway/portal CSS, gold passage metaphor', copy_source: 'carousel_texts[7] / headlines[9]' },
  { id: '09', fn: slide09, carousel: 2, concept: 'Evolução liderança — timeline CSS 2005→2025→2026, blue', copy_source: 'carousel_texts[8] / headlines[5]' },
  { id: '10', fn: slide10, carousel: 2, concept: 'Agentes autônomos — orbital nodes, green neon, orchestra', copy_source: 'carousel_texts[9]' },
  { id: '11', fn: slide11, carousel: 2, concept: 'Urgência do gap 62% — amber stat hero, warning tone', copy_source: 'carousel_texts[10]' },
  { id: '12', fn: slide12, carousel: 2, concept: 'Autoridade fundador — vertical timeline left panel, gold', copy_source: 'carousel_texts[11] / headlines[6]' },
  { id: '13', fn: slide13, carousel: 2, concept: 'Comunidade VIP premium — glassmorphism cards, blue panels', copy_source: 'carousel_texts[12] / headlines[8]' },
  { id: '14', fn: slide14, carousel: 2, concept: 'Final CTA gold explosion — radiating lines, concentric rings, mega URL', copy_source: 'carousel_texts[13] / approved_ctas[0]' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Playwright render
// ─────────────────────────────────────────────────────────────────────────────

async function renderAll() {
  console.log('🚀 Starting render — 14 carousel slides\n');
  const browser = await chromium.launch();
  const layoutSlides = [];

  for (const slide of slides) {
    const prefix = `c0038-pascoa_2026_carousel_${slide.id}`;
    const htmlFile = `${prefix}.html`;
    const pngFile = `${prefix}.png`;
    const htmlPath = path.join(OUT_DIR, htmlFile);
    const pngPath = path.join(OUT_DIR, pngFile);

    // Write HTML
    const html = slide.fn();
    fs.writeFileSync(htmlPath, html, 'utf8');

    // Render PNG
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.goto('file://' + htmlPath);
    await page.waitForTimeout(1200); // wait for fonts + animations
    await page.screenshot({ path: pngPath });
    await page.close();

    console.log(`  ✅ ${pngFile}  [Carousel ${slide.carousel}]`);

    layoutSlides.push({
      filename: pngFile,
      html_source: htmlFile,
      carousel: slide.carousel,
      dimensions: '1080x1080',
      concept: slide.concept,
      copy_source: slide.copy_source,
      images_used: []
    });
  }

  await browser.close();

  // Save layout.json
  const layout = {
    campaign: 'c0038-pascoa_2026',
    brand: 'INEMA',
    generated_at: new Date().toISOString(),
    total_slides: slides.length,
    carousels: {
      carousel_1: { title: 'O Líder Maestro: 7 Competências da Era Agentic', slides: 7 },
      carousel_2: { title: 'Páscoa e IA: A Transformação que Ninguém Estava Esperando', slides: 7 }
    },
    slides: layoutSlides
  };

  const layoutPath = path.join(OUT_DIR, 'layout.json');
  fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 2), 'utf8');
  console.log('\n  ✅ Saved layout.json');
  console.log(`\n✅ Done. Files in: ${OUT_DIR}\n`);
}

renderAll().catch(err => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
