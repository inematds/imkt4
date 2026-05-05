#!/usr/bin/env node
/**
 * Render script for c0076-agentes_ia_advocacia carousel (15 slides)
 * Generates HTML + PNG for each slide via Playwright at 1080x1080
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/home/nmaldaner/projetos/timesmkt3';
const OUTPUT_DIR = path.join(BASE, 'prj/inema/outputs/c0076-agentes_ia_advocacia/ads');
const IMGS_DIR = path.join(BASE, 'prj/inema/outputs/c0076-agentes_ia_advocacia/imgs');
const CAMPAIGN = 'c0076-agentes_ia_advocacia';

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function img(n) {
  return path.join(IMGS_DIR, `${CAMPAIGN}_generated_${String(n).padStart(2, '0')}_carousel_1080x1080.jpg`);
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

const BASE_CSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1080px;overflow:hidden;font-family:'Space Grotesk','Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:#0D0D0D}
  .wrap{position:relative;width:1080px;height:1080px;overflow:hidden}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.8) contrast(1.1) saturate(1.15)}
  .overlay{position:absolute;inset:0}
  .slide-num{position:absolute;top:44px;right:56px;font-size:20px;color:rgba(255,255,255,0.4);font-weight:600;letter-spacing:0.12em;font-family:'Space Grotesk',sans-serif;z-index:10}
  .brand-mark{position:absolute;top:44px;left:56px;display:flex;align-items:center;gap:10px;z-index:10}
  .brand-dot{width:9px;height:9px;border-radius:50%;background:#0099FF;box-shadow:0 0 8px rgba(0,153,255,0.8)}
  .brand-name{font-size:20px;font-weight:700;color:rgba(255,255,255,0.65);letter-spacing:0.12em;text-transform:uppercase}
  .content{position:absolute;inset:0;z-index:5;padding:56px}
`;

function shell(slideNum, bgImage, overlayStyle, innerContent, extra = '') {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}${extra}</style></head><body>
<div class="wrap">
  <img class="bg" src="file://${bgImage}">
  <div class="overlay" style="${overlayStyle}"></div>
  <div class="brand-mark"><div class="brand-dot"></div><div class="brand-name">INEMA.CLUB</div></div>
  <div class="slide-num">${String(slideNum).padStart(2,'0')} / 15</div>
  <div class="content">${innerContent}</div>
</div></body></html>`;
}

// ── SLIDE 1 — HOOK ────────────────────────────────────────────────────────────
function slide01() {
  const extra = `
    .s1-inner{display:flex;flex-direction:column;justify-content:flex-end;height:100%;padding-bottom:24px}
    .s1-eyebrow{display:inline-block;background:#0099FF;color:#fff;font-size:22px;font-weight:700;padding:10px 24px;border-radius:9999px;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:28px;align-self:flex-start;box-shadow:0 4px 20px rgba(0,153,255,0.5)}
    .s1-headline{font-size:108px;font-weight:800;color:#fff;line-height:1.0;letter-spacing:-0.02em;text-shadow:0 4px 32px rgba(0,0,0,0.7);margin-bottom:28px}
    .s1-headline span{color:#00FF88}
    .s1-sub{font-size:46px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.3;text-shadow:0 2px 16px rgba(0,0,0,0.6);max-width:820px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    .s1-eyebrow{animation:fadeUp 0.4s ease both}
    .s1-headline{animation:fadeUp 0.5s ease 0.1s both}
    .s1-sub{animation:fadeUp 0.5s ease 0.2s both}
  `;
  const inner = `<div class="s1-inner">
    <div class="s1-eyebrow">⚡ DADO REAL</div>
    <div class="s1-headline"><span>60%</span> DO SEU<br>DIA É<br>OPERACIONAL</div>
    <div class="s1-sub">Você ainda redige contratos<br>e petições do zero?</div>
  </div>`;
  return shell(1, img(1), 'background:linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.55) 55%,rgba(13,13,13,0.15) 100%)', inner, extra);
}

// ── SLIDE 2 — REVEAL ─────────────────────────────────────────────────────────
function slide02() {
  const extra = `
    .s2-inner{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;height:100%}
    .s2-label{font-size:24px;font-weight:600;color:#0099FF;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px}
    .s2-headline{font-size:96px;font-weight:800;color:#fff;line-height:1.0;letter-spacing:-0.02em;text-shadow:0 4px 32px rgba(0,0,0,0.7);margin-bottom:12px}
    .s2-headline span{color:#00FF88}
    .s2-divider{width:80px;height:4px;background:linear-gradient(90deg,#0099FF,#00FF88);border-radius:2px;margin-bottom:28px}
    .s2-sub{font-size:44px;font-weight:500;color:rgba(255,255,255,0.88);line-height:1.35;text-shadow:0 2px 12px rgba(0,0,0,0.6);max-width:760px;margin-bottom:20px}
    .s2-body{font-size:32px;font-weight:400;color:rgba(255,255,255,0.62);line-height:1.5;max-width:680px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    .s2-label{animation:fadeUp 0.4s ease both}
    .s2-headline{animation:fadeUp 0.5s ease 0.1s both}
    .s2-divider{animation:fadeUp 0.4s ease 0.15s both}
    .s2-sub{animation:fadeUp 0.5s ease 0.2s both}
    .s2-body{animation:fadeUp 0.5s ease 0.3s both}
  `;
  const inner = `<div class="s2-inner">
    <div class="s2-label">🧠 A SOLUÇÃO EXISTE</div>
    <div class="s2-headline"><span>5</span> AGENTES<br>DE IA</div>
    <div class="s2-divider"></div>
    <div class="s2-sub">Um pipeline que transforma<br>seu escritório</div>
    <div class="s2-body">Cada etapa. Cada detalhe. Automatizados.</div>
  </div>`;
  return shell(2, img(2), 'background:linear-gradient(135deg,rgba(0,0,0,0.88) 40%,rgba(0,153,255,0.12) 100%)', inner, extra);
}

// ── SLIDES 3-7 — AGENT SHOWCASE (split layout) ───────────────────────────────
function agentSlide(num, imgNum, agentNum, agentColor, title, description, icon) {
  const extra = `
    .split{display:flex;height:100%}
    .split-left{width:540px;flex-shrink:0;display:flex;flex-direction:column;justify-content:flex-end;padding:56px;background:linear-gradient(135deg,#0D0D0D 0%,#1A1A2E 100%);position:relative;z-index:5}
    .split-right{flex:1;position:relative;overflow:hidden}
    .split-right img{width:100%;height:100%;object-fit:cover;filter:brightness(0.82) contrast(1.1) saturate(1.15)}
    .split-right::after{content:'';position:absolute;inset:0;background:linear-gradient(270deg,transparent 60%,#0D0D0D 100%)}
    .agent-badge{display:inline-flex;align-items:center;gap:10px;background:${agentColor};color:#0D0D0D;font-size:18px;font-weight:700;padding:10px 22px;border-radius:9999px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:24px;align-self:flex-start;box-shadow:0 4px 20px rgba(0,0,0,0.4)}
    .agent-num{font-size:72px;font-weight:800;color:rgba(255,255,255,0.07);line-height:1;position:absolute;top:44px;left:44px;letter-spacing:-0.04em}
    .agent-title{font-size:68px;font-weight:800;color:#fff;line-height:1.05;letter-spacing:-0.02em;text-shadow:0 4px 24px rgba(0,0,0,0.5);margin-bottom:20px}
    .agent-desc{font-size:34px;font-weight:400;color:rgba(255,255,255,0.72);line-height:1.5;max-width:460px}
    .pipeline-bar{display:flex;gap:6px;margin-top:32px}
    .pipeline-dot{height:4px;border-radius:2px;flex:1;background:rgba(255,255,255,0.15)}
    .pipeline-dot.active{background:${agentColor}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .agent-badge{animation:fadeUp 0.4s ease both}
    .agent-title{animation:fadeUp 0.5s ease 0.1s both}
    .agent-desc{animation:fadeUp 0.5s ease 0.2s both}
  `;
  const dots = [1,2,3,4,5].map(d => `<div class="pipeline-dot${d===agentNum?' active':''}"></div>`).join('');
  const inner = `<div class="split">
    <div class="split-left">
      <div class="agent-num">0${agentNum}</div>
      <div class="agent-badge">${icon} AGENTE ${agentNum}</div>
      <div class="agent-title">${title}</div>
      <div class="agent-desc">${description}</div>
      <div class="pipeline-bar">${dots}</div>
    </div>
    <div class="split-right"><img src="file://${img(imgNum)}"></div>
  </div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}${extra}</style></head><body>
<div class="wrap">
  <div class="brand-mark"><div class="brand-dot"></div><div class="brand-name">INEMA.CLUB</div></div>
  <div class="slide-num">${String(num).padStart(2,'0')} / 15</div>
  <div class="content" style="padding:0">${inner}</div>
</div></body></html>`;
}

// ── SLIDE 8 — RESULT ─────────────────────────────────────────────────────────
function slide08() {
  const extra = `
    .s8-inner{display:flex;flex-direction:column;justify-content:flex-end;height:100%;padding-bottom:32px}
    .s8-label{font-size:22px;font-weight:600;color:#0099FF;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:20px}
    .s8-headline{font-size:90px;font-weight:800;color:#fff;line-height:1.0;letter-spacing:-0.02em;text-shadow:0 4px 32px rgba(0,0,0,0.7);margin-bottom:32px}
    .s8-headline span{color:#00FF88}
    .s8-items{display:flex;flex-direction:column;gap:16px;margin-bottom:32px}
    .s8-item{display:flex;align-items:center;gap:16px;font-size:36px;font-weight:600;color:rgba(255,255,255,0.92);text-shadow:0 2px 12px rgba(0,0,0,0.5)}
    .s8-check{width:36px;height:36px;border-radius:50%;background:#00FF88;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px}
    .s8-footer{font-size:36px;font-weight:500;color:rgba(255,255,255,0.7);line-height:1.45}
    .s8-footer strong{color:#0099FF}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .s8-label{animation:fadeUp 0.4s ease both}
    .s8-headline{animation:fadeUp 0.5s ease 0.1s both}
    .s8-items{animation:fadeUp 0.5s ease 0.2s both}
    .s8-footer{animation:fadeUp 0.5s ease 0.3s both}
  `;
  const inner = `<div class="s8-inner">
    <div class="s8-label">🎯 O RESULTADO</div>
    <div class="s8-headline">DO CAOS AO<br>CASO <span>ESTRUTURADO</span></div>
    <div class="s8-items">
      <div class="s8-item"><div class="s8-check">✓</div>Caso estruturado e organizado</div>
      <div class="s8-item"><div class="s8-check">✓</div>Peças jurídicas prontas para revisão</div>
      <div class="s8-item"><div class="s8-check">✓</div>Insights estratégicos do caso</div>
    </div>
    <div class="s8-footer"><strong>Você foca na estratégia.</strong><br>A IA cuida do resto.</div>
  </div>`;
  return shell(8, img(8), 'background:linear-gradient(to top,rgba(0,0,0,0.94) 0%,rgba(0,0,0,0.5) 55%,rgba(13,13,13,0.1) 100%)', inner, extra);
}

// ── SLIDE 9 — OAB APPROVED ───────────────────────────────────────────────────
function slide09() {
  const extra = `
    .s9-inner{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;height:100%;max-width:820px}
    .s9-stamp{display:inline-flex;align-items:center;gap:14px;border:2px solid #00FF88;border-radius:12px;padding:14px 24px;margin-bottom:36px}
    .s9-stamp-dot{width:12px;height:12px;border-radius:50%;background:#00FF88;box-shadow:0 0 12px rgba(0,255,136,0.8)}
    .s9-stamp-text{font-size:20px;font-weight:700;color:#00FF88;letter-spacing:0.12em;text-transform:uppercase}
    .s9-headline{font-size:92px;font-weight:800;color:#fff;line-height:1.0;letter-spacing:-0.02em;text-shadow:0 4px 32px rgba(0,0,0,0.7);margin-bottom:16px}
    .s9-date{font-size:32px;font-weight:600;color:#0099FF;margin-bottom:28px;letter-spacing:0.05em}
    .s9-sub{font-size:40px;font-weight:500;color:rgba(255,255,255,0.82);line-height:1.4;text-shadow:0 2px 12px rgba(0,0,0,0.5);margin-bottom:20px}
    .s9-body{font-size:30px;font-weight:400;color:rgba(255,255,255,0.6);line-height:1.55}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .s9-stamp{animation:fadeUp 0.4s ease both}
    .s9-headline{animation:fadeUp 0.5s ease 0.1s both}
    .s9-date{animation:fadeUp 0.4s ease 0.15s both}
    .s9-sub{animation:fadeUp 0.5s ease 0.2s both}
    .s9-body{animation:fadeUp 0.5s ease 0.3s both}
  `;
  const inner = `<div class="s9-inner">
    <div class="s9-stamp"><div class="s9-stamp-dot"></div><div class="s9-stamp-text">✅ APROVADO PELA OAB</div></div>
    <div class="s9-headline">LEGITIMIDADE<br>OFICIAL</div>
    <div class="s9-date">Novembro de 2024</div>
    <div class="s9-sub">A OAB regulamentou o uso de<br>IA na advocacia.</div>
    <div class="s9-body">Sem precisar saber programar.<br>Aprende em horas, não em meses.</div>
  </div>`;
  return shell(9, img(9), 'background:linear-gradient(135deg,rgba(0,0,0,0.9) 45%,rgba(0,255,136,0.06) 100%)', inner, extra);
}

// ── SLIDE 10 — KEY MESSAGE ───────────────────────────────────────────────────
function slide10() {
  const extra = `
    .s10-inner{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:880px}
    .s10-pre{font-size:30px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:16px}
    .s10-headline{font-size:100px;font-weight:800;color:#fff;line-height:1.0;letter-spacing:-0.025em;text-shadow:0 4px 32px rgba(0,0,0,0.7);margin-bottom:0}
    .s10-dash{font-size:100px;font-weight:800;color:#0099FF;line-height:1.0;margin-bottom:0}
    .s10-release{font-size:100px;font-weight:800;color:#00FF88;line-height:1.0;letter-spacing:-0.02em;margin-bottom:36px}
    .s10-divider{width:100px;height:4px;background:linear-gradient(90deg,#0099FF,#00FF88);border-radius:2px;margin-bottom:36px}
    .s10-sub{font-size:44px;font-weight:600;color:rgba(255,255,255,0.88);line-height:1.3;text-shadow:0 2px 12px rgba(0,0,0,0.5)}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .s10-pre{animation:fadeUp 0.4s ease both}
    .s10-headline{animation:fadeUp 0.5s ease 0.08s both}
    .s10-dash{animation:fadeUp 0.5s ease 0.12s both}
    .s10-release{animation:fadeUp 0.5s ease 0.16s both}
    .s10-divider{animation:fadeUp 0.4s ease 0.22s both}
    .s10-sub{animation:fadeUp 0.5s ease 0.28s both}
  `;
  const inner = `<div class="s10-inner">
    <div class="s10-pre">A VERDADE SOBRE IA</div>
    <div class="s10-headline">IA NÃO</div>
    <div class="s10-dash">SUBSTITUI</div>
    <div class="s10-release">— ela libera</div>
    <div class="s10-divider"></div>
    <div class="s10-sub">Você advoga.<br>A IA opera.</div>
  </div>`;
  return shell(10, img(10), 'background:linear-gradient(135deg,rgba(0,0,0,0.92) 50%,rgba(0,153,255,0.08) 100%)', inner, extra);
}

// ── SLIDE 11 — BIG STAT ──────────────────────────────────────────────────────
function slide11() {
  const extra = `
    .s11-inner{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;height:100%}
    .s11-big{font-size:220px;font-weight:800;color:#00FF88;line-height:0.9;letter-spacing:-0.04em;text-shadow:0 0 80px rgba(0,255,136,0.3);margin-bottom:0}
    .s11-unit{font-size:56px;font-weight:700;color:#0099FF;letter-spacing:0.05em;margin-bottom:20px}
    .s11-label{font-size:48px;font-weight:600;color:#fff;line-height:1.2;text-shadow:0 4px 24px rgba(0,0,0,0.6);margin-bottom:28px;max-width:700px}
    .s11-sub{font-size:34px;font-weight:400;color:rgba(255,255,255,0.65);line-height:1.5;max-width:660px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .s11-big{animation:fadeUp 0.5s ease both}
    .s11-unit{animation:fadeUp 0.4s ease 0.1s both}
    .s11-label{animation:fadeUp 0.5s ease 0.2s both}
    .s11-sub{animation:fadeUp 0.5s ease 0.3s both}
  `;
  const inner = `<div class="s11-inner">
    <div class="s11-big">80%</div>
    <div class="s11-unit">DO TEMPO DE VOLTA</div>
    <div class="s11-label">para o que realmente importa</div>
    <div class="s11-sub">Menos operacional. Mais estratégia.<br>Mais valor para o cliente.</div>
  </div>`;
  return shell(11, img(11), 'background:linear-gradient(to right,rgba(0,0,0,0.95) 55%,rgba(0,0,0,0.6) 100%)', inner, extra);
}

// ── SLIDE 12 — PIPELINE VISUAL ───────────────────────────────────────────────
function slide12() {
  const extra = `
    .s12-wrap{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:960px;margin:0 auto}
    .s12-title{font-size:72px;font-weight:800;color:#fff;line-height:1.0;letter-spacing:-0.02em;text-shadow:0 4px 24px rgba(0,0,0,0.6);margin-bottom:8px;text-align:center}
    .s12-sub{font-size:34px;font-weight:500;color:#0099FF;text-align:center;margin-bottom:48px;letter-spacing:0.05em}
    .pipeline{display:flex;align-items:center;gap:0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px 24px;backdrop-filter:blur(8px)}
    .step{display:flex;flex-direction:column;align-items:center;flex:1;gap:10px}
    .step-icon{width:64px;height:64px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800}
    .step-name{font-size:18px;font-weight:700;color:#fff;text-align:center;line-height:1.2;letter-spacing:0.02em}
    .step-desc{font-size:14px;font-weight:400;color:rgba(255,255,255,0.5);text-align:center;line-height:1.3}
    .arrow{font-size:22px;color:rgba(255,255,255,0.2);flex-shrink:0;margin-bottom:30px}
    .s12-footer{font-size:34px;font-weight:600;color:rgba(255,255,255,0.75);text-align:center;margin-top:40px;line-height:1.4}
    .s12-footer span{color:#00FF88}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .s12-title{animation:fadeUp 0.5s ease both}
    .s12-sub{animation:fadeUp 0.4s ease 0.1s both}
    .pipeline{animation:fadeUp 0.5s ease 0.2s both}
    .s12-footer{animation:fadeUp 0.5s ease 0.3s both}
  `;
  const inner = `<div class="s12-wrap">
    <div class="s12-title">O PIPELINE JURÍDICO</div>
    <div class="s12-sub">5 etapas. Fluxo completo.</div>
    <div class="pipeline">
      <div class="step">
        <div class="step-icon" style="background:rgba(0,153,255,0.2);color:#0099FF">📥</div>
        <div class="step-name">ORGANIZAR</div>
        <div class="step-desc">Documentos<br>classificados</div>
      </div>
      <div class="arrow">→</div>
      <div class="step">
        <div class="step-icon" style="background:rgba(0,255,136,0.15);color:#00FF88">🏷️</div>
        <div class="step-name">CLASSIFICAR</div>
        <div class="step-desc">Tipo e<br>prioridade</div>
      </div>
      <div class="arrow">→</div>
      <div class="step">
        <div class="step-icon" style="background:rgba(255,180,0,0.15);color:#FFB400">🔍</div>
        <div class="step-name">ANALISAR</div>
        <div class="step-desc">Precedentes<br>e riscos</div>
      </div>
      <div class="arrow">→</div>
      <div class="step">
        <div class="step-icon" style="background:rgba(0,153,255,0.2);color:#0099FF">✍️</div>
        <div class="step-name">REDIGIR</div>
        <div class="step-desc">Peças<br>prontas</div>
      </div>
      <div class="arrow">→</div>
      <div class="step">
        <div class="step-icon" style="background:rgba(0,255,136,0.15);color:#00FF88">🎯</div>
        <div class="step-name">ESTRATÉGIA</div>
        <div class="step-desc">Insights<br>táticos</div>
      </div>
    </div>
    <div class="s12-footer">Do caos ao <span>caso estruturado</span></div>
  </div>`;
  return shell(12, img(12), 'background:linear-gradient(180deg,rgba(13,13,13,0.97) 0%,rgba(26,26,46,0.97) 100%)', inner, extra);
}

// ── SLIDE 13 — COMPARISON ────────────────────────────────────────────────────
function slide13() {
  const extra = `
    .s13-inner{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:940px}
    .s13-pre{font-size:24px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:24px}
    .stat-row{display:flex;gap:24px;margin-bottom:36px}
    .stat-card{flex:1;border-radius:16px;padding:28px 24px}
    .stat-card.off{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08)}
    .stat-card.on{background:linear-gradient(135deg,rgba(0,153,255,0.15),rgba(0,255,136,0.1));border:1px solid rgba(0,153,255,0.3)}
    .stat-num{font-size:80px;font-weight:800;line-height:1.0;letter-spacing:-0.03em;margin-bottom:8px}
    .stat-card.off .stat-num{color:rgba(255,255,255,0.35)}
    .stat-card.on .stat-num{color:#00FF88}
    .stat-label{font-size:24px;font-weight:600;line-height:1.3}
    .stat-card.off .stat-label{color:rgba(255,255,255,0.45)}
    .stat-card.on .stat-label{color:rgba(255,255,255,0.88)}
    .s13-body{font-size:38px;font-weight:500;color:rgba(255,255,255,0.8);line-height:1.45;text-shadow:0 2px 12px rgba(0,0,0,0.5)}
    .s13-body span{color:#0099FF;font-weight:700}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .s13-pre{animation:fadeUp 0.4s ease both}
    .stat-row{animation:fadeUp 0.5s ease 0.1s both}
    .s13-body{animation:fadeUp 0.5s ease 0.2s both}
  `;
  const inner = `<div class="s13-inner">
    <div class="s13-pre">📋 CENÁRIO ATUAL</div>
    <div class="stat-row">
      <div class="stat-card off">
        <div class="stat-num">69%</div>
        <div class="stat-label">dos advogados<br>ainda não usa IA</div>
      </div>
      <div class="stat-card on">
        <div class="stat-num">31%</div>
        <div class="stat-label">já entregam<br>mais rápido</div>
      </div>
    </div>
    <div class="s13-body">A OAB aprovou. O mercado<br>está se movendo.<br><span>E você?</span></div>
  </div>`;
  return shell(13, img(13), 'background:linear-gradient(to bottom,rgba(0,0,0,0.96) 0%,rgba(26,26,46,0.96) 100%)', inner, extra);
}

// ── SLIDE 14 — FUTURE ────────────────────────────────────────────────────────
function slide14() {
  const extra = `
    .s14-inner{display:flex;flex-direction:column;justify-content:flex-end;height:100%;padding-bottom:28px}
    .s14-badge{display:inline-block;background:rgba(0,153,255,0.2);border:1px solid rgba(0,153,255,0.5);color:#0099FF;font-size:20px;font-weight:700;padding:10px 22px;border-radius:9999px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:24px;align-self:flex-start}
    .s14-headline{font-size:96px;font-weight:800;color:#fff;line-height:1.0;letter-spacing:-0.02em;text-shadow:0 4px 32px rgba(0,0,0,0.7);margin-bottom:20px}
    .s14-headline span{color:#0099FF}
    .s14-sub{font-size:42px;font-weight:500;color:rgba(255,255,255,0.82);line-height:1.35;text-shadow:0 2px 12px rgba(0,0,0,0.5);margin-bottom:20px;max-width:820px}
    .s14-bullets{display:flex;flex-direction:column;gap:12px}
    .s14-bullet{font-size:28px;font-weight:500;color:rgba(255,255,255,0.6);display:flex;align-items:center;gap:12px}
    .s14-bullet::before{content:'▸';color:#00FF88;font-size:18px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .s14-badge{animation:fadeUp 0.4s ease both}
    .s14-headline{animation:fadeUp 0.5s ease 0.1s both}
    .s14-sub{animation:fadeUp 0.5s ease 0.2s both}
    .s14-bullets{animation:fadeUp 0.5s ease 0.3s both}
  `;
  const inner = `<div class="s14-inner">
    <div class="s14-badge">🚀 ADVOCACIA DO FUTURO</div>
    <div class="s14-headline">COMEÇA<br><span>AGORA</span></div>
    <div class="s14-sub">Sem custo. Sem código.<br>Sem precisar ser técnico.</div>
    <div class="s14-bullets">
      <div class="s14-bullet">5 agentes. Um pipeline. Liberdade estratégica.</div>
      <div class="s14-bullet">Aprende em horas, não em meses.</div>
      <div class="s14-bullet">Formação 100% gratuita no INEMA.CLUB</div>
    </div>
  </div>`;
  return shell(14, img(14), 'background:linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.5) 55%,rgba(13,13,13,0.1) 100%)', inner, extra);
}

// ── SLIDE 15 — CTA FINAL ─────────────────────────────────────────────────────
function slide15() {
  const extra = `
    .s15-inner{display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;text-align:center}
    .s15-eyebrow{font-size:22px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px}
    .s15-brand{font-size:112px;font-weight:800;color:#fff;letter-spacing:-0.02em;line-height:1.0;text-shadow:0 0 60px rgba(0,153,255,0.4),0 4px 32px rgba(0,0,0,0.8);margin-bottom:8px}
    .s15-brand span{color:#0099FF}
    .s15-tagline{font-size:38px;font-weight:500;color:rgba(255,255,255,0.75);margin-bottom:48px;letter-spacing:0.02em}
    .s15-cta{display:inline-block;background:linear-gradient(135deg,#0099FF,#00CC88);color:#fff;font-size:28px;font-weight:800;padding:20px 56px;border-radius:9999px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;box-shadow:0 4px 32px rgba(0,153,255,0.5),0 8px 48px rgba(0,255,136,0.2);margin-bottom:32px}
    .s15-free{font-size:26px;font-weight:500;color:rgba(255,255,255,0.55);letter-spacing:0.06em}
    .s15-free span{color:#00FF88;font-weight:700}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
    .s15-eyebrow{animation:fadeUp 0.4s ease both}
    .s15-brand{animation:fadeUp 0.5s ease 0.1s both}
    .s15-tagline{animation:fadeUp 0.4s ease 0.18s both}
    .s15-cta{animation:scaleIn 0.5s ease 0.28s both}
    .s15-free{animation:fadeUp 0.4s ease 0.38s both}
  `;
  const inner = `<div class="s15-inner">
    <div class="s15-eyebrow">Formação em IA Jurídica</div>
    <div class="s15-brand">INEMA<span>.</span>CLUB</div>
    <div class="s15-tagline">Aprenda rápido e fácil como</div>
    <div class="s15-cta">ACESSE GRÁTIS AGORA</div>
    <div class="s15-free">Trilha completa. <span>100% gratuita.</span> Sem truques.</div>
  </div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}${extra}</style></head><body>
<div class="wrap" style="background:linear-gradient(135deg,#0D0D0D 0%,#0A1628 50%,#0D1A0D 100%)">
  <img class="bg" src="file://${img(15)}" style="opacity:0.15;filter:brightness(0.4) saturate(0.8)">
  <div class="overlay" style="background:radial-gradient(circle at 50% 40%,rgba(0,153,255,0.08) 0%,transparent 70%)"></div>
  <div class="brand-mark" style="display:none"></div>
  <div class="slide-num">15 / 15</div>
  <div class="content">${inner}</div>
</div></body></html>`;
}

// ── BUILD ALL SLIDES ──────────────────────────────────────────────────────────
const slides = [
  { num: 1,  fn: slide01 },
  { num: 2,  fn: slide02 },
  { num: 3,  fn: () => agentSlide(3,  3,  1, '#0099FF', 'ORGANIZAÇÃO',           'Recebe documentos caóticos e classifica tudo automaticamente.', '📁') },
  { num: 4,  fn: () => agentSlide(4,  4,  2, '#00FF88', 'CLASSIFICAÇÃO',         'Identifica tipo de caso, partes envolvidas e prioridade.', '🏷️') },
  { num: 5,  fn: () => agentSlide(5,  5,  3, '#FFB400', 'ANÁLISE E\nCONCILIAÇÃO', 'Avalia precedentes, riscos e alternativas de acordo.', '🔍') },
  { num: 6,  fn: () => agentSlide(6,  6,  4, '#0099FF', 'REDAÇÃO\nJURÍDICA',     'Gera petições, contratos e minutas prontos para revisão.', '✍️') },
  { num: 7,  fn: () => agentSlide(7,  7,  5, '#00FF88', 'INSIGHTS\nESTRATÉGICOS', 'Sugere a melhor estratégia com base em dados do caso.', '🎯') },
  { num: 8,  fn: slide08 },
  { num: 9,  fn: slide09 },
  { num: 10, fn: slide10 },
  { num: 11, fn: slide11 },
  { num: 12, fn: slide12 },
  { num: 13, fn: slide13 },
  { num: 14, fn: slide14 },
  { num: 15, fn: slide15 },
];

async function main() {
  const browser = await chromium.launch();
  const layoutSlides = [];

  for (const slide of slides) {
    const html = slide.fn();
    const numStr = String(slide.num).padStart(2, '0');
    const htmlPath = path.join(OUTPUT_DIR, `${CAMPAIGN}_carousel_${numStr}.html`);
    const pngPath  = path.join(OUTPUT_DIR, `${CAMPAIGN}_carousel_${numStr}.png`);
    const tmpHtml  = `/tmp/${CAMPAIGN}_slide_${numStr}.html`;

    fs.writeFileSync(htmlPath, html, 'utf8');
    fs.writeFileSync(tmpHtml,  html, 'utf8');

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.goto(`file://${tmpHtml}`);
    await page.waitForTimeout(700);
    await page.screenshot({ path: pngPath });
    await page.close();

    console.log(`✅ Slide ${numStr} → ${path.basename(pngPath)}`);
    layoutSlides.push({
      slide: slide.num,
      filename: path.basename(pngPath),
      html: path.basename(htmlPath),
      dimensions: '1080x1080',
      image_used: path.basename(img(slide.num)),
    });
  }

  await browser.close();

  const layout = {
    campaign: CAMPAIGN,
    date: '2026-04-18',
    format: 'carousel',
    total_slides: 15,
    dimensions: '1080x1080',
    platforms: ['instagram', 'youtube', 'threads'],
    copy_source: 'narrative.json',
    slides: layoutSlides,
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'layout.json'), JSON.stringify(layout, null, 2));
  console.log('\n🎨 layout.json saved');
  console.log(`📁 Output: ${OUTPUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
