#!/usr/bin/env node
/**
 * Ad Creative Renderer — c0043-gestores_ia_lideranca
 * 10 carousel slides 1080x1080 for Instagram
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, 'prj/inema/outputs/c0043-gestores_ia_lideranca/ads');
const IMG_DIR = path.resolve(__dirname, 'prj/inema/imgs/pascoa');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Brand palette
const B = {
  dark: '#0D0D0D',
  blue: '#0099FF',
  green: '#00FF88',
  white: '#FFFFFF',
  mid: '#1A1A2E',
};

// Google Fonts import — Space Grotesk + Montserrat
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Montserrat:wght@400;600;700;800;900&display=swap');`;

// Slide definitions
const slides = [
  // ── SLIDE 1 — HOOK ──────────────────────────────────────────────────────────
  {
    id: 1,
    filename: 'c0043-gestores_ia_lideranca_carousel_01',
    image: path.join(IMG_DIR, 'slide01_capa.jpg'),
    imgFit: 'contain',  // BANNER — do not crop
    concept: 'hook',
    copy_source: 'carousel_texts[0]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:${B.dark}}
.bg img{width:100%;height:100%;object-fit:contain;object-position:center;filter:brightness(0.55) contrast(1.1) saturate(1.1)}
.overlay{position:absolute;inset:0;background:linear-gradient(160deg,rgba(0,0,0,0.72) 0%,rgba(0,153,255,0.18) 50%,rgba(0,0,0,0.85) 100%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:72px 72px 80px}
.badge{display:inline-block;background:${B.blue};color:#fff;font-size:22px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:10px 28px;border-radius:4px;margin-bottom:40px;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:112px;font-weight:900;line-height:1.0;letter-spacing:-0.01em;color:#fff;text-transform:uppercase;max-width:900px;text-shadow:0 4px 32px rgba(0,0,0,0.7),0 0 60px rgba(0,0,0,0.4);animation:fadeUp 0.5s 0.05s both}
.headline em{color:${B.blue};font-style:normal}
.subline{font-size:42px;font-weight:600;color:rgba(255,255,255,0.88);line-height:1.3;margin-top:28px;max-width:700px;text-shadow:0 2px 16px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.15s both}
.cta-bar{position:absolute;bottom:72px;left:72px;right:72px;display:flex;align-items:center;justify-content:space-between}
.brand{font-family:'Montserrat',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.1em;color:${B.green};text-transform:uppercase;text-shadow:0 0 20px rgba(0,255,136,0.5)}
.handle{font-size:24px;font-weight:600;color:rgba(255,255,255,0.6);letter-spacing:0.06em}
.accent-line{position:absolute;top:0;left:0;width:8px;height:100%;background:linear-gradient(to bottom,${B.blue},${B.green})}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="accent-line"></div>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'slide01_capa.jpg')}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="badge">⚡ Alerta para Líderes</div>
  <h1 class="headline">Gestores<br><em>precisam</em><br>aprender IA</h1>
  <p class="subline">O mercado já se dividiu.<br>E você, de que lado está?</p>
</div>
<div class="cta-bar">
  <span class="brand">INEMA</span>
  <span class="handle">@inema.tds</span>
</div>
</body></html>`,
  },

  // ── SLIDE 2 — PROBLEMA ──────────────────────────────────────────────────────
  {
    id: 2,
    filename: 'c0043-gestores_ia_lideranca_carousel_02',
    image: path.join(IMG_DIR, 'c0013-pascoa2026_generated_01_carousel_1080x1080.jpg'),
    imgFit: 'cover',
    concept: 'problema',
    copy_source: 'carousel_texts[1]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.45) contrast(1.15) saturate(0.9)}
.overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,rgba(13,13,13,0.9) 100%)}
.side-accent{position:absolute;top:0;right:0;width:6px;height:100%;background:linear-gradient(to bottom,${B.green},${B.blue})}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:72px}
.eyebrow{font-size:24px;font-weight:700;color:${B.green};letter-spacing:0.15em;text-transform:uppercase;margin-bottom:28px;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:96px;font-weight:900;line-height:1.05;letter-spacing:-0.01em;color:#fff;text-transform:uppercase;max-width:920px;text-shadow:0 4px 32px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.05s both}
.headline .highlight{color:${B.blue};display:block}
.divider{width:80px;height:5px;background:linear-gradient(to right,${B.blue},${B.green});margin:32px 0;border-radius:3px;animation:fadeUp 0.5s 0.1s both}
.subline{font-size:38px;font-weight:600;color:rgba(255,255,255,0.85);line-height:1.4;max-width:780px;text-shadow:0 2px 16px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.15s both}
.bottom-bar{position:absolute;bottom:0;left:0;right:0;height:80px;background:rgba(0,0,0,0.6);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;padding:0 72px}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;letter-spacing:0.1em;color:${B.green};text-transform:uppercase}
.slide-num{font-size:22px;font-weight:700;color:rgba(255,255,255,0.5)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'c0013-pascoa2026_generated_01_carousel_1080x1080.jpg')}"></div>
<div class="overlay"></div>
<div class="side-accent"></div>
<div class="content">
  <div class="eyebrow">O problema</div>
  <h1 class="headline">Liderança<br>sem IA<span class="highlight">fica para trás</span></h1>
  <div class="divider"></div>
  <p class="subline">A divisão não é entre<br>sênior e júnior. É entre<br>quem usa IA e quem espera.</p>
</div>
<div class="bottom-bar">
  <span class="brand">INEMA</span>
  <span class="slide-num">02 / 10</span>
</div>
</body></html>`,
  },

  // ── SLIDE 3 — DADO DE MERCADO ────────────────────────────────────────────────
  {
    id: 3,
    filename: 'c0043-gestores_ia_lideranca_carousel_03',
    image: path.join(IMG_DIR, 'c0013-pascoa2026_generated_03_carousel_1080x1080.jpg'),
    imgFit: 'cover',
    concept: 'dado de mercado',
    copy_source: 'carousel_texts[2]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.3) contrast(1.2) saturate(0.7)}
.overlay{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,153,255,0.15) 0%,rgba(13,13,13,0.95) 70%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px;text-align:center}
.big-number{font-family:'Montserrat',sans-serif;font-size:220px;font-weight:900;line-height:0.9;color:${B.blue};text-shadow:0 0 80px rgba(0,153,255,0.6),0 4px 32px rgba(0,0,0,0.8);letter-spacing:-0.04em;animation:scaleIn 0.5s both}
.percent{font-size:120px;font-weight:900;color:${B.green};vertical-align:super;line-height:1;text-shadow:0 0 40px rgba(0,255,136,0.5)}
.statement{font-family:'Montserrat',sans-serif;font-size:48px;font-weight:700;color:#fff;line-height:1.25;max-width:820px;text-shadow:0 3px 20px rgba(0,0,0,0.9);margin-top:16px;animation:fadeUp 0.5s 0.15s both}
.statement em{color:${B.blue};font-style:normal}
.question{font-size:56px;font-weight:800;color:${B.green};margin-top:24px;text-transform:uppercase;letter-spacing:0.04em;text-shadow:0 0 30px rgba(0,255,136,0.4);animation:fadeUp 0.5s 0.25s both}
.brand{position:absolute;bottom:48px;right:64px;font-family:'Montserrat',sans-serif;font-size:26px;font-weight:900;color:rgba(255,255,255,0.5);letter-spacing:0.1em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
</style></head><body>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'c0013-pascoa2026_generated_03_carousel_1080x1080.jpg')}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="big-number">83<span class="percent">%</span></div>
  <p class="statement">dos executivos globais<br>já usam <em>IA ativamente</em></p>
  <p class="question">E você?</p>
</div>
<div class="brand">INEMA</div>
</body></html>`,
  },

  // ── SLIDE 4 — CONSEQUÊNCIA ───────────────────────────────────────────────────
  {
    id: 4,
    filename: 'c0043-gestores_ia_lideranca_carousel_04',
    image: path.join(IMG_DIR, 'c0013-pascoa2026_generated_05_carousel_1080x1080.jpg'),
    imgFit: 'cover',
    concept: 'consequencia',
    copy_source: 'carousel_texts[3]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.35) contrast(1.2) saturate(0.6) sepia(0.3)}
.overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,0.85) 0%,rgba(26,10,10,0.75) 50%,rgba(0,0,0,0.9) 100%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-start;padding:72px}
.eyebrow{font-size:22px;font-weight:700;color:#FF6B6B;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px;animation:fadeUp 0.4s both}
.headline-sm{font-family:'Montserrat',sans-serif;font-size:56px;font-weight:900;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:0.02em;animation:fadeUp 0.4s 0.05s both}
.big-cost{font-family:'Montserrat',sans-serif;font-size:72px;font-weight:900;line-height:1.05;color:#fff;text-transform:uppercase;text-shadow:0 4px 32px rgba(0,0,0,0.8);margin-top:16px;animation:fadeUp 0.5s 0.1s both}
.months{font-family:'Montserrat',sans-serif;font-size:140px;font-weight:900;color:#FF6B6B;line-height:1;text-shadow:0 0 60px rgba(255,107,107,0.4);letter-spacing:-0.02em;animation:scaleIn 0.5s 0.1s both}
.months-label{font-size:54px;font-weight:800;color:rgba(255,255,255,0.9);text-transform:uppercase;letter-spacing:0.05em;margin-top:4px;animation:fadeUp 0.5s 0.2s both}
.detail{font-size:36px;font-weight:600;color:rgba(255,255,255,0.7);margin-top:20px;line-height:1.4;animation:fadeUp 0.5s 0.25s both}
.bottom-bar{position:absolute;bottom:0;left:0;right:0;height:80px;background:rgba(0,0,0,0.7);backdrop-filter:blur(12px);border-top:1px solid rgba(255,107,107,0.3);display:flex;align-items:center;justify-content:space-between;padding:0 72px}
.brand{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
.slide-num{font-size:22px;color:rgba(255,255,255,0.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
</style></head><body>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'c0013-pascoa2026_generated_05_carousel_1080x1080.jpg')}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">⚠ O custo real de esperar</div>
  <div class="headline-sm">Atraso competitivo de</div>
  <div class="months">10</div>
  <div class="months-label">meses</div>
  <p class="detail">Cada mês sem IA é um mês<br>cedido ao seu concorrente.</p>
</div>
<div class="bottom-bar">
  <span class="brand">INEMA</span>
  <span class="slide-num">04 / 10</span>
</div>
</body></html>`,
  },

  // ── SLIDE 5 — REFRAME EMPODERADOR ──────────────────────────────────────────
  {
    id: 5,
    filename: 'c0043-gestores_ia_lideranca_carousel_05',
    image: path.join(IMG_DIR, 'easter_tech_30681933.jpg'),
    imgFit: 'cover',
    concept: 'reframe empoderador',
    copy_source: 'carousel_texts[4]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center top;filter:brightness(0.4) contrast(1.1) saturate(1.2)}
.overlay{position:absolute;inset:0;background:linear-gradient(to bottom right,rgba(0,153,255,0.2) 0%,rgba(0,0,0,0.8) 60%)}
.glow{position:absolute;top:20%;left:-10%;width:500px;height:500px;background:radial-gradient(circle,rgba(0,255,136,0.12) 0%,transparent 70%);pointer-events:none}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:72px}
.tag{display:inline-flex;align-items:center;gap:10px;background:rgba(0,255,136,0.15);border:1px solid rgba(0,255,136,0.4);color:${B.green};font-size:22px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:10px 24px;border-radius:4px;width:fit-content;margin-bottom:32px;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:100px;font-weight:900;line-height:1.0;color:#fff;text-transform:uppercase;text-shadow:0 4px 32px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.05s both}
.headline .blue{color:${B.blue}}
.headline .green{color:${B.green}}
.divider{width:100px;height:5px;background:linear-gradient(to right,${B.green},${B.blue});margin:28px 0;border-radius:3px}
.sub1{font-size:44px;font-weight:700;color:rgba(255,255,255,0.9);line-height:1.3;text-shadow:0 2px 16px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.1s both}
.sub2{font-size:38px;font-weight:600;color:rgba(255,255,255,0.75);line-height:1.4;margin-top:16px;text-shadow:0 2px 16px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.18s both}
.brand{position:absolute;bottom:60px;right:72px;font-family:'Montserrat',sans-serif;font-size:28px;font-weight:900;color:${B.green};letter-spacing:0.1em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'easter_tech_30681933.jpg')}"></div>
<div class="overlay"></div>
<div class="glow"></div>
<div class="content">
  <div class="tag">Reframe estratégico</div>
  <h1 class="headline"><span class="green">IA</span><br><span class="blue">amplifica.</span><br>Não substitui.</h1>
  <div class="divider"></div>
  <p class="sub1">Bons gestores com IA</p>
  <p class="sub2">ficam maiores, não menores.</p>
</div>
<div class="brand">INEMA</div>
</body></html>`,
  },

  // ── SLIDE 6 — EQUAÇÃO DO SUCESSO ────────────────────────────────────────────
  {
    id: 6,
    filename: 'c0043-gestores_ia_lideranca_carousel_06',
    image: path.join(IMG_DIR, 'easter_tech_31080746.jpg'),
    imgFit: 'cover',
    concept: 'equacao do sucesso',
    copy_source: 'carousel_texts[5]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.35) contrast(1.2) saturate(1.1)}
.overlay{position:absolute;inset:0;background:radial-gradient(ellipse at 80% 50%,rgba(0,153,255,0.2) 0%,rgba(13,13,13,0.9) 60%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px;text-align:center}
.formula{display:flex;align-items:center;justify-content:center;gap:24px;animation:scaleIn 0.5s both;margin-bottom:36px}
.formula-item{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:28px 40px;backdrop-filter:blur(8px)}
.formula-item.blue{border-color:rgba(0,153,255,0.5);background:rgba(0,153,255,0.15)}
.formula-item.green{border-color:rgba(0,255,136,0.5);background:rgba(0,255,136,0.1)}
.fi-label{font-family:'Montserrat',sans-serif;font-size:56px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.02em;line-height:1.1}
.fi-label.c-blue{color:${B.blue}}
.fi-label.c-green{color:${B.green}}
.op{font-family:'Montserrat',sans-serif;font-size:72px;font-weight:900;color:rgba(255,255,255,0.6)}
.result-line{font-family:'Montserrat',sans-serif;font-size:80px;font-weight:900;color:#fff;text-transform:uppercase;text-shadow:0 4px 32px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.1s both;line-height:1.1}
.result-sub{font-size:40px;font-weight:600;color:${B.blue};margin-top:16px;letter-spacing:0.04em;text-shadow:0 0 20px rgba(0,153,255,0.4);animation:fadeUp 0.5s 0.2s both}
.brand{position:absolute;bottom:56px;left:50%;transform:translateX(-50%);font-family:'Montserrat',sans-serif;font-size:26px;font-weight:900;color:rgba(255,255,255,0.45);letter-spacing:0.12em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
</style></head><body>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'easter_tech_31080746.jpg')}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="formula">
    <div class="formula-item blue"><div class="fi-label c-blue">Gestão</div></div>
    <div class="op">+</div>
    <div class="formula-item green"><div class="fi-label c-green">IA</div></div>
    <div class="op">=</div>
  </div>
  <div class="result-line">Vantagem<br>Competitiva Real</div>
  <div class="result-sub">que seu concorrente ainda não tem</div>
</div>
<div class="brand">INEMA</div>
</body></html>`,
  },

  // ── SLIDE 7 — APLICAÇÃO PRÁTICA ─────────────────────────────────────────────
  {
    id: 7,
    filename: 'c0043-gestores_ia_lideranca_carousel_07',
    image: path.join(IMG_DIR, 'easter_tech_3972147.jpg'),
    imgFit: 'cover',
    concept: 'aplicacao pratica',
    copy_source: 'carousel_texts[6]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.3) contrast(1.15) saturate(0.9)}
.overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.6) 0%,rgba(13,13,13,0.92) 100%)}
.content{position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:flex-start}
.eyebrow{font-size:24px;font-weight:700;color:${B.green};letter-spacing:0.15em;text-transform:uppercase;margin-bottom:20px;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:76px;font-weight:900;line-height:1.05;color:#fff;text-transform:uppercase;max-width:900px;text-shadow:0 4px 24px rgba(0,0,0,0.8);margin-bottom:48px;animation:fadeUp 0.5s 0.05s both}
.headline .num{color:${B.green};font-size:110px}
.items{display:flex;flex-direction:column;gap:20px}
.item{display:flex;align-items:center;gap:24px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-left:4px solid ${B.blue};border-radius:8px;padding:20px 28px;backdrop-filter:blur(8px);animation:slideIn 0.5s both}
.item:nth-child(2){animation-delay:0.1s;border-left-color:${B.green}}
.item:nth-child(3){animation-delay:0.2s;border-left-color:#FF6B6B}
.item-icon{font-size:40px;flex-shrink:0}
.item-text{font-size:36px;font-weight:700;color:#fff;line-height:1.2}
.item-sub{font-size:26px;font-weight:500;color:rgba(255,255,255,0.65);margin-top:4px}
.brand{position:absolute;bottom:60px;right:72px;font-family:'Montserrat',sans-serif;font-size:26px;font-weight:900;color:${B.green};letter-spacing:0.1em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
</style></head><body>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'easter_tech_3972147.jpg')}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="eyebrow">Aplicação imediata</div>
  <h1 class="headline"><span class="num">3</span> áreas onde<br>IA economiza<br>tempo hoje</h1>
  <div class="items">
    <div class="item">
      <div class="item-icon">📊</div>
      <div><div class="item-text">Relatórios e Análises</div><div class="item-sub">Automatize em minutos o que leva horas</div></div>
    </div>
    <div class="item">
      <div class="item-icon">🤝</div>
      <div><div class="item-text">Reuniões e Decisões</div><div class="item-sub">Síntese, resumos e preparação automática</div></div>
    </div>
    <div class="item">
      <div class="item-icon">📈</div>
      <div><div class="item-text">Gestão de Equipes</div><div class="item-sub">Processos e comunicação em escala</div></div>
    </div>
  </div>
</div>
<div class="brand">INEMA</div>
</body></html>`,
  },

  // ── SLIDE 8 — ASPIRAÇÃO ─────────────────────────────────────────────────────
  {
    id: 8,
    filename: 'c0043-gestores_ia_lideranca_carousel_08',
    image: path.join(IMG_DIR, 'easter_tech_4135641.jpg'),
    imgFit: 'cover',
    concept: 'aspiracao',
    copy_source: 'carousel_texts[7]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.4) contrast(1.1) saturate(1.3)}
.overlay{position:absolute;inset:0;background:linear-gradient(to top right,rgba(0,0,0,0.9) 0%,rgba(0,153,255,0.1) 60%,rgba(0,0,0,0.7) 100%)}
.glow-bottom{position:absolute;bottom:0;left:0;right:0;height:300px;background:linear-gradient(to top,rgba(0,255,136,0.12) 0%,transparent 100%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:72px}
.badge{display:inline-flex;align-items:center;gap:8px;background:rgba(0,153,255,0.2);border:1px solid rgba(0,153,255,0.5);color:${B.blue};font-size:22px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:10px 24px;border-radius:4px;width:fit-content;margin-bottom:36px;animation:fadeUp 0.4s both}
.headline{font-family:'Montserrat',sans-serif;font-size:92px;font-weight:900;line-height:1.05;color:#fff;text-transform:uppercase;max-width:900px;text-shadow:0 4px 32px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.05s both}
.headline .future{color:${B.green};font-size:80px}
.divider{width:80px;height:5px;background:linear-gradient(to right,${B.blue},${B.green});margin:28px 0;border-radius:3px}
.sub{font-size:42px;font-weight:600;color:rgba(255,255,255,0.85);line-height:1.4;text-shadow:0 2px 16px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.15s both}
.brand{position:absolute;bottom:60px;right:72px;font-family:'Montserrat',sans-serif;font-size:26px;font-weight:900;color:${B.green};letter-spacing:0.1em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'easter_tech_4135641.jpg')}"></div>
<div class="overlay"></div>
<div class="glow-bottom"></div>
<div class="content">
  <div class="badge">🚀 Visão de futuro</div>
  <h1 class="headline">Quem aprende<br>IA hoje<br><span class="future">lidera amanhã</span></h1>
  <div class="divider"></div>
  <p class="sub">O mercado do próximo ciclo<br>pertence a quem age agora.</p>
</div>
<div class="brand">INEMA</div>
</body></html>`,
  },

  // ── SLIDE 9 — SOLUÇÃO INEMA ──────────────────────────────────────────────────
  {
    id: 9,
    filename: 'c0043-gestores_ia_lideranca_carousel_09',
    image: path.join(IMG_DIR, 'easter_tech_6990559.jpg'),
    imgFit: 'cover',
    concept: 'solucao INEMA',
    copy_source: 'carousel_texts[8]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.25) contrast(1.2) saturate(1.1)}
.overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,153,255,0.25) 0%,rgba(0,0,0,0.85) 100%)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:72px}
.logo-block{margin-bottom:36px;animation:fadeUp 0.4s both}
.logo-text{font-family:'Montserrat',sans-serif;font-size:64px;font-weight:900;color:#fff;letter-spacing:0.08em}
.logo-text .dot{color:${B.blue}}
.logo-sub{font-size:24px;font-weight:600;color:${B.green};letter-spacing:0.14em;text-transform:uppercase;margin-top:4px}
.divider{width:80px;height:4px;background:${B.blue};margin:28px 0;border-radius:3px}
.headline{font-family:'Montserrat',sans-serif;font-size:64px;font-weight:800;line-height:1.15;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,0.8);max-width:860px;animation:fadeUp 0.5s 0.08s both}
.features{display:flex;flex-direction:column;gap:14px;margin-top:36px}
.feat{display:flex;align-items:center;gap:16px;font-size:32px;font-weight:600;color:rgba(255,255,255,0.88);animation:fadeUp 0.5s both}
.feat:nth-child(2){animation-delay:0.1s}
.feat:nth-child(3){animation-delay:0.2s}
.feat-dot{width:10px;height:10px;border-radius:50%;background:${B.green};flex-shrink:0}
.brand{position:absolute;bottom:60px;right:72px;font-family:'Montserrat',sans-serif;font-size:26px;font-weight:900;color:rgba(255,255,255,0.4);letter-spacing:0.1em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'easter_tech_6990559.jpg')}"></div>
<div class="overlay"></div>
<div class="content">
  <div class="logo-block">
    <div class="logo-text">INEMA<span class="dot">.</span></div>
    <div class="logo-sub">Formação Executiva em IA</div>
  </div>
  <div class="divider"></div>
  <h2 class="headline">Onde gestores aprendem IA<br>de forma prática</h2>
  <div class="features">
    <div class="feat"><div class="feat-dot"></div>100% gratuito no inema.club</div>
    <div class="feat"><div class="feat-dot"></div>Sem jargão técnico — foco em gestão</div>
    <div class="feat"><div class="feat-dot"></div>No seu ritmo, na sua língua</div>
  </div>
</div>
<div class="brand">INEMA</div>
</body></html>`,
  },

  // ── SLIDE 10 — CTA ──────────────────────────────────────────────────────────
  {
    id: 10,
    filename: 'c0043-gestores_ia_lideranca_carousel_010',
    image: path.join(IMG_DIR, 'pex01_easter_egg_glow.jpg'),
    imgFit: 'cover',
    concept: 'cta',
    copy_source: 'carousel_texts[9]',
    html: () => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:${B.dark};font-family:'Space Grotesk',sans-serif}
.bg{position:absolute;inset:0}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(0.25) contrast(1.1) saturate(0.8)}
.overlay{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(0,153,255,0.18) 0%,rgba(13,13,13,0.95) 65%)}
.glow-ring{position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);width:600px;height:600px;border-radius:50%;border:1px solid rgba(0,255,136,0.15);box-shadow:0 0 80px rgba(0,255,136,0.1) inset,0 0 40px rgba(0,255,136,0.08)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:72px}
.logo{font-family:'Montserrat',sans-serif;font-size:52px;font-weight:900;letter-spacing:0.12em;color:#fff;margin-bottom:48px;animation:fadeUp 0.4s both}
.logo .dot{color:${B.blue}}
.headline{font-family:'Montserrat',sans-serif;font-size:100px;font-weight:900;line-height:1.0;color:#fff;text-transform:uppercase;text-shadow:0 4px 32px rgba(0,0,0,0.8);animation:fadeUp 0.5s 0.05s both;margin-bottom:16px}
.headline .now{color:${B.green}}
.url{font-size:52px;font-weight:700;color:${B.blue};margin-bottom:52px;text-shadow:0 0 30px rgba(0,153,255,0.4);animation:fadeUp 0.5s 0.1s both}
.cta-btn{display:inline-block;background:${B.green};color:#000;font-family:'Montserrat',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;padding:22px 72px;border-radius:9999px;box-shadow:0 4px 32px rgba(0,255,136,0.5),0 0 60px rgba(0,255,136,0.2);animation:scaleIn 0.5s 0.2s both}
.free-badge{font-size:26px;font-weight:700;color:rgba(255,255,255,0.7);margin-top:24px;letter-spacing:0.06em;animation:fadeUp 0.5s 0.3s both}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
</style></head><body>
<div class="bg"><img src="file://${path.join(IMG_DIR, 'pex01_easter_egg_glow.jpg')}"></div>
<div class="overlay"></div>
<div class="glow-ring"></div>
<div class="content">
  <div class="logo">INEMA<span class="dot">.</span></div>
  <h1 class="headline">Comece<br><span class="now">agora.</span></h1>
  <div class="url">inema.club</div>
  <div class="cta-btn">Acessar Grátis</div>
  <div class="free-badge">100% gratuito · Sem cartão de crédito</div>
</div>
</body></html>`,
  },
];

async function renderSlide(browser, slide, outputDir) {
  const htmlPath = path.join(outputDir, `${slide.filename}.html`);
  const pngPath = path.join(outputDir, `${slide.filename}.png`);

  // Write HTML
  fs.writeFileSync(htmlPath, slide.html(), 'utf8');
  console.log(`  ✓ HTML written: ${path.basename(htmlPath)}`);

  // Render PNG
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(800); // let fonts + animations settle
  await page.screenshot({ path: pngPath });
  await page.close();
  console.log(`  ✓ PNG rendered: ${path.basename(pngPath)}`);

  return { htmlPath, pngPath };
}

async function main() {
  console.log('\n🎨 Ad Creative Designer — c0043-gestores_ia_lideranca');
  console.log('━'.repeat(60));

  const browser = await chromium.launch();
  const results = [];

  for (const slide of slides) {
    console.log(`\n▶ Slide ${slide.id}/10 — ${slide.concept}`);
    const { htmlPath, pngPath } = await renderSlide(browser, slide, OUTPUT_DIR);
    results.push({
      slide: slide.id,
      filename: slide.filename + '.png',
      html_source: slide.filename + '.html',
      dimensions: '1080x1080',
      format: 'carousel',
      platform: 'instagram',
      concept: slide.concept,
      copy_source: slide.copy_source,
      image_used: path.basename(slide.image),
    });
  }

  await browser.close();

  // Write layout.json
  const layout = {
    campaign_id: 'c0043-gestores_ia_lideranca',
    generated_at: new Date().toISOString(),
    platform: 'instagram',
    format: 'carousel',
    slides_count: 10,
    dimensions: '1080x1080',
    slides: results,
  };
  const layoutPath = path.join(OUTPUT_DIR, 'layout.json');
  fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 2), 'utf8');
  console.log(`\n✅ layout.json saved: ${layoutPath}`);
  console.log('\n🏁 All 10 carousel slides rendered successfully.\n');
}

main().catch(err => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
