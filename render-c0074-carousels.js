#!/usr/bin/env node
'use strict';

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ADS_DIR = '/home/nmaldaner/projetos/timesmkt3/prj/inema/outputs/c0074-claude_opus_47/ads';
const IMGS_DIR = '/home/nmaldaner/projetos/timesmkt3/prj/inema/outputs/c0074-claude_opus_47/imgs';
const PREFIX = 'c0074-claude_opus_47';

fs.mkdirSync(ADS_DIR, { recursive: true });

const img = (n) => `file://${IMGS_DIR}/${PREFIX}_generated_${n}_carousel_1080x1080.jpg`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

const BASE_CSS = `* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1080px; height:1080px; overflow:hidden; }
body { font-family:'Space Grotesk','Helvetica Neue',Arial,sans-serif; background:#0D0D0D; color:#FFF; }`;

const html = (extraCss, body) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8">${FONTS}
<style>${BASE_CSS}${extraCss}</style></head>
<body>${body}</body></html>`;

// ─── Slide definitions ──────────────────────────────────────────────────────

const slides = [

// ─── 01 · HOOK ──────────────────────────────────────────────────────────────
{
  id: '01',
  concept: 'Hook — A IA que a Anthropic decidiu não liberar',
  headline: 'A IA que a Anthropic decidiu não liberar',
  copy_source: 'headlines[0]',
  images_used: [img(16)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(16)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.82) contrast(1.1) saturate(1.2);">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 20%,rgba(0,0,0,0.65) 100%);"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.25) 50%,rgba(0,0,0,0.55) 100%);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <!-- TOP -->
        <div>
          <div style="display:inline-block;background:rgba(0,153,255,0.18);border:1.5px solid #0099FF;color:#0099FF;font-size:21px;font-weight:700;letter-spacing:0.16em;padding:10px 26px;border-radius:4px;text-transform:uppercase;margin-bottom:44px;">LABORATÓRIO SECRETO</div>
          <h1 style="font-size:106px;font-weight:800;line-height:1.0;letter-spacing:-0.025em;color:#FFF;text-shadow:0 4px 32px rgba(0,0,0,0.85),0 0 60px rgba(0,0,0,0.4);max-width:940px;">
            A IA que a<br>
            <span style="color:#0099FF;">Anthropic</span><br>
            decidiu <span style="color:#00FF88;">não liberar</span>
          </h1>
        </div>
        <!-- BOTTOM -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;">
          <div style="font-size:30px;font-weight:500;color:rgba(255,255,255,0.8);letter-spacing:0.04em;text-shadow:0 2px 8px rgba(0,0,0,0.8);">Deslize para entender →</div>
          <div style="font-size:22px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;font-weight:400;">01 / 15</div>
        </div>
      </div>
    </div>
  `)
},

// ─── 02 · REVELAÇÃO ─────────────────────────────────────────────────────────
{
  id: '02',
  concept: 'Revelação — Mythos Preview existe mas não será liberado',
  headline: 'A Anthropic tem um modelo mais avançado que o Opus 4.7',
  copy_source: 'carousel_texts[0]',
  images_used: [img(18)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(18)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.68) contrast(1.12) saturate(1.1);">
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.38) 50%,rgba(0,0,0,0.72) 100%);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;letter-spacing:0.2em;color:#0099FF;text-transform:uppercase;margin-bottom:32px;">A REVELAÇÃO</div>
          <h1 style="font-size:72px;font-weight:800;line-height:1.08;color:#FFF;text-shadow:0 4px 24px rgba(0,0,0,0.85);max-width:960px;">
            A Anthropic tem um modelo<br><span style="color:#0099FF;">mais avançado</span><br>que o Opus 4.7.
          </h1>
        </div>
        <div>
          <p style="font-size:52px;font-weight:700;color:#FFF;text-shadow:0 2px 16px rgba(0,0,0,0.8);margin-bottom:20px;">Não vai te dar acesso.</p>
          <div style="width:80px;height:3px;background:linear-gradient(90deg,#0099FF,#00FF88);margin-bottom:24px;border-radius:2px;"></div>
          <p style="font-size:38px;font-weight:500;color:rgba(255,255,255,0.78);text-shadow:0 2px 8px rgba(0,0,0,0.7);line-height:1.35;">Isso importa mais que qualquer benchmark.</p>
          <div style="margin-top:40px;font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">02 / 15</div>
        </div>
      </div>
    </div>
  `)
},

// ─── 03 · POSICIONAMENTO (split) ─────────────────────────────────────────────
{
  id: '03',
  concept: 'Posicionamento — Não o mais poderoso, o mais responsável',
  headline: 'Não é o mais poderoso. É o mais responsável.',
  copy_source: 'headlines[2]',
  images_used: [img(20)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;display:flex;">
      <!-- LEFT: solid dark -->
      <div style="width:510px;height:1080px;background:#0D0D0D;padding:72px 56px;display:flex;flex-direction:column;justify-content:center;z-index:2;position:relative;">
        <div style="font-size:19px;font-weight:700;letter-spacing:0.18em;color:#00FF88;text-transform:uppercase;margin-bottom:36px;">POSICIONAMENTO</div>
        <p style="font-size:74px;font-weight:800;line-height:1.05;color:#FFF;letter-spacing:-0.02em;margin-bottom:0;">Não é o mais poderoso.</p>
        <div style="width:72px;height:4px;background:linear-gradient(90deg,#0099FF,#00FF88);margin:32px 0;border-radius:2px;"></div>
        <p style="font-size:74px;font-weight:800;line-height:1.05;color:#00FF88;letter-spacing:-0.02em;">É o mais responsável.</p>
        <div style="margin-top:auto;padding-top:48px;font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">03 / 15</div>
      </div>
      <!-- RIGHT: image -->
      <div style="width:570px;height:1080px;position:relative;overflow:hidden;">
        <img src="${img(20)}" style="width:100%;height:100%;object-fit:cover;filter:brightness(0.82) contrast(1.1) saturate(1.2);">
        <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(13,13,13,0.7) 0%,transparent 45%);"></div>
      </div>
    </div>
  `)
},

// ─── 04 · LABORATÓRIO SECRETO (centrado, dramático) ─────────────────────────
{
  id: '04',
  concept: 'Tema central — O laboratório secreto da Anthropic',
  headline: 'O laboratório secreto da Anthropic',
  copy_source: 'headlines[3]',
  images_used: [img(21)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(21)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.55) contrast(1.22) saturate(1.1);">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.55);"></div>
      <!-- corner brackets -->
      <div style="position:absolute;top:52px;left:52px;width:44px;height:44px;border-top:3px solid #0099FF;border-left:3px solid #0099FF;border-radius:2px 0 0 0;"></div>
      <div style="position:absolute;top:52px;right:52px;width:44px;height:44px;border-top:3px solid #0099FF;border-right:3px solid #0099FF;border-radius:0 2px 0 0;"></div>
      <div style="position:absolute;bottom:52px;left:52px;width:44px;height:44px;border-bottom:3px solid #0099FF;border-left:3px solid #0099FF;border-radius:0 0 0 2px;"></div>
      <div style="position:absolute;bottom:52px;right:52px;width:44px;height:44px;border-bottom:3px solid #0099FF;border-right:3px solid #0099FF;border-radius:0 0 2px 0;"></div>
      <!-- subtle border -->
      <div style="position:absolute;inset:52px;border:1.5px solid rgba(0,153,255,0.22);border-radius:2px;pointer-events:none;"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:110px;">
        <div style="font-size:18px;font-weight:700;letter-spacing:0.26em;color:#0099FF;text-transform:uppercase;margin-bottom:28px;">CAMPANHA C0074</div>
        <h1 style="font-size:112px;font-weight:800;line-height:0.95;letter-spacing:-0.025em;color:#FFF;text-shadow:0 0 80px rgba(0,153,255,0.35),0 4px 40px rgba(0,0,0,0.95);margin-bottom:20px;">
          O LABORATÓRIO<br><span style="color:#0099FF;">SECRETO</span>
        </h1>
        <p style="font-size:54px;font-weight:500;color:rgba(255,255,255,0.68);text-shadow:0 2px 12px rgba(0,0,0,0.8);letter-spacing:0.08em;">da Anthropic</p>
        <div style="width:100px;height:3px;background:linear-gradient(90deg,transparent,#00FF88,transparent);margin-top:52px;"></div>
      </div>
      <div style="position:absolute;bottom:80px;right:100px;font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;z-index:3;">04 / 15</div>
    </div>
  `)
},

// ─── 05 · MODELO PONTE — benefícios ─────────────────────────────────────────
{
  id: '05',
  concept: 'Modelo ponte — benefícios reais, não hype',
  headline: 'O Opus 4.7 é o modelo ponte. Melhorias reais.',
  copy_source: 'carousel_texts[1]',
  images_used: [img(23)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(23)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.62) contrast(1.1) saturate(1.2);">
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.45) 38%,rgba(13,13,13,0.92) 68%,#0D0D0D 100%);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;letter-spacing:0.16em;color:#00FF88;text-transform:uppercase;margin-bottom:24px;">MODELO PONTE</div>
          <h2 style="font-size:72px;font-weight:800;line-height:1.05;color:#FFF;text-shadow:0 4px 24px rgba(0,0,0,0.85);">O Opus 4.7<br>é o modelo ponte.</h2>
        </div>
        <div>
          <p style="font-size:40px;font-weight:600;color:rgba(255,255,255,0.8);margin-bottom:28px;">Melhorias reais — não hype:</p>
          <div style="display:flex;flex-direction:column;gap:22px;">
            ${['Memória em sessões longas','Visão avançada','Código mais preciso','Melhor em finanças e direito'].map(it=>`
              <div style="display:flex;align-items:center;gap:22px;">
                <div style="width:10px;height:10px;background:#00FF88;border-radius:50%;flex-shrink:0;"></div>
                <span style="font-size:40px;font-weight:600;color:#FFF;text-shadow:0 2px 8px rgba(0,0,0,0.6);">${it}</span>
              </div>`).join('')}
          </div>
          <div style="margin-top:36px;font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">05 / 15</div>
        </div>
      </div>
    </div>
  `)
},

// ─── 06 · MEMÓRIA ───────────────────────────────────────────────────────────
{
  id: '06',
  concept: 'Feature — Memória em sessões longas',
  headline: 'Memória em sessões longas',
  copy_source: 'key_phrases[4]',
  images_used: [img(25)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(25)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.74) contrast(1.1) saturate(1.2);">
      <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,153,255,0.12) 0%,rgba(0,0,0,0.78) 55%,rgba(0,255,136,0.08) 100%);"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.22) 50%,rgba(0,0,0,0.52) 100%);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="display:flex;align-items:center;gap:18px;margin-bottom:38px;">
            <div style="width:52px;height:3px;background:#0099FF;border-radius:2px;"></div>
            <span style="font-size:20px;font-weight:700;letter-spacing:0.16em;color:#0099FF;text-transform:uppercase;">NOVA CAPACIDADE</span>
          </div>
          <h1 style="font-size:100px;font-weight:800;line-height:1.0;letter-spacing:-0.025em;color:#FFF;text-shadow:0 4px 32px rgba(0,0,0,0.85);max-width:940px;">
            Memória em<br><span style="color:#00FF88;">sessões longas</span>
          </h1>
        </div>
        <div>
          <p style="font-size:44px;font-weight:500;line-height:1.35;color:rgba(255,255,255,0.85);text-shadow:0 2px 12px rgba(0,0,0,0.72);max-width:900px;">O modelo que finalmente lembra<br>o que você pediu 3 sessões atrás.</p>
          <div style="margin-top:40px;font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">06 / 15</div>
        </div>
      </div>
    </div>
  `)
},

// ─── 07 · CÓDIGO + VISÃO (glassmorphism cards) ──────────────────────────────
{
  id: '07',
  concept: 'Features — Código mais preciso e visão avançada',
  headline: 'Duas melhorias que mudam o fluxo',
  copy_source: 'carousel_texts[1]',
  images_used: [img(26)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(26)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.68) contrast(1.1) saturate(1.1);">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.58);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;letter-spacing:0.16em;color:#0099FF;text-transform:uppercase;margin-bottom:28px;">OPUS 4.7 — CAPACIDADES</div>
          <h2 style="font-size:80px;font-weight:800;line-height:1.05;color:#FFF;text-shadow:0 4px 24px rgba(0,0,0,0.85);">Duas melhorias<br>que mudam o fluxo.</h2>
        </div>
        <div style="display:flex;gap:24px;">
          <div style="flex:1;background:rgba(0,153,255,0.15);backdrop-filter:blur(12px);border:1px solid rgba(0,153,255,0.42);border-radius:16px;padding:40px 34px;">
            <div style="font-size:46px;margin-bottom:14px;">⚡</div>
            <div style="font-size:36px;font-weight:700;color:#0099FF;margin-bottom:12px;line-height:1.1;">CÓDIGO<br>MAIS PRECISO</div>
            <div style="font-size:26px;color:rgba(255,255,255,0.72);line-height:1.4;">Menos alucinações. Mais confiabilidade em agentic coding.</div>
          </div>
          <div style="flex:1;background:rgba(0,255,136,0.1);backdrop-filter:blur(12px);border:1px solid rgba(0,255,136,0.32);border-radius:16px;padding:40px 34px;">
            <div style="font-size:46px;margin-bottom:14px;">🌐</div>
            <div style="font-size:36px;font-weight:700;color:#00FF88;margin-bottom:12px;line-height:1.1;">VISÃO<br>AVANÇADA</div>
            <div style="font-size:26px;color:rgba(255,255,255,0.72);line-height:1.4;">Análise de imagens mais sofisticada que o Claude 4.6.</div>
          </div>
        </div>
        <div style="font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">07 / 15</div>
      </div>
    </div>
  `)
},

// ─── 08 · CUSTO OCULTO (amber warning) ──────────────────────────────────────
{
  id: '08',
  concept: 'Aviso de custo — tokenizer novo pode encarecer na prática',
  headline: 'Mesmo preço por token. Mas cuidado.',
  copy_source: 'carousel_texts[2]',
  images_used: [img(28)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(28)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.58) contrast(1.2) saturate(0.88);">
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.48) 45%,rgba(0,0,0,0.88) 100%);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="display:inline-flex;align-items:center;gap:12px;background:rgba(255,165,0,0.14);border:1.5px solid rgba(255,165,0,0.52);padding:10px 26px;border-radius:6px;margin-bottom:32px;">
            <span style="font-size:22px;">💡</span>
            <span style="font-size:20px;font-weight:700;letter-spacing:0.13em;color:#FFA500;text-transform:uppercase;">ATENÇÃO — CUSTO OCULTO</span>
          </div>
          <h2 style="font-size:76px;font-weight:800;line-height:1.05;color:#FFF;text-shadow:0 4px 24px rgba(0,0,0,0.88);">Mesmo preço<br>por token que o 4.6.</h2>
        </div>
        <div>
          <p style="font-size:46px;font-weight:600;color:rgba(255,255,255,0.85);line-height:1.3;margin-bottom:20px;text-shadow:0 2px 8px rgba(0,0,0,0.72);">Mas atenção:</p>
          <p style="font-size:42px;font-weight:500;color:rgba(255,255,255,0.78);line-height:1.42;text-shadow:0 2px 8px rgba(0,0,0,0.65);">
            tokenizer novo + mais raciocínio<br>
            <span style="color:#FFA500;font-weight:700;">= pode sair mais caro na prática</span>
          </p>
          <div style="margin-top:36px;font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">08 / 15</div>
        </div>
      </div>
    </div>
  `)
},

// ─── 09 · PONTE (dois estados) ──────────────────────────────────────────────
{
  id: '09',
  concept: 'Metáfora da ponte — entre o presente e o futuro da IA',
  headline: 'A ponte entre o presente e o futuro da IA',
  copy_source: 'headlines[6] + key_phrases[1]',
  images_used: [img(29)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(29)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.74) contrast(1.1) saturate(1.3);">
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.18) 50%,rgba(0,0,0,0.72) 100%);"></div>
      <div style="position:absolute;top:50%;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,rgba(0,153,255,0.45),rgba(0,255,136,0.45),transparent);transform:translateY(-50%);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;letter-spacing:0.2em;color:#00FF88;text-transform:uppercase;margin-bottom:24px;">A PONTE</div>
          <h1 style="font-size:92px;font-weight:800;line-height:1.0;letter-spacing:-0.025em;color:#FFF;text-shadow:0 4px 32px rgba(0,0,0,0.88);max-width:960px;">
            Entre o presente<br>e o futuro da <span style="color:#0099FF;">IA</span>
          </h1>
        </div>
        <div>
          <div style="display:flex;align-items:stretch;gap:0;margin-bottom:36px;">
            <div style="flex:1;background:rgba(0,153,255,0.14);border:1px solid rgba(0,153,255,0.34);border-radius:12px 0 0 12px;padding:26px 30px;">
              <div style="font-size:22px;font-weight:700;color:#0099FF;letter-spacing:0.1em;margin-bottom:10px;">HOJE</div>
              <div style="font-size:34px;font-weight:700;color:#FFF;margin-bottom:6px;">Opus 4.7</div>
              <div style="font-size:24px;color:rgba(255,255,255,0.62);">Disponível. Testado. Seguro.</div>
            </div>
            <div style="display:flex;align-items:center;padding:0 20px;font-size:42px;color:#00FF88;font-weight:800;">→</div>
            <div style="flex:1;background:rgba(0,255,136,0.09);border:1px solid rgba(0,255,136,0.22);border-radius:0 12px 12px 0;padding:26px 30px;opacity:0.78;">
              <div style="font-size:22px;font-weight:700;color:#00FF88;letter-spacing:0.1em;margin-bottom:10px;">EM BREVE</div>
              <div style="font-size:34px;font-weight:700;color:#FFF;margin-bottom:6px;">Mythos Preview</div>
              <div style="font-size:24px;color:rgba(255,255,255,0.62);">Retido. Aguardando aprovação.</div>
            </div>
          </div>
          <div style="font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">09 / 15</div>
        </div>
      </div>
    </div>
  `)
},

// ─── 10 · FILOSOFIA (split invertido) ───────────────────────────────────────
{
  id: '10',
  concept: 'Filosofia — Segurança não é limitação, é engenharia',
  headline: 'Segurança não é limitação — é engenharia',
  copy_source: 'headlines[7]',
  images_used: [img(16)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;display:flex;">
      <!-- LEFT: image -->
      <div style="width:530px;height:1080px;position:relative;overflow:hidden;">
        <img src="${img(16)}" style="width:100%;height:100%;object-fit:cover;filter:brightness(0.68) contrast(1.1) saturate(1.0);">
        <div style="position:absolute;inset:0;background:linear-gradient(to right,transparent 55%,#0D0D0D 100%);"></div>
      </div>
      <!-- RIGHT: solid dark -->
      <div style="width:550px;height:1080px;background:#0D0D0D;padding:72px 60px;display:flex;flex-direction:column;justify-content:center;z-index:2;">
        <div style="font-size:19px;font-weight:700;letter-spacing:0.18em;color:#0099FF;text-transform:uppercase;margin-bottom:32px;">FILOSOFIA</div>
        <h2 style="font-size:68px;font-weight:800;line-height:1.06;color:#FFF;margin-bottom:32px;">
          Segurança não é<br><span style="color:#00FF88;">limitação.</span>
        </h2>
        <div style="width:64px;height:3.5px;background:linear-gradient(90deg,#0099FF,#00FF88);margin-bottom:32px;border-radius:2px;"></div>
        <h2 style="font-size:68px;font-weight:800;line-height:1.06;color:#FFF;">
          É <span style="color:#0099FF;">engenharia</span><br>de responsabilidade.
        </h2>
        <div style="margin-top:auto;padding-top:48px;font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">10 / 15</div>
      </div>
    </div>
  `)
},

// ─── 11 · DIFERENCIAÇÃO INEMA ───────────────────────────────────────────────
{
  id: '11',
  concept: 'Diferenciação — INEMA explica a filosofia por trás',
  headline: 'Enquanto outros recebem o update — a INEMA explica a filosofia',
  copy_source: 'carousel_texts[3]',
  images_used: [img(18)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(18)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.48) contrast(1.22) saturate(0.78);">
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(26,26,46,0.96) 0%,rgba(26,26,46,0.68) 50%,rgba(0,0,0,0.92) 100%);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;letter-spacing:0.16em;color:#0099FF;text-transform:uppercase;margin-bottom:28px;">DIFERENCIAÇÃO</div>
          <h2 style="font-size:72px;font-weight:800;line-height:1.05;color:#FFF;text-shadow:0 4px 24px rgba(0,0,0,0.88);">Enquanto outros<br>recebem o update —</h2>
        </div>
        <div>
          <p style="font-size:58px;font-weight:800;line-height:1.1;color:#FFF;margin-bottom:22px;">
            a <span style="color:#0099FF;">INEMA</span> explica<br>a filosofia por trás.
          </p>
          <div style="width:80px;height:3px;background:linear-gradient(90deg,#0099FF,#00FF88);margin-bottom:26px;border-radius:2px;"></div>
          <p style="font-size:34px;font-weight:500;color:rgba(255,255,255,0.72);line-height:1.42;">Porque entender o modelo<br>vale mais que apenas usá-lo.</p>
          <div style="margin-top:36px;font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">11 / 15</div>
        </div>
      </div>
    </div>
  `)
},

// ─── 12 · O PLANO (timeline) ─────────────────────────────────────────────────
{
  id: '12',
  concept: 'O plano — Mythos retido, Opus 4.7 aprende os limites',
  headline: 'O Mythos Preview existe. A Anthropic o retém.',
  copy_source: 'carousel_texts[4]',
  images_used: [img(20)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(20)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.52) contrast(1.22) saturate(0.88);">
      <div style="position:absolute;inset:0;background:rgba(13,13,13,0.74);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;letter-spacing:0.18em;color:#00FF88;text-transform:uppercase;margin-bottom:28px;">O PLANO</div>
          <h2 style="font-size:68px;font-weight:800;line-height:1.05;color:#FFF;text-shadow:0 4px 24px rgba(0,0,0,0.88);max-width:960px;">
            O Mythos Preview existe.<br>A Anthropic o retém.
          </h2>
        </div>
        <div>
          <div style="display:flex;flex-direction:column;gap:22px;margin-bottom:34px;">
            ${[
              {n:1, text:'O Mythos Preview existe', c:'rgba(255,255,255,0.48)', bg:'rgba(255,255,255,0.12)', fg:'rgba(255,255,255,0.55)'},
              {n:2, text:'A Anthropic o retém deliberadamente', c:'rgba(255,255,255,0.62)', bg:'rgba(255,255,255,0.14)', fg:'rgba(255,255,255,0.65)'},
              {n:3, text:'O Opus 4.7 aprende os limites', c:'rgba(0,153,255,0.95)', bg:'rgba(0,153,255,0.22)', fg:'#1a1a1a'},
              {n:4, text:'Esse é o plano. E é sábio.', c:'#00FF88', bg:'rgba(0,255,136,0.18)', fg:'#0D0D0D'},
            ].map(s=>`
              <div style="display:flex;align-items:center;gap:22px;">
                <div style="width:38px;height:38px;border-radius:50%;background:${s.bg};border:1.5px solid ${s.c};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:17px;font-weight:700;color:${s.c};">${s.n}</div>
                <span style="font-size:36px;font-weight:${s.n>=3?700:500};color:${s.c};">${s.text}</span>
              </div>`).join('')}
          </div>
          <div style="font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">12 / 15</div>
        </div>
      </div>
    </div>
  `)
},

// ─── 13 · NINGUÉM EXPLICA ───────────────────────────────────────────────────
{
  id: '13',
  concept: 'Intriga — O que ninguém está explicando sobre o Opus 4.7',
  headline: 'O que ninguém está explicando sobre o Opus 4.7',
  copy_source: 'headlines[8]',
  images_used: [img(21)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(21)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.38) contrast(1.32) saturate(0.68);">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.65);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:82px;display:flex;flex-direction:column;justify-content:center;">
        <div style="font-size:20px;font-weight:700;letter-spacing:0.2em;color:#0099FF;text-transform:uppercase;margin-bottom:32px;">EXCLUSIVO — PT-BR</div>
        <h1 style="font-size:86px;font-weight:800;line-height:1.0;letter-spacing:-0.022em;color:#FFF;text-shadow:0 0 80px rgba(0,153,255,0.28),0 4px 32px rgba(0,0,0,0.95);max-width:940px;">
          O que ninguém<br>está explicando<br>sobre o <span style="color:#0099FF;">Opus 4.7</span>
        </h1>
        <div style="width:82px;height:4px;background:linear-gradient(90deg,#0099FF,#00FF88);margin-top:40px;border-radius:2px;"></div>
        <p style="font-size:36px;font-weight:500;color:rgba(255,255,255,0.72);margin-top:28px;line-height:1.42;max-width:800px;text-shadow:0 2px 8px rgba(0,0,0,0.8);">A filosofia por trás do lançamento.<br>Em PT-BR. Com profundidade real.</p>
      </div>
      <div style="position:absolute;bottom:82px;right:82px;font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;z-index:3;">13 / 15</div>
    </div>
  `)
},

// ─── 14 · SALVA O POST ──────────────────────────────────────────────────────
{
  id: '14',
  concept: 'Salva o post — guia de migração 4.6 → 4.7',
  headline: 'Você vai precisar quando for migrar',
  copy_source: 'carousel_texts[5]',
  images_used: [img(23)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(23)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.58) contrast(1.1) saturate(1.0);">
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.44) 50%,rgba(0,0,0,0.88) 100%);"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;letter-spacing:0.16em;color:#FFA500;text-transform:uppercase;margin-bottom:24px;">🔖 SALVA ESSE POST</div>
          <h2 style="font-size:84px;font-weight:800;line-height:1.0;color:#FFF;text-shadow:0 4px 24px rgba(0,0,0,0.88);max-width:960px;">Você vai precisar<br>quando for migrar.</h2>
        </div>
        <div>
          <div style="background:rgba(0,153,255,0.14);backdrop-filter:blur(12px);border:1px solid rgba(0,153,255,0.42);border-radius:16px;padding:36px 40px;margin-bottom:32px;">
            <div style="font-size:30px;font-weight:700;color:#0099FF;margin-bottom:14px;">GUIA COMPLETO</div>
            <div style="font-size:40px;font-weight:700;color:#FFF;line-height:1.2;">Migração <span style="color:#FFA500;">4.6 → 4.7</span></div>
            <div style="font-size:28px;color:rgba(255,255,255,0.68);margin-top:10px;">Em PT-BR. Só na inema.club.</div>
          </div>
          <div style="font-size:22px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;">14 / 15</div>
        </div>
      </div>
    </div>
  `)
},

// ─── 15 · CTA FINAL (INEMA.CLUB hero) ───────────────────────────────────────
{
  id: '15',
  concept: 'CTA Final — INEMA.CLUB como hero text',
  headline: 'INEMA.CLUB — Comece grátis agora',
  copy_source: 'approved_ctas[1] + approved_ctas[5]',
  images_used: [img(25)],
  html: html('', `
    <div style="position:relative;width:1080px;height:1080px;">
      <img src="${img(25)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.48) contrast(1.22) saturate(1.1);">
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.92) 0%,rgba(13,13,46,0.84) 50%,rgba(0,0,0,0.96) 100%);"></div>
      <!-- glow -->
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:640px;height:320px;background:radial-gradient(ellipse,rgba(0,153,255,0.18) 0%,transparent 72%);pointer-events:none;"></div>
      <div style="position:relative;z-index:2;width:100%;height:100%;padding:72px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center;">
        <!-- TOP -->
        <div style="width:100%;">
          <div style="font-size:20px;font-weight:600;letter-spacing:0.2em;color:rgba(255,255,255,0.58);text-transform:uppercase;margin-bottom:24px;">TRILHA COMPLETA</div>
          <p style="font-size:38px;font-weight:500;color:rgba(255,255,255,0.8);line-height:1.32;text-shadow:0 2px 8px rgba(0,0,0,0.8);">Entenda o modelo antes de migrar.<br>Comece agora.</p>
        </div>
        <!-- HERO brand -->
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;">
          <div style="font-size:142px;font-weight:800;letter-spacing:-0.03em;line-height:1.0;text-shadow:0 0 90px rgba(0,153,255,0.48),0 4px 48px rgba(0,0,0,0.95);">
            <span style="color:#0099FF;">INEMA</span><span style="color:#FFF;">.</span><span style="color:#00FF88;">CLUB</span>
          </div>
        </div>
        <!-- CTA button + tagline -->
        <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:24px;">
          <div style="background:rgba(0,153,255,0.92);color:#FFF;font-size:36px;font-weight:700;letter-spacing:0.1em;padding:22px 72px;border-radius:9999px;text-transform:uppercase;box-shadow:0 4px 48px rgba(0,153,255,0.48);">ACESSE GRATUITAMENTE</div>
          <p style="font-size:28px;color:rgba(255,255,255,0.58);font-weight:500;letter-spacing:0.04em;">Trilha completa. 100% gratuita. Sem truques.</p>
        </div>
      </div>
    </div>
  `)
},

]; // end slides


// ─── RENDER ALL ─────────────────────────────────────────────────────────────

(async () => {
  const browser = await chromium.launch();
  console.log(`🎨 Rendering ${slides.length} carousel slides for c0074-claude_opus_47`);

  for (const slide of slides) {
    const htmlFile = path.join(ADS_DIR, `${PREFIX}_carousel_${slide.id}.html`);
    const pngFile  = path.join(ADS_DIR, `${PREFIX}_carousel_${slide.id}.png`);

    fs.writeFileSync(htmlFile, slide.html, 'utf8');

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.goto('file://' + htmlFile);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: pngFile });
    await page.close();

    console.log(`  ✓ Slide ${slide.id} → ${path.basename(pngFile)}`);
  }

  await browser.close();

  // Write layout.json
  const layout = {
    campaign: PREFIX,
    campaign_theme: 'O Laboratório Secreto da Anthropic',
    date: '2026-04-17',
    platform: 'instagram',
    format: 'carousel',
    total_slides: slides.length,
    dimensions: '1080x1080',
    brand_url: 'INEMA.CLUB',
    colors: ['#0099FF', '#00FF88', '#0D0D0D', '#1A1A2E', '#FFFFFF'],
    fonts: ['Space Grotesk', 'Inter'],
    slides: slides.map(s => ({
      slide_number: parseInt(s.id),
      filename: `${PREFIX}_carousel_${s.id}.png`,
      html_source: `${PREFIX}_carousel_${s.id}.html`,
      dimensions: '1080x1080',
      concept: s.concept,
      headline: s.headline,
      copy_source: s.copy_source,
      images_used: s.images_used,
    }))
  };

  fs.writeFileSync(path.join(ADS_DIR, 'layout.json'), JSON.stringify(layout, null, 2));
  console.log('\n✅ All 15 slides rendered. layout.json updated.');
  console.log(`📁 Output: ${ADS_DIR}`);
})();
