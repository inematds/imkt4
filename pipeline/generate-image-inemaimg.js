/**
 * inemaimg — local multi-model image server
 *
 * Hits a FastAPI server we run on the same host (default http://localhost:8000)
 * which hot-swaps between Qwen-Image-Edit-2511, FLUX.2-klein, FLUX.2-dev and
 * ERNIE. See ~/projetos/inemaimg for the server and MODELOS.md for the
 * license matrix (FLUX.2 models are non-commercial — only use those when
 * you're okay with that constraint).
 *
 * Usage (CLI):
 *   node pipeline/generate-image-inemaimg.js <output.png> "<prompt>" [model] [aspect_ratio]
 *
 * Models:
 *   flux2-klein     — step-distilled, 4 steps, fastest (non-commercial)
 *   qwen-edit-2511  — 40 steps, edit-capable, Apache 2.0 (commercial OK)
 *   ernie           — 50 steps, pure T2I, open license
 *   flux2-dev       — 28 steps, premium quality, 4-bit (non-commercial)
 *
 * Aspect ratios:
 *   1:1, 9:16, 16:9, 4:3, 3:4
 *
 * Environment:
 *   INEMAIMG_URL       — base URL of the server (default http://localhost:8000)
 *   INEMAIMG_MODEL     — default model id (default flux2-klein)
 *   INEMAIMG_TIMEOUT_S — HTTP timeout in seconds (default 1800 = 30 min,
 *                        big because cold starts download 35+ GB and the
 *                        server blocks until the pipe is warm)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { getEnv } = require('../config/env');

const BASE_URL = getEnv('INEMAIMG_URL', 'http://localhost:8000');
const DEFAULT_MODEL = getEnv('INEMAIMG_MODEL', 'flux2-klein');
const TIMEOUT_MS = parseInt(getEnv('INEMAIMG_TIMEOUT_S', '1800'), 10) * 1000;

// FAST MODE defaults — small resolution + low step counts so iteration is
// cheap. Override via INEMAIMG_QUALITY=high (or tweak the body in
// generateImage) when you want final-quality output.
//
// The inemaimg server works with multiples of 64. 512² runs in roughly
// 1/4 the time of 1024² on the GB10 host; 768² is the usual sweet spot
// when quality matters but you still want sub-minute iteration.
const FAST = (getEnv('INEMAIMG_QUALITY', 'fast') || 'fast').toLowerCase() !== 'high';

const ASPECT_RATIO_SIZES_FAST = {
  '1:1':  { width: 512, height: 512 },
  '9:16': { width: 512, height: 896 },
  '16:9': { width: 896, height: 512 },
  '4:3':  { width: 640, height: 448 },
  '3:4':  { width: 448, height: 640 },
};
const ASPECT_RATIO_SIZES_HIGH = {
  '1:1':  { width: 1024, height: 1024 },
  '9:16': { width: 1024, height: 1536 },
  '16:9': { width: 1536, height: 1024 },
  '4:3':  { width: 1216, height: 896  },
  '3:4':  { width: 896,  height: 1216 },
};
const ASPECT_RATIO_SIZES = FAST ? ASPECT_RATIO_SIZES_FAST : ASPECT_RATIO_SIZES_HIGH;

const AVAILABLE_MODELS = [
  { id: 'flux2-klein',    label: 'FLUX.2 klein (4 steps, mais rápido, non-commercial)' },
  { id: 'qwen-edit-2511', label: 'Qwen Image Edit 2511 (Apache 2.0)' },
  { id: 'ernie',          label: 'ERNIE-Image (T2I puro, open)' },
  { id: 'flux2-dev',      label: 'FLUX.2 dev 4-bit (premium, non-commercial)' },
];

// Per-model defaults. FAST column is tuned for iteration — drops the step
// count to the minimum that still produces something coherent. HIGH is the
// recommended value from each model's docs.
const MODEL_DEFAULTS_FAST = {
  'flux2-klein':    { steps: 4,  guidance_scale: 1.0 }, // klein is step-distilled, 4 is already min
  'qwen-edit-2511': { steps: 15, true_cfg_scale: 3.5 },
  'ernie':          { steps: 20, guidance_scale: 3.5 },
  'flux2-dev':      { steps: 10, guidance_scale: 3.5 },
};
const MODEL_DEFAULTS_HIGH = {
  'flux2-klein':    { steps: 4,  guidance_scale: 1.0 },
  'qwen-edit-2511': { steps: 40, true_cfg_scale: 4.0 },
  'ernie':          { steps: 50, guidance_scale: 4.0 },
  'flux2-dev':      { steps: 28, guidance_scale: 4.0 },
};
const MODEL_DEFAULTS = FAST ? MODEL_DEFAULTS_FAST : MODEL_DEFAULTS_HIGH;

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const protocol = u.protocol === 'https:' ? https : http;
    const payload = JSON.stringify(body);
    const req = protocol.request({
      method: 'POST',
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + u.search,
      headers: {
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload),
      },
      timeout: TIMEOUT_MS,
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const text = buf.toString('utf8');
        let parsed = null;
        try { parsed = JSON.parse(text); } catch { /* non-JSON error page */ }
        if (res.statusCode >= 200 && res.statusCode < 300 && parsed) {
          resolve(parsed);
        } else {
          const detail = (parsed && parsed.detail) || text.slice(0, 400);
          reject(new Error(`inemaimg HTTP ${res.statusCode}: ${detail}`));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error(`inemaimg timeout after ${TIMEOUT_MS / 1000}s`)); });
    req.write(payload);
    req.end();
  });
}

async function getHealth() {
  return new Promise((resolve, reject) => {
    const u = new URL(`${BASE_URL}/health`);
    const protocol = u.protocol === 'https:' ? https : http;
    protocol.get(u, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function generateImage(outputPath, prompt, model = DEFAULT_MODEL, aspectRatio = '1:1', referenceImages = []) {
  const size = ASPECT_RATIO_SIZES[aspectRatio] || ASPECT_RATIO_SIZES['1:1'];
  const defaults = MODEL_DEFAULTS[model] || {};

  // Encode reference images as base64 (flux2-klein accepts up to 3)
  const images = [];
  for (const refPath of (referenceImages || []).slice(0, 3)) {
    if (!refPath) continue;
    const abs = path.isAbsolute(refPath) ? refPath : path.resolve(refPath);
    if (fs.existsSync(abs)) {
      images.push(fs.readFileSync(abs).toString('base64'));
    } else {
      console.log(`[inemaimg] warning: reference image not found: ${abs}`);
    }
  }

  const body = {
    model,
    prompt,
    width: size.width,
    height: size.height,
    seed: Math.floor(Math.random() * 9999999),
    ...defaults,
    ...(images.length > 0 ? { images } : {}),
  };

  const refLabel = images.length > 0 ? ` refs=${images.length}` : '';
  console.log(`[inemaimg] model=${model} quality=${FAST ? 'fast' : 'high'} ratio=${aspectRatio} (${size.width}x${size.height}) steps=${body.steps}${refLabel}`);
  console.log(`[inemaimg] prompt: ${prompt.slice(0, 120)}...`);

  const t0 = Date.now();
  const result = await postJson(`${BASE_URL}/generate`, body);
  const wall = ((Date.now() - t0) / 1000).toFixed(1);

  if (!result.image) {
    throw new Error(`inemaimg returned no image field: ${JSON.stringify(result).slice(0, 200)}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(result.image, 'base64'));

  console.log(
    `[inemaimg] ✅ saved: ${outputPath}  ` +
    `(server=${result.generation_time_s}s wall=${wall}s vram=${result.gpu_memory_allocated_gb}GB)`
  );
  return outputPath;
}

// CLI mode
if (require.main === module) {
  const [, , outputArg, promptArg, modelArg, ratioArg = '1:1'] = process.argv;
  if (!outputArg || !promptArg) {
    console.error('Usage: node pipeline/generate-image-inemaimg.js <output.png> "<prompt>" [model] [aspect_ratio]');
    console.error('\nAvailable models:');
    AVAILABLE_MODELS.forEach(m => console.error(`  ${m.id} — ${m.label}`));
    console.error(`\nDefault: ${DEFAULT_MODEL}`);
    console.error(`Server:  ${BASE_URL}`);
    console.error('\nTip: before a big run, hit the health endpoint to see prewarm_status.');
    process.exit(1);
  }
  (async () => {
    try {
      const h = await getHealth();
      console.log(`[inemaimg] health: loaded=${h.loaded_model} prewarm=${h.prewarm_status} vram=${h.gpu_memory_allocated_gb}GB`);
    } catch (e) {
      console.error(`[inemaimg] health check failed: ${e.message}`);
      console.error(`[inemaimg] is the server at ${BASE_URL} up?`);
      process.exit(2);
    }
    await generateImage(outputArg, promptArg, modelArg || DEFAULT_MODEL, ratioArg);
  })().catch((e) => {
    console.error(`❌ ${e.message}`);
    process.exit(1);
  });
}

module.exports = { generateImage, AVAILABLE_MODELS, DEFAULT_MODEL, BASE_URL, getHealth };
