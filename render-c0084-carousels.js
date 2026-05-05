const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname);
const IMGS_DIR = path.join(BASE, 'prj/inema/outputs/c0084-assistente_agente_agentic_ia/imgs');
const ADS_DIR = path.join(BASE, 'prj/inema/outputs/c0084-assistente_agente_agentic_ia/ads');

if (!fs.existsSync(ADS_DIR)) fs.mkdirSync(ADS_DIR, { recursive: true });

function imgPath(n) {
  const num = String(n).padStart(2, '0');
  return path.join(IMGS_DIR, `c0084-assistente_agente_agentic_ia_generated_${num}_carousel_1080x1080.jpg`);
}

function fileUrl(p) {
  return 'file://' + p;
}

// Brand colors
const C = {
  bg: '#0D0D0D',
  bg2: '#1A1A2E',
  blue: '#0099FF',
  green: '#00FF88',
  white: '#FFFFFF',
  grey: '#8892A4',
  dark: 'rgba(0,0,0,0.72)',
  darkStrong: 'rgba(0,0,0,0.85)',
};

function baseHtml(content) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080,height=1080">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1080px; overflow: hidden; font-family: 'Space Grotesk', sans-serif; background: ${C.bg}; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .anim-up { animation: fadeUp 0.5s ease both; }
  .anim-scale { animation: scaleIn 0.5s ease both; }
  .anim-fade { animation: fadeIn 0.6s ease both; }
  .delay1 { animation-delay: 0.1s; }
  .delay2 { animation-delay: 0.2s; }
  .delay3 { animation-delay: 0.35s; }
</style>
</head>
<body>${content}</body>
</html>`;
}

const slides = [
  // SLIDE 1 — Hook
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_01.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_01.html',
    imgIndex: 1,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};">
  <img src="${fileUrl(imgPath(1))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.55) contrast(1.15) saturate(1.2);" />
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.3) 40%,rgba(0,0,0,0.8) 100%);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-fade" style="display:inline-block;background:${C.blue};color:#fff;font-size:24px;font-weight:700;letter-spacing:0.12em;padding:8px 24px;border-radius:9999px;margin-bottom:32px;text-transform:uppercase;">
      INEMA.CLUB
    </div>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;padding:64px;background:linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.6) 60%,transparent 100%);">
    <div class="anim-up" style="font-size:100px;font-weight:800;color:#fff;line-height:1.0;letter-spacing:-0.02em;text-shadow:0 4px 32px rgba(0,0,0,0.8);margin-bottom:24px;">
      Você sabe a<br><span style="color:${C.blue};">diferença?</span>
    </div>
    <div class="anim-up delay1" style="font-size:42px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.4;text-shadow:0 2px 12px rgba(0,0,0,0.7);">
      Assistente, Agente ou Agentic<br>— não são a mesma coisa. 🤖
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.06em;">1 / 15</div>
</div>`)
  },

  // SLIDE 2 — Contexto
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_02.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_02.html',
    imgIndex: 2,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg2};">
  <img src="${fileUrl(imgPath(2))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.45) contrast(1.1) saturate(1.1);" />
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,153,255,0.18) 0%,rgba(0,0,0,0.7) 100%);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-up" style="font-size:38px;font-weight:700;color:${C.blue};letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">O Problema</div>
    <div class="anim-up delay1" style="font-size:76px;font-weight:800;color:#fff;line-height:1.05;letter-spacing:-0.01em;text-shadow:0 4px 24px rgba(0,0,0,0.8);margin-bottom:32px;">
      Todo mundo<br>usa IA.
    </div>
    <div class="anim-up delay2" style="width:80px;height:5px;background:${C.blue};border-radius:9999px;margin-bottom:32px;"></div>
    <div class="anim-up delay2" style="font-size:46px;font-weight:500;color:rgba(255,255,255,0.88);line-height:1.45;text-shadow:0 2px 12px rgba(0,0,0,0.7);">
      Mas a maioria usa no<br><span style="color:${C.blue};font-weight:700;">nível mais básico</span><br>sem saber que existem<br>dois acima.
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">2 / 15</div>
</div>`)
  },

  // SLIDE 3 — Analogia intro
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_03.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_03.html',
    imgIndex: 3,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};">
  <img src="${fileUrl(imgPath(3))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.4) contrast(1.2) saturate(1.15);" />
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,255,136,0.08) 0%,rgba(0,0,0,0.75) 80%);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-up" style="font-size:36px;font-weight:700;color:${C.green};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px;">A Analogia</div>
    <div class="anim-up delay1" style="font-size:72px;font-weight:800;color:#fff;line-height:1.05;letter-spacing:-0.01em;text-shadow:0 4px 24px rgba(0,0,0,0.8);margin-bottom:36px;">
      Pense em<br><span style="color:${C.green};">cargos de<br>trabalho.</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:20px;" class="anim-up delay2">
      <div style="display:flex;align-items:center;gap:20px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:22px 28px;backdrop-filter:blur(8px);">
        <span style="font-size:40px;">🧑‍💼</span>
        <span style="font-size:38px;font-weight:600;color:#fff;">O Atendente</span>
      </div>
      <div style="display:flex;align-items:center;gap:20px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:22px 28px;backdrop-filter:blur(8px);">
        <span style="font-size:40px;">⚙️</span>
        <span style="font-size:38px;font-weight:600;color:#fff;">O Funcionário</span>
      </div>
      <div style="display:flex;align-items:center;gap:20px;background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);border-radius:16px;padding:22px 28px;backdrop-filter:blur(8px);">
        <span style="font-size:40px;">🚀</span>
        <span style="font-size:38px;font-weight:600;color:${C.green};">O Autônomo Proativo</span>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">3 / 15</div>
</div>`)
  },

  // SLIDE 4 — ASSISTENTE título
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_04.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_04.html',
    imgIndex: 4,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg2};">
  <img src="${fileUrl(imgPath(4))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.35) contrast(1.2) saturate(0.9);" />
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,153,255,0.25) 0%,rgba(13,13,13,0.85) 60%);"></div>
  <div style="position:absolute;inset:64px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
    <div class="anim-fade" style="font-size:26px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:28px;">NÍVEL 1</div>
    <div class="anim-scale" style="font-size:136px;font-weight:800;color:${C.blue};line-height:1.0;letter-spacing:-0.03em;text-shadow:0 0 80px rgba(0,153,255,0.5),0 4px 32px rgba(0,0,0,0.8);margin-bottom:16px;">
      ASSIS-<br>TENTE
    </div>
    <div class="anim-up delay2" style="width:120px;height:5px;background:${C.blue};border-radius:9999px;margin:24px auto;"></div>
    <div class="anim-up delay3" style="font-size:44px;font-weight:500;color:rgba(255,255,255,0.8);letter-spacing:0.04em;">
      O Atendente de Balcão 🧑‍💼
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">4 / 15</div>
</div>`)
  },

  // SLIDE 5 — Assistente definição
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_05.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_05.html',
    imgIndex: 5,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};">
  <img src="${fileUrl(imgPath(5))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.4) contrast(1.1) saturate(1.0);" />
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,153,255,0.15) 0%,rgba(0,0,0,0.8) 100%);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-fade" style="display:inline-flex;align-items:center;gap:12px;background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.4);border-radius:9999px;padding:10px 24px;margin-bottom:36px;">
      <span style="color:${C.blue};font-size:26px;font-weight:700;letter-spacing:0.1em;">ASSISTENTE</span>
    </div>
    <div class="anim-up delay1" style="font-size:74px;font-weight:800;color:#fff;line-height:1.05;text-shadow:0 4px 24px rgba(0,0,0,0.8);margin-bottom:36px;">
      Responde<br>quando você<br><span style="color:${C.blue};">pergunta.</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:18px;" class="anim-up delay2">
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="min-width:8px;height:8px;border-radius:50%;background:${C.blue};margin-top:20px;"></div>
        <span style="font-size:38px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.4;">Aguarda seu comando</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="min-width:8px;height:8px;border-radius:50%;background:${C.blue};margin-top:20px;"></div>
        <span style="font-size:38px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.4;">Reativo por natureza</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="min-width:8px;height:8px;border-radius:50%;background:${C.blue};margin-top:20px;"></div>
        <span style="font-size:38px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.4;">Não age por conta própria</span>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">5 / 15</div>
</div>`)
  },

  // SLIDE 6 — Assistente exemplo
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_06.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_06.html',
    imgIndex: 6,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg2};">
  <img src="${fileUrl(imgPath(6))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.35) contrast(1.15) saturate(1.1);" />
  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.65);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-fade" style="display:inline-flex;align-items:center;gap:12px;background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.4);border-radius:9999px;padding:10px 24px;margin-bottom:36px;">
      <span style="color:${C.blue};font-size:26px;font-weight:700;letter-spacing:0.1em;">EXEMPLO REAL</span>
    </div>
    <div class="anim-up delay1" style="font-size:42px;font-weight:500;color:rgba(255,255,255,0.65);line-height:1.5;margin-bottom:28px;">Você diz:</div>
    <div class="anim-up delay1" style="background:rgba(0,153,255,0.12);border-left:5px solid ${C.blue};border-radius:0 12px 12px 0;padding:24px 32px;margin-bottom:36px;">
      <span style="font-size:46px;font-weight:700;color:#fff;font-style:italic;line-height:1.35;">"Me explica<br>esse relatório."</span>
    </div>
    <div class="anim-up delay2" style="font-size:42px;font-weight:500;color:rgba(255,255,255,0.65);margin-bottom:16px;">Ele faz:</div>
    <div class="anim-up delay2" style="font-size:52px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:24px;">
      Explica. <span style="color:${C.blue};">Pronto.</span>
    </div>
    <div class="anim-up delay3" style="font-size:40px;font-weight:500;color:rgba(255,255,255,0.7);line-height:1.4;">
      Aguarda o <span style="color:${C.blue};font-weight:700;">próximo pedido.</span>
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">6 / 15</div>
</div>`)
  },

  // SLIDE 7 — AGENTE título
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_07.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_07.html',
    imgIndex: 7,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};">
  <img src="${fileUrl(imgPath(7))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.35) contrast(1.2) saturate(1.1);" />
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,180,220,0.2) 0%,rgba(0,0,0,0.85) 65%);"></div>
  <div style="position:absolute;inset:64px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
    <div class="anim-fade" style="font-size:26px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:28px;">NÍVEL 2</div>
    <div class="anim-scale" style="font-size:160px;font-weight:800;color:#00CCFF;line-height:0.95;letter-spacing:-0.04em;text-shadow:0 0 80px rgba(0,200,255,0.45),0 4px 32px rgba(0,0,0,0.8);margin-bottom:16px;">
      AGENTE
    </div>
    <div class="anim-up delay2" style="width:120px;height:5px;background:#00CCFF;border-radius:9999px;margin:24px auto;"></div>
    <div class="anim-up delay3" style="font-size:44px;font-weight:500;color:rgba(255,255,255,0.8);letter-spacing:0.04em;">
      O Funcionário Executor ⚙️
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">7 / 15</div>
</div>`)
  },

  // SLIDE 8 — Agente definição
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_08.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_08.html',
    imgIndex: 8,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg2};">
  <img src="${fileUrl(imgPath(8))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.4) contrast(1.1) saturate(1.1);" />
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,180,220,0.12) 0%,rgba(0,0,0,0.82) 100%);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-fade" style="display:inline-flex;align-items:center;gap:12px;background:rgba(0,200,255,0.12);border:1px solid rgba(0,200,255,0.35);border-radius:9999px;padding:10px 24px;margin-bottom:36px;">
      <span style="color:#00CCFF;font-size:26px;font-weight:700;letter-spacing:0.1em;">AGENTE</span>
    </div>
    <div class="anim-up delay1" style="font-size:74px;font-weight:800;color:#fff;line-height:1.05;text-shadow:0 4px 24px rgba(0,0,0,0.8);margin-bottom:36px;">
      Objetivo definido.<br><span style="color:#00CCFF;">Age com<br>autonomia.</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:18px;" class="anim-up delay2">
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="min-width:8px;height:8px;border-radius:50%;background:#00CCFF;margin-top:20px;"></div>
        <span style="font-size:38px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.4;">Planeja os passos</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="min-width:8px;height:8px;border-radius:50%;background:#00CCFF;margin-top:20px;"></div>
        <span style="font-size:38px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.4;">Usa ferramentas disponíveis</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="min-width:8px;height:8px;border-radius:50%;background:#00CCFF;margin-top:20px;"></div>
        <span style="font-size:38px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.4;">Age dentro da missão</span>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">8 / 15</div>
</div>`)
  },

  // SLIDE 9 — Agente exemplo
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_09.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_09.html',
    imgIndex: 9,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};">
  <img src="${fileUrl(imgPath(9))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.35) contrast(1.15) saturate(1.1);" />
  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.65);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-fade" style="display:inline-flex;align-items:center;gap:12px;background:rgba(0,200,255,0.12);border:1px solid rgba(0,200,255,0.35);border-radius:9999px;padding:10px 24px;margin-bottom:36px;">
      <span style="color:#00CCFF;font-size:26px;font-weight:700;letter-spacing:0.1em;">EXEMPLO REAL</span>
    </div>
    <div class="anim-up delay1" style="font-size:42px;font-weight:500;color:rgba(255,255,255,0.65);margin-bottom:16px;">Você diz:</div>
    <div class="anim-up delay1" style="background:rgba(0,200,255,0.1);border-left:5px solid #00CCFF;border-radius:0 12px 12px 0;padding:24px 32px;margin-bottom:32px;">
      <span style="font-size:38px;font-weight:700;color:#fff;font-style:italic;line-height:1.4;">"Pesquisa 3 fornecedores,<br>compara preços e me<br>manda o resumo."</span>
    </div>
    <div class="anim-up delay2" style="font-size:42px;font-weight:500;color:rgba(255,255,255,0.65);margin-bottom:16px;">Ele faz:</div>
    <div class="anim-up delay2" style="font-size:52px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:20px;">
      <span style="color:#00CCFF;">Tudo.</span> Você recebe<br>o resultado.
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">9 / 15</div>
</div>`)
  },

  // SLIDE 10 — AGENTIC título
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_10.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_10.html',
    imgIndex: 10,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};">
  <img src="${fileUrl(imgPath(10))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.3) contrast(1.25) saturate(1.2);" />
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,255,136,0.18) 0%,rgba(0,0,0,0.88) 65%);"></div>
  <div style="position:absolute;inset:64px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
    <div class="anim-fade" style="font-size:26px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:28px;">NÍVEL 3</div>
    <div class="anim-scale" style="font-size:140px;font-weight:800;color:${C.green};line-height:0.95;letter-spacing:-0.03em;text-shadow:0 0 100px rgba(0,255,136,0.4),0 4px 32px rgba(0,0,0,0.8);margin-bottom:16px;">
      AGENTIC
    </div>
    <div class="anim-up delay2" style="width:120px;height:5px;background:${C.green};border-radius:9999px;margin:24px auto;"></div>
    <div class="anim-up delay3" style="font-size:44px;font-weight:500;color:rgba(255,255,255,0.8);letter-spacing:0.04em;">
      O Profissional Proativo 🚀
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">10 / 15</div>
</div>`)
  },

  // SLIDE 11 — Agentic definição
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_11.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_11.html',
    imgIndex: 11,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg2};">
  <img src="${fileUrl(imgPath(11))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.38) contrast(1.15) saturate(1.2);" />
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,255,136,0.1) 0%,rgba(0,0,0,0.85) 100%);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-fade" style="display:inline-flex;align-items:center;gap:12px;background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.35);border-radius:9999px;padding:10px 24px;margin-bottom:32px;">
      <span style="color:${C.green};font-size:26px;font-weight:700;letter-spacing:0.1em;">AGENTIC</span>
    </div>
    <div class="anim-up delay1" style="font-size:64px;font-weight:800;color:#fff;line-height:1.1;text-shadow:0 4px 24px rgba(0,0,0,0.8);margin-bottom:28px;">
      Não é um tipo de IA.<br><span style="color:${C.green};">É um comportamento.</span>
    </div>
    <div class="anim-up delay2" style="width:80px;height:4px;background:${C.green};border-radius:9999px;margin-bottom:28px;"></div>
    <div class="anim-up delay2" style="font-size:40px;font-weight:500;color:rgba(255,255,255,0.82);line-height:1.55;">
      Toma iniciativa, decide<br>próximos passos, executa<br>em sequência —<br><span style="color:${C.green};font-weight:700;">sem precisar de instruções<br>passo a passo.</span>
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">11 / 15</div>
</div>`)
  },

  // SLIDE 12 — Agentic exemplo
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_12.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_12.html',
    imgIndex: 12,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};">
  <img src="${fileUrl(imgPath(12))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.35) contrast(1.15) saturate(1.15);" />
  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.68);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-fade" style="display:inline-flex;align-items:center;gap:12px;background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.35);border-radius:9999px;padding:10px 24px;margin-bottom:36px;">
      <span style="color:${C.green};font-size:26px;font-weight:700;letter-spacing:0.1em;">EXEMPLO REAL</span>
    </div>
    <div class="anim-up delay1" style="background:rgba(0,255,136,0.08);border-left:5px solid ${C.green};border-radius:0 12px 12px 0;padding:28px 32px;margin-bottom:36px;">
      <span style="font-size:40px;font-weight:600;color:rgba(255,255,255,0.9);line-height:1.5;">Um sistema agentic<br>monitora oportunidades,<br>detecta o momento certo<br>e já prepara a resposta —<br><span style="color:${C.green};font-weight:700;">sem você precisar pedir.</span></span>
    </div>
    <div class="anim-up delay2" style="display:flex;gap:20px;flex-wrap:wrap;">
      <div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.25);border-radius:12px;padding:16px 24px;font-size:32px;font-weight:600;color:#fff;">🔍 Monitora</div>
      <div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.25);border-radius:12px;padding:16px 24px;font-size:32px;font-weight:600;color:#fff;">⚡ Detecta</div>
      <div style="background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.4);border-radius:12px;padding:16px 24px;font-size:32px;font-weight:700;color:${C.green};">🚀 Age</div>
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">12 / 15</div>
</div>`)
  },

  // SLIDE 13 — Comparativo
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_13.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_13.html',
    imgIndex: 13,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg2};">
  <img src="${fileUrl(imgPath(13))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.25) contrast(1.2) saturate(0.9);" />
  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.72);"></div>
  <div style="position:absolute;top:56px;left:64px;right:64px;text-align:center;">
    <div class="anim-up" style="font-size:52px;font-weight:800;color:#fff;letter-spacing:0.02em;margin-bottom:8px;">O Comparativo</div>
    <div class="anim-up delay1" style="width:80px;height:4px;background:linear-gradient(90deg,${C.blue},${C.green});border-radius:9999px;margin:16px auto 40px;"></div>
  </div>
  <div style="position:absolute;top:200px;left:64px;right:64px;display:flex;gap:24px;" class="anim-up delay1">
    <div style="flex:1;background:rgba(0,153,255,0.1);border:2px solid rgba(0,153,255,0.4);border-radius:20px;padding:32px 24px;text-align:center;">
      <div style="font-size:52px;margin-bottom:16px;">🧑‍💼</div>
      <div style="font-size:36px;font-weight:800;color:${C.blue};margin-bottom:12px;letter-spacing:0.05em;">ASSISTENTE</div>
      <div style="width:40px;height:3px;background:${C.blue};border-radius:9999px;margin:0 auto 16px;"></div>
      <div style="font-size:30px;font-weight:600;color:rgba(255,255,255,0.85);line-height:1.4;">Responde<br>perguntas</div>
    </div>
    <div style="flex:1;background:rgba(0,200,255,0.1);border:2px solid rgba(0,200,255,0.4);border-radius:20px;padding:32px 24px;text-align:center;">
      <div style="font-size:52px;margin-bottom:16px;">⚙️</div>
      <div style="font-size:36px;font-weight:800;color:#00CCFF;margin-bottom:12px;letter-spacing:0.05em;">AGENTE</div>
      <div style="width:40px;height:3px;background:#00CCFF;border-radius:9999px;margin:0 auto 16px;"></div>
      <div style="font-size:30px;font-weight:600;color:rgba(255,255,255,0.85);line-height:1.4;">Executa<br>missões</div>
    </div>
    <div style="flex:1;background:rgba(0,255,136,0.1);border:2px solid rgba(0,255,136,0.4);border-radius:20px;padding:32px 24px;text-align:center;">
      <div style="font-size:52px;margin-bottom:16px;">🚀</div>
      <div style="font-size:36px;font-weight:800;color:${C.green};margin-bottom:12px;letter-spacing:0.05em;">AGENTIC</div>
      <div style="width:40px;height:3px;background:${C.green};border-radius:9999px;margin:0 auto 16px;"></div>
      <div style="font-size:30px;font-weight:600;color:rgba(255,255,255,0.85);line-height:1.4;">Resolve por<br>conta própria</div>
    </div>
  </div>
  <div style="position:absolute;bottom:100px;left:64px;right:64px;" class="anim-up delay2">
    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:28px 32px;text-align:center;">
      <div style="font-size:36px;font-weight:500;color:rgba(255,255,255,0.75);line-height:1.5;">
        Atendente → Funcionário → <span style="color:${C.green};font-weight:700;">Autônomo Proativo</span>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">13 / 15</div>
</div>`)
  },

  // SLIDE 14 — Por que importa
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_14.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_14.html',
    imgIndex: 14,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};">
  <img src="${fileUrl(imgPath(14))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.4) contrast(1.15) saturate(1.2);" />
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.85) 100%);"></div>
  <div style="position:absolute;top:64px;left:64px;right:64px;">
    <div class="anim-fade" style="display:inline-block;background:linear-gradient(90deg,${C.blue},${C.green});-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;">
      Por que isso importa
    </div>
    <div class="anim-up delay1" style="font-size:72px;font-weight:800;color:#fff;line-height:1.08;text-shadow:0 4px 24px rgba(0,0,0,0.8);margin-bottom:36px;">
      Saber isso<br><span style="color:${C.green};">muda o jogo.</span>
    </div>
    <div class="anim-up delay2" style="width:80px;height:4px;background:${C.green};border-radius:9999px;margin-bottom:32px;"></div>
    <div class="anim-up delay2" style="font-size:42px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.55;">
      Você para de usar IA<br>como ferramenta passiva<br>e começa a ter uma<br><span style="color:${C.green};font-weight:700;">equipe que trabalha<br>enquanto você dorme.</span>
    </div>
  </div>
  <div style="position:absolute;bottom:36px;right:64px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">14 / 15</div>
</div>`)
  },

  // SLIDE 15 — CTA final
  {
    filename: 'c0084-assistente_agente_agentic_ia_carousel_15.png',
    htmlFile: 'c0084-assistente_agente_agentic_ia_carousel_15.html',
    imgIndex: 15,
    html: () => baseHtml(`
<div style="position:relative;width:1080px;height:1080px;background:${C.bg};">
  <img src="${fileUrl(imgPath(15))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.3) contrast(1.2) saturate(1.1);" />
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,153,255,0.15) 0%,rgba(0,0,0,0.9) 60%,rgba(0,255,136,0.08) 100%);"></div>
  <div style="position:absolute;inset:64px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
    <div class="anim-up" style="font-size:48px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:0.04em;line-height:1.5;margin-bottom:16px;">
      Trilha completa.<br>100% gratuita. Sem truques.
    </div>
    <div class="anim-up delay1" style="width:100px;height:5px;background:linear-gradient(90deg,${C.blue},${C.green});border-radius:9999px;margin:24px auto 36px;"></div>
    <div class="anim-scale delay2" style="font-size:120px;font-weight:800;color:#fff;line-height:1.0;letter-spacing:-0.02em;text-shadow:0 0 80px rgba(0,153,255,0.4),0 4px 40px rgba(0,0,0,0.9);margin-bottom:12px;">
      INEMA
    </div>
    <div class="anim-scale delay2" style="font-size:120px;font-weight:800;color:${C.green};line-height:1.0;letter-spacing:-0.02em;text-shadow:0 0 80px rgba(0,255,136,0.4),0 4px 40px rgba(0,0,0,0.9);margin-bottom:40px;">
      .CLUB
    </div>
    <div class="anim-up delay3" style="display:inline-block;background:linear-gradient(90deg,${C.blue},${C.green});border-radius:9999px;padding:22px 72px;">
      <span style="font-size:42px;font-weight:800;color:#fff;letter-spacing:0.1em;text-transform:uppercase;">Acesse Grátis Agora 🚀</span>
    </div>
    <div class="anim-fade delay3" style="font-size:36px;font-weight:500;color:rgba(255,255,255,0.55);margin-top:28px;letter-spacing:0.04em;">
      Aprenda a construir e usar agentes de verdade.
    </div>
  </div>
</div>`)
  },
];

async function render() {
  const browser = await chromium.launch();

  for (const slide of slides) {
    const htmlContent = slide.html();
    const htmlPath = path.join(ADS_DIR, slide.htmlFile);
    const pngPath = path.join(ADS_DIR, slide.filename);

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.goto('file://' + htmlPath);
    await page.waitForTimeout(800);
    await page.screenshot({ path: pngPath });
    await page.close();

    console.log(`✓ ${slide.filename}`);
  }

  await browser.close();

  // Write layout.json
  const layout = {
    campaign: 'c0084-assistente_agente_agentic_ia',
    date: '2026-04-20',
    platform: 'instagram',
    dimensions: '1080x1080',
    slides: slides.map((s, i) => ({
      index: i + 1,
      filename: s.filename,
      html_file: s.htmlFile,
      copy_source: 'narrative.json → carousel_texts[' + i + ']',
      image_used: path.basename(imgPath(s.imgIndex)),
      concept: [
        'Hook — Você sabe a diferença?',
        'Contexto — Nível mais básico',
        'Analogia — Cargos de trabalho',
        'ASSISTENTE — Título/Nível 1',
        'ASSISTENTE — Definição',
        'ASSISTENTE — Exemplo real',
        'AGENTE — Título/Nível 2',
        'AGENTE — Definição',
        'AGENTE — Exemplo real',
        'AGENTIC — Título/Nível 3',
        'AGENTIC — Definição',
        'AGENTIC — Exemplo real',
        'Comparativo 3 conceitos',
        'Por que isso importa',
        'CTA — INEMA.CLUB',
      ][i],
    })),
  };

  fs.writeFileSync(path.join(ADS_DIR, 'layout.json'), JSON.stringify(layout, null, 2));
  console.log('✓ layout.json');
  console.log('\n✅ All 15 carousel slides rendered.');
}

render().catch(err => {
  console.error(err);
  process.exit(1);
});
