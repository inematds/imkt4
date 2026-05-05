const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = '/home/nmaldaner/projetos/timesmkt3/prj/inema/outputs/c0090-vibe_coding_negocios/ads';
const IMGS_BASE = '/home/nmaldaner/projetos/timesmkt3/prj/inema/outputs/c0090-vibe_coding_negocios/imgs';
const PREFIX = 'c0090-vibe_coding_negocios';

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const imgUrl = (n) =>
  `file://${IMGS_BASE}/${PREFIX}_generated_${String(n).padStart(2, '0')}_carousel_1080x1080.jpg`;

const GF = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');`;

const BASE = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; height: 1080px; overflow: hidden; font-family: 'Space Grotesk', 'Inter', sans-serif; background: #0D0D0D; }
.slide { position: relative; width: 1080px; height: 1080px; overflow: hidden; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85) contrast(1.1) saturate(1.15); }
.ov { position: absolute; inset: 0; }
.brand { position: absolute; top: 40px; right: 48px; font-size: 20px; font-weight: 800; color: #0099FF; letter-spacing: 0.14em; text-transform: uppercase; text-shadow: 0 2px 8px rgba(0,0,0,0.9); }
.num { position: absolute; top: 44px; left: 48px; font-size: 18px; font-weight: 500; color: rgba(255,255,255,0.45); letter-spacing: 0.08em; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
`;

const slides = [
  // ─── SLIDE 1: Hook ─────────────────────────────────────────────────────────
  {
    id: '01', imgIndex: 1,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:80px 60px; }
.tag { background:#0099FF; color:#fff; font-size:21px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; padding:9px 26px; border-radius:4px; margin-bottom:44px; animation:fadeUp .5s ease both; }
.cmp { display:flex; align-items:center; gap:52px; margin-bottom:44px; animation:fadeUp .5s ease .1s both; }
.cb { text-align:center; }
.cn { font-size:128px; font-weight:900; line-height:.85; letter-spacing:-.04em; }
.cn.old { color:rgba(255,255,255,.35); text-decoration:line-through; text-decoration-color:rgba(255,70,70,.6); }
.cn.nw { color:#00FF88; text-shadow:0 0 60px rgba(0,255,136,.4); }
.cl { font-size:30px; font-weight:700; color:rgba(255,255,255,.6); text-transform:uppercase; letter-spacing:.1em; margin-top:10px; }
.arr { font-size:80px; color:#0099FF; font-weight:900; line-height:1; }
.hl { font-size:44px; font-weight:700; color:#fff; text-align:center; max-width:820px; line-height:1.2; text-shadow:0 2px 16px rgba(0,0,0,.8); animation:fadeUp .5s ease .2s both; }
.sub { font-size:30px; font-weight:400; color:rgba(255,255,255,.6); text-align:center; margin-top:14px; animation:fadeUp .5s ease .3s both; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" />
<div class="ov" style="background:linear-gradient(135deg,rgba(0,0,0,.85) 0%,rgba(0,10,30,.78) 100%);"></div>
<div class="brand">INEMA</div><div class="num">01 / 10</div>
<div class="c">
  <div class="tag">VIBE CODING &amp; IA NOS NEGÓCIOS</div>
  <div class="cmp">
    <div class="cb"><div class="cn old">6</div><div class="cl">Meses</div></div>
    <div class="arr">→</div>
    <div class="cb"><div class="cn nw">6</div><div class="cl">Horas</div></div>
  </div>
  <div class="hl">O que o vibe coding realmente<br>mudou nos negócios</div>
  <div class="sub">Sem hype. Com dados.</div>
</div>
</div></body></html>`
  },

  // ─── SLIDE 2: Before/After data ────────────────────────────────────────────
  {
    id: '02', imgIndex: 2,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:70px 60px; }
.hl { font-size:54px; font-weight:900; color:#fff; text-align:center; letter-spacing:-.01em; margin-bottom:44px; text-shadow:0 2px 16px rgba(0,0,0,.8); animation:fadeUp .5s ease both; }
.grid { display:grid; grid-template-columns:1fr auto 1fr; width:940px; animation:fadeUp .5s ease .15s both; }
.col { background:rgba(0,0,0,.62); backdrop-filter:blur(14px); border-radius:20px; padding:36px 32px; text-align:center; }
.col.past { border:1px solid rgba(255,80,80,.3); }
.col.now { border:2px solid rgba(0,255,136,.45); }
.yr { font-size:28px; font-weight:800; letter-spacing:.1em; margin-bottom:24px; }
.col.past .yr { color:rgba(255,255,255,.45); }
.col.now .yr { color:#00FF88; }
.dn { font-size:72px; font-weight:900; line-height:.9; letter-spacing:-.03em; }
.col.past .dn { color:rgba(255,255,255,.38); }
.col.now .dn { color:#00FF88; text-shadow:0 0 40px rgba(0,255,136,.35); }
.dd { font-size:22px; font-weight:500; color:rgba(255,255,255,.6); margin-top:6px; margin-bottom:20px; }
.dc { display:flex; align-items:center; justify-content:center; padding:0 28px; }
.darr { font-size:52px; color:#0099FF; font-weight:900; }
.bt { font-size:28px; font-weight:700; color:#0099FF; text-align:center; margin-top:36px; animation:fadeUp .5s ease .3s both; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" />
<div class="ov" style="background:rgba(0,0,0,.82);"></div>
<div class="brand">INEMA</div><div class="num">02 / 10</div>
<div class="c">
  <div class="hl">O custo de experimentar<br>caiu absurdamente</div>
  <div class="grid">
    <div class="col past">
      <div class="yr">2022</div>
      <div class="dn">6</div><div class="dd">meses de dev</div>
      <div class="dn" style="font-size:60px">R$80k</div><div class="dd">investimento</div>
    </div>
    <div class="dc"><div class="darr">→</div></div>
    <div class="col now">
      <div class="yr">2025</div>
      <div class="dn">6</div><div class="dd">horas de trabalho</div>
      <div class="dn" style="font-size:60px">R$200</div><div class="dd">custo total</div>
    </div>
  </div>
  <div class="bt">Isso não é hype — é mudança estrutural no jogo.</div>
</div>
</div></body></html>`
  },

  // ─── SLIDE 3: Speed as moat ─────────────────────────────────────────────────
  {
    id: '03', imgIndex: 3,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:80px 76px; }
.pill { display:inline-flex; align-items:center; gap:10px; background:rgba(0,153,255,.18); border:1px solid rgba(0,153,255,.55); border-radius:999px; padding:10px 28px; font-size:20px; font-weight:700; color:#0099FF; letter-spacing:.08em; text-transform:uppercase; margin-bottom:36px; width:fit-content; animation:fadeUp .5s ease both; }
.hl { font-size:100px; font-weight:900; color:#fff; line-height:.9; letter-spacing:-.04em; margin-bottom:32px; text-shadow:0 4px 24px rgba(0,0,0,.7); animation:fadeUp .5s ease .1s both; }
.hl em { color:#00FF88; font-style:normal; display:block; }
.body { font-size:34px; font-weight:500; color:rgba(255,255,255,.72); line-height:1.45; max-width:680px; margin-bottom:48px; animation:fadeUp .5s ease .2s both; }
.badge { display:inline-flex; align-items:center; gap:14px; background:rgba(0,255,136,.12); border:2px solid #00FF88; border-radius:14px; padding:18px 36px; animation:scaleIn .5s ease .3s both; }
.badge-t { font-size:26px; font-weight:700; color:#00FF88; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" />
<div class="ov" style="background:linear-gradient(to right,rgba(0,0,0,.9) 58%,rgba(0,0,0,.45) 100%);"></div>
<div class="brand">INEMA</div><div class="num">03 / 10</div>
<div class="c">
  <div class="pill">⚡ Vantagem Competitiva</div>
  <div class="hl">Quem testa<br>mais ideias,<br><em>ganha.</em></div>
  <div class="body">Velocidade de iteração<br>não é diferencial — é moat.</div>
  <div class="badge"><span class="badge-t">Testar rápido = aprender rápido = vencer</span></div>
</div>
</div></body></html>`
  },

  // ─── SLIDE 4: 41% stat ──────────────────────────────────────────────────────
  {
    id: '04', imgIndex: 4,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:72px 60px; text-align:center; }
.big { font-size:210px; font-weight:900; color:#0099FF; line-height:.8; letter-spacing:-.06em; text-shadow:0 0 100px rgba(0,153,255,.45),0 4px 24px rgba(0,0,0,.7); animation:fadeUp .5s ease both; }
.stat-l { font-size:34px; font-weight:600; color:rgba(255,255,255,.8); letter-spacing:.04em; margin-bottom:36px; line-height:1.35; animation:fadeUp .5s ease .12s both; }
.div { width:80px; height:4px; background:linear-gradient(to right,#0099FF,#00FF88); border-radius:2px; margin:0 auto 36px; animation:scaleIn .5s ease .2s both; }
.bullets { display:flex; flex-direction:column; gap:12px; width:100%; max-width:820px; animation:fadeUp .5s ease .28s both; }
.b { display:flex; align-items:center; gap:18px; background:rgba(0,0,0,.52); backdrop-filter:blur(8px); border:1px solid rgba(0,153,255,.22); border-radius:12px; padding:18px 28px; text-align:left; }
.bd { width:12px; height:12px; border-radius:50%; background:#0099FF; flex-shrink:0; }
.bt { font-size:26px; font-weight:500; color:rgba(255,255,255,.85); line-height:1.3; }
.b.green { border-color:rgba(0,255,136,.3); }
.b.green .bd { background:#00FF88; }
.b.green .bt { color:#00FF88; font-weight:700; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" />
<div class="ov" style="background:rgba(0,0,0,.8);"></div>
<div class="brand">INEMA</div><div class="num">04 / 10</div>
<div class="c">
  <div class="big">41%</div>
  <div class="stat-l">do código global já é<br>gerado por IA</div>
  <div class="div"></div>
  <div class="bullets">
    <div class="b"><div class="bd"></div><div class="bt">Uma pessoa + IA já cria MVP decente</div></div>
    <div class="b"><div class="bd"></div><div class="bt">A barreira de entrada não é mais técnica</div></div>
    <div class="b green"><div class="bd"></div><div class="bt">É estratégica. É cognitiva. É sua.</div></div>
  </div>
</div>
</div></body></html>`
  },

  // ─── SLIDE 5: Value shift ───────────────────────────────────────────────────
  {
    id: '05', imgIndex: 5,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:80px 76px; }
.hl { font-size:90px; font-weight:900; color:#fff; line-height:.9; letter-spacing:-.03em; margin-bottom:20px; text-shadow:0 4px 24px rgba(0,0,0,.7); animation:fadeUp .5s ease both; }
.hl .cm { color:rgba(255,255,255,.32); text-decoration:line-through; text-decoration-color:rgba(255,70,70,.55); }
.hl .vl { color:#00FF88; }
.sub { font-size:36px; font-weight:700; color:rgba(255,255,255,.65); margin-bottom:44px; animation:fadeUp .5s ease .1s both; }
.flow { display:flex; flex-direction:column; gap:13px; animation:fadeUp .5s ease .2s both; }
.fi { display:flex; align-items:center; gap:24px; background:rgba(0,0,0,.58); backdrop-filter:blur(12px); border-radius:14px; padding:20px 28px; border-left:4px solid #0099FF; }
.ff { font-size:26px; font-weight:600; color:rgba(255,255,255,.45); text-decoration:line-through; text-decoration-color:rgba(255,70,70,.45); }
.fa { font-size:22px; color:#0099FF; font-weight:700; }
.ft { font-size:26px; font-weight:700; color:#00FF88; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" />
<div class="ov" style="background:linear-gradient(to right,rgba(0,0,0,.92) 55%,rgba(0,0,0,.52) 100%);"></div>
<div class="brand">INEMA</div><div class="num">05 / 10</div>
<div class="c">
  <div class="hl">O <span class="cm">código</span><br>virou<br><span class="vl">commodity.</span></div>
  <div class="sub">O valor está na decisão:</div>
  <div class="flow">
    <div class="fi"><div class="ff">Habilidade técnica</div><div class="fa">→</div><div class="ft">Problema certo</div></div>
    <div class="fi"><div class="ff">Velocidade de build</div><div class="fa">→</div><div class="ft">Entender o usuário</div></div>
    <div class="fi"><div class="ff">Stack tecnológica</div><div class="fa">→</div><div class="ft">Distribuição certa</div></div>
  </div>
</div>
</div></body></html>`
  },

  // ─── SLIDE 6: Prototyping strategic ────────────────────────────────────────
  {
    id: '06', imgIndex: 6,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:72px; text-align:center; }
.lbl { font-size:20px; font-weight:700; color:#0099FF; letter-spacing:.16em; text-transform:uppercase; margin-bottom:28px; animation:fadeUp .5s ease both; }
.hl { font-size:82px; font-weight:900; color:#fff; line-height:1.0; letter-spacing:-.025em; margin-bottom:28px; text-shadow:0 4px 24px rgba(0,0,0,.7); animation:fadeUp .5s ease .1s both; }
.hl em { color:#0099FF; font-style:normal; }
.body { font-size:30px; font-weight:500; color:rgba(255,255,255,.68); line-height:1.5; max-width:760px; margin-bottom:44px; animation:fadeUp .5s ease .2s both; }
.sc { display:flex; gap:20px; animation:scaleIn .5s ease .3s both; }
.si { background:rgba(0,0,0,.62); backdrop-filter:blur(12px); border-radius:18px; padding:26px 32px; text-align:center; flex:1; }
.si.from { border:1px solid rgba(255,255,255,.14); }
.si.to { border:2px solid #00FF88; }
.sl { font-size:18px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; margin-bottom:10px; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,.1); }
.si.from .sl { color:rgba(255,255,255,.4); }
.si.to .sl { color:#00FF88; }
.st { font-size:23px; font-weight:600; }
.si.from .st { color:rgba(255,255,255,.5); }
.si.to .st { color:#fff; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" />
<div class="ov" style="background:linear-gradient(to bottom,rgba(0,0,0,.78) 0%,rgba(0,0,0,.88) 100%);"></div>
<div class="brand">INEMA</div><div class="num">06 / 10</div>
<div class="c">
  <div class="lbl">Nova Realidade</div>
  <div class="hl">Prototipar virou<br><em>pensamento</em><br>estratégico.</div>
  <div class="body">Não é mais etapa de dev.<br>É ferramenta de validação do fundador.</div>
  <div class="sc">
    <div class="si from"><div class="sl">Antes</div><div class="st">Etapa de desenvolvimento</div></div>
    <div class="si to"><div class="sl">Agora</div><div class="st">Ferramenta de decisão estratégica</div></div>
  </div>
</div>
</div></body></html>`
  },

  // ─── SLIDE 7: Risk / Technical debt ────────────────────────────────────────
  {
    id: '07', imgIndex: 7,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:80px 76px; }
.wtag { display:inline-flex; align-items:center; gap:10px; background:rgba(255,70,40,.14); border:1px solid rgba(255,70,40,.5); border-radius:8px; padding:10px 24px; font-size:20px; font-weight:700; color:#FF5232; letter-spacing:.1em; text-transform:uppercase; margin-bottom:32px; width:fit-content; animation:fadeUp .5s ease both; }
.hl { font-size:88px; font-weight:900; color:#fff; line-height:.9; letter-spacing:-.025em; margin-bottom:36px; text-shadow:0 4px 24px rgba(0,0,0,.7); animation:fadeUp .5s ease .1s both; }
.hl .rr { color:#FF5232; }
.rl { display:flex; flex-direction:column; gap:12px; animation:fadeUp .5s ease .2s both; }
.ri { display:flex; align-items:flex-start; gap:16px; background:rgba(0,0,0,.58); backdrop-filter:blur(12px); border:1px solid rgba(255,70,40,.22); border-radius:12px; padding:18px 24px; }
.ic { font-size:22px; color:#FF5232; font-weight:700; flex-shrink:0; margin-top:2px; }
.rt { font-size:26px; font-weight:500; color:rgba(255,255,255,.82); line-height:1.3; }
.bn { margin-top:28px; font-size:28px; font-weight:600; color:rgba(255,255,255,.5); font-style:italic; animation:fadeUp .5s ease .3s both; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" style="filter:brightness(.72) contrast(1.1) saturate(.85);"/>
<div class="ov" style="background:linear-gradient(135deg,rgba(18,0,0,.9) 0%,rgba(0,0,0,.78) 100%);"></div>
<div class="brand">INEMA</div><div class="num">07 / 10</div>
<div class="c">
  <div class="wtag">⚠ Atenção</div>
  <div class="hl">O <span class="rr">risco</span><br>que o hype<br>ignora.</div>
  <div class="rl">
    <div class="ri"><div class="ic">▸</div><div class="rt">Dívida técnica invisível — difícil de ver enquanto cria</div></div>
    <div class="ri"><div class="ic">▸</div><div class="rt">Sistemas criados sem critério: difíceis de manter e escalar</div></div>
    <div class="ri"><div class="ic">▸</div><div class="rt">Velocidade sem estratégia é armadilha, não vantagem</div></div>
  </div>
  <div class="bn">Velocidade precisa de direção.</div>
</div>
</div></body></html>`
  },

  // ─── SLIDE 8: What hasn't changed ──────────────────────────────────────────
  {
    id: '08', imgIndex: 8,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:80px 72px; text-align:center; }
.lbl { font-size:22px; font-weight:700; color:rgba(255,255,255,.48); letter-spacing:.16em; text-transform:uppercase; margin-bottom:22px; animation:fadeUp .5s ease both; }
.hl { font-size:82px; font-weight:900; color:#fff; line-height:1.0; letter-spacing:-.025em; margin-bottom:44px; text-shadow:0 4px 24px rgba(0,0,0,.7); animation:fadeUp .5s ease .1s both; }
.hl em { color:#0099FF; font-style:normal; }
.tc { display:flex; flex-direction:column; gap:16px; width:100%; max-width:860px; animation:fadeUp .5s ease .2s both; }
.tc .card { background:rgba(0,153,255,.1); border:1px solid rgba(0,153,255,.35); border-radius:16px; padding:22px 32px; text-align:left; display:flex; align-items:center; gap:20px; }
.chk { font-size:26px; color:#0099FF; font-weight:700; flex-shrink:0; }
.ct { font-size:27px; font-weight:600; color:rgba(255,255,255,.9); line-height:1.3; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" />
<div class="ov" style="background:rgba(0,0,0,.82);"></div>
<div class="brand">INEMA</div><div class="num">08 / 10</div>
<div class="c">
  <div class="lbl">O que NÃO mudou</div>
  <div class="hl">Execução consistente<br>ainda <em>vence.</em></div>
  <div class="tc">
    <div class="card"><div class="chk">✓</div><div class="ct">O cliente ainda quer valor real — não velocidade</div></div>
    <div class="card"><div class="chk">✓</div><div class="ct">Execução consistente vence no longo prazo</div></div>
    <div class="card"><div class="chk">✓</div><div class="ct">Escolher o problema certo ainda é o diferencial humano</div></div>
  </div>
</div>
</div></body></html>`
  },

  // ─── SLIDE 9: Clarity framework ────────────────────────────────────────────
  {
    id: '09', imgIndex: 9,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:72px; }
.hl { font-size:66px; font-weight:900; color:#fff; line-height:1.0; letter-spacing:-.025em; margin-bottom:40px; text-shadow:0 4px 24px rgba(0,0,0,.7); animation:fadeUp .5s ease both; }
.hl em { color:#00FF88; font-style:normal; }
.fw { display:grid; grid-template-columns:1fr 1fr; gap:20px; animation:fadeUp .5s ease .15s both; }
.fc { border-radius:20px; padding:28px 26px; backdrop-filter:blur(12px); }
.fc.adv { background:rgba(0,255,136,.1); border:2px solid rgba(0,255,136,.5); }
.fc.trap { background:rgba(255,70,40,.1); border:2px solid rgba(255,70,40,.42); }
.ft { font-size:22px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,.1); }
.fc.adv .ft { color:#00FF88; }
.fc.trap .ft { color:#FF5232; }
.fi { font-size:23px; font-weight:500; color:rgba(255,255,255,.82); line-height:1.35; padding:7px 0; border-bottom:1px solid rgba(255,255,255,.06); display:flex; gap:10px; align-items:flex-start; }
.fc.adv .fi::before { content:'✓'; color:#00FF88; font-weight:700; flex-shrink:0; }
.fc.trap .fi::before { content:'✗'; color:#FF5232; font-weight:700; flex-shrink:0; }
.bi { margin-top:26px; font-size:26px; font-weight:700; color:#0099FF; text-align:center; animation:scaleIn .5s ease .3s both; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" />
<div class="ov" style="background:linear-gradient(to bottom,rgba(0,0,0,.84) 0%,rgba(0,5,20,.9) 100%);"></div>
<div class="brand">INEMA</div><div class="num">09 / 10</div>
<div class="c">
  <div class="hl">Clareza no<br><em>novo jogo</em><br>competitivo.</div>
  <div class="fw">
    <div class="fc adv">
      <div class="ft">🟢 Vantagem</div>
      <div class="fi">Velocidade + clareza de decisão</div>
      <div class="fi">Iterar rápido com foco no usuário</div>
      <div class="fi">Prototipar para validar, não lançar</div>
    </div>
    <div class="fc trap">
      <div class="ft">🔴 Armadilha</div>
      <div class="fi">Velocidade sem estratégia</div>
      <div class="fi">Build sem validação de problema</div>
      <div class="fi">Código rápido, decisão errada</div>
    </div>
  </div>
  <div class="bi">A diferença está em saber qual é qual.</div>
</div>
</div></body></html>`
  },

  // ─── SLIDE 10: CTA — INEMA.CLUB ────────────────────────────────────────────
  {
    id: '010', imgIndex: 10,
    html: (u) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${GF}${BASE}
.c { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:80px 72px; text-align:center; }
.top { font-size:28px; font-weight:600; color:rgba(255,255,255,.62); letter-spacing:.04em; line-height:1.4; max-width:720px; margin-bottom:36px; animation:fadeUp .5s ease both; }
.bu { font-size:116px; font-weight:900; color:#fff; letter-spacing:-.04em; line-height:.85; text-shadow:0 0 80px rgba(0,153,255,.55),0 4px 32px rgba(0,0,0,.9); margin-bottom:14px; animation:fadeUp .5s ease .1s both; }
.bu span { color:#0099FF; }
.tl { font-size:30px; font-weight:500; color:rgba(255,255,255,.55); margin-bottom:52px; animation:fadeUp .5s ease .2s both; }
.btn { display:inline-flex; align-items:center; gap:14px; background:linear-gradient(135deg,#0099FF,#00CC88); border-radius:9999px; padding:22px 60px; font-size:28px; font-weight:700; color:#fff; letter-spacing:.1em; text-transform:uppercase; box-shadow:0 8px 48px rgba(0,153,255,.55),0 4px 16px rgba(0,0,0,.5); animation:scaleIn .5s ease .3s both; }
.fb { display:inline-flex; align-items:center; background:rgba(0,255,136,.14); border:1px solid rgba(0,255,136,.5); border-radius:8px; padding:9px 22px; font-size:21px; font-weight:700; color:#00FF88; margin-top:22px; letter-spacing:.06em; animation:scaleIn .5s ease .4s both; }
</style></head><body>
<div class="slide">
<img class="bg" src="${u}" />
<div class="ov" style="background:linear-gradient(to bottom,rgba(0,0,0,.72) 0%,rgba(0,5,20,.92) 100%);"></div>
<div class="brand">INEMA</div><div class="num">10 / 10</div>
<div class="c">
  <div class="top">Aprenda a tomar as decisões certas<br>no novo jogo competitivo.</div>
  <div class="bu">INEMA<span>.CLUB</span></div>
  <div class="tl">Trilha completa &nbsp;·&nbsp; 100% gratuita</div>
  <div class="btn">▶&nbsp; Comece agora</div>
  <div class="fb">✓ Sem cartão · Sem truques · Acesso imediato</div>
</div>
</div></body></html>`
  }
];

async function render() {
  const browser = await chromium.launch();
  const results = [];

  for (const slide of slides) {
    const htmlFile = path.join(OUTPUT_DIR, `${PREFIX}_carousel_${slide.id}.html`);
    const pngFile = path.join(OUTPUT_DIR, `${PREFIX}_carousel_${slide.id}.png`);

    const html = slide.html(imgUrl(slide.imgIndex));
    fs.writeFileSync(htmlFile, html, 'utf8');

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.goto(`file://${htmlFile}`);
    await page.waitForTimeout(900);
    await page.screenshot({ path: pngFile });
    await page.close();

    console.log(`✓ Rendered slide ${slide.id} → ${path.basename(pngFile)}`);
    results.push({
      slide: slide.id,
      filename: path.basename(pngFile),
      html: path.basename(htmlFile),
      image_source: `${PREFIX}_generated_${String(slide.imgIndex).padStart(2,'0')}_carousel_1080x1080.jpg`
    });
  }

  await browser.close();

  const layout = {
    campaign: PREFIX,
    date: '2026-04-21',
    format: 'carousel',
    dimensions: '1080x1080',
    total_slides: slides.length,
    platforms: ['instagram', 'youtube', 'threads'],
    visual_style: 'editorial dark, clean, bold typography, data-driven',
    color_palette: { primary: '#0D0D0D', accent_blue: '#0099FF', accent_green: '#00FF88' },
    font: 'Space Grotesk',
    copy_source: 'narrative.json → carousel_texts + headlines + approved_ctas',
    brand_url: 'INEMA.CLUB',
    slides: results
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'layout.json'), JSON.stringify(layout, null, 2));
  console.log('\n✅ All 10 slides rendered. layout.json saved.');
}

render().catch(console.error);
