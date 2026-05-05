#!/usr/bin/env node
// Render script — c0077-ia_para_nutricao_e_academias carousel slides
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CAMPAIGN = 'c0077-ia_para_nutricao_e_academias';
const BASE_DIR = `/home/nmaldaner/projetos/timesmkt3/prj/inema/outputs/${CAMPAIGN}`;
const ADS_DIR = path.join(BASE_DIR, 'ads');
const IMGS_DIR = path.join(BASE_DIR, 'imgs');

if (!fs.existsSync(ADS_DIR)) fs.mkdirSync(ADS_DIR, { recursive: true });

const imgPath = (n) => `${IMGS_DIR}/${CAMPAIGN}_generated_${String(n).padStart(2,'0')}_carousel_1080x1080.jpg`;

// ── Color palette ──────────────────────────────────────────────
const CYAN  = '#0099FF';
const GREEN = '#00FF88';
const DARK  = '#0D0D0D';
const DARK2 = '#1A1A2E';
const WHITE = '#FFFFFF';

// ── Google Fonts (always same) ─────────────────────────────────
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">`;

// ── Common CSS reset ───────────────────────────────────────────
const RESET = `
*{margin:0;padding:0;box-sizing:border-box;}
body{width:1080px;height:1080px;overflow:hidden;background:${DARK};}
.slide{width:1080px;height:1080px;position:relative;overflow:hidden;}
.bg{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.82) contrast(1.12) saturate(1.15);}
.vignette{position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,0.55) 100%);}
.badge{display:inline-block;font-family:'Space Grotesk',Arial,sans-serif;font-size:24px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${DARK};background:${CYAN};padding:10px 24px;border-radius:9999px;}
.badge-green{background:${GREEN};}
.url{font-family:'Space Grotesk',Arial,sans-serif;font-size:28px;font-weight:700;letter-spacing:0.06em;color:${CYAN};text-transform:uppercase;}
.tag{font-family:'Space Grotesk',Arial,sans-serif;font-size:22px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.5);}
`;

// ── Overlay helpers ────────────────────────────────────────────
const overlayDarkFull  = `background:linear-gradient(160deg,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.72) 100%)`;
const overlayDarkBot   = `background:linear-gradient(to bottom,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.5) 45%,rgba(0,0,0,0.82) 100%)`;
const overlayDarkTop   = `background:linear-gradient(to top,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.5) 45%,rgba(0,0,0,0.82) 100%)`;
const overlayCyanBot   = `background:linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,rgba(0,15,35,0.6) 50%,rgba(0,50,100,0.8) 100%)`;
const overlayGreenBot  = `background:linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,rgba(0,20,15,0.6) 50%,rgba(0,80,50,0.8) 100%)`;
const overlayDarkStrong= `background:linear-gradient(160deg,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.85) 100%)`;

function textShadow(opacity=0.6){ return `text-shadow:0 2px 12px rgba(0,0,0,${opacity}),0 0 48px rgba(0,0,0,${opacity*0.6})`; }

// ══════════════════════════════════════════════════════════════════
// SLIDE HTML GENERATORS
// ══════════════════════════════════════════════════════════════════

function slide01() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkFull};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:80px 80px;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${CYAN};margin-bottom:24px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:96px;font-weight:700;line-height:1.0;letter-spacing:-0.01em;color:${WHITE};${textShadow(0.7)};margin-bottom:12px;}
.headline em{color:${CYAN};font-style:normal;}
.sub{font-family:'Inter',Arial,sans-serif;font-size:44px;font-weight:400;line-height:1.3;color:rgba(255,255,255,0.85);${textShadow(0.5)};margin-top:24px;max-width:840px;}
.emoji-big{font-size:72px;margin-bottom:20px;}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(1)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">NUTRIÇÃO &amp; FITNESS + IA</div>
  <div class="headline">ÀS 22H,<br>UM LEAD<br><em>CHEGOU.</em></div>
  <div class="sub">Quem respondeu<br>no seu consultório? 🧠</div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide02() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkStrong};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:80px 80px;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:32px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:80px;font-weight:700;line-height:1.05;letter-spacing:-0.01em;color:${WHITE};${textShadow(0.6)};max-width:900px;}
.word-stress{color:${CYAN};}
.list{margin-top:40px;display:flex;flex-direction:column;gap:16px;}
.list-item{font-family:'Inter',Arial,sans-serif;font-size:36px;font-weight:400;color:rgba(255,255,255,0.75);${textShadow(0.4)};padding-left:24px;border-left:3px solid rgba(255,255,255,0.25);}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(2)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">O CICLO QUE TE ESGOTA</div>
  <div class="headline">TODO. DIA.<br><span class="word-stress">ISSO TE ESGOTA.</span></div>
  <div class="list">
    <div class="list-item">Responder as mesmas perguntas</div>
    <div class="list-item">Perseguir quem sumiu</div>
    <div class="list-item">Refazer o plano com pequenos ajustes</div>
    <div class="list-item">Perder lead por falta de resposta rápida</div>
  </div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide03() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkFull};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:80px 80px;text-align:center;}
.icon{font-size:80px;margin-bottom:32px;}
.headline-lg{font-family:'Space Grotesk',Arial,sans-serif;font-size:72px;font-weight:700;line-height:1.1;letter-spacing:-0.01em;color:${WHITE};${textShadow(0.7)};max-width:900px;}
.divider{width:120px;height:4px;background:${GREEN};margin:32px auto;border-radius:4px;}
.sub{font-family:'Inter',Arial,sans-serif;font-size:46px;font-weight:600;line-height:1.25;color:${GREEN};${textShadow(0.5)};max-width:800px;}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(3)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="icon">🔥</div>
  <div class="headline-lg">IA NÃO SUBSTITUI<br>O NUTRICIONISTA.</div>
  <div class="divider"></div>
  <div class="sub">Ela substitui o que o nutricionista<br>odeia fazer.</div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide04() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayCyanBot};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:80px 80px;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${CYAN};margin-bottom:28px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:88px;font-weight:700;line-height:1.0;letter-spacing:-0.02em;color:${WHITE};${textShadow(0.7)};}
.highlight{color:${CYAN};}
.sub{font-family:'Inter',Arial,sans-serif;font-size:42px;font-weight:400;line-height:1.35;color:rgba(255,255,255,0.85);${textShadow(0.5)};margin-top:32px;max-width:840px;}
.stat-box{margin-top:40px;background:rgba(0,153,255,0.15);backdrop-filter:blur(12px);border:1px solid rgba(0,153,255,0.35);border-radius:16px;padding:24px 36px;display:inline-block;}
.stat-text{font-family:'Space Grotesk',Arial,sans-serif;font-size:32px;font-weight:600;color:${WHITE};${textShadow(0.4)};}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(4)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">A REALIDADE DO MERCADO</div>
  <div class="headline">ENQUANTO<br>VOCÊ <span class="highlight">DORME...</span></div>
  <div class="sub">O sistema do seu concorrente<br>está convertendo leads.</div>
  <div class="stat-box">
    <div class="stat-text">⚡ Resposta automática em segundos.</div>
  </div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide05() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkStrong};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:80px 80px;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${GREEN};margin-bottom:20px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:72px;font-weight:700;line-height:1.05;letter-spacing:-0.01em;color:${WHITE};${textShadow(0.6)};margin-bottom:48px;}
.steps{display:flex;flex-direction:column;gap:20px;max-width:900px;}
.step{display:flex;align-items:center;gap:24px;}
.step-num{width:56px;height:56px;border-radius:50%;background:${GREEN};display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:700;color:${DARK};flex-shrink:0;}
.step-text{font-family:'Inter',Arial,sans-serif;font-size:38px;font-weight:600;color:${WHITE};${textShadow(0.4)};}
.step-arrow{font-size:28px;color:rgba(0,255,136,0.5);margin-top:6px;padding-left:16px;}
.tagline{margin-top:40px;font-family:'Space Grotesk',Arial,sans-serif;font-size:30px;font-weight:500;color:rgba(255,255,255,0.6);letter-spacing:0.08em;}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(5)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">O CAMINHO PRÁTICO</div>
  <div class="headline">4 PASSOS.<br>SEM CÓDIGO.</div>
  <div class="steps">
    <div class="step"><div class="step-num">1</div><div class="step-text">Mapear sua rotina</div></div>
    <div class="step-arrow">↓</div>
    <div class="step"><div class="step-num">2</div><div class="step-text">Quebrar em etapas simples</div></div>
    <div class="step-arrow">↓</div>
    <div class="step"><div class="step-num">3</div><div class="step-text">Escrever um prompt para cada etapa</div></div>
    <div class="step-arrow">↓</div>
    <div class="step"><div class="step-num">4</div><div class="step-text">Testar uma automação de cada vez</div></div>
  </div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide06() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkFull};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:80px 80px;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${CYAN};margin-bottom:24px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:60px;font-weight:700;line-height:1.1;letter-spacing:-0.01em;color:${WHITE};${textShadow(0.6)};margin-bottom:40px;}
.check-list{display:flex;flex-direction:column;gap:18px;}
.check-item{display:flex;align-items:center;gap:20px;}
.check{font-size:36px;color:${GREEN};}
.check-text{font-family:'Inter',Arial,sans-serif;font-size:38px;font-weight:500;color:rgba(255,255,255,0.9);${textShadow(0.4)};}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(6)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">IA TRABALHANDO AGORA</div>
  <div class="headline">PROFISSIONAIS DE SAÚDE<br>JÁ USAM IA PARA:</div>
  <div class="check-list">
    <div class="check-item"><span class="check">✅</span><span class="check-text">Responder leads 24/7</span></div>
    <div class="check-item"><span class="check">✅</span><span class="check-text">Triagem de pacientes</span></div>
    <div class="check-item"><span class="check">✅</span><span class="check-text">Follow-up automático</span></div>
    <div class="check-item"><span class="check">✅</span><span class="check-text">Criação de planos personalizados</span></div>
    <div class="check-item"><span class="check">✅</span><span class="check-text">Conteúdo de marketing</span></div>
  </div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide07() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkBot};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:80px 80px;text-align:center;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:32px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:100px;font-weight:700;line-height:1.0;letter-spacing:-0.02em;color:${WHITE};${textShadow(0.7)};}
.divider{width:160px;height:4px;background:linear-gradient(to right,${CYAN},${GREEN});margin:36px auto;border-radius:4px;}
.sub{font-family:'Inter',Arial,sans-serif;font-size:52px;font-weight:600;line-height:1.2;color:${GREEN};${textShadow(0.5)};max-width:780px;}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(7)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">LIBERDADE PROFISSIONAL</div>
  <div class="headline">LIBERTE<br>SEU TEMPO.</div>
  <div class="divider"></div>
  <div class="sub">Preserve o que é genuinamente humano no seu trabalho.</div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide08() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkFull};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:80px 80px;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${GREEN};margin-bottom:28px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:84px;font-weight:700;line-height:1.0;letter-spacing:-0.02em;color:${WHITE};${textShadow(0.7)};max-width:880px;}
.headline em{color:${CYAN};font-style:normal;}
.sub-box{margin-top:48px;background:rgba(0,255,136,0.1);backdrop-filter:blur(12px);border:1px solid rgba(0,255,136,0.3);border-radius:16px;padding:28px 36px;max-width:820px;}
.sub-text{font-family:'Inter',Arial,sans-serif;font-size:38px;font-weight:500;line-height:1.4;color:rgba(255,255,255,0.9);}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(8)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">DESMISTIFICANDO A IA</div>
  <div class="headline">VOCÊ NÃO<br>PRECISA <em>PROGRAMAR.</em></div>
  <div class="sub-box">
    <div class="sub-text">Você precisa aprender o método.<br>Sem código. Sem mistério.</div>
  </div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide09() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkStrong};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:80px 80px;}
.headline-xl{font-family:'Space Grotesk',Arial,sans-serif;font-size:128px;font-weight:700;line-height:0.95;letter-spacing:-0.03em;color:${WHITE};${textShadow(0.8)};}
.headline-xl .accent{color:${CYAN};}
.rule{width:80px;height:6px;background:${GREEN};margin:36px 0;border-radius:4px;}
.sub{font-family:'Inter',Arial,sans-serif;font-size:56px;font-weight:600;line-height:1.1;color:${GREEN};${textShadow(0.5)};}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(9)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="headline-xl">IA<br>SEM<br><span class="accent">CÓDIGO.</span></div>
  <div class="rule"></div>
  <div class="sub">Resultados reais.</div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide10() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkFull};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:80px;}
.pair{display:flex;flex-direction:column;gap:0px;width:100%;}
.row{display:flex;align-items:center;justify-content:center;gap:32px;}
.row-text{font-family:'Space Grotesk',Arial,sans-serif;font-size:88px;font-weight:700;line-height:1.0;letter-spacing:-0.02em;${textShadow(0.7)};}
.row-text.light{color:rgba(255,255,255,0.6);}
.row-text.bright{color:${WHITE};}
.row-text.cyan{color:${CYAN};}
.divider-h{width:100%;height:2px;background:rgba(255,255,255,0.12);margin:32px 0;}
.sub-center{font-family:'Inter',Arial,sans-serif;font-size:36px;font-weight:400;line-height:1.5;color:rgba(255,255,255,0.65);${textShadow(0.4)};max-width:760px;margin:0 auto;}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(10)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="pair">
    <div class="row"><span class="row-text bright">O SISTEMA</span></div>
    <div class="row"><span class="row-text cyan">TRABALHA.</span></div>
    <div class="divider-h"></div>
    <div class="row"><span class="row-text light">Você</span></div>
    <div class="row"><span class="row-text bright">CUIDA.</span></div>
  </div>
  <div class="sub-center" style="margin-top:32px;">O toque humano fica com você.<br>O operacional vai para a máquina.</div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide11() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayGreenBot};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:80px 80px;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${GREEN};margin-bottom:28px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:88px;font-weight:700;line-height:1.0;letter-spacing:-0.02em;color:${WHITE};${textShadow(0.7)};max-width:900px;}
.headline .green{color:${GREEN};}
.sub{font-family:'Inter',Arial,sans-serif;font-size:40px;font-weight:400;line-height:1.4;color:rgba(255,255,255,0.8);${textShadow(0.5)};margin-top:36px;max-width:820px;}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(11)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">CRESCIMENTO SEM ESGOTAMENTO</div>
  <div class="headline">ESCALE SEM<br>PERDER O<br><span class="green">TOQUE HUMANO.</span></div>
  <div class="sub">Automatize o operacional. Mantenha o que só você pode entregar.</div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide12() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkFull};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:80px 80px;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${CYAN};margin-bottom:24px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:90px;font-weight:700;line-height:1.0;letter-spacing:-0.02em;color:${WHITE};${textShadow(0.7)};}
.headline .cyan{color:${CYAN};}
.arrow-line{display:flex;align-items:center;gap:24px;margin:40px 0;}
.arrow-from{font-family:'Inter',Arial,sans-serif;font-size:38px;font-weight:500;color:rgba(255,255,255,0.55);padding:16px 28px;background:rgba(255,255,255,0.06);border-radius:12px;}
.arrow-icon{font-size:44px;color:${GREEN};}
.arrow-to{font-family:'Space Grotesk',Arial,sans-serif;font-size:38px;font-weight:700;color:${GREEN};padding:16px 28px;background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);border-radius:12px;}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(12)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">TRANSFORMAÇÃO</div>
  <div class="headline">SEU<br><span class="cyan">CONHECIMENTO</span><br>VIRA SISTEMA.</div>
  <div class="arrow-line">
    <div class="arrow-from">Expertise clínica</div>
    <div class="arrow-icon">→</div>
    <div class="arrow-to">Automação funcional</div>
  </div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide13() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkStrong};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:80px;}
.icon-row{font-size:64px;margin-bottom:28px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:80px;font-weight:700;line-height:1.0;letter-spacing:-0.02em;color:${WHITE};${textShadow(0.7)};max-width:900px;}
.headline .strike-line{color:rgba(255,255,255,0.35);position:relative;text-decoration:line-through;text-decoration-color:rgba(255,100,100,0.6);}
.divider{width:100px;height:4px;background:${GREEN};margin:32px auto;border-radius:4px;}
.sub{font-family:'Inter',Arial,sans-serif;font-size:44px;font-weight:500;line-height:1.3;color:${GREEN};${textShadow(0.5)};max-width:820px;}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(13)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="icon-row">🧠</div>
  <div class="headline">IA NÃO É<br><span class="strike-line">COISA DE TI.</span></div>
  <div class="divider"></div>
  <div class="sub">É coisa de quem quer<br>crescer sem se esgotar.</div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide14() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;${overlayDarkFull};}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:80px 80px;}
.eyebrow{font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:28px;}
.headline{font-family:'Space Grotesk',Arial,sans-serif;font-size:76px;font-weight:700;line-height:1.05;letter-spacing:-0.02em;color:${WHITE};${textShadow(0.7)};max-width:900px;}
.headline .cyan{color:${CYAN};}
.two-col{display:flex;gap:32px;margin-top:48px;}
.col-box{flex:1;background:rgba(255,255,255,0.06);backdrop-filter:blur(8px);border-radius:16px;padding:28px 28px;border:1px solid rgba(255,255,255,0.12);}
.col-title{font-family:'Space Grotesk',Arial,sans-serif;font-size:22px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:14px;}
.col-title.human{color:${GREEN};}
.col-title.machine{color:${CYAN};}
.col-text{font-family:'Inter',Arial,sans-serif;font-size:32px;font-weight:400;line-height:1.4;color:rgba(255,255,255,0.85);}
.brand-bar{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(14)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">A DIVISÃO PERFEITA</div>
  <div class="headline">O TOQUE <span class="cyan">HUMANO</span><br>FICA COM VOCÊ.</div>
  <div class="two-col">
    <div class="col-box">
      <div class="col-title human">Você faz</div>
      <div class="col-text">Diagnóstico · Empatia · Ajuste clínico · Relacionamento</div>
    </div>
    <div class="col-box">
      <div class="col-title machine">Sistema faz</div>
      <div class="col-text">Leads · Triagem · Follow-up · Agendamento · Conteúdo</div>
    </div>
  </div>
</div>
<div class="brand-bar">
  <span class="tag">@inema.tds</span>
  <span class="url">inema.club</span>
</div>
</div></body></html>`;
}

function slide15() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>${RESET}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(160deg,rgba(0,0,0,0.75) 0%,rgba(0,10,30,0.88) 100%);}
.content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:80px;}
.brand-name{font-family:'Space Grotesk',Arial,sans-serif;font-size:144px;font-weight:700;line-height:1.0;letter-spacing:-0.02em;background:linear-gradient(135deg,${CYAN} 0%,${GREEN} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-shadow:none;filter:drop-shadow(0 4px 32px rgba(0,153,255,0.4));}
.brand-sub{font-family:'Space Grotesk',Arial,sans-serif;font-size:36px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.55);margin-top:8px;}
.divider{width:200px;height:3px;background:linear-gradient(to right,${CYAN},${GREEN});margin:36px auto;border-radius:4px;}
.tagline{font-family:'Inter',Arial,sans-serif;font-size:42px;font-weight:500;line-height:1.4;color:rgba(255,255,255,0.85);max-width:760px;text-shadow:0 2px 12px rgba(0,0,0,0.6);}
.cta-btn{margin-top:48px;display:inline-block;font-family:'Space Grotesk',Arial,sans-serif;font-size:34px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${DARK};background:linear-gradient(135deg,${CYAN},${GREEN});padding:20px 64px;border-radius:9999px;box-shadow:0 4px 40px rgba(0,153,255,0.5);animation:scaleIn 0.5s 0.3s both ease-out;}
@keyframes scaleIn{from{transform:scale(0.9);opacity:0;}to{transform:scale(1);opacity:1;}}
.cta-sub{margin-top:20px;font-family:'Space Grotesk',Arial,sans-serif;font-size:26px;font-weight:500;letter-spacing:0.06em;color:rgba(255,255,255,0.5);}
</style></head><body><div class="slide">
<img class="bg" src="file://${imgPath(15)}">
<div class="vignette"></div>
<div class="overlay"></div>
<div class="content">
  <div class="brand-name">INEMA.CLUB</div>
  <div class="brand-sub">Educação em IA para saúde &amp; fitness</div>
  <div class="divider"></div>
  <div class="tagline">Trilha completa. 100% gratuita.<br>Sem truques.</div>
  <div class="cta-btn">COMECE GRÁTIS AGORA</div>
  <div class="cta-sub">inema.club — acesso imediato</div>
</div>
</div></body></html>`;
}

// ══════════════════════════════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════════════════════════════

const slides = [
  { fn: slide01, num: 1  },
  { fn: slide02, num: 2  },
  { fn: slide03, num: 3  },
  { fn: slide04, num: 4  },
  { fn: slide05, num: 5  },
  { fn: slide06, num: 6  },
  { fn: slide07, num: 7  },
  { fn: slide08, num: 8  },
  { fn: slide09, num: 9  },
  { fn: slide10, num: 10 },
  { fn: slide11, num: 11 },
  { fn: slide12, num: 12 },
  { fn: slide13, num: 13 },
  { fn: slide14, num: 14 },
  { fn: slide15, num: 15 },
];

async function renderAll() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });

  const layout = { campaign: CAMPAIGN, slides: [] };

  for (const { fn, num } of slides) {
    const html = fn();
    const padded = String(num).padStart(2, '0');
    const htmlFile = path.join(ADS_DIR, `${CAMPAIGN}_carousel_${padded}.html`);
    const pngFile  = path.join(ADS_DIR, `${CAMPAIGN}_carousel_${padded}.png`);

    fs.writeFileSync(htmlFile, html, 'utf8');
    await page.goto(`file://${htmlFile}`);
    await page.waitForTimeout(800);
    await page.screenshot({ path: pngFile });

    console.log(`✓ Slide ${padded} → ${path.basename(pngFile)}`);

    layout.slides.push({
      slide: num,
      filename: path.basename(pngFile),
      html: path.basename(htmlFile),
      dimensions: '1080x1080',
      image_used: path.basename(imgPath(num)),
    });
  }

  await browser.close();

  // Save layout.json
  const layoutPath = path.join(ADS_DIR, 'layout.json');
  fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 2), 'utf8');
  console.log(`\n✓ layout.json saved`);
  console.log(`\n✅ All ${slides.length} slides rendered to ${ADS_DIR}`);
}

renderAll().catch(err => { console.error(err); process.exit(1); });
