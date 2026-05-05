#!/usr/bin/env node
/**
 * Carousel renderer — c0089-vibe_code_cursos_gratuitos
 * 10 slides × 1080×1080 px — INEMA Vibe Code campaign
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CAMPAIGN = 'c0089-vibe_code_cursos_gratuitos';
const OUT = `/home/nmaldaner/projetos/timesmkt3/prj/inema/outputs/${CAMPAIGN}/ads`;
const IMGS = `/home/nmaldaner/projetos/timesmkt3/prj/inema/outputs/${CAMPAIGN}/imgs`;

function imgSrc(n) {
  const num = String(n).padStart(2, '0');
  return `${IMGS}/${CAMPAIGN}_generated_${num}_carousel_1080x1080.jpg`;
}

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

const BASE_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1080px; overflow: hidden; background: #0D0D0D; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85) contrast(1.1) saturate(1.2); }
.overlay { position: absolute; inset: 0; }
.content { position: absolute; inset: 0; padding: 64px; display: flex; flex-direction: column; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
.fu { animation: fadeUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }
.si { animation: scaleIn 0.5s cubic-bezier(.22,.68,0,1.2) both; }
.slide-num {
  position: absolute; top: 52px; right: 64px;
  font-family: 'Inter', sans-serif; font-size: 22px;
  color: rgba(255,255,255,0.35); font-weight: 500; letter-spacing: 0.04em;
}
.handle {
  position: absolute; bottom: 52px; right: 64px;
  font-family: 'Space Grotesk', sans-serif; font-size: 24px;
  color: rgba(255,255,255,0.45); font-weight: 500; letter-spacing: 0.02em;
}
.badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 24px; border-radius: 9999px;
  font-family: 'Space Grotesk', sans-serif; font-size: 22px;
  font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
}
.cta-pill {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 22px 56px; border-radius: 9999px;
  font-family: 'Space Grotesk', sans-serif; font-size: 32px;
  font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  text-shadow: none !important;
}
`;

/* ───────────────── SLIDE GENERATORS ───────────────── */

function slide01() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.word-vibe {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 140px; font-weight: 800; line-height: 0.95;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #0099FF 0%, #00FF88 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 40px rgba(0,153,255,0.5));
}
.sub {
  font-family: 'Space Grotesk', sans-serif; font-size: 46px;
  font-weight: 500; color: #FFFFFF; letter-spacing: 0.02em; line-height: 1.3;
  text-shadow: 0 2px 16px rgba(0,0,0,0.9);
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(1)}">
<div class="overlay" style="background: linear-gradient(to top, rgba(13,13,13,0.96) 0%, rgba(13,13,13,0.65) 55%, rgba(13,13,13,0.35) 100%);"></div>
<div class="content" style="justify-content: flex-end; gap: 20px; padding-bottom: 100px;">
  <div class="badge fu" style="background: rgba(0,153,255,0.15); border: 1.5px solid rgba(0,153,255,0.6); color: #0099FF; align-self: flex-start; animation-delay: 0s;">⚡ NOVA ERA DA PROGRAMAÇÃO</div>
  <div class="word-vibe fu" style="animation-delay: 0.1s;">VIBE<br>CODE</div>
  <div class="sub fu" style="animation-delay: 0.2s;">A nova era da programação com IA</div>
</div>
<div class="slide-num">01 / 10</div>
<div class="handle">@inema.tds</div>
</body></html>`;
}

function slide02() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.reveal {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 100px; font-weight: 800; line-height: 1.0;
  color: #0099FF; letter-spacing: -0.02em;
  text-shadow: 0 0 60px rgba(0,153,255,0.5), 0 4px 24px rgba(0,0,0,0.8);
}
.body-text {
  font-family: 'Inter', sans-serif; font-size: 42px; font-weight: 400;
  color: rgba(255,255,255,0.88); line-height: 1.5;
  text-shadow: 0 2px 12px rgba(0,0,0,0.9);
}
.top-label {
  font-family: 'Space Grotesk', sans-serif; font-size: 30px;
  font-weight: 600; color: rgba(255,255,255,0.55); letter-spacing: 0.04em;
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(2)}">
<div class="overlay" style="background: linear-gradient(to bottom, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.25) 40%, rgba(13,13,13,0.75) 100%);"></div>
<div class="content" style="justify-content: space-between;">
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div class="top-label fu" style="animation-delay:0s;">Você sente o flow.</div>
    <div class="body-text fu" style="animation-delay:0.1s; max-width: 900px;">
      Programar sem planejamento rígido.<br>
      Só você, a IA e o feeling do momento.
    </div>
  </div>
  <div class="reveal fu" style="animation-delay: 0.2s;">Isso tem<br>nome.</div>
</div>
<div class="slide-num">02 / 10</div>
<div class="handle">@inema.tds</div>
</body></html>`;
}

function slide03() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.stat-num {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 160px; font-weight: 800; line-height: 1.0; letter-spacing: -0.04em;
  color: #00FF88;
  filter: drop-shadow(0 0 48px rgba(0,255,136,0.6));
  text-shadow: none;
}
.stat-label {
  font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 500;
  color: rgba(255,255,255,0.85); line-height: 1.4; max-width: 750px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.9);
}
.source-badge {
  font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 500;
  color: rgba(255,255,255,0.5); letter-spacing: 0.03em;
}
.top-fact {
  font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 600;
  color: #0099FF; letter-spacing: 0.02em; max-width: 860px; line-height: 1.4;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(3)}">
<div class="overlay" style="background: linear-gradient(160deg, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0.5) 50%, rgba(13,13,13,0.9) 100%);"></div>
<div class="content" style="justify-content: space-between;">
  <div style="display: flex; flex-direction: column; gap: 14px;">
    <div class="badge fu" style="background: rgba(0,255,136,0.1); border: 1.5px solid rgba(0,255,136,0.5); color: #00FF88; align-self: flex-start; animation-delay: 0s;">📊 DADO DO MERCADO</div>
    <div class="top-fact fu" style="animation-delay: 0.1s;">Andrej Karpathy cunhou o termo em fev/2025.<br>Em meses, virou movimento global.</div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div class="stat-num fu" style="animation-delay: 0.15s;">25%</div>
    <div class="stat-label fu" style="animation-delay: 0.2s;">das startups do Y Combinator<br>já têm código gerado por IA</div>
    <div class="source-badge fu" style="animation-delay: 0.25s;">YC Demo Day 2025</div>
  </div>
</div>
<div class="slide-num">03 / 10</div>
<div class="handle">@inema.tds</div>
</body></html>`;
}

function slide04() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.pos-badge {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px; font-weight: 700; color: #00FF88;
  letter-spacing: 0.1em; text-transform: uppercase;
}
.headline-line {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 96px; font-weight: 800; line-height: 1.0; letter-spacing: -0.02em;
  text-shadow: 0 4px 24px rgba(0,0,0,0.8);
}
.sub-text {
  font-family: 'Inter', sans-serif; font-size: 38px; font-weight: 400;
  color: rgba(255,255,255,0.8); line-height: 1.5; max-width: 860px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.9);
}
.glow-bar {
  width: 5px; height: 100%; background: linear-gradient(to bottom, #00FF88, #0099FF);
  border-radius: 3px; box-shadow: 0 0 20px rgba(0,255,136,0.7);
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(4)}">
<div class="overlay" style="background: linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.4) 60%, rgba(13,13,13,0.3) 100%);"></div>
<div class="content" style="justify-content: flex-end; gap: 0; padding-bottom: 90px;">
  <div style="display: flex; gap: 28px; align-items: flex-start;">
    <div class="glow-bar si" style="animation-delay: 0s; min-height: 240px;"></div>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div class="badge fu" style="background: rgba(0,255,136,0.12); border: 1.5px solid rgba(0,255,136,0.6); color: #00FF88; align-self: flex-start; animation-delay: 0s;">✅ O LADO POSITIVO</div>
      <div class="headline-line fu" style="color: #FFFFFF; animation-delay: 0.1s;">Velocidade total.</div>
      <div class="headline-line fu" style="color: #00FF88; animation-delay: 0.15s;">Ideia hoje.</div>
      <div class="headline-line fu" style="color: #0099FF; font-size: 80px; animation-delay: 0.2s;">Produto amanhã.</div>
      <div class="sub-text fu" style="animation-delay: 0.25s;">Prototipagem sem burocracia, sem espera.</div>
    </div>
  </div>
</div>
<div class="slide-num">04 / 10</div>
<div class="handle">@inema.tds</div>
</body></html>`;
}

function slide05() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.warn-headline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 96px; font-weight: 800; line-height: 1.0; letter-spacing: -0.02em;
  color: #FFFFFF;
  text-shadow: 0 4px 24px rgba(0,0,0,0.9);
}
.warn-impact {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 120px; font-weight: 800; line-height: 1.0; letter-spacing: -0.03em;
  color: #FF6B2B;
  filter: drop-shadow(0 0 40px rgba(255,107,43,0.5));
  text-shadow: none;
}
.warn-sub {
  font-family: 'Inter', sans-serif; font-size: 40px; font-weight: 400;
  color: rgba(255,255,255,0.8); line-height: 1.5; max-width: 820px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.9);
}
.warn-resolve {
  font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 600;
  color: #0099FF; letter-spacing: 0.02em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(5)}">
<div class="overlay" style="background: linear-gradient(160deg, rgba(30,10,5,0.85) 0%, rgba(13,13,13,0.5) 50%, rgba(13,13,13,0.92) 100%);"></div>
<div class="content" style="justify-content: flex-end; gap: 16px; padding-bottom: 90px;">
  <div class="badge fu" style="background: rgba(255,107,43,0.15); border: 1.5px solid rgba(255,107,43,0.7); color: #FF6B2B; align-self: flex-start; animation-delay: 0s;">⚠️ PONTO DE ATENÇÃO</div>
  <div class="warn-headline fu" style="animation-delay: 0.1s;">Sem estrutura,</div>
  <div class="warn-impact fu" style="animation-delay: 0.15s;">vira caos.</div>
  <div class="warn-sub fu" style="animation-delay: 0.2s;">O vibe code tem dois lados —<br>e você precisa conhecer os dois.</div>
  <div class="warn-resolve fu" style="animation-delay: 0.25s;">A INEMA ensina os dois lados. →</div>
</div>
<div class="slide-num">05 / 10</div>
<div class="handle">@inema.tds</div>
</body></html>`;
}

function slide06() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.who-headline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 72px; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;
  color: #FFFFFF; text-shadow: 0 4px 24px rgba(0,0,0,0.8);
}
.who-q { color: #0099FF; }
.persona-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
}
.persona-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 22px 28px;
  display: flex; align-items: center; gap: 16px;
}
.persona-icon { font-size: 40px; }
.persona-label {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 34px; font-weight: 700;
  color: #FFFFFF; letter-spacing: 0.01em;
}
.footer-text {
  font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 400;
  color: rgba(255,255,255,0.75); line-height: 1.45; max-width: 900px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.9);
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(6)}">
<div class="overlay" style="background: linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.55) 50%, rgba(13,13,13,0.4) 100%);"></div>
<div class="content" style="justify-content: space-between;">
  <div style="display: flex; flex-direction: column; gap: 14px;">
    <div class="who-headline fu" style="animation-delay: 0s;">Quem usa <span class="who-q">vibe coding?</span></div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <div class="persona-grid fu" style="animation-delay: 0.1s;">
      <div class="persona-card"><span class="persona-icon">⚡</span><span class="persona-label">Devs</span></div>
      <div class="persona-card"><span class="persona-icon">🎨</span><span class="persona-label">Designers</span></div>
      <div class="persona-card"><span class="persona-icon">📊</span><span class="persona-label">PMs</span></div>
      <div class="persona-card"><span class="persona-icon">🚀</span><span class="persona-label">Empreendedores</span></div>
    </div>
    <div class="footer-text fu" style="animation-delay: 0.2s;">Qualquer pessoa com uma ideia e vontade<br>de criar com IA.</div>
  </div>
</div>
<div class="slide-num">06 / 10</div>
<div class="handle">@inema.tds</div>
</body></html>`;
}

function slide07() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.inema-badge-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px; font-weight: 700; color: #0099FF; letter-spacing: 0.08em;
  text-transform: uppercase;
}
.intro-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 60px; font-weight: 700; line-height: 1.15;
  color: #FFFFFF; letter-spacing: -0.01em;
  text-shadow: 0 4px 24px rgba(0,0,0,0.8);
}
.year-num {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 160px; font-weight: 800; line-height: 0.95; letter-spacing: -0.04em;
  color: #00FF88;
  filter: drop-shadow(0 0 48px rgba(0,255,136,0.55));
  text-shadow: none;
}
.year-label {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 52px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.01em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
}
.proof-text {
  font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 500;
  color: #0099FF; line-height: 1.45; max-width: 900px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
}
.free-label {
  font-family: 'Space Grotesk', sans-serif; font-size: 40px; font-weight: 700;
  color: rgba(255,255,255,0.85); letter-spacing: 0.01em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(7)}">
<div class="overlay" style="background: linear-gradient(to top, rgba(13,13,13,0.96) 0%, rgba(13,13,13,0.6) 50%, rgba(13,13,13,0.4) 100%);"></div>
<div class="content" style="justify-content: space-between;">
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <div class="badge fu" style="background: rgba(0,153,255,0.15); border: 1.5px solid rgba(0,153,255,0.6); color: #0099FF; align-self: flex-start; animation-delay: 0s;">🧠 INEMA</div>
    <div class="intro-text fu" style="animation-delay: 0.1s;">ensina vibe coding</div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div style="display: flex; align-items: baseline; gap: 16px;">
      <div class="year-num fu" style="animation-delay: 0.15s;">1</div>
      <div class="year-label fu" style="animation-delay: 0.18s;">ANO.</div>
    </div>
    <div class="proof-text fu" style="animation-delay: 0.2s;">Antes de virar hype no Brasil.</div>
    <div class="free-label fu" style="animation-delay: 0.25s;">Trilhas completas, em português, de graça.</div>
  </div>
</div>
<div class="slide-num">07 / 10</div>
<div class="handle">@inema.tds</div>
</body></html>`;
}

function slide08() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.catalog-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 40px; font-weight: 600; color: #0099FF; letter-spacing: 0.03em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
}
.course-card {
  background: rgba(0,153,255,0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0,153,255,0.3);
  border-left: 4px solid #0099FF;
  border-radius: 12px;
  padding: 20px 28px;
}
.course-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 34px; font-weight: 700;
  color: #FFFFFF; line-height: 1.3;
}
.course-detail {
  font-family: 'Inter', sans-serif; font-size: 26px; font-weight: 400;
  color: rgba(255,255,255,0.6); margin-top: 4px;
}
.free-stamp {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 80px; font-weight: 800; line-height: 1.0; letter-spacing: -0.02em;
  color: #00FF88;
  filter: drop-shadow(0 0 40px rgba(0,255,136,0.5));
  text-shadow: none;
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(8)}">
<div class="overlay" style="background: rgba(13,13,13,0.88);"></div>
<div class="content" style="justify-content: space-between;">
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div class="badge fu" style="background: rgba(0,153,255,0.15); border: 1.5px solid rgba(0,153,255,0.5); color: #0099FF; align-self: flex-start; animation-delay:0s;">📚 NO INEMA.CLUB</div>
    <div class="catalog-title fu" style="animation-delay:0.05s;">Trilhas disponíveis agora:</div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div class="course-card fu" style="animation-delay:0.1s;">
      <div class="course-name">Vibe Coding: Da Ideia ao Produto</div>
    </div>
    <div class="course-card fu" style="animation-delay:0.15s;">
      <div class="course-name">Claude Code CCA</div>
      <div class="course-detail">24 módulos completos</div>
    </div>
    <div class="course-card fu" style="animation-delay:0.2s;">
      <div class="course-name">Engenharia Agentic Masterclass</div>
    </div>
    <div style="display: flex; align-items: center; gap: 20px; margin-top: 8px;" class="fu" style="animation-delay:0.25s;">
      <div class="free-stamp fu" style="animation-delay:0.25s;">Tudo gratuito.</div>
    </div>
  </div>
</div>
<div class="slide-num">08 / 10</div>
<div class="handle">@inema.tds</div>
</body></html>`;
}

function slide09() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.manifesto-pre {
  font-family: 'Inter', sans-serif; font-size: 38px; font-weight: 500;
  color: rgba(255,255,255,0.7); line-height: 1.4;
  text-shadow: 0 2px 12px rgba(0,0,0,0.9);
}
.manifesto-main {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 80px; font-weight: 800; line-height: 1.05; letter-spacing: -0.02em;
  color: #0099FF;
  text-shadow: 0 0 60px rgba(0,153,255,0.4), 0 4px 24px rgba(0,0,0,0.8);
}
.manifesto-sub {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 48px; font-weight: 600; line-height: 1.2;
  color: #FFFFFF;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
}
.manifesto-detail {
  font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 400;
  color: rgba(0,255,136,0.85); line-height: 1.4;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
}
.divider {
  width: 80px; height: 4px;
  background: linear-gradient(to right, #0099FF, #00FF88);
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(0,153,255,0.5);
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(9)}">
<div class="overlay" style="background: linear-gradient(160deg, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.45) 45%, rgba(13,13,13,0.88) 100%);"></div>
<div class="content" style="justify-content: flex-end; gap: 20px; padding-bottom: 90px;">
  <div class="manifesto-pre fu" style="animation-delay:0s;">Quem programa no vibe code,</div>
  <div class="manifesto-main fu" style="animation-delay:0.1s;">aprende no<br>vibe code.</div>
  <div class="divider si" style="animation-delay:0.2s;"></div>
  <div class="manifesto-sub fu" style="animation-delay:0.22s;">Rápido, prático, sem barreira.</div>
  <div class="manifesto-detail fu" style="animation-delay:0.28s;">Essa é a filosofia — aqui e lá.</div>
</div>
<div class="slide-num">09 / 10</div>
<div class="handle">@inema.tds</div>
</body></html>`;
}

function slide10() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}
<style>${BASE_CSS}
.brand-url {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 120px; font-weight: 800; line-height: 1.0; letter-spacing: -0.02em;
  color: #00FF88;
  filter: drop-shadow(0 0 56px rgba(0,255,136,0.65));
  text-shadow: none;
}
.cta-tagline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 48px; font-weight: 700; line-height: 1.2;
  color: #FFFFFF;
  text-shadow: 0 2px 16px rgba(0,0,0,0.9);
}
.cta-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 12px;
  padding: 24px 60px; border-radius: 9999px;
  background: linear-gradient(135deg, #0099FF, #0066CC);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 36px; font-weight: 700; color: #FFFFFF;
  letter-spacing: 0.05em; text-transform: uppercase;
  box-shadow: 0 8px 40px rgba(0,153,255,0.5), 0 2px 12px rgba(0,0,0,0.4);
  text-shadow: none;
  align-self: flex-start;
}
.cta-social {
  font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 500;
  color: rgba(255,255,255,0.5); letter-spacing: 0.03em;
}
.free-detail {
  font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 400;
  color: rgba(255,255,255,0.65); line-height: 1.4;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
}
</style></head>
<body>
<img class="bg" src="file://${imgSrc(10)}">
<div class="overlay" style="background: linear-gradient(to top, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0.75) 50%, rgba(13,13,13,0.5) 100%);"></div>
<div class="content" style="justify-content: flex-end; gap: 22px; padding-bottom: 96px;">
  <div class="badge fu" style="background: rgba(0,255,136,0.12); border: 1.5px solid rgba(0,255,136,0.5); color: #00FF88; align-self: flex-start; animation-delay:0s; font-size: 24px;">🚀 COMECE AGORA</div>
  <div class="cta-tagline fu" style="animation-delay:0.1s;">Trilha completa. 100% gratuita. Sem truques.</div>
  <div class="brand-url fu" style="animation-delay:0.15s;">INEMA.CLUB</div>
  <div class="cta-btn si" style="animation-delay:0.25s;">Acesse grátis →</div>
  <div class="free-detail fu" style="animation-delay:0.3s;">Vibe Coding · Claude Code · IA Generativa · em PT-BR</div>
  <div class="cta-social fu" style="animation-delay:0.35s;">Siga @inema.tds para mais conteúdo</div>
</div>
<div class="slide-num">10 / 10</div>
</body></html>`;
}

/* ───────────────── RENDER ───────────────── */

const slides = [
  { n: 1,  fn: slide01 },
  { n: 2,  fn: slide02 },
  { n: 3,  fn: slide03 },
  { n: 4,  fn: slide04 },
  { n: 5,  fn: slide05 },
  { n: 6,  fn: slide06 },
  { n: 7,  fn: slide07 },
  { n: 8,  fn: slide08 },
  { n: 9,  fn: slide09 },
  { n: 10, fn: slide10 },
];

(async () => {
  console.log('🎨 Rendering c0089 carousel — 10 slides');
  const browser = await chromium.launch();

  const layoutSlides = [];

  for (const slide of slides) {
    const num = String(slide.n).padStart(2, '0');
    const htmlFile = path.join(OUT, `${CAMPAIGN}_carousel_${num}.html`);
    const pngFile  = path.join(OUT, `${CAMPAIGN}_carousel_${num}.png`);

    const html = slide.fn();
    fs.writeFileSync(htmlFile, html, 'utf8');

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.goto('file://' + htmlFile);
    await page.waitForTimeout(1500); // fonts + animations settle
    await page.screenshot({ path: pngFile });
    await page.close();

    console.log(`  ✅ slide ${slide.n.toString().padStart(2,'0')} → ${path.basename(pngFile)}`);

    layoutSlides.push({
      slide: slide.n,
      filename: path.basename(pngFile),
      html_source: path.basename(htmlFile),
      dimensions: '1080x1080',
      image_used: path.basename(imgSrc(slide.n)),
    });
  }

  await browser.close();

  /* layout.json */
  const layout = {
    campaign_id: CAMPAIGN,
    campaign_date: '2026-04-21',
    format: 'carousel',
    total_slides: 10,
    dimensions: '1080x1080',
    platforms: ['instagram', 'youtube', 'threads'],
    visual_theme: {
      mood: 'dark e energético — flow state + neon terminal aesthetic',
      dominant_colors: ['#0D0D0D', '#0099FF', '#00FF88', '#7B2FBE'],
      accent_colors: ['#FFFFFF', '#FF6B2B'],
      typography: 'Space Grotesk (headlines 800-900) + Inter (body 400-500)',
    },
    narrative_arc: [
      'Slide 01 — Hook: VIBE CODE, a nova era da programação com IA',
      'Slide 02 — Conceito: o que é programar no feeling, e isso tem nome',
      'Slide 03 — Dados: Karpathy fev/2025, 25% YC = código por IA',
      'Slide 04 — Positivo: velocidade total, ideia hoje, produto amanhã',
      'Slide 05 — Tensão: sem estrutura vira caos — dois lados',
      'Slide 06 — Comunidade: quem usa — devs, designers, PMs, empreendedores',
      'Slide 07 — INEMA 1 ano: antes do hype, em português, de graça',
      'Slide 08 — Catálogo: trilhas disponíveis no inema.club, tudo gratuito',
      'Slide 09 — Manifesto: quem programa no vibe code, aprende no vibe code',
      'Slide 10 — CTA: INEMA.CLUB enorme + botão Acesse grátis',
    ],
    copy_source: 'narrative.json — carousel_texts + headlines + approved_ctas',
    slides: layoutSlides,
  };

  fs.writeFileSync(path.join(OUT, 'layout.json'), JSON.stringify(layout, null, 2), 'utf8');
  console.log('\n📄 layout.json saved');
  console.log('🏁 Done — all 10 slides rendered to', OUT);
})();
