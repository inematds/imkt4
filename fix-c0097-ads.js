/**
 * One-off: re-renderiza os 10 ads PNG quebrados de c0097 com Playwright robusto.
 * Aplica o mesmo fix que vai pro pipeline (waitUntil networkidle + img decode wait).
 */

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ADS_DIR = path.resolve(__dirname, 'prj/inema/outputs/c0097-dia_das_maes_2026/ads');

// Carousels com img quebrada (PNG ~100KB) — confirmado por inspeção
const BROKEN = [1, 2, 4, 5, 6, 10, 12, 13, 14, 15];

(async () => {
  const browser = await chromium.launch();
  for (const n of BROKEN) {
    const num = String(n).padStart(2, '0');
    const html = path.join(ADS_DIR, `c0097-dia_das_maes_2026_carousel_${num}.html`);
    const png = path.join(ADS_DIR, `c0097-dia_das_maes_2026_carousel_${num}.png`);
    if (!fs.existsSync(html)) { console.error(`! ${html} não existe`); continue; }

    const before = fs.existsSync(png) ? fs.statSync(png).size : 0;

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.goto('file://' + html, { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(
      [...document.images].map((img) => (img.complete && img.naturalWidth > 0)
        ? null
        : new Promise((r) => { img.onload = img.onerror = r; }))
    ));
    await page.waitForTimeout(200);
    await page.screenshot({ path: png });
    await page.close();

    const after = fs.statSync(png).size;
    const delta = after > before * 1.5 ? '✅ FIXED' : (after > before ? '↗ maior' : '⚠ ainda pequeno');
    console.log(`carousel_${num}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB ${delta}`);
  }
  await browser.close();
  console.log('done');
})();
