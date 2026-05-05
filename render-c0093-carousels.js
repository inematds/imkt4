/**
 * Render script — c0093-metodo_seis_chapeus Carousel Slides
 * 15 slides — single carousel narrative
 * Output: prj/inema/outputs/c0093-metodo_seis_chapeus/ads/
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('prj/inema/outputs/c0093-metodo_seis_chapeus/ads');
const IMG_DIR = path.resolve('prj/inema/outputs/c0093-metodo_seis_chapeus/imgs');
fs.mkdirSync(OUT_DIR, { recursive: true });

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">
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

function imgPath(n) {
  const num = String(n).padStart(2, '0');
  return `file://${IMG_DIR}/c0093-metodo_seis_chapeus_generated_${num}_carousel_1080x1080.jpg`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 01 — HOOK: "Você não está decidindo. Está confirmando o que já decidiu."
// ─────────────────────────────────────────────────────────────────────────────
function slide01() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0D0D0D;">
  <img src="${imgPath(1)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.45) contrast(1.15) saturate(1.1);">
  <!-- gradient overlay top to bottom -->
  <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(13,13,13,0.85) 0%,rgba(13,13,13,0.3) 55%,rgba(0,153,255,0.15) 100%);"></div>
  <!-- Blue corner glow -->
  <div style="position:absolute;top:-100px;right:-100px;width:600px;height:600px;background:radial-gradient(circle,rgba(0,153,255,0.18) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:space-between;animation:fadeUp 0.5s both;">
    <!-- top badge -->
    <div>
      <div style="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(0,153,255,0.45);padding:9px 22px;border-radius:9999px;margin-bottom:52px;">
        <div style="width:7px;height:7px;border-radius:50%;background:#0099FF;"></div>
        <span style="font-size:15px;font-weight:700;color:#0099FF;letter-spacing:0.2em;text-transform:uppercase;">Anti-Âncora · Método 6 Chapéus</span>
      </div>
      <!-- main headline -->
      <h1 style="font-size:120px;font-weight:900;line-height:0.92;letter-spacing:-0.03em;text-transform:uppercase;text-shadow:0 4px 40px rgba(0,0,0,0.9);">
        VOCÊ NÃO<br>ESTÁ<br><span style="color:#0099FF;">DECIDINDO.</span>
      </h1>
      <!-- rule -->
      <div style="width:90px;height:4px;background:#0099FF;border-radius:2px;margin:32px 0;animation:scaleIn 0.5s 0.2s both;"></div>
      <!-- subtext -->
      <p style="font-size:40px;font-weight:400;line-height:1.35;color:rgba(255,255,255,0.8);max-width:800px;text-shadow:0 2px 20px rgba(0,0,0,0.7);">
        Está confirmando o que já decidiu — e nem percebe.
      </p>
    </div>
    <!-- bottom brand -->
    <div style="display:flex;justify-content:space-between;align-items:flex-end;">
      <span style="font-size:20px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:0.15em;">INEMA.CLUB</span>
      <span style="font-size:16px;font-weight:500;color:rgba(255,255,255,0.25);letter-spacing:0.1em;">01 / 15</span>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 02 — PROBLEM: viés de confirmação
// ─────────────────────────────────────────────────────────────────────────────
function slide02() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0A0A12;">
  <img src="${imgPath(2)}" style="position:absolute;right:0;top:0;width:54%;height:100%;object-fit:cover;filter:brightness(0.4) contrast(1.1) saturate(0.8);">
  <!-- fade left -->
  <div style="position:absolute;inset:0;background:linear-gradient(to right,#0A0A12 45%,transparent 75%);"></div>
  <!-- red glow -->
  <div style="position:absolute;left:-100px;top:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(204,0,0,0.15) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- vertical red line left -->
  <div style="position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(to bottom,transparent,#CC0000 30%,#CC0000 70%,transparent);"></div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:72px 56%;72px 80px;padding-left:80px;padding-right:56%;padding-top:72px;padding-bottom:72px;display:flex;flex-direction:column;justify-content:center;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#CC0000;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;">02 · O PROBLEMA</div>
    <h1 style="font-size:84px;font-weight:900;line-height:0.95;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:32px;">
      VIÉS DE<br>CONFIRMA<br><span style="color:#CC0000;">ÇÃO.</span>
    </h1>
    <div style="width:56px;height:3px;background:#CC0000;margin-bottom:28px;animation:scaleIn 0.5s 0.2s both;"></div>
    <p style="font-size:28px;font-weight:400;line-height:1.65;color:rgba(255,255,255,0.65);max-width:480px;animation:fadeUp 0.5s 0.2s both;">
      Contamina toda decisão<br>antes de ela começar.
    </p>
    <p style="font-size:22px;font-weight:400;line-height:1.6;color:rgba(255,255,255,0.4);max-width:460px;margin-top:20px;">
      Você busca informações que confirmam o que já acredita — e ignora o restante.
    </p>
    <div style="margin-top:60px;font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB</div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 03 — OS 6 CHAPÉUS: modos cognitivos
// ─────────────────────────────────────────────────────────────────────────────
function slide03() {
  const hats = [
    { color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.25)', label: 'BRANCO', desc: 'Fatos e dados' },
    { color: '#FFD700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.35)', label: 'AMARELO', desc: 'Benefícios' },
    { color: '#CC0000', bg: 'rgba(204,0,0,0.08)', border: 'rgba(204,0,0,0.35)', label: 'PRETO', desc: 'Riscos e cuidados' },
    { color: '#00CC44', bg: 'rgba(0,204,68,0.08)', border: 'rgba(0,204,68,0.35)', label: 'VERDE', desc: 'Alternativas' },
    { color: '#FF4444', bg: 'rgba(255,68,68,0.08)', border: 'rgba(255,68,68,0.35)', label: 'VERMELHO', desc: 'Intuição' },
    { color: '#0099FF', bg: 'rgba(0,153,255,0.08)', border: 'rgba(0,153,255,0.35)', label: 'AZUL', desc: 'Organização' },
  ];
  const hatCards = hats.map(h => `
    <div style="background:${h.bg};border:1px solid ${h.border};border-radius:12px;padding:20px 22px;display:flex;align-items:center;gap:14px;animation:scaleIn 0.5s both;">
      <div style="width:14px;height:14px;min-width:14px;border-radius:50%;background:${h.color};box-shadow:0 0 10px ${h.color};"></div>
      <div>
        <div style="font-size:16px;font-weight:700;color:${h.color};letter-spacing:0.1em;">${h.label}</div>
        <div style="font-size:14px;font-weight:400;color:rgba(255,255,255,0.5);margin-top:2px;">${h.desc}</div>
      </div>
    </div>`).join('');

  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0D0D0D;">
  <img src="${imgPath(3)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.22) contrast(1.2) saturate(0.7);">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,13,13,0.6) 0%,rgba(13,13,13,0.75) 100%);"></div>
  <!-- blue glow center -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(circle,rgba(0,153,255,0.08) 0%,transparent 65%);pointer-events:none;"></div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:68px;display:flex;flex-direction:column;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:20px;">03 · OS 6 CHAPÉUS</div>
    <h1 style="font-size:72px;font-weight:900;line-height:1.0;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:8px;">
      MODOS COGNITIVOS<br><span style="color:#0099FF;">SEPARADOS.</span>
    </h1>
    <p style="font-size:26px;font-weight:400;color:rgba(255,255,255,0.55);margin-bottom:40px;">Um de cada vez. Sem misturar. Sem conflito.</p>
    <!-- hat grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;flex:1;">
      ${hatCards}
    </div>
    <!-- bottom -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:28px;">
      <span style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB</span>
      <span style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.2);">03 / 15</span>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 04 — A FALHA FATAL: começa depois que o viés contaminou
// ─────────────────────────────────────────────────────────────────────────────
function slide04() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0D0D0D;">
  <img src="${imgPath(4)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.35) contrast(1.2) saturate(0.9);">
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(204,0,0,0.4) 0%,rgba(13,13,13,0.85) 60%,rgba(13,13,13,0.95) 100%);"></div>
  <!-- red glow top -->
  <div style="position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:800px;height:400px;background:radial-gradient(ellipse,rgba(204,0,0,0.3) 0%,transparent 65%);pointer-events:none;"></div>
  <!-- content center -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:flex-end;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#CC0000;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;">04 · A FALHA FATAL</div>
    <h1 style="font-size:100px;font-weight:900;line-height:0.9;letter-spacing:-0.03em;text-transform:uppercase;margin-bottom:28px;text-shadow:0 4px 40px rgba(0,0,0,0.9);">
      MAS TODO<br>MÉTODO TEM<br><span style="color:#CC0000;">UMA FALHA.</span>
    </h1>
    <div style="width:72px;height:4px;background:#CC0000;border-radius:2px;margin-bottom:28px;"></div>
    <p style="font-size:36px;font-weight:400;line-height:1.45;color:rgba(255,255,255,0.75);max-width:820px;text-shadow:0 2px 16px rgba(0,0,0,0.8);">
      Começa depois que o viés já contaminou tudo.
    </p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:52px;">
      <span style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB</span>
      <span style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.2);">04 / 15</span>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 05 — A FASE 0 ANTI-ÂNCORA: o passo que vem antes de tudo
// ─────────────────────────────────────────────────────────────────────────────
function slide05() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#050810;">
  <img src="${imgPath(5)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.35) contrast(1.2) saturate(0.7) hue-rotate(200deg);">
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,153,255,0.25) 0%,rgba(5,8,16,0.9) 60%);"></div>
  <!-- cyan glow -->
  <div style="position:absolute;top:-100px;right:-100px;width:700px;height:700px;background:radial-gradient(circle,rgba(0,153,255,0.22) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- big 0 bg -->
  <div style="position:absolute;right:-20px;top:50%;transform:translateY(-50%);font-size:520px;font-weight:900;color:rgba(0,153,255,0.05);line-height:1;user-select:none;">0</div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:center;animation:fadeUp 0.5s both;">
    <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:28px;">
      <div style="padding:6px 18px;background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.5);border-radius:9999px;">
        <span style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.2em;text-transform:uppercase;">FASE 0</span>
      </div>
      <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.3);letter-spacing:0.15em;text-transform:uppercase;">Exclusivo INEMA.CLUB</span>
    </div>
    <h1 style="font-size:110px;font-weight:900;line-height:0.88;letter-spacing:-0.03em;text-transform:uppercase;margin-bottom:32px;text-shadow:0 4px 40px rgba(0,153,255,0.3);">
      ANTI-<br><span style="color:#0099FF;">ÂNCORA.</span>
    </h1>
    <div style="width:80px;height:4px;background:linear-gradient(to right,#0099FF,rgba(0,153,255,0.3));border-radius:2px;margin-bottom:32px;animation:scaleIn 0.5s 0.2s both;"></div>
    <p style="font-size:36px;font-weight:400;line-height:1.5;color:rgba(255,255,255,0.75);max-width:760px;text-shadow:0 2px 16px rgba(0,0,0,0.7);">
      Vem antes de qualquer chapéu.<br>Nenhum livro cobre isso.<br>Nenhum concorrente entrega.
    </p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:56px;">
      <span style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB</span>
      <span style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.2);">05 / 15</span>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 06 — OS 8 PASSOS: processo completo
// ─────────────────────────────────────────────────────────────────────────────
function slide06() {
  const steps = [
    { num: '0', label: 'Anti-Âncora', color: '#0099FF', special: true },
    { num: '1', label: 'Azul (abertura)', color: '#0099FF' },
    { num: '2', label: 'Branco', color: '#FFFFFF' },
    { num: '3', label: 'Amarelo', color: '#FFD700' },
    { num: '4', label: 'Preto', color: '#888888' },
    { num: '5', label: 'Verde', color: '#00CC44' },
    { num: '6', label: 'Vermelho', color: '#CC0000' },
    { num: '7', label: 'Azul (síntese)', color: '#0099FF' },
  ];
  const stepItems = steps.map((s, i) => `
    <div style="display:flex;align-items:center;gap:14px;padding:10px 0;${i < steps.length-1 ? 'border-bottom:1px solid rgba(255,255,255,0.06);' : ''}animation:fadeUp 0.5s ${i*0.04}s both;">
      <div style="width:36px;height:36px;border-radius:50%;background:${s.special ? s.color : 'rgba(255,255,255,0.05)'};border:2px solid ${s.color};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="font-size:15px;font-weight:700;color:${s.special ? '#000' : s.color};">${s.num}</span>
      </div>
      <span style="font-size:22px;font-weight:${s.special ? '700' : '500'};color:${s.special ? '#0099FF' : s.num === '7' ? '#0099FF' : 'rgba(255,255,255,0.8)'};">${s.label}</span>
      ${s.special ? '<div style="margin-left:auto;padding:3px 12px;background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.4);border-radius:9999px;font-size:11px;font-weight:700;color:#0099FF;letter-spacing:0.1em;">EXCLUSIVO</div>' : ''}
    </div>`).join('');

  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0A0A12;">
  <img src="${imgPath(6)}" style="position:absolute;right:0;top:0;width:40%;height:100%;object-fit:cover;filter:brightness(0.2) saturate(0.5);">
  <div style="position:absolute;inset:0;background:linear-gradient(to right,#0A0A12 58%,transparent 85%);"></div>
  <!-- blue glow -->
  <div style="position:absolute;left:-100px;top:50%;transform:translateY(-50%);width:500px;height:700px;background:radial-gradient(ellipse,rgba(0,153,255,0.1) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- left bar -->
  <div style="position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(to bottom,transparent,#0099FF 30%,#0099FF 70%,transparent);"></div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:64px 56% 64px 80px;display:flex;flex-direction:column;justify-content:center;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:16px;">06 · PROCESSO COMPLETO</div>
    <h1 style="font-size:76px;font-weight:900;line-height:0.95;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:28px;">
      8 PASSOS.<br><span style="color:#0099FF;">O MÉTODO<br>COMPLETO.</span>
    </h1>
    <div style="width:48px;height:3px;background:#0099FF;margin-bottom:24px;"></div>
    ${stepItems}
    <div style="margin-top:24px;font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB · 06 / 15</div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 07 — PROVA: 3 trilhas, 18 módulos, 108 tópicos, 9h, gratuito
// ─────────────────────────────────────────────────────────────────────────────
function slide07() {
  const stats = [
    { num: '3', label: 'Trilhas' },
    { num: '18', label: 'Módulos' },
    { num: '108', label: 'Tópicos' },
    { num: '~9h', label: 'Duração' },
  ];
  const statCards = stats.map(s => `
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px 24px;text-align:center;animation:scaleIn 0.5s both;">
      <div style="font-size:80px;font-weight:900;color:#0099FF;line-height:1;letter-spacing:-0.03em;text-shadow:0 0 40px rgba(0,153,255,0.4);">${s.num}</div>
      <div style="font-size:20px;font-weight:500;color:rgba(255,255,255,0.5);margin-top:8px;letter-spacing:0.05em;text-transform:uppercase;">${s.label}</div>
    </div>`).join('');

  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0D0D0D;">
  <img src="${imgPath(7)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.2) contrast(1.1) saturate(0.6);">
  <div style="position:absolute;inset:0;background:rgba(13,13,13,0.85);"></div>
  <!-- blue glow center top -->
  <div style="position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:700px;height:400px;background:radial-gradient(ellipse,rgba(0,153,255,0.15) 0%,transparent 65%);pointer-events:none;"></div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;">07 · ESTRUTURA DO CURSO</div>
    <h1 style="font-size:80px;font-weight:900;line-height:0.95;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:40px;">
      O PROCESSO COMPLETO<br><span style="color:#0099FF;">QUE OS LIVROS CORTAM.</span>
    </h1>
    <!-- stats grid -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;width:100%;margin-bottom:40px;">
      ${statCards}
    </div>
    <!-- free badge -->
    <div style="display:inline-flex;align-items:center;gap:12px;background:rgba(0,153,255,0.12);border:1px solid rgba(0,153,255,0.4);border-radius:9999px;padding:14px 36px;animation:scaleIn 0.5s 0.3s both;">
      <div style="width:10px;height:10px;border-radius:50%;background:#00CC44;box-shadow:0 0 10px #00CC44;"></div>
      <span style="font-size:26px;font-weight:700;color:#FFFFFF;letter-spacing:0.05em;">100% GRATUITO · INEMA.CLUB</span>
    </div>
    <div style="margin-top:36px;font-size:15px;font-weight:500;color:rgba(255,255,255,0.2);">07 / 15</div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 08 — "A Fase 0 que nenhum livro ensina"
// ─────────────────────────────────────────────────────────────────────────────
function slide08() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0D0D0D;">
  <img src="${imgPath(8)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.38) contrast(1.15) saturate(0.8);">
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,13,13,0.95) 0%,rgba(13,13,13,0.5) 50%,rgba(0,0,0,0.2) 100%);"></div>
  <!-- content bottom-anchored -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:flex-end;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#FFD700;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:20px;">08 · EXCLUSIVIDADE</div>
    <h1 style="font-size:100px;font-weight:900;line-height:0.92;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:24px;text-shadow:0 4px 32px rgba(0,0,0,0.9);">
      A FASE 0<br>QUE NENHUM<br><span style="color:#FFD700;">LIVRO ENSINA.</span>
    </h1>
    <div style="width:80px;height:4px;background:#FFD700;border-radius:2px;margin-bottom:24px;"></div>
    <p style="font-size:32px;font-weight:400;line-height:1.5;color:rgba(255,255,255,0.7);max-width:780px;text-shadow:0 2px 16px rgba(0,0,0,0.8);">
      Edward de Bono criou os chapéus.<br>O INEMA.CLUB ensina o passo que faltava.
    </p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:44px;">
      <span style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB</span>
      <span style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.2);">08 / 15</span>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 09 — "O passo invisível que vem antes de tudo"
// ─────────────────────────────────────────────────────────────────────────────
function slide09() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#080C14;">
  <img src="${imgPath(9)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.3) contrast(1.2) saturate(0.6) hue-rotate(180deg);">
  <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(8,12,20,0.9) 0%,rgba(0,153,255,0.1) 100%);"></div>
  <!-- dashed vertical line center -->
  <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,rgba(0,153,255,0.15),transparent);"></div>
  <!-- big text decoration -->
  <div style="position:absolute;font-size:420px;font-weight:900;color:rgba(0,153,255,0.04);top:50%;left:50%;transform:translate(-50%,-50%);line-height:1;user-select:none;white-space:nowrap;">FASE 0</div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:28px;">09 · O PASSO INVISÍVEL</div>
    <h1 style="font-size:96px;font-weight:900;line-height:0.95;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:28px;text-shadow:0 4px 40px rgba(0,0,0,0.9);">
      O PASSO<br><span style="color:#0099FF;">INVISÍVEL</span><br>QUE VEM<br>ANTES DE TUDO.
    </h1>
    <div style="width:64px;height:3px;background:#0099FF;border-radius:2px;margin-bottom:28px;"></div>
    <p style="font-size:30px;font-weight:400;line-height:1.6;color:rgba(255,255,255,0.6);max-width:680px;">
      Antes de qualquer chapéu —<br>você precisa quebrar o que já está<br>na sua cabeça.
    </p>
    <div style="margin-top:52px;font-size:15px;font-weight:500;color:rgba(255,255,255,0.2);">INEMA.CLUB · 09 / 15</div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 10 — "O Azul abre. O Azul fecha."
// ─────────────────────────────────────────────────────────────────────────────
function slide10() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#050A14;">
  <img src="${imgPath(10)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.28) contrast(1.15) saturate(0.5) hue-rotate(200deg);">
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,153,255,0.3) 0%,rgba(5,10,20,0.9) 50%,rgba(5,10,20,0.95) 100%);"></div>
  <!-- blue ambient top -->
  <div style="position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:900px;height:500px;background:radial-gradient(ellipse,rgba(0,153,255,0.3) 0%,transparent 65%);pointer-events:none;"></div>
  <!-- content split: two blue circles top + text bottom -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:flex-end;animation:fadeUp 0.5s both;">
    <!-- two azul indicators -->
    <div style="display:flex;gap:20px;margin-bottom:32px;animation:scaleIn 0.5s 0.1s both;">
      <div style="display:flex;align-items:center;gap:10px;background:rgba(0,153,255,0.12);border:1px solid rgba(0,153,255,0.45);border-radius:9999px;padding:10px 24px;">
        <div style="width:10px;height:10px;border-radius:50%;background:#0099FF;box-shadow:0 0 12px #0099FF;"></div>
        <span style="font-size:16px;font-weight:700;color:#0099FF;letter-spacing:0.1em;">AZUL ABERTURA</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;background:rgba(0,153,255,0.12);border:1px solid rgba(0,153,255,0.45);border-radius:9999px;padding:10px 24px;">
        <div style="width:10px;height:10px;border-radius:50%;background:#0099FF;box-shadow:0 0 12px #0099FF;"></div>
        <span style="font-size:16px;font-weight:700;color:#0099FF;letter-spacing:0.1em;">AZUL SÍNTESE</span>
      </div>
    </div>
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:20px;">10 · O MAESTRO</div>
    <h1 style="font-size:104px;font-weight:900;line-height:0.9;letter-spacing:-0.03em;text-transform:uppercase;margin-bottom:24px;text-shadow:0 4px 40px rgba(0,0,0,0.9);">
      O AZUL<br>ABRE.<br><span style="color:#0099FF;">O AZUL<br>FECHA.</span>
    </h1>
    <div style="width:72px;height:4px;background:#0099FF;margin-bottom:24px;"></div>
    <p style="font-size:30px;font-weight:400;line-height:1.55;color:rgba(255,255,255,0.65);max-width:720px;">
      Tudo no meio é estrutura. O Azul é o maestro<br>que abre e fecha o processo — e quase ninguém explica por quê.
    </p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:40px;">
      <span style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB</span>
      <span style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.2);">10 / 15</span>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 11 — "Decida com clareza. Não com viés."
// ─────────────────────────────────────────────────────────────────────────────
function slide11() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0D0D0D;">
  <img src="${imgPath(11)}" style="position:absolute;left:0;top:0;width:55%;height:100%;object-fit:cover;filter:brightness(0.4) contrast(1.15) saturate(1.0);">
  <div style="position:absolute;inset:0;background:linear-gradient(to right,transparent 30%,#0D0D0D 60%);"></div>
  <!-- right panel green glow -->
  <div style="position:absolute;right:-100px;top:50%;transform:translateY(-50%);width:500px;height:500px;background:radial-gradient(circle,rgba(0,204,68,0.1) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- right bar -->
  <div style="position:absolute;right:0;top:0;bottom:0;width:5px;background:linear-gradient(to bottom,transparent,#00CC44 30%,#00CC44 70%,transparent);"></div>
  <!-- content right side -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;text-align:right;animation:fadeUp 0.5s both;">
    <div style="max-width:520px;">
      <div style="font-size:13px;font-weight:700;color:#00CC44;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;">11 · CLAREZA</div>
      <h1 style="font-size:96px;font-weight:900;line-height:0.92;letter-spacing:-0.03em;text-transform:uppercase;margin-bottom:28px;text-shadow:0 4px 32px rgba(0,0,0,0.9);">
        DECIDA<br>COM<br><span style="color:#00CC44;">CLAREZA.</span>
      </h1>
      <div style="width:60px;height:3px;background:#00CC44;margin-bottom:24px;margin-left:auto;"></div>
      <p style="font-size:30px;font-weight:400;line-height:1.55;color:rgba(255,255,255,0.65);">
        Não com viés.<br>Não com suposição.<br>Com método.
      </p>
      <div style="margin-top:52px;font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB · 11 / 15</div>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 12 — "Pensamento paralelo, decisão sem conflito"
// ─────────────────────────────────────────────────────────────────────────────
function slide12() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0D0D0D;">
  <img src="${imgPath(12)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.35) contrast(1.1) saturate(0.8);">
  <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(0,0,0,0.8) 0%,rgba(13,13,13,0.5) 50%,rgba(255,215,0,0.1) 100%);"></div>
  <!-- gold glow bottom-right -->
  <div style="position:absolute;bottom:-100px;right:-100px;width:600px;height:600px;background:radial-gradient(circle,rgba(255,215,0,0.12) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:center;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#FFD700;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;">12 · MÉTODO</div>
    <h1 style="font-size:100px;font-weight:900;line-height:0.92;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:32px;text-shadow:0 4px 40px rgba(0,0,0,0.9);">
      PENSA<br>MENTO<br><span style="color:#FFD700;">PARALELO.</span>
    </h1>
    <div style="width:72px;height:4px;background:#FFD700;border-radius:2px;margin-bottom:28px;animation:scaleIn 0.5s 0.2s both;"></div>
    <p style="font-size:36px;font-weight:400;line-height:1.45;color:rgba(255,255,255,0.75);max-width:760px;text-shadow:0 2px 16px rgba(0,0,0,0.8);">
      Decisão sem conflito.<br>Todos pensando na mesma direção —<br>de modos diferentes.
    </p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:56px;">
      <span style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB</span>
      <span style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.2);">12 / 15</span>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 13 — "Aprenda a pensar antes de decidir"
// ─────────────────────────────────────────────────────────────────────────────
function slide13() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0A0A12;">
  <img src="${imgPath(13)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.32) contrast(1.2) saturate(0.7);">
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,18,0.7) 0%,rgba(10,10,18,0.6) 40%,rgba(10,10,18,0.9) 100%);"></div>
  <!-- multiple colored glow dots representing hats -->
  <div style="position:absolute;top:60px;right:60px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(0,153,255,0.2) 0%,transparent 70%);"></div>
  <div style="position:absolute;top:80px;right:160px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,rgba(255,215,0,0.15) 0%,transparent 70%);"></div>
  <div style="position:absolute;top:40px;right:220px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,rgba(0,204,68,0.15) 0%,transparent 70%);"></div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:flex-end;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#0099FF;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;">13 · TRANSFORMAÇÃO</div>
    <h1 style="font-size:96px;font-weight:900;line-height:0.92;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:24px;text-shadow:0 4px 40px rgba(0,0,0,0.9);">
      APRENDA A<br><span style="color:#0099FF;">PENSAR</span><br>ANTES DE<br>DECIDIR.
    </h1>
    <div style="width:72px;height:4px;background:#0099FF;border-radius:2px;margin-bottom:24px;"></div>
    <p style="font-size:30px;font-weight:400;line-height:1.55;color:rgba(255,255,255,0.65);max-width:760px;">
      A diferença entre decidir bem e decidir mal<br>é um processo — não experiência, não intuição.
    </p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:44px;">
      <span style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB</span>
      <span style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.2);">13 / 15</span>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 14 — "O método que os cursos cortam pela metade"
// ─────────────────────────────────────────────────────────────────────────────
function slide14() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#0D0D0D;">
  <img src="${imgPath(14)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.3) contrast(1.2) saturate(0.7);">
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(13,13,13,0.5) 0%,rgba(13,13,13,0.95) 65%,rgba(13,13,13,1.0) 100%);"></div>
  <!-- diagonal accent line -->
  <div style="position:absolute;top:0;left:0;width:100%;height:6px;background:linear-gradient(to right,transparent,#CC0000 40%,#0099FF 60%,transparent);"></div>
  <!-- content -->
  <div style="position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:flex-end;animation:fadeUp 0.5s both;">
    <div style="font-size:13px;font-weight:700;color:#CC0000;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:20px;">14 · A PROMESSA</div>
    <h1 style="font-size:88px;font-weight:900;line-height:0.92;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:24px;text-shadow:0 4px 40px rgba(0,0,0,0.9);">
      O MÉTODO<br>QUE OS CURSOS<br><span style="color:#CC0000;">CORTAM</span><br><span style="color:#0099FF;">PELA METADE.</span>
    </h1>
    <div style="display:flex;gap:16px;margin-bottom:28px;animation:scaleIn 0.5s 0.2s both;">
      <div style="padding:8px 20px;background:rgba(204,0,0,0.15);border:1px solid rgba(204,0,0,0.4);border-radius:9999px;">
        <span style="font-size:14px;font-weight:700;color:#CC0000;letter-spacing:0.1em;">Outros cursos: só os 6 chapéus</span>
      </div>
      <div style="padding:8px 20px;background:rgba(0,153,255,0.15);border:1px solid rgba(0,153,255,0.4);border-radius:9999px;">
        <span style="font-size:14px;font-weight:700;color:#0099FF;letter-spacing:0.1em;">INEMA.CLUB: 8 passos completos</span>
      </div>
    </div>
    <p style="font-size:30px;font-weight:400;line-height:1.55;color:rgba(255,255,255,0.65);max-width:800px;">
      Com Anti-Âncora, variantes de conflito interpessoal, pre-mortem, e UMA recomendação final + Plano B.
    </p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:40px;">
      <span style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.2);letter-spacing:0.12em;">INEMA.CLUB</span>
      <span style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.2);">14 / 15</span>
    </div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 15 — CTA FINAL: INEMA.CLUB + curso gratuito
// ─────────────────────────────────────────────────────────────────────────────
function slide15() {
  return wrap(`
<div style="position:relative;width:1080px;height:1080px;overflow:hidden;background:#050810;">
  <img src="${imgPath(15)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.25) contrast(1.2) saturate(0.5) hue-rotate(200deg);">
  <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(0,153,255,0.3) 0%,rgba(5,8,16,0.92) 60%);"></div>
  <!-- Blue radial glow center -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:900px;background:radial-gradient(circle,rgba(0,153,255,0.18) 0%,transparent 60%);pointer-events:none;"></div>
  <!-- top accent line -->
  <div style="position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(to right,transparent,#0099FF 25%,#0099FF 75%,transparent);"></div>
  <!-- bottom accent line -->
  <div style="position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(to right,transparent,#0099FF 25%,#0099FF 75%,transparent);"></div>
  <!-- content: centered CTA -->
  <div style="position:absolute;inset:0;padding:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;animation:fadeUp 0.5s both;">
    <!-- pre-headline -->
    <div style="font-size:15px;font-weight:700;color:rgba(0,153,255,0.8);letter-spacing:0.3em;text-transform:uppercase;margin-bottom:32px;animation:fadeIn 0.5s 0.1s both;">CURSO COMPLETO · 100% GRATUITO</div>
    <!-- INEMA.CLUB big -->
    <h1 style="font-size:160px;font-weight:900;line-height:0.85;letter-spacing:-0.04em;color:#FFFFFF;text-shadow:0 0 80px rgba(0,153,255,0.4),0 4px 40px rgba(0,0,0,0.9);margin-bottom:16px;animation:scaleIn 0.5s 0.1s both;">
      INEMA<span style="color:#0099FF;">.</span>CLUB
    </h1>
    <!-- tagline -->
    <p style="font-size:32px;font-weight:400;color:rgba(255,255,255,0.65);line-height:1.5;max-width:760px;margin-bottom:52px;animation:fadeUp 0.5s 0.2s both;">
      Método dos 6 Chapéus + Fase 0 Anti-Âncora.<br>3 trilhas · 18 módulos · 108 tópicos · ~9h
    </p>
    <!-- CTA button -->
    <a style="display:inline-flex;align-items:center;gap:14px;background:#0099FF;color:#FFFFFF;text-decoration:none;padding:20px 56px;border-radius:9999px;font-size:24px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;box-shadow:0 4px 40px rgba(0,153,255,0.5),0 0 80px rgba(0,153,255,0.2);animation:scaleIn 0.5s 0.3s both;">
      <span>Acesse Gratuitamente</span>
      <span style="font-size:20px;">→</span>
    </a>
    <!-- URL -->
    <div style="margin-top:28px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.45);letter-spacing:0.08em;animation:fadeIn 0.5s 0.4s both;">inema.club</div>
  </div>
</div>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER ALL
// ─────────────────────────────────────────────────────────────────────────────

const slides = [
  { fn: slide01, name: 'c0093-metodo_seis_chapeus_carousel_01' },
  { fn: slide02, name: 'c0093-metodo_seis_chapeus_carousel_02' },
  { fn: slide03, name: 'c0093-metodo_seis_chapeus_carousel_03' },
  { fn: slide04, name: 'c0093-metodo_seis_chapeus_carousel_04' },
  { fn: slide05, name: 'c0093-metodo_seis_chapeus_carousel_05' },
  { fn: slide06, name: 'c0093-metodo_seis_chapeus_carousel_06' },
  { fn: slide07, name: 'c0093-metodo_seis_chapeus_carousel_07' },
  { fn: slide08, name: 'c0093-metodo_seis_chapeus_carousel_08' },
  { fn: slide09, name: 'c0093-metodo_seis_chapeus_carousel_09' },
  { fn: slide10, name: 'c0093-metodo_seis_chapeus_carousel_10' },
  { fn: slide11, name: 'c0093-metodo_seis_chapeus_carousel_11' },
  { fn: slide12, name: 'c0093-metodo_seis_chapeus_carousel_12' },
  { fn: slide13, name: 'c0093-metodo_seis_chapeus_carousel_13' },
  { fn: slide14, name: 'c0093-metodo_seis_chapeus_carousel_14' },
  { fn: slide15, name: 'c0093-metodo_seis_chapeus_carousel_15' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });

  const layout = { slides: [] };

  for (const slide of slides) {
    const html = slide.fn();
    const htmlPath = path.join(OUT_DIR, `${slide.name}.html`);
    const pngPath = path.join(OUT_DIR, `${slide.name}.png`);

    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`Rendering ${slide.name}...`);

    await page.goto(`file://${htmlPath}`);
    await page.waitForTimeout(800);
    await page.screenshot({ path: pngPath });

    layout.slides.push({
      filename: `${slide.name}.png`,
      html_source: `${slide.name}.html`,
      dimensions: '1080x1080',
      format: 'carousel',
    });

    console.log(`  ✓ ${slide.name}.png`);
  }

  await browser.close();

  fs.writeFileSync(
    path.join(OUT_DIR, 'layout.json'),
    JSON.stringify({
      campaign: 'c0093-metodo_seis_chapeus',
      date: '2026-04-21',
      total_slides: slides.length,
      format: 'carousel_1080x1080',
      copy_source: 'narrative.json',
      brand: 'INEMA.CLUB',
      slides: layout.slides,
    }, null, 2),
    'utf8'
  );

  console.log('\n✓ All 15 slides rendered.');
  console.log(`✓ layout.json saved to ${OUT_DIR}`);
})();
