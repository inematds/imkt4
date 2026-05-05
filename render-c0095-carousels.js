#!/usr/bin/env node
/**
 * Ad Creative Renderer — c0095-ebook_gramado_canela_leo_careca
 * 15 carousel slides 1080x1080 — Instagram, YouTube, Threads
 * Campaign: Ebook Leo Careca | Gramado & Canela | Serra Gaúcha
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = path.resolve(__dirname);
const IMGS = path.join(BASE, 'prj/inema/outputs/c0095-ebook_gramado_canela_leo_careca/imgs');
const ADS  = path.join(BASE, 'prj/inema/outputs/c0095-ebook_gramado_canela_leo_careca/ads');
const PFX  = 'c0095-ebook_gramado_canela_leo_careca';

if (!fs.existsSync(ADS)) fs.mkdirSync(ADS, { recursive: true });

// Campaign palette — warm Serra Gaúcha
const C = {
  gold:       '#C8882A',
  goldLight:  '#E8A840',
  goldDark:   '#8B5E1A',
  green:      '#2D5016',
  greenLight: '#4A7A25',
  cream:      '#F5EED8',
  warmGray:   '#7B7462',
  dark:       '#1A0E05',
  darkBrown:  '#2A1A08',
};

const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Raleway:wght@400;600;700;800&family=Montserrat:wght@600;700;800;900&display=swap');`;

const BASE_CSS = `
  ${GFONTS}
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1080px; height:1080px; overflow:hidden; position:relative; background:${C.dark}; }
  .bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.82) contrast(1.12) saturate(1.22); }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
`;

function imgSrc(n) {
  return `${IMGS}/${PFX}_generated_${String(n).padStart(2,'0')}_carousel_1080x1080.jpg`;
}

function wrap(style, body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${BASE_CSS}${style}</style></head><body>${body}</body></html>`;
}

// ─── 15 Slide HTML generators ───────────────────────────────────────────────

// Slide 01 — HOOK: Maximum visual impact, large number
function s01() {
  return wrap(`
    .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(26,14,5,0.92) 0%, rgba(26,14,5,0.48) 45%, rgba(0,0,0,0.12) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:flex-end; }
    .badge { display:inline-flex; align-items:center; background:${C.gold}; color:${C.dark}; font-family:'Montserrat',sans-serif; font-weight:800; font-size:16px; letter-spacing:0.14em; padding:10px 22px; border-radius:3px; text-transform:uppercase; margin-bottom:32px; align-self:flex-start; animation:scaleIn 0.5s ease both; }
    .stat { font-family:'Playfair Display',serif; font-weight:900; font-size:136px; color:${C.cream}; line-height:0.88; letter-spacing:-0.02em; text-shadow:0 4px 40px rgba(0,0,0,0.9); animation:fadeUp 0.5s ease 0.05s both; }
    .stat em { color:${C.gold}; font-style:normal; }
    .label { font-family:'Raleway',sans-serif; font-size:28px; font-weight:600; color:rgba(245,238,216,0.75); letter-spacing:0.1em; text-transform:uppercase; margin-top:10px; margin-bottom:28px; animation:fadeUp 0.5s ease 0.1s both; }
    .divider { width:80px; height:4px; background:${C.gold}; margin-bottom:28px; border-radius:2px; animation:fadeUp 0.5s ease 0.15s both; }
    .tagline { font-family:'Playfair Display',serif; font-weight:700; font-style:italic; font-size:54px; color:${C.cream}; line-height:1.25; max-width:820px; text-shadow:0 2px 16px rgba(0,0,0,0.8); animation:fadeUp 0.5s ease 0.2s both; }
  `,`
    <img class="bg" src="file://${imgSrc(1)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="badge">📍 Serra Gaúcha</div>
      <div class="stat"><em>6,5</em><br>Milhões</div>
      <div class="label">de turistas visitam Gramado e Canela todo ano</div>
      <div class="divider"></div>
      <div class="tagline">A maioria vai embora sem saber o que perdeu.</div>
    </div>
  `);
}

// Slide 02 — PROBLEMA: Paga preço máximo sem guia
function s02() {
  return wrap(`
    .bg { filter:brightness(0.65) contrast(1.2) saturate(1.1); }
    .overlay { position:absolute; inset:0; background:linear-gradient(135deg, rgba(26,14,5,0.94) 0%, rgba(26,14,5,0.72) 55%, rgba(44,28,8,0.45) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:center; }
    .problem-tag { display:inline-flex; align-items:center; gap:8px; border:2px solid ${C.gold}; color:${C.gold}; font-family:'Montserrat',sans-serif; font-weight:700; font-size:15px; letter-spacing:0.12em; padding:10px 20px; border-radius:3px; text-transform:uppercase; margin-bottom:36px; align-self:flex-start; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:92px; color:${C.cream}; line-height:1.05; letter-spacing:-0.01em; text-shadow:0 4px 28px rgba(0,0,0,0.95); max-width:880px; animation:fadeUp 0.5s ease 0.08s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .divider { width:80px; height:3px; background:${C.gold}; margin:32px 0; border-radius:2px; animation:fadeUp 0.5s ease 0.14s both; }
    .body { font-family:'Raleway',sans-serif; font-size:36px; font-weight:600; color:rgba(245,238,216,0.84); line-height:1.5; max-width:800px; text-shadow:0 2px 8px rgba(0,0,0,0.7); animation:fadeUp 0.5s ease 0.2s both; }
  `,`
    <img class="bg" src="file://${imgSrc(2)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="problem-tag">⚠ O Problema</div>
      <div class="headline">Sem um Guia<br>Local de <em>Verdade</em></div>
      <div class="divider"></div>
      <div class="body">você paga o preço máximo em tudo — hotéis, atrações, restaurantes.</div>
    </div>
  `);
}

// Slide 03 — AUTORIDADE: Leo Careca décadas de experiência
function s03() {
  return wrap(`
    .overlay { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(26,14,5,0.82) 0%, rgba(26,14,5,0.25) 42%, rgba(26,14,5,0.7) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:flex-start; }
    .eyebrow { font-family:'Montserrat',sans-serif; font-weight:700; font-size:16px; letter-spacing:0.18em; color:${C.gold}; text-transform:uppercase; margin-bottom:20px; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:100px; color:${C.cream}; line-height:1.0; max-width:900px; text-shadow:0 4px 36px rgba(0,0,0,0.95); animation:fadeUp 0.5s ease 0.08s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .bottom { position:absolute; bottom:72px; left:64px; right:64px; animation:fadeUp 0.5s ease 0.18s both; }
    .card { background:rgba(200,136,42,0.15); border:1.5px solid rgba(200,136,42,0.5); backdrop-filter:blur(14px); border-radius:12px; padding:32px 40px; }
    .card-text { font-family:'Raleway',sans-serif; font-size:34px; font-weight:600; color:${C.cream}; line-height:1.45; text-shadow:0 2px 8px rgba(0,0,0,0.6); }
  `,`
    <img class="bg" src="file://${imgSrc(3)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="eyebrow">Autoridade Local</div>
      <div class="headline">Leo Careca<br><em>Conhece<br>Cada Canto</em></div>
    </div>
    <div class="bottom">
      <div class="card">
        <div class="card-text">Décadas de relacionamentos exclusivos em Gramado e Canela — hotéis, atrações, restaurantes.</div>
      </div>
    </div>
  `);
}

// Slide 04 — PREÇOS ESPECIAIS: Benefício único
function s04() {
  return wrap(`
    .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(26,14,5,0.92) 0%, rgba(26,14,5,0.52) 50%, rgba(0,0,0,0.18) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:flex-end; }
    .tag { display:inline-flex; align-items:center; background:${C.green}; color:${C.cream}; font-family:'Montserrat',sans-serif; font-weight:700; font-size:15px; letter-spacing:0.12em; padding:10px 20px; border-radius:3px; text-transform:uppercase; margin-bottom:30px; align-self:flex-start; animation:scaleIn 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:108px; color:${C.cream}; line-height:0.92; letter-spacing:-0.01em; text-shadow:0 4px 40px rgba(0,0,0,0.95); animation:fadeUp 0.5s ease 0.06s both; }
    .headline strong { color:${C.gold}; font-weight:900; font-style:normal; }
    .divider { width:80px; height:4px; background:${C.gold}; margin:28px 0; border-radius:2px; animation:fadeUp 0.5s ease 0.12s both; }
    .sub { font-family:'Raleway',sans-serif; font-size:34px; font-weight:600; color:rgba(245,238,216,0.82); line-height:1.45; max-width:800px; text-shadow:0 2px 8px rgba(0,0,0,0.7); animation:fadeUp 0.5s ease 0.18s both; }
  `,`
    <img class="bg" src="file://${imgSrc(4)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="tag">💰 Diferencial</div>
      <div class="headline">Preços<br><strong>Especiais</strong></div>
      <div class="divider"></div>
      <div class="sub">Que só os contatos do Leo conseguem — o que nenhum site ou app vai te dar.</div>
    </div>
  `);
}

// Slide 05 — SEM FILA: Features práticas com pills
function s05() {
  return wrap(`
    .overlay { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(26,14,5,0.8) 0%, rgba(26,14,5,0.18) 48%, rgba(26,14,5,0.84) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:space-between; }
    .eyebrow { font-family:'Montserrat',sans-serif; font-weight:700; font-size:15px; letter-spacing:0.15em; color:${C.gold}; text-transform:uppercase; margin-bottom:16px; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:86px; color:${C.cream}; line-height:1.05; text-shadow:0 4px 28px rgba(0,0,0,0.95); animation:fadeUp 0.5s ease 0.07s both; }
    .bottom { }
    .pills { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:26px; animation:fadeUp 0.5s ease 0.13s both; }
    .pill { background:rgba(200,136,42,0.22); border:1.5px solid ${C.gold}; color:${C.cream}; font-family:'Montserrat',sans-serif; font-weight:700; font-size:20px; letter-spacing:0.06em; padding:12px 24px; border-radius:40px; backdrop-filter:blur(8px); }
    .sub { font-family:'Raleway',sans-serif; font-size:32px; font-weight:600; color:rgba(245,238,216,0.8); line-height:1.45; max-width:820px; text-shadow:0 2px 8px rgba(0,0,0,0.65); animation:fadeUp 0.5s ease 0.2s both; }
  `,`
    <img class="bg" src="file://${imgSrc(5)}">
    <div class="overlay"></div>
    <div class="content">
      <div>
        <div class="eyebrow">✅ O que você ganha</div>
        <div class="headline">Filas Evitadas.<br>Horários Certos.</div>
      </div>
      <div class="bottom">
        <div class="pills">
          <div class="pill">Sem Espera</div>
          <div class="pill">Sem Estresse</div>
          <div class="pill">Sem Desperdício</div>
        </div>
        <div class="sub">As atrações que valem cada centavo — e as que você pode pular sem arrependimento.</div>
      </div>
    </div>
  `);
}

// Slide 06 — GASTRONOMIA: Estilo editorial, tipografia grande
function s06() {
  return wrap(`
    .bg { filter:brightness(0.84) contrast(1.12) saturate(1.35); }
    .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(26,14,5,0.94) 0%, rgba(26,14,5,0.38) 55%, rgba(0,0,0,0.08) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:flex-end; }
    .eyebrow { font-family:'Montserrat',sans-serif; font-weight:700; font-size:16px; letter-spacing:0.18em; color:${C.gold}; text-transform:uppercase; margin-bottom:20px; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:110px; color:${C.cream}; line-height:0.94; letter-spacing:-0.01em; text-shadow:0 4px 44px rgba(0,0,0,0.95); animation:fadeUp 0.5s ease 0.07s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .divider { width:80px; height:3px; background:${C.gold}; margin:28px 0; border-radius:2px; animation:fadeUp 0.5s ease 0.14s both; }
    .sub { font-family:'Raleway',sans-serif; font-size:32px; font-weight:600; color:rgba(245,238,216,0.8); line-height:1.5; max-width:820px; text-shadow:0 2px 8px rgba(0,0,0,0.7); animation:fadeUp 0.5s ease 0.2s both; }
  `,`
    <img class="bg" src="file://${imgSrc(6)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="eyebrow">🍽 Gastronomia Serra Gaúcha</div>
      <div class="headline">Gastronomia<br>de <em>Verdade</em></div>
      <div class="divider"></div>
      <div class="sub">Do fondue aconchegante ao café colonial farto que os blogs ignoram — só o Leo sabe onde ir.</div>
    </div>
  `);
}

// Slide 07 — FAMÍLIA & CASAL: Gradiente verde lateral
function s07() {
  return wrap(`
    .overlay { position:absolute; inset:0; background:linear-gradient(155deg, rgba(45,80,22,0.78) 0%, rgba(26,14,5,0.45) 48%, rgba(26,14,5,0.85) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; }
    .badge { display:inline-flex; align-items:center; gap:10px; border:2px solid ${C.gold}; color:${C.gold}; font-family:'Montserrat',sans-serif; font-weight:700; font-size:15px; letter-spacing:0.12em; padding:10px 22px; border-radius:3px; text-transform:uppercase; margin-bottom:32px; animation:scaleIn 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:94px; color:${C.cream}; line-height:1.05; max-width:860px; text-shadow:0 4px 36px rgba(0,0,0,0.95); animation:fadeUp 0.5s ease 0.08s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .divider { width:80px; height:4px; background:${C.gold}; margin:30px 0; border-radius:2px; animation:fadeUp 0.5s ease 0.15s both; }
    .body { font-family:'Raleway',sans-serif; font-size:34px; font-weight:600; color:rgba(245,238,216,0.84); line-height:1.5; max-width:800px; text-shadow:0 2px 8px rgba(0,0,0,0.7); animation:fadeUp 0.5s ease 0.22s both; }
  `,`
    <img class="bg" src="file://${imgSrc(7)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="badge">👨‍👩‍👧 Família & Casais</div>
      <div class="headline">Roteiro<br>Completo para<br><em>Família ou Casal</em></div>
      <div class="divider"></div>
      <div class="body">Testado, aprovado, sem estresse de planejamento — do jeito que a viagem deve ser.</div>
    </div>
  `);
}

// Slide 08 — PROVA SOCIAL: Citação estilo editorial
function s08() {
  return wrap(`
    .bg { filter:brightness(0.72) contrast(1.18) saturate(1.15); }
    .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(26,14,5,0.97) 0%, rgba(26,14,5,0.55) 42%, rgba(0,0,0,0.18) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:flex-end; }
    .quote-mark { font-family:'Playfair Display',serif; font-weight:900; font-size:160px; color:${C.gold}; line-height:0.75; margin-bottom:0; opacity:0.65; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:700; font-style:italic; font-size:60px; color:${C.cream}; line-height:1.25; max-width:900px; text-shadow:0 4px 24px rgba(0,0,0,0.9); animation:fadeUp 0.5s ease 0.08s both; }
    .divider { width:80px; height:3px; background:${C.gold}; margin:28px 0; border-radius:2px; animation:fadeUp 0.5s ease 0.15s both; }
    .sub { font-family:'Raleway',sans-serif; font-size:30px; font-weight:600; color:rgba(245,238,216,0.78); line-height:1.5; max-width:820px; text-shadow:0 2px 8px rgba(0,0,0,0.6); animation:fadeUp 0.5s ease 0.2s both; }
  `,`
    <img class="bg" src="file://${imgSrc(8)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="quote-mark">"</div>
      <div class="headline">Quem comprou transformou a viagem: economias reais e experiências que turistas comuns nunca têm.</div>
      <div class="divider"></div>
      <div class="sub">Não é promessa — é o relato de quem viveu o Gramado do Leo Careca.</div>
    </div>
  `);
}

// Slide 09 — ATALHO INSIDER: Diferencial com badge dourado
function s09() {
  return wrap(`
    .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(26,14,5,0.92) 0%, rgba(26,14,5,0.5) 50%, rgba(0,0,0,0.18) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:flex-end; }
    .label { display:inline-flex; align-items:center; background:${C.gold}; color:${C.dark}; font-family:'Montserrat',sans-serif; font-weight:800; font-size:16px; letter-spacing:0.12em; padding:10px 22px; border-radius:3px; text-transform:uppercase; margin-bottom:32px; align-self:flex-start; animation:scaleIn 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:90px; color:${C.cream}; line-height:1.0; letter-spacing:-0.01em; max-width:900px; text-shadow:0 4px 36px rgba(0,0,0,0.95); animation:fadeUp 0.5s ease 0.08s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .divider { width:80px; height:4px; background:${C.gold}; margin:28px 0; border-radius:2px; animation:fadeUp 0.5s ease 0.15s both; }
    .sub { font-family:'Raleway',sans-serif; font-size:34px; font-weight:600; color:rgba(245,238,216,0.82); line-height:1.45; max-width:800px; text-shadow:0 2px 8px rgba(0,0,0,0.7); animation:fadeUp 0.5s ease 0.22s both; }
  `,`
    <img class="bg" src="file://${imgSrc(9)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="label">🔑 O Diferencial</div>
      <div class="headline">Não é mais<br>um Guia <em>Genérico.</em></div>
      <div class="divider"></div>
      <div class="sub">É o atalho insider para a melhor versão de Gramado e Canela — o que nenhum site entrega.</div>
    </div>
  `);
}

// Slide 10 — O GUIA DO LEO: Faixa inferior com frase-chave
function s10() {
  return wrap(`
    .bg { filter:brightness(0.8) contrast(1.1) saturate(1.18); }
    .overlay { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(26,14,5,0.88) 0%, rgba(26,14,5,0.28) 45%, rgba(26,14,5,0.85) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:flex-start; }
    .eyebrow { font-family:'Montserrat',sans-serif; font-weight:700; font-size:16px; letter-spacing:0.18em; color:${C.gold}; text-transform:uppercase; margin-bottom:20px; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:108px; color:${C.cream}; line-height:0.98; max-width:900px; text-shadow:0 4px 44px rgba(0,0,0,0.98); animation:fadeUp 0.5s ease 0.07s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .bottom-band { position:absolute; bottom:0; left:0; right:0; padding:44px 64px 68px; background:linear-gradient(to top, rgba(26,14,5,1) 0%, rgba(26,14,5,0.7) 60%, transparent 100%); animation:fadeUp 0.5s ease 0.16s both; }
    .key-phrase { font-family:'Playfair Display',serif; font-weight:700; font-style:italic; font-size:48px; color:${C.cream}; line-height:1.3; max-width:800px; text-shadow:0 2px 8px rgba(0,0,0,0.7); }
    .key-phrase em { color:${C.gold}; font-style:normal; }
  `,`
    <img class="bg" src="file://${imgSrc(10)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="eyebrow">O Único no Mercado</div>
      <div class="headline">O Guia que<br>Só <em>o Leo</em> Tem</div>
    </div>
    <div class="bottom-band">
      <div class="key-phrase">Décadas de contatos. <em>Uma viagem transformada.</em></div>
    </div>
  `);
}

// Slide 11 — AMIGO LOCAL: Overlay lateral esquerdo
function s11() {
  return wrap(`
    .overlay { position:absolute; inset:0; background:linear-gradient(to right, rgba(26,14,5,0.92) 0%, rgba(26,14,5,0.62) 50%, rgba(26,14,5,0.22) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:center; max-width:680px; }
    .eyebrow { font-family:'Montserrat',sans-serif; font-weight:700; font-size:15px; letter-spacing:0.15em; color:${C.gold}; text-transform:uppercase; margin-bottom:20px; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:88px; color:${C.cream}; line-height:1.05; text-shadow:0 4px 36px rgba(0,0,0,0.95); animation:fadeUp 0.5s ease 0.08s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .divider { width:72px; height:4px; background:${C.gold}; margin:28px 0; border-radius:2px; animation:fadeUp 0.5s ease 0.15s both; }
    .body { font-family:'Raleway',sans-serif; font-size:32px; font-weight:600; color:rgba(245,238,216,0.82); line-height:1.5; text-shadow:0 2px 8px rgba(0,0,0,0.6); animation:fadeUp 0.5s ease 0.22s both; }
  `,`
    <img class="bg" src="file://${imgSrc(11)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="eyebrow">🤝 Seu Amigo Local</div>
      <div class="headline">Serra Gaúcha<br>como os<br><em>Locais Vivem</em></div>
      <div class="divider"></div>
      <div class="body">Não como o Google mostra — do jeito que quem nasceu ali realmente conhece.</div>
    </div>
  `);
}

// Slide 12 — A VIAGEM QUE OS OUTROS NÃO FAZEM: Overlay radial central
function s12() {
  return wrap(`
    .bg { filter:brightness(0.76) contrast(1.22) saturate(1.28); }
    .overlay { position:absolute; inset:0; background:radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, rgba(26,14,5,0.88) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; }
    .eyebrow { font-family:'Montserrat',sans-serif; font-weight:700; font-size:16px; letter-spacing:0.18em; color:${C.gold}; text-transform:uppercase; margin-bottom:28px; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:100px; color:${C.cream}; line-height:1.0; max-width:900px; text-shadow:0 4px 44px rgba(0,0,0,0.98); animation:fadeUp 0.5s ease 0.08s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .divider { width:80px; height:4px; background:${C.gold}; margin:30px auto; border-radius:2px; animation:fadeUp 0.5s ease 0.15s both; }
    .sub { font-family:'Raleway',sans-serif; font-size:33px; font-weight:600; color:rgba(245,238,216,0.82); line-height:1.5; max-width:800px; text-shadow:0 2px 8px rgba(0,0,0,0.7); animation:fadeUp 0.5s ease 0.22s both; }
  `,`
    <img class="bg" src="file://${imgSrc(12)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="eyebrow">✨ Experiência Única</div>
      <div class="headline">A Viagem que<br>os Outros<br><em>Não Fazem</em></div>
      <div class="divider"></div>
      <div class="sub">Insider de verdade. Não é mais um blog. É quem vive e respira a Serra Gaúcha.</div>
    </div>
  `);
}

// Slide 13 — VIAJE MAIS, PAGUE MENOS: Proposta de valor
function s13() {
  return wrap(`
    .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(26,14,5,0.94) 0%, rgba(26,14,5,0.52) 45%, rgba(0,0,0,0.14) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:flex-end; }
    .badge { display:inline-flex; align-items:center; background:rgba(245,238,216,0.14); border:2px solid ${C.cream}; color:${C.cream}; font-family:'Montserrat',sans-serif; font-weight:700; font-size:15px; letter-spacing:0.12em; padding:10px 22px; border-radius:3px; text-transform:uppercase; margin-bottom:30px; align-self:flex-start; backdrop-filter:blur(8px); animation:scaleIn 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:110px; color:${C.cream}; line-height:0.94; letter-spacing:-0.01em; text-shadow:0 4px 44px rgba(0,0,0,0.98); animation:fadeUp 0.5s ease 0.07s both; }
    .headline em { color:${C.gold}; font-style:normal; }
    .divider { width:80px; height:4px; background:${C.gold}; margin:28px 0; border-radius:2px; animation:fadeUp 0.5s ease 0.14s both; }
    .sub { font-family:'Raleway',sans-serif; font-size:34px; font-weight:600; color:rgba(245,238,216,0.82); line-height:1.45; max-width:820px; text-shadow:0 2px 8px rgba(0,0,0,0.7); animation:fadeUp 0.5s ease 0.2s both; }
  `,`
    <img class="bg" src="file://${imgSrc(13)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="badge">💎 Valor Real</div>
      <div class="headline">Viaje <em>Mais.</em><br>Pague Muito<br>Menos.</div>
      <div class="divider"></div>
      <div class="sub">O ebook que se paga na própria viagem — economias reais em cada atração, cada refeição.</div>
    </div>
  `);
}

// Slide 14 — BASTIDORES DE GRAMADO: Card verde com destaque
function s14() {
  return wrap(`
    .overlay { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(45,80,22,0.78) 0%, rgba(26,14,5,0.38) 45%, rgba(26,14,5,0.9) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:flex-start; }
    .eyebrow { font-family:'Montserrat',sans-serif; font-weight:700; font-size:16px; letter-spacing:0.18em; color:${C.cream}; text-transform:uppercase; margin-bottom:20px; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:100px; color:${C.cream}; line-height:1.0; max-width:900px; text-shadow:0 4px 36px rgba(0,0,0,0.95); animation:fadeUp 0.5s ease 0.07s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .bottom-content { position:absolute; bottom:72px; left:64px; right:64px; animation:fadeUp 0.5s ease 0.16s both; }
    .card { background:rgba(45,80,22,0.32); border:1.5px solid rgba(74,122,37,0.6); backdrop-filter:blur(16px); border-radius:12px; padding:36px 44px; }
    .card-text { font-family:'Raleway',sans-serif; font-size:34px; font-weight:600; color:${C.cream}; line-height:1.45; text-shadow:0 2px 8px rgba(0,0,0,0.5); }
    .card-text strong { color:${C.gold}; }
  `,`
    <img class="bg" src="file://${imgSrc(14)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="eyebrow">🌿 Insider Exclusivo</div>
      <div class="headline">Abra os<br>Bastidores de<br><em>Gramado</em></div>
    </div>
    <div class="bottom-content">
      <div class="card">
        <div class="card-text">Cantos escondidos que <strong>só os moradores conhecem</strong>, agora reunidos num único material.</div>
      </div>
    </div>
  `);
}

// Slide 15 — CTA: Brand URL em destaque máximo
function s15() {
  return wrap(`
    .bg { filter:brightness(0.52) contrast(1.22) saturate(1.08); }
    .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(26,14,5,1) 0%, rgba(26,14,5,0.82) 42%, rgba(26,14,5,0.52) 100%); }
    .content { position:absolute; inset:0; padding:72px 64px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; }
    .logo { font-family:'Montserrat',sans-serif; font-weight:800; font-size:20px; letter-spacing:0.24em; color:${C.gold}; text-transform:uppercase; margin-bottom:36px; animation:fadeUp 0.5s ease both; }
    .headline { font-family:'Playfair Display',serif; font-weight:900; font-size:90px; color:${C.cream}; line-height:1.05; max-width:900px; text-shadow:0 4px 44px rgba(0,0,0,0.98); animation:fadeUp 0.5s ease 0.07s both; }
    .headline em { color:${C.gold}; font-style:italic; }
    .divider { width:80px; height:4px; background:${C.gold}; margin:32px auto; border-radius:2px; animation:fadeUp 0.5s ease 0.13s both; }
    .sub { font-family:'Raleway',sans-serif; font-size:32px; font-weight:600; color:rgba(245,238,216,0.82); line-height:1.5; max-width:700px; margin-bottom:48px; text-shadow:0 2px 8px rgba(0,0,0,0.6); animation:fadeUp 0.5s ease 0.18s both; }
    .cta-btn { display:inline-flex; align-items:center; gap:12px; background:${C.gold}; color:${C.dark}; font-family:'Montserrat',sans-serif; font-weight:900; font-size:28px; letter-spacing:0.1em; text-transform:uppercase; padding:24px 60px; border-radius:9999px; box-shadow:0 8px 44px rgba(200,136,42,0.65), 0 2px 12px rgba(0,0,0,0.5); animation:scaleIn 0.5s ease 0.25s both; margin-bottom:36px; }
    .brand-url { font-family:'Montserrat',sans-serif; font-weight:900; font-size:52px; letter-spacing:0.06em; color:${C.cream}; text-shadow:0 2px 16px rgba(0,0,0,0.9); animation:fadeUp 0.5s ease 0.3s both; }
    .brand-url em { color:${C.gold}; font-style:normal; }
    .handle { font-family:'Raleway',sans-serif; font-size:26px; font-weight:600; color:rgba(245,238,216,0.58); letter-spacing:0.06em; margin-top:12px; animation:fadeUp 0.5s ease 0.35s both; }
  `,`
    <img class="bg" src="file://${imgSrc(15)}">
    <div class="overlay"></div>
    <div class="content">
      <div class="logo">Ebook Leo Careca · Serra Gaúcha</div>
      <div class="headline">Garanta seu<br>Ebook <em>Antes</em><br>da Viagem</div>
      <div class="divider"></div>
      <div class="sub">O guia que transforma turistas em quem realmente conhece Gramado e Canela.</div>
      <div class="cta-btn">🔗 Link na Bio</div>
      <div class="brand-url"><em>inema.club</em></div>
      <div class="handle">@inema.tds</div>
    </div>
  `);
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { fn: 'carousel_01', gen: s01 },
  { fn: 'carousel_02', gen: s02 },
  { fn: 'carousel_03', gen: s03 },
  { fn: 'carousel_04', gen: s04 },
  { fn: 'carousel_05', gen: s05 },
  { fn: 'carousel_06', gen: s06 },
  { fn: 'carousel_07', gen: s07 },
  { fn: 'carousel_08', gen: s08 },
  { fn: 'carousel_09', gen: s09 },
  { fn: 'carousel_10', gen: s10 },
  { fn: 'carousel_11', gen: s11 },
  { fn: 'carousel_12', gen: s12 },
  { fn: 'carousel_13', gen: s13 },
  { fn: 'carousel_14', gen: s14 },
  { fn: 'carousel_15', gen: s15 },
];

// ─── Render ──────────────────────────────────────────────────────────────────

async function main() {
  const browser = await chromium.launch();
  const layoutSlides = [];

  for (let i = 0; i < SLIDES.length; i++) {
    const { fn, gen } = SLIDES[i];
    const filename = `${PFX}_${fn}`;
    const htmlPath = path.join(ADS, `${filename}.html`);
    const pngPath  = path.join(ADS, `${filename}.png`);

    fs.writeFileSync(htmlPath, gen(), 'utf8');

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.goto(`file://${htmlPath}`);
    await page.waitForTimeout(600);
    await page.screenshot({ path: pngPath });
    await page.close();

    layoutSlides.push({
      filename: `${filename}.png`,
      html_source: `${filename}.html`,
      slide_number: i + 1,
      dimensions: '1080x1080',
      concept: fn,
      images_used: [`${PFX}_generated_${String(i + 1).padStart(2, '0')}_carousel_1080x1080.jpg`],
      copy_source: i < 9 ? `narrative.json → carousel_texts[${i}]` : (i === 14 ? 'narrative.json → approved_ctas' : `narrative.json → headlines / key_phrases`),
    });

    console.log(`✓ [${i + 1}/15] ${filename}.png`);
  }

  await browser.close();

  const layout = {
    campaign: PFX,
    date: '2026-04-24',
    platforms: ['instagram', 'youtube', 'threads'],
    total_slides: 15,
    format: '1080x1080',
    brand_colors: { gold: '#C8882A', green: '#2D5016', cream: '#F5EED8', dark: '#1A0E05' },
    typography: { headline: 'Playfair Display', body: 'Raleway', badge: 'Montserrat' },
    slides: layoutSlides,
  };

  fs.writeFileSync(path.join(ADS, 'layout.json'), JSON.stringify(layout, null, 2));
  console.log('\n✅ All 15 slides rendered!');
  console.log(`📁 ${ADS}`);
}

main().catch(err => { console.error(err); process.exit(1); });
