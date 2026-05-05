#!/usr/bin/env node
/**
 * Ad Creative Renderer — c0082-arquiteturas_agentes_inteligentes
 * 15 carousel slides 1080x1080 (Instagram / YouTube / Threads)
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, 'prj/inema/outputs/c0082-arquiteturas_agentes_inteligentes/ads');
const IMGS_DIR = path.resolve(__dirname, 'prj/inema/outputs/c0082-arquiteturas_agentes_inteligentes/imgs');
const CAMPAIGN = 'c0082-arquiteturas_agentes_inteligentes';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const B = {
  dark: '#0D0D0D',
  mid: '#1A1A2E',
  blue: '#0099FF',
  green: '#00FF88',
  white: '#FFFFFF',
  purple: '#7B61FF',
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`;

function img(n) {
  const num = String(n).padStart(2, '0');
  return path.join(IMGS_DIR, `${CAMPAIGN}_generated_${num}_carousel_1080x1080.jpg`);
}

const slides = [

  // ── SLIDE 01 — HOOK ──────────────────────────────────────────────────────────
  {
    id: 1,
    filename: `${CAMPAIGN}_carousel_01`,
    image: img(1),
    concept: 'hook',
    copy_source: 'carousel_texts[0]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.65) contrast(1.15) saturate(1.2)}
.overlay{position:absolute;inset:0;background:linear-gradient(160deg,rgba(0,0,30,0.7) 0%,rgba(0,0,0,0.3) 40%,rgba(0,0,0,0.85) 100%)}
.accent-bar{position:absolute;top:0;left:0;width:8px;height:100%;background:linear-gradient(to bottom,${B.blue},${B.green})}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px}
.badge{display:inline-block;background:${B.blue};color:#fff;font-size:20px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:10px 24px;border-radius:4px;width:fit-content;animation:fadeUp 0.4s both}
.main{flex:1;display:flex;flex-direction:column;justify-content:center}
.tag-line{font-family:'Inter',sans-serif;font-size:34px;font-weight:600;color:rgba(255,255,255,0.6);letter-spacing:0.04em;margin-bottom:20px;animation:fadeUp 0.4s 0.05s both}
.headline{font-family:'Montserrat',sans-serif;font-size:116px;font-weight:900;line-height:1.0;letter-spacing:-0.02em;color:#fff;text-transform:uppercase;text-shadow:0 4px 32px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.1s both}
.headline .accent{color:${B.blue};display:block}
.subtext{font-size:42px;font-weight:600;color:rgba(255,255,255,0.82);line-height:1.4;margin-top:28px;text-shadow:0 2px 16px rgba(0,0,0,0.8);max-width:780px;animation:fadeUp 0.5s 0.2s both}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:30px;font-weight:900;letter-spacing:0.1em;color:${B.green};text-shadow:0 0 20px rgba(0,255,136,0.4)}
.handle{font-size:22px;font-weight:600;color:rgba(255,255,255,0.5)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="accent-bar"></div>
<div class="content">
  <div class="badge">🧠 Arquitetura de Agentes</div>
  <div class="main">
    <div class="tag-line">Você usa IA. Mas...</div>
    <h1 class="headline">Sabe como<br>ela <span class="accent">decide</span><br>o que fazer?</h1>
    <p class="subtext">Todo agente inteligente tem uma arquitetura.<br>A maioria só vê o resultado.</p>
  </div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="handle">@inema.tds</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 02 — LOOP FUNDAMENTAL ──────────────────────────────────────────────
  {
    id: 2,
    filename: `${CAMPAIGN}_carousel_02`,
    image: img(2),
    concept: 'loop fundamental',
    copy_source: 'carousel_texts[1]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.5) contrast(1.1) saturate(1.1)}
.overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.75) 0%,rgba(13,13,40,0.6) 50%,rgba(0,0,0,0.9) 100%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px}
.eyebrow{font-size:22px;font-weight:700;color:${B.green};letter-spacing:0.15em;text-transform:uppercase;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:84px;font-weight:900;line-height:1.05;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,0.9);animation:fadeUp 0.5s 0.05s both}
.headline em{color:${B.blue};font-style:normal}
.loop-row{display:flex;align-items:stretch;gap:0;animation:fadeUp 0.5s 0.15s both}
.loop-step{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,153,255,0.12);border:1px solid rgba(0,153,255,0.35);padding:28px 20px;backdrop-filter:blur(12px)}
.loop-step:nth-child(3){background:rgba(0,255,136,0.1);border-color:rgba(0,255,136,0.35)}
.loop-step:nth-child(5){background:rgba(123,97,255,0.12);border-color:rgba(123,97,255,0.35)}
.step-num{font-size:20px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:0.12em;margin-bottom:8px}
.step-name{font-family:'Montserrat',sans-serif;font-size:36px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.04em}
.arrow{display:flex;align-items:center;justify-content:center;font-size:44px;color:${B.green};padding:0 8px;font-weight:900}
.conclusion{font-size:36px;font-weight:600;color:${B.green};text-align:center;animation:fadeUp 0.5s 0.25s both}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">Loop Fundamental</div>
  <h1 class="headline">Todo agente<br>inteligente age em<br><em>3 etapas</em></h1>
  <div class="loop-row">
    <div class="loop-step">
      <div class="step-num">01</div>
      <div class="step-name">Perceber</div>
    </div>
    <div class="arrow">→</div>
    <div class="loop-step">
      <div class="step-num">02</div>
      <div class="step-name">Decidir</div>
    </div>
    <div class="arrow">→</div>
    <div class="loop-step">
      <div class="step-num">03</div>
      <div class="step-name">Agir</div>
    </div>
  </div>
  <div class="conclusion">Entender esse loop muda tudo.</div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">02 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 03 — 3 ARQUITETURAS ─────────────────────────────────────────────────
  {
    id: 3,
    filename: `${CAMPAIGN}_carousel_03`,
    image: img(3),
    concept: '3 arquiteturas principais',
    copy_source: 'carousel_texts[2]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.mid};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.3) contrast(1.2) saturate(0.9)}
.overlay{position:absolute;inset:0;background:rgba(13,13,46,0.88)}
.side-bar{position:absolute;top:0;right:0;width:6px;height:100%;background:linear-gradient(to bottom,${B.green},${B.blue})}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px}
.header{}
.eyebrow{font-size:22px;font-weight:700;color:${B.blue};letter-spacing:0.15em;text-transform:uppercase;margin-bottom:16px;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:88px;font-weight:900;line-height:1.0;color:#fff;text-transform:uppercase;text-shadow:0 4px 24px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.05s both}
.divider{width:80px;height:5px;background:linear-gradient(to right,${B.blue},${B.green});margin:20px 0;border-radius:3px}
.arch-list{display:flex;flex-direction:column;gap:20px;flex:1;justify-content:center}
.arch-item{display:flex;align-items:center;gap:28px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:22px 32px;animation:slideIn 0.5s both}
.arch-item:nth-child(1){border-left:5px solid ${B.blue};animation-delay:0.1s}
.arch-item:nth-child(2){border-left:5px solid ${B.green};animation-delay:0.2s}
.arch-item:nth-child(3){border-left:5px solid ${B.purple};animation-delay:0.3s}
.arch-num{font-family:'Montserrat',sans-serif;font-size:52px;font-weight:900;min-width:64px;color:${B.blue}}
.arch-item:nth-child(2) .arch-num{color:${B.green}}
.arch-item:nth-child(3) .arch-num{color:${B.purple}}
.arch-info{}
.arch-name{font-family:'Montserrat',sans-serif;font-size:38px;font-weight:800;color:#fff}
.arch-desc{font-size:26px;font-weight:500;color:rgba(255,255,255,0.55);margin-top:4px}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="side-bar"></div>
<div class="content">
  <div class="header">
    <div class="eyebrow">Arquiteturas de Agentes</div>
    <div class="headline">3 Modelos<br>Principais</div>
    <div class="divider"></div>
  </div>
  <div class="arch-list">
    <div class="arch-item">
      <div class="arch-num">01</div>
      <div class="arch-info">
        <div class="arch-name">Reativo</div>
        <div class="arch-desc">estímulo → resposta imediata (rápido, previsível)</div>
      </div>
    </div>
    <div class="arch-item">
      <div class="arch-num">02</div>
      <div class="arch-info">
        <div class="arch-name">Deliberativo</div>
        <div class="arch-desc">planejamento simbólico + tomada de decisão</div>
      </div>
    </div>
    <div class="arch-item">
      <div class="arch-num">03</div>
      <div class="arch-info">
        <div class="arch-name">Híbrido</div>
        <div class="arch-desc">velocidade reativa + inteligência deliberativa</div>
      </div>
    </div>
  </div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">03 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 04 — GARTNER STAT ───────────────────────────────────────────────────
  {
    id: 4,
    filename: `${CAMPAIGN}_carousel_04`,
    image: img(4),
    concept: 'dado de mercado gartner',
    copy_source: 'carousel_texts[3]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.25) contrast(1.3) saturate(0.8)}
.overlay{position:absolute;inset:0;background:radial-gradient(ellipse at 40% 50%,rgba(0,153,255,0.18) 0%,rgba(0,0,20,0.94) 65%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:72px}
.eyebrow{font-size:24px;font-weight:700;color:rgba(255,255,255,0.55);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:20px;animation:fadeUp 0.4s both}
.big-num{font-family:'Montserrat',sans-serif;font-size:200px;font-weight:900;line-height:0.88;letter-spacing:-0.03em;color:${B.green};text-shadow:0 0 80px rgba(0,255,136,0.45),0 4px 40px rgba(0,0,0,0.8);animation:scaleIn 0.5s 0.05s both}
.statement{font-family:'Montserrat',sans-serif;font-size:52px;font-weight:800;color:#fff;line-height:1.25;max-width:820px;text-shadow:0 3px 20px rgba(0,0,0,0.9);margin-top:20px;animation:fadeUp 0.5s 0.15s both}
.statement em{color:${B.blue};font-style:normal}
.source{font-size:24px;font-weight:500;color:rgba(255,255,255,0.4);margin-top:20px;letter-spacing:0.06em;animation:fadeUp 0.5s 0.25s both}
.chart-bar-row{display:flex;align-items:flex-end;gap:12px;margin-top:32px;animation:fadeUp 0.5s 0.3s both}
.bar{border-radius:4px 4px 0 0;background:linear-gradient(to top,${B.blue},${B.green})}
.brand{position:absolute;bottom:56px;right:72px;font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">📈 Gartner Q1/2024 → Q2/2025</div>
  <div class="big-num">+1.445%</div>
  <p class="statement">em consultas sobre<br><em>sistemas multiagentes</em></p>
  <div class="source">Esse conhecimento já virou vantagem competitiva real.</div>
  <div class="chart-bar-row">
    <div class="bar" style="height:30px;width:32px;opacity:0.4"></div>
    <div class="bar" style="height:48px;width:32px;opacity:0.5"></div>
    <div class="bar" style="height:72px;width:32px;opacity:0.6"></div>
    <div class="bar" style="height:110px;width:32px;opacity:0.75"></div>
    <div class="bar" style="height:160px;width:32px"></div>
  </div>
</div>
<div class="brand">INEMA</div>
</body></html>`,
  },

  // ── SLIDE 05 — BOLD STATEMENT: ARQUITETURA > MODELO ──────────────────────────
  {
    id: 5,
    filename: `${CAMPAIGN}_carousel_05`,
    image: img(5),
    concept: 'arquitetura > modelo — bold statement',
    copy_source: 'carousel_texts[4]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.4) contrast(1.15) saturate(1.0)}
.overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,20,0.88) 0%,rgba(0,20,60,0.75) 60%,rgba(0,0,0,0.9) 100%)}
.glow{position:absolute;top:30%;right:10%;width:400px;height:400px;background:radial-gradient(circle,rgba(0,153,255,0.1) 0%,transparent 70%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:72px}
.eyebrow{font-size:24px;font-weight:700;color:${B.blue};letter-spacing:0.14em;text-transform:uppercase;animation:fadeUp 0.4s both}
.main{flex:1;display:flex;flex-direction:column;justify-content:center}
.pre-text{font-family:'Montserrat',sans-serif;font-size:64px;font-weight:800;color:rgba(255,255,255,0.75);text-transform:uppercase;animation:fadeUp 0.5s 0.05s both}
.menos{font-family:'Montserrat',sans-serif;font-size:148px;font-weight:900;color:#FF5555;line-height:0.95;letter-spacing:-0.02em;text-shadow:0 0 60px rgba(255,85,85,0.35);animation:scaleIn 0.5s 0.1s both}
.post-text{font-family:'Montserrat',sans-serif;font-size:60px;font-weight:800;color:rgba(255,255,255,0.75);text-transform:uppercase;margin-bottom:28px;animation:fadeUp 0.5s 0.18s both}
.divider{width:90px;height:5px;background:linear-gradient(to right,${B.blue},${B.green});border-radius:3px;margin:8px 0 24px;animation:fadeUp 0.4s 0.2s both}
.conclusion{font-size:48px;font-weight:700;color:${B.green};text-shadow:0 0 30px rgba(0,255,136,0.3);animation:fadeUp 0.5s 0.25s both}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="glow"></div>
<div class="content">
  <div class="eyebrow">Perspectiva técnica</div>
  <div class="main">
    <div class="pre-text">O modelo de IA é a parte</div>
    <div class="menos">MENOS</div>
    <div class="post-text">importante do sistema.</div>
    <div class="divider"></div>
    <div class="conclusion">O que define tudo é a <strong>arquitetura</strong>.</div>
  </div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">05 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 06 — JORNADA: TEORIA → PRÁTICA ─────────────────────────────────────
  {
    id: 6,
    filename: `${CAMPAIGN}_carousel_06`,
    image: img(6),
    concept: 'jornada teoria à prática',
    copy_source: 'carousel_texts[5]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.28) contrast(1.2) saturate(1.1)}
.overlay{position:absolute;inset:0;background:rgba(10,10,30,0.88)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px}
.eyebrow{font-size:22px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.16em;text-transform:uppercase;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:80px;font-weight:900;line-height:1.05;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,0.9);animation:fadeUp 0.5s 0.05s both}
.headline em{color:${B.blue};font-style:normal}
.divider{width:80px;height:4px;background:linear-gradient(to right,${B.blue},${B.green});border-radius:2px;margin:16px 0;animation:fadeUp 0.4s 0.1s both}
.journey{display:flex;align-items:flex-start;gap:0;animation:fadeUp 0.5s 0.15s both;flex:1;justify-content:center;align-items:center}
.jstep{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center}
.jstep-label{font-size:20px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:12px}
.jstep-name{font-family:'Montserrat',sans-serif;font-size:38px;font-weight:900;color:#fff;line-height:1.15}
.jstep-name.blue{color:${B.blue}}
.jstep-name.green{color:${B.green}}
.jarrow{display:flex;align-items:center;padding:0 8px;padding-top:32px;font-size:40px;color:${B.green}}
.tags{display:flex;gap:16px;flex-wrap:wrap;animation:fadeUp 0.5s 0.3s both}
.tag{background:rgba(0,153,255,0.12);border:1px solid rgba(0,153,255,0.35);border-radius:6px;padding:10px 22px;font-size:26px;font-weight:700;color:${B.blue}}
.tag.green{background:rgba(0,255,136,0.1);border-color:rgba(0,255,136,0.35);color:${B.green}}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="content">
  <div>
    <div class="eyebrow">Da teoria à prática moderna</div>
    <div class="headline">Da teoria clássica<br>ao <em>presente</em></div>
    <div class="divider"></div>
  </div>
  <div class="journey">
    <div class="jstep">
      <div class="jstep-label">Fundamentos</div>
      <div class="jstep-name blue">Russell &<br>Norvig</div>
    </div>
    <div class="jarrow">→</div>
    <div class="jstep">
      <div class="jstep-label">Frameworks</div>
      <div class="jstep-name">LangGraph<br>CrewAI</div>
    </div>
    <div class="jarrow">→</div>
    <div class="jstep">
      <div class="jstep-label">Você</div>
      <div class="jstep-name green">Construindo<br>Agentes Reais</div>
    </div>
  </div>
  <div class="tags">
    <div class="tag">PT-BR</div>
    <div class="tag green">100% Gratuito</div>
    <div class="tag">Com Comunidade</div>
  </div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">06 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 07 — MID-CTA: PARE DE USAR ─────────────────────────────────────────
  {
    id: 7,
    filename: `${CAMPAIGN}_carousel_07`,
    image: img(7),
    concept: 'mid-cta — pare de usar comece a construir',
    copy_source: 'carousel_texts[6]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.35) contrast(1.2) saturate(1.2)}
.overlay{position:absolute;inset:0;background:linear-gradient(160deg,rgba(0,0,30,0.92) 0%,rgba(0,20,60,0.82) 100%)}
.glow-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(circle,rgba(0,153,255,0.1) 0%,transparent 70%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:72px}
.badge{display:inline-block;background:rgba(0,255,136,0.15);border:1px solid rgba(0,255,136,0.4);color:${B.green};font-size:22px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:10px 28px;border-radius:4px;margin-bottom:48px;animation:fadeUp 0.4s both}
.strike-text{font-family:'Montserrat',sans-serif;font-size:96px;font-weight:900;line-height:1.0;color:rgba(255,255,255,0.4);text-transform:uppercase;text-decoration:line-through;text-shadow:0 4px 24px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.05s both}
.and-text{font-size:36px;font-weight:600;color:rgba(255,255,255,0.4);margin:12px 0;animation:fadeUp 0.4s 0.1s both}
.cta-text{font-family:'Montserrat',sans-serif;font-size:96px;font-weight:900;line-height:1.0;color:${B.green};text-transform:uppercase;text-shadow:0 0 60px rgba(0,255,136,0.4);animation:fadeUp 0.5s 0.15s both}
.divider{width:200px;height:3px;background:linear-gradient(to right,transparent,${B.green},transparent);margin:36px auto;animation:fadeUp 0.4s 0.2s both}
.cta-btn{display:inline-block;background:linear-gradient(135deg,${B.blue},#00CC88);color:#fff;font-family:'Montserrat',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;padding:22px 64px;border-radius:9999px;box-shadow:0 4px 32px rgba(0,153,255,0.5);animation:scaleIn 0.5s 0.3s both}
.brand{position:absolute;bottom:56px;left:50%;transform:translateX(-50%);font-family:'Montserrat',sans-serif;font-size:26px;font-weight:900;color:rgba(255,255,255,0.4);letter-spacing:0.12em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="glow-center"></div>
<div class="content">
  <div class="badge">✅ Ação</div>
  <div class="strike-text">Pare de usar.</div>
  <div class="and-text">e</div>
  <div class="cta-text">Comece a<br>construir.</div>
  <div class="divider"></div>
  <div class="cta-btn">Acesse: inema.club</div>
</div>
<div class="brand">INEMA</div>
</body></html>`,
  },

  // ── SLIDE 08 — LOOP CIRCLES (PERCEPÇÃO-DECISÃO-AÇÃO) ─────────────────────────
  {
    id: 8,
    filename: `${CAMPAIGN}_carousel_08`,
    image: img(8),
    concept: 'percepção-decisão-ação loop visual',
    copy_source: 'key_phrases[0]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.22) contrast(1.25) saturate(0.9)}
.overlay{position:absolute;inset:0;background:rgba(13,13,13,0.9)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px}
.headline-block{animation:fadeUp 0.5s both}
.eyebrow{font-size:22px;font-weight:700;color:${B.blue};letter-spacing:0.16em;text-transform:uppercase;margin-bottom:12px}
.headline{font-family:'Montserrat',sans-serif;font-size:80px;font-weight:900;line-height:1.05;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,0.9)}
.headline span{color:${B.green}}
.circles-row{display:flex;align-items:center;justify-content:center;gap:24px;animation:fadeUp 0.5s 0.15s both}
.circle{width:210px;height:210px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid;backdrop-filter:blur(12px)}
.circle.c1{border-color:${B.blue};background:rgba(0,153,255,0.12)}
.circle.c2{border-color:${B.green};background:rgba(0,255,136,0.1)}
.circle.c3{border-color:${B.purple};background:rgba(123,97,255,0.12)}
.c-num{font-size:20px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:0.1em}
.c-name{font-family:'Montserrat',sans-serif;font-size:30px;font-weight:900;color:#fff;text-transform:uppercase;text-align:center;padding:0 8px}
.c-arrow{font-size:40px;color:${B.green};font-weight:900}
.bottom-text{font-size:32px;font-weight:600;color:rgba(255,255,255,0.6);text-align:center;animation:fadeUp 0.5s 0.25s both;line-height:1.5}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="headline-block">
    <div class="eyebrow">Arquitetura Fundamental</div>
    <div class="headline">Percepção, decisão, ação —<br><span>o loop que move tudo</span></div>
  </div>
  <div class="circles-row">
    <div class="circle c1">
      <div class="c-num">01</div>
      <div class="c-name">Perceber</div>
    </div>
    <div class="c-arrow">→</div>
    <div class="circle c2">
      <div class="c-num">02</div>
      <div class="c-name">Decidir</div>
    </div>
    <div class="c-arrow">→</div>
    <div class="circle c3">
      <div class="c-num">03</div>
      <div class="c-name">Agir</div>
    </div>
  </div>
  <div class="bottom-text">Formalizado por Russell & Norvig.<br>Hoje potencializado por LLMs.</div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">08 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 09 — LLMs: MOTORES DE RACIOCÍNIO ───────────────────────────────────
  {
    id: 9,
    filename: `${CAMPAIGN}_carousel_09`,
    image: img(9),
    concept: 'LLMs como motores de raciocínio — reframe',
    copy_source: 'key_phrases[3]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.3) contrast(1.2) saturate(1.1)}
.overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,20,60,0.92) 0%,rgba(0,0,0,0.88) 100%)}
.quote-bg{position:absolute;top:100px;left:40px;font-family:'Montserrat',sans-serif;font-size:200px;font-weight:900;color:rgba(0,153,255,0.08);line-height:1;pointer-events:none}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:72px}
.eyebrow{font-size:22px;font-weight:700;color:${B.blue};letter-spacing:0.15em;text-transform:uppercase;animation:fadeUp 0.4s both}
.main{flex:1;display:flex;flex-direction:column;justify-content:center;padding-left:16px}
.before-text{font-family:'Montserrat',sans-serif;font-size:68px;font-weight:800;color:rgba(255,255,255,0.75);text-transform:uppercase;animation:fadeUp 0.5s 0.05s both}
.striked{font-family:'Montserrat',sans-serif;font-size:68px;font-weight:800;color:rgba(255,255,255,0.3);text-decoration:line-through;animation:fadeUp 0.5s 0.08s both}
.after-text{font-family:'Montserrat',sans-serif;font-size:100px;font-weight:900;color:${B.green};line-height:1.0;text-shadow:0 0 50px rgba(0,255,136,0.3);animation:fadeUp 0.5s 0.15s both;margin-top:8px}
.sub{font-size:36px;font-weight:600;color:rgba(255,255,255,0.6);line-height:1.5;margin-top:28px;max-width:820px;animation:fadeUp 0.5s 0.25s both}
.sub em{color:${B.blue};font-style:normal}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="quote-bg">"</div>
<div class="content">
  <div class="eyebrow">Redefinição Técnica</div>
  <div class="main">
    <div class="before-text">LLMs não são</div>
    <div class="striked">ferramentas.</div>
    <div class="after-text">São motores<br>de raciocínio.</div>
    <p class="sub">GPT. Claude. Gemini.<br>Entenda como eles <em>decidem</em>, não só como respondem.</p>
  </div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">09 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 10 — URGÊNCIA DE MERCADO ───────────────────────────────────────────
  {
    id: 10,
    filename: `${CAMPAIGN}_carousel_10`,
    image: img(10),
    concept: 'urgência de mercado — mercado já decidiu',
    copy_source: 'key_phrases[6]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.28) contrast(1.3) saturate(0.85)}
.overlay{position:absolute;inset:0;background:rgba(0,10,30,0.9)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px}
.eyebrow{font-size:22px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.16em;text-transform:uppercase;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:88px;font-weight:900;line-height:1.05;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,0.9);animation:fadeUp 0.5s 0.05s both}
.headline em{color:${B.green};font-style:normal}
.card{background:rgba(0,153,255,0.1);border:1px solid rgba(0,153,255,0.3);border-radius:16px;padding:28px 36px;backdrop-filter:blur(12px);animation:fadeUp 0.5s 0.2s both}
.card-label{font-size:22px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px}
.card-data{font-family:'Montserrat',sans-serif;font-size:30px;font-weight:800;color:#fff}
.question{font-size:40px;font-weight:700;color:rgba(255,255,255,0.8);line-height:1.4;animation:fadeUp 0.5s 0.3s both}
.question em{color:${B.blue};font-style:normal}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">📈 O mercado fala</div>
  <div class="headline">+1.445% em<br>multiagentes —<br>o mercado<br><em>já decidiu</em></div>
  <div class="card">
    <div class="card-label">Crescimento em consultas</div>
    <div class="card-data">Sistemas multiagentes · Gartner Q1/2024 → Q2/2025</div>
  </div>
  <div class="question">Você está preparado para<br>entender <em>por dentro</em>? ⚡</div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">10 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 11 — TIMELINE: RUSSELL → LANGGRAPH ─────────────────────────────────
  {
    id: 11,
    filename: `${CAMPAIGN}_carousel_11`,
    image: img(11),
    concept: 'evolução — russell & norvig ao langgraph',
    copy_source: 'key_phrases[4]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.22) contrast(1.25) saturate(0.9)}
.overlay{position:absolute;inset:0;background:rgba(13,13,13,0.92)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px}
.eyebrow{font-size:22px;font-weight:700;color:${B.blue};letter-spacing:0.16em;text-transform:uppercase;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:76px;font-weight:900;line-height:1.05;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,0.9);margin:16px 0;animation:fadeUp 0.5s 0.05s both}
.headline em{color:${B.green};font-style:normal}
.timeline{display:flex;flex-direction:column;gap:0;flex:1;justify-content:center;position:relative}
.tline{position:absolute;left:14px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,${B.blue},${B.green},${B.purple})}
.titem{display:flex;gap:32px;padding:16px 0;position:relative}
.tdot{width:30px;height:30px;border-radius:50%;flex-shrink:0;margin-top:4px;position:relative;z-index:1}
.tdot.blue{background:${B.blue};box-shadow:0 0 20px rgba(0,153,255,0.6)}
.tdot.green{background:${B.green};box-shadow:0 0 20px rgba(0,255,136,0.6)}
.tdot.purple{background:${B.purple};box-shadow:0 0 20px rgba(123,97,255,0.6)}
.tinfo{}
.tyear{font-size:20px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:0.12em;text-transform:uppercase}
.tname{font-family:'Montserrat',sans-serif;font-size:40px;font-weight:900;color:#fff;margin-top:2px}
.tdesc{font-size:26px;font-weight:500;color:rgba(255,255,255,0.55);margin-top:4px}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="content">
  <div>
    <div class="eyebrow">Evolução dos Agentes</div>
    <div class="headline">Russell & Norvig<br>escreveu o mapa.<br><em>LangGraph é o veículo.</em></div>
  </div>
  <div class="timeline">
    <div class="tline"></div>
    <div class="titem">
      <div class="tdot blue"></div>
      <div class="tinfo">
        <div class="tyear">Fundamentos Clássicos</div>
        <div class="tname">Russell & Norvig</div>
        <div class="tdesc">O mapa teórico dos agentes racionais inteligentes</div>
      </div>
    </div>
    <div class="titem">
      <div class="tdot green"></div>
      <div class="tinfo">
        <div class="tyear">Frameworks Modernos</div>
        <div class="tname">LangGraph + CrewAI</div>
        <div class="tdesc">Agentes reais com LLMs, memória e planejamento</div>
      </div>
    </div>
    <div class="titem">
      <div class="tdot purple"></div>
      <div class="tinfo">
        <div class="tyear">Você Agora</div>
        <div class="tname">Construtor de Agentes</div>
        <div class="tdesc">Quem entende os dois mundos lidera</div>
      </div>
    </div>
  </div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">11 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 12 — AUTORIDADE: QUEM USA vs QUEM COMANDA ──────────────────────────
  {
    id: 12,
    filename: `${CAMPAIGN}_carousel_12`,
    image: img(12),
    concept: 'diferencial — quem usa vs quem comanda',
    copy_source: 'key_phrases[1]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.35) contrast(1.15) saturate(1.1)}
.overlay{position:absolute;inset:0;background:linear-gradient(160deg,rgba(0,0,40,0.92) 0%,rgba(0,20,60,0.78) 100%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:72px}
.eyebrow{font-size:22px;font-weight:700;color:${B.blue};letter-spacing:0.15em;text-transform:uppercase;animation:fadeUp 0.4s both}
.main{flex:1;display:flex;flex-direction:column;justify-content:center}
.pre{font-family:'Montserrat',sans-serif;font-size:72px;font-weight:800;color:rgba(255,255,255,0.65);text-transform:uppercase;animation:fadeUp 0.5s 0.05s both}
.vs-row{display:flex;gap:28px;align-items:center;margin:16px 0;animation:fadeUp 0.5s 0.1s both}
.vs-item-uses{font-family:'Montserrat',sans-serif;font-size:88px;font-weight:900;color:rgba(255,80,80,0.5);text-decoration:line-through;text-transform:uppercase}
.vs-arrow{font-size:52px;color:${B.green}}
.vs-item-builds{font-family:'Montserrat',sans-serif;font-size:88px;font-weight:900;color:${B.green};text-transform:uppercase;text-shadow:0 0 50px rgba(0,255,136,0.35)}
.sub{font-size:40px;font-weight:600;color:rgba(255,255,255,0.7);line-height:1.4;animation:fadeUp 0.5s 0.2s both;max-width:820px}
.sub em{color:${B.blue};font-style:normal}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">INEMA ✦ Diferencial</div>
  <div class="main">
    <div class="pre">A arquitetura separa quem</div>
    <div class="vs-row">
      <div class="vs-item-uses">usa</div>
      <div class="vs-arrow">→</div>
      <div class="vs-item-builds">comanda</div>
    </div>
    <p class="sub">Em 2026, essa diferença<br>define <em>quem lidera projetos</em><br>e quem executa tarefas.</p>
  </div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">12 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 13 — COMUNIDADE: PT-BR GRATUITO ────────────────────────────────────
  {
    id: 13,
    filename: `${CAMPAIGN}_carousel_13`,
    image: img(13),
    concept: 'diferencial INEMA — PT-BR gratuito comunidade',
    copy_source: 'key_phrases[7]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.28) contrast(1.2) saturate(1.0)}
.overlay{position:absolute;inset:0;background:rgba(13,13,40,0.9)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px}
.header{}
.eyebrow{font-size:22px;font-weight:700;color:${B.blue};letter-spacing:0.15em;text-transform:uppercase;margin-bottom:14px;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:84px;font-weight:900;line-height:1.05;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,0.9);animation:fadeUp 0.5s 0.05s both}
.headline em{color:${B.green};font-style:normal}
.divider{width:80px;height:4px;background:linear-gradient(to right,${B.blue},${B.green});border-radius:2px;margin:20px 0;animation:fadeUp 0.4s 0.1s both}
.feat-list{display:flex;flex-direction:column;gap:20px;flex:1;justify-content:center}
.feat{display:flex;align-items:center;gap:24px;animation:slideIn 0.5s both}
.feat:nth-child(2){animation-delay:0.1s}
.feat:nth-child(3){animation-delay:0.2s}
.feat-icon{font-size:44px;width:56px;text-align:center;flex-shrink:0}
.feat-content{}
.feat-title{font-family:'Montserrat',sans-serif;font-size:40px;font-weight:800;color:#fff}
.feat-sub{font-size:26px;font-weight:500;color:rgba(255,255,255,0.55);margin-top:4px}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="header">
    <div class="eyebrow">Por que a INEMA é diferente</div>
    <div class="headline">Em PT-BR.<br>De graça.<br><em>Com comunidade.</em></div>
    <div class="divider"></div>
  </div>
  <div class="feat-list">
    <div class="feat">
      <div class="feat-icon">🌐</div>
      <div class="feat-content">
        <div class="feat-title">100% em Português</div>
        <div class="feat-sub">contexto brasileiro, exemplos do nosso mercado</div>
      </div>
    </div>
    <div class="feat">
      <div class="feat-icon">🆓</div>
      <div class="feat-content">
        <div class="feat-title">Trilha totalmente gratuita</div>
        <div class="feat-sub">sem cartão de crédito, sem paywall</div>
      </div>
    </div>
    <div class="feat">
      <div class="feat-icon">🧠</div>
      <div class="feat-content">
        <div class="feat-title">Comunidade de +500K</div>
        <div class="feat-sub">ecossistema INEMA ativo e colaborativo</div>
      </div>
    </div>
  </div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">13 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 14 — FRAMEWORKS: LANGGRAPH, CREWAI, AUTOGEN ────────────────────────
  {
    id: 14,
    filename: `${CAMPAIGN}_carousel_14`,
    image: img(14),
    concept: 'frameworks modernos — LangGraph CrewAI AutoGen',
    copy_source: 'story_texts[4]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.25) contrast(1.3) saturate(0.9)}
.overlay{position:absolute;inset:0;background:rgba(13,13,13,0.92)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:72px}
.eyebrow{font-size:22px;font-weight:700;color:${B.blue};letter-spacing:0.15em;text-transform:uppercase;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:84px;font-weight:900;line-height:1.05;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,0.9);animation:fadeUp 0.5s 0.05s both}
.headline em{color:${B.green};font-style:normal}
.chips{display:flex;flex-direction:column;gap:20px;animation:fadeUp 0.5s 0.15s both}
.chip{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:24px 36px;display:flex;align-items:center;justify-content:space-between}
.chip:nth-child(1){border-left:5px solid ${B.blue}}
.chip:nth-child(2){border-left:5px solid ${B.green}}
.chip:nth-child(3){border-left:5px solid ${B.purple}}
.chip-name{font-family:'Montserrat',sans-serif;font-size:42px;font-weight:900;color:#fff}
.chip:nth-child(1) .chip-name{color:${B.blue}}
.chip:nth-child(2) .chip-name{color:${B.green}}
.chip:nth-child(3) .chip-name{color:${B.purple}}
.chip-desc{font-size:26px;font-weight:500;color:rgba(255,255,255,0.5);text-align:right}
.sub{font-size:34px;font-weight:600;color:rgba(255,255,255,0.6);line-height:1.5;animation:fadeUp 0.5s 0.25s both}
.footer{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">Frameworks Modernos</div>
  <div class="headline">Você sabe como<br>eles funcionam<br><em>por dentro?</em></div>
  <div class="chips">
    <div class="chip">
      <div class="chip-name">LangGraph</div>
      <div class="chip-desc">grafos de estado para agentes</div>
    </div>
    <div class="chip">
      <div class="chip-name">CrewAI</div>
      <div class="chip-desc">equipes de agentes colaborativos</div>
    </div>
    <div class="chip">
      <div class="chip-name">AutoGen</div>
      <div class="chip-desc">agentes conversacionais autônomos</div>
    </div>
  </div>
  <div class="sub">Não basta usar — você precisa<br>entender a arquitetura por baixo.</div>
  <div class="footer">
    <span class="brand">INEMA</span>
    <span class="slide-num">14 / 15</span>
  </div>
</div>
</body></html>`,
  },

  // ── SLIDE 15 — CTA FINAL: INEMA.CLUB (BRAND-FORWARD) ─────────────────────────
  {
    id: 15,
    filename: `${CAMPAIGN}_carousel_15`,
    image: img(15),
    concept: 'cta final — INEMA.CLUB brand-forward',
    copy_source: 'approved_ctas[0]',
    html: (imgPath) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.2) contrast(1.2) saturate(0.8)}
.overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,30,0.97) 0%,rgba(0,10,40,0.94) 50%,rgba(0,0,20,0.97) 100%)}
.glow-radial{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;background:radial-gradient(ellipse,rgba(0,153,255,0.14) 0%,transparent 70%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center;padding:64px 72px}
.top-tag{font-family:'Inter',sans-serif;font-size:26px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:0.18em;text-transform:uppercase;animation:fadeUp 0.4s both}
.main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
.brand-inema{font-family:'Montserrat',sans-serif;font-size:168px;font-weight:900;line-height:0.9;letter-spacing:-0.02em;color:#fff;text-shadow:0 0 80px rgba(0,153,255,0.5),0 4px 40px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.05s both}
.brand-club{font-family:'Montserrat',sans-serif;font-size:96px;font-weight:900;letter-spacing:0.06em;color:${B.blue};text-shadow:0 0 60px rgba(0,153,255,0.6);animation:fadeUp 0.5s 0.1s both}
.brand-sub{font-family:'Inter',sans-serif;font-size:30px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.08em;margin-top:16px;animation:fadeUp 0.5s 0.18s both}
.cta-block{display:flex;flex-direction:column;align-items:center;gap:16px;animation:scaleIn 0.5s 0.3s both}
.cta-btn{display:inline-block;background:linear-gradient(135deg,${B.blue},#00CC88);color:#fff;font-family:'Montserrat',sans-serif;font-size:36px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;padding:24px 80px;border-radius:9999px;box-shadow:0 4px 40px rgba(0,153,255,0.55),0 0 80px rgba(0,153,255,0.2)}
.cta-fine{font-size:26px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
</style></head><body>
<div class="bg"><img src="file://${imgPath}"></div>
<div class="overlay"></div>
<div class="glow-radial"></div>
<div class="content">
  <div class="top-tag">Trilha Completa · 100% Gratuita · Arquitetura de Agentes</div>
  <div class="main">
    <div class="brand-inema">INEMA</div>
    <div class="brand-club">.CLUB</div>
    <div class="brand-sub">Em PT-BR · Gratuito · Com Comunidade</div>
  </div>
  <div class="cta-block">
    <div class="cta-btn">Acesse Gratuitamente</div>
    <div class="cta-fine">Pare de usar. Comece a construir.</div>
  </div>
</div>
</body></html>`,
  },

];

async function renderSlide(browser, slide, outputDir) {
  const htmlPath = path.join(outputDir, `${slide.filename}.html`);
  const pngPath = path.join(outputDir, `${slide.filename}.png`);

  fs.writeFileSync(htmlPath, slide.html(slide.image), 'utf8');
  console.log(`  ✓ HTML: ${path.basename(htmlPath)}`);

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(800);
  await page.screenshot({ path: pngPath });
  await page.close();
  console.log(`  ✓ PNG: ${path.basename(pngPath)}`);

  return { htmlPath, pngPath };
}

async function main() {
  console.log('\n🎨 Ad Creative Designer — c0082-arquiteturas_agentes_inteligentes');
  console.log('━'.repeat(64));

  const browser = await chromium.launch();
  const results = [];

  for (const slide of slides) {
    console.log(`\n▶ Slide ${slide.id}/15 — ${slide.concept}`);
    const { htmlPath, pngPath } = await renderSlide(browser, slide, OUTPUT_DIR);
    results.push({
      slide: slide.id,
      filename: slide.filename + '.png',
      html_source: slide.filename + '.html',
      dimensions: '1080x1080',
      format: 'carousel',
      platforms: ['instagram', 'youtube', 'threads'],
      concept: slide.concept,
      copy_source: slide.copy_source,
      image_used: path.basename(slide.image),
    });
  }

  await browser.close();

  const layout = {
    campaign_id: CAMPAIGN,
    generated_at: new Date().toISOString(),
    platforms: ['instagram', 'youtube', 'threads'],
    format: 'carousel',
    slides_count: 15,
    dimensions: '1080x1080',
    brand_url: 'inema.club',
    copy_source: 'narrative.json + creative_brief.json',
    slides: results,
  };

  const layoutPath = path.join(OUTPUT_DIR, 'layout.json');
  fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 2), 'utf8');
  console.log(`\n✅ layout.json: ${layoutPath}`);
  console.log(`\n🏁 All 15 carousel slides rendered to:\n   ${OUTPUT_DIR}\n`);
}

main().catch(err => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
