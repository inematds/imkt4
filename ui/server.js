#!/usr/bin/env node

const http = require('http');
const net = require('net');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(__dirname, 'public');
const PAYLOAD_DIR = path.join(ROOT, 'pipeline', 'payloads');
const DEFAULTS_PATH = path.join(__dirname, 'config', 'defaults.json');
const CONFIG_PATH = path.join(__dirname, 'config', 'saved.json');
const PROVIDERS_PATH = path.join(__dirname, 'config', 'providers.json');
const HOST = process.env.TIMESMKT_UI_HOST || '0.0.0.0';
const PORT = Number(process.env.TIMESMKT_UI_PORT || process.env.PORT || 5177);
const MAX_RUN_LOG = 160000;

const runs = new Map();

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov']);
const AUDIO_EXT = new Set(['.mp3', '.wav', '.ogg']);
const TEXT_EXT = new Set(['.json', '.md', '.txt', '.log', '.out', '.html', '.css', '.js']);
const ASSET_EXT = new Set([...IMAGE_EXT, ...VIDEO_EXT, ...AUDIO_EXT, ...TEXT_EXT, '.pdf']);

function exists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function readDirSafe(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function statSafe(filePath) {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

function readJsonSafe(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function rel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function safeResolve(root, relPath) {
  const resolved = path.resolve(root, relPath || '.');
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    return null;
  }
  return resolved;
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

function walkFiles(dir, options = {}) {
  const {
    maxDepth = 3,
    limit = 1000,
    includeHidden = false,
    match = null,
  } = options;
  const out = [];
  const root = path.resolve(dir);
  const stack = [{ dir: root, depth: 0 }];

  while (stack.length > 0 && out.length < limit) {
    const current = stack.pop();
    for (const entry of readDirSafe(current.dir)) {
      if (!includeHidden && entry.name.startsWith('.')) continue;
      const fullPath = path.join(current.dir, entry.name);
      if (entry.isDirectory()) {
        if (current.depth < maxDepth) stack.push({ dir: fullPath, depth: current.depth + 1 });
        continue;
      }
      if (!entry.isFile()) continue;
      if (!match || match(fullPath)) out.push(fullPath);
      if (out.length >= limit) break;
    }
  }

  return out.sort((a, b) => a.localeCompare(b));
}

function countFiles(dir, matcher, maxDepth = 2) {
  return walkFiles(dir, { maxDepth, limit: 5000, match: matcher }).length;
}

function findFiles(dir, matcher, limit = 12, maxDepth = 2) {
  return walkFiles(dir, { maxDepth, limit, match: matcher });
}

function fileUrl(filePath) {
  return `/asset?path=${encodeURIComponent(rel(filePath))}`;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.log': 'text/plain; charset=utf-8',
    '.out': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.pdf': 'application/pdf',
  }[ext] || 'application/octet-stream';
}

function getAccessUrls() {
  const urls = [`http://127.0.0.1:${PORT}`];
  const networks = os.networkInterfaces();
  for (const iface of Object.values(networks)) {
    for (const item of iface || []) {
      if (item.family === 'IPv4' && !item.internal) {
        urls.push(`http://${item.address}:${PORT}`);
      }
    }
  }
  return [...new Set(urls)];
}

function sendJson(res, data, status = 200) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(body);
}

function sendText(res, text, status = 200) {
  res.writeHead(status, {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(text);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 2_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function getDefaults() {
  return readJsonSafe(DEFAULTS_PATH, {});
}

function getConfig() {
  const defaults = getDefaults();
  const saved = readJsonSafe(CONFIG_PATH, {});
  return { ...defaults, ...saved };
}

function saveConfig(config) {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);
}

function envHas(key) {
  if (process.env[key]) return true;
  const envPath = path.join(ROOT, '.env');
  try {
    const text = fs.readFileSync(envPath, 'utf8');
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^\\s*${escaped}\\s*=\\s*(?!$|YOUR_|your_)`, 'm').test(text);
  } catch {
    return false;
  }
}

const redisStatus = { ok: false, host: 'localhost', port: 6379, checkedAt: 0 };

function probeRedis() {
  const host = process.env.UPSTASH_REDIS_ENDPOINT || 'localhost';
  const port = 6379;
  redisStatus.host = host;
  redisStatus.port = port;
  return new Promise((resolve) => {
    const sock = net.createConnection({ host, port });
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      redisStatus.ok = ok;
      redisStatus.checkedAt = Date.now();
      try { sock.destroy(); } catch {}
      resolve(ok);
    };
    sock.setTimeout(800);
    sock.once('connect', () => finish(true));
    sock.once('error', () => finish(false));
    sock.once('timeout', () => finish(false));
  });
}

probeRedis();
setInterval(probeRedis, 5000).unref();

let queueRef = null;
function getQueue() {
  if (queueRef) return queueRef;
  try {
    const { Queue } = require('bullmq');
    queueRef = new Queue('ai-content-pipeline-imkt4', {
      connection: {
        host: process.env.UPSTASH_REDIS_ENDPOINT || 'localhost',
        port: 6379,
      },
    });
  } catch (err) {
    return null;
  }
  return queueRef;
}

async function getQueueSnapshot(limit = 20) {
  const queue = getQueue();
  if (!queue || !redisStatus.ok) {
    return { ok: false, error: 'Redis offline ou bullmq indisponível', counts: {}, jobs: { active: [], waiting: [], failed: [], completed: [], delayed: [] } };
  }
  const counts = await queue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed', 'paused');
  const [active, waiting, failed, completed, delayed] = await Promise.all([
    queue.getJobs(['active'], 0, limit, true),
    queue.getJobs(['wait'], 0, limit, true),
    queue.getJobs(['failed'], 0, limit, false),
    queue.getJobs(['completed'], 0, limit, false),
    queue.getJobs(['delayed'], 0, limit, true),
  ]);
  const fmt = (j) => ({
    id: String(j.id),
    name: j.name,
    progress: typeof j.progress === 'number' ? j.progress : 0,
    attempts: j.attemptsMade,
    maxAttempts: j.opts?.attempts ?? 1,
    timestamp: j.timestamp,
    processedOn: j.processedOn || null,
    finishedOn: j.finishedOn || null,
    delay: j.opts?.delay || 0,
    failedReason: j.failedReason || null,
    task_name: j.data?.payload?.task_name || j.data?.task_name || null,
    output_dir: j.data?.payload?.output_dir || j.data?.output_dir || null,
    project_dir: j.data?.payload?.project_dir || j.data?.project_dir || null,
  });
  return {
    ok: true,
    queueName: 'ai-content-pipeline-imkt4',
    redisHost: redisStatus.host,
    counts,
    jobs: {
      active: active.map(fmt),
      waiting: waiting.map(fmt),
      failed: failed.map(fmt),
      completed: completed.map(fmt),
      delayed: delayed.map(fmt),
    },
  };
}

async function queueAction(op, id, statusFilter) {
  const queue = getQueue();
  if (!queue) return { ok: false, error: 'Queue indisponível' };
  try {
    if (op === 'retry') {
      const job = await queue.getJob(id);
      if (!job) return { ok: false, error: 'Job não encontrado' };
      await job.retry();
      return { ok: true };
    }
    if (op === 'remove') {
      const job = await queue.getJob(id);
      if (!job) return { ok: false, error: 'Job não encontrado' };
      await job.remove();
      return { ok: true };
    }
    if (op === 'clean') {
      const removed = await queue.clean(0, 1000, statusFilter);
      return { ok: true, removed: removed.length };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
  return { ok: false, error: 'Operação desconhecida' };
}

function getEnvStatus() {
  const groups = [
    { key: 'redis', label: 'Redis/BullMQ', env: [], runtime: true },
    { key: 'tavily', label: 'Pesquisa Tavily', env: ['TAVILY_API_KEY'] },
    { key: 'image_ai', label: 'Imagem IA', env: ['KIE_API_KEY', 'OPENAI_API_KEY', 'STABILITY_API_KEY'] },
    { key: 'stock', label: 'Banco de imagem', env: ['PEXELS_API_KEY', 'UNSPLASH_ACCESS_KEY'] },
    { key: 'tts', label: 'Narracao/TTS', env: ['ELEVENLABS_API_KEY', 'FISH_AUDIO_API_KEY', 'MINIMAX_API_KEY'] },
    { key: 'supabase', label: 'Supabase', env: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] },
    { key: 'telegram', label: 'Telegram', env: ['TELEGRAM_BOT_TOKEN'] },
    { key: 'social', label: 'Publicacao social', env: ['INSTAGRAM_ACCESS_TOKEN', 'YOUTUBE_CLIENT_ID', 'THREADS_ACCESS_TOKEN'] },
  ];

  return groups.map((group) => {
    if (group.runtime && group.key === 'redis') {
      const tag = `${redisStatus.host}:${redisStatus.port}`;
      return {
        ...group,
        present: redisStatus.ok ? [tag] : [],
        configured: redisStatus.ok,
        complete: redisStatus.ok,
      };
    }
    const present = group.env.filter(envHas);
    return {
      ...group,
      present,
      configured: present.length > 0,
      complete: present.length === group.env.length,
    };
  });
}

function stageFromCampaign(dir) {
  const adsDir = path.join(dir, 'ads');
  const imgsDir = path.join(dir, 'imgs');
  const videoDir = path.join(dir, 'video');
  const platformsDir = path.join(dir, 'platforms');
  const publishFiles = findFiles(dir, (filePath) => /^Publish .+\.md$/i.test(path.basename(filePath)), 10, 1);
  const stage1Candidates = [
    path.join(dir, 'research_brief.md'),
    path.join(dir, 'creative', 'creative_brief.json'),
    path.join(dir, 'copy', 'narrative.json'),
    path.join(dir, 'research_results.json'),
  ];
  const ads = countFiles(adsDir, (filePath) => IMAGE_EXT.has(path.extname(filePath).toLowerCase()), 1);
  const imgs = countFiles(imgsDir, (filePath) => IMAGE_EXT.has(path.extname(filePath).toLowerCase()), 1);
  const videos = countFiles(videoDir, (filePath) => VIDEO_EXT.has(path.extname(filePath).toLowerCase()), 2);
  const platformFiles = countFiles(platformsDir, (filePath) => /\.(json|md)$/i.test(filePath), 1);

  const platformTextFiles = findFiles(platformsDir, (filePath) => /\.(json|md)$/i.test(filePath), 10, 1).map(rel);

  return [
    {
      key: 'stage1',
      label: 'Estrategia',
      status: stage1Candidates.some(exists) ? 'done' : 'empty',
      detail: 'research, brief e narrativa',
      files: stage1Candidates.filter(exists).map(rel),
    },
    {
      key: 'stage2',
      label: 'Imagens',
      status: ads > 0 || imgs > 0 ? 'done' : 'empty',
      detail: `${ads} ads, ${imgs} imagens base`,
      files: [path.join(dir, 'ads', 'layout.json'), path.join(dir, 'ads', 'ad.html')]
        .filter(exists).map(rel),
    },
    {
      key: 'stage3',
      label: 'Video',
      status: videos > 0 ? 'done' : exists(path.join(videoDir, 'approval_needed.json')) ? 'waiting' : 'empty',
      detail: `${videos} videos`,
      files: findFiles(videoDir, (filePath) => /\.(json|md)$/i.test(filePath), 10, 1).map(rel),
    },
    {
      key: 'stage4',
      label: 'Plataformas',
      status: platformFiles > 0 ? 'done' : 'empty',
      detail: `${platformFiles} arquivos`,
      files: platformTextFiles,
    },
    {
      key: 'stage5',
      label: 'Distribuicao',
      status: exists(path.join(dir, 'media_urls.json')) || publishFiles.length > 0 ? 'done' : 'empty',
      detail: `${publishFiles.length} publish docs`,
      files: [path.join(dir, 'media_urls.json'), ...publishFiles].filter(exists).map(rel),
    },
  ];
}

function inferPlatforms(dir, payload) {
  if (Array.isArray(payload?.platform_targets)) return payload.platform_targets;
  const platformDir = path.join(dir, 'platforms');
  return readDirSafe(platformDir)
    .filter((entry) => entry.isFile() && /\.(json|md)$/i.test(entry.name))
    .map((entry) => path.basename(entry.name, path.extname(entry.name)))
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .sort();
}

function scanCampaign(projectName, outputDir) {
  const dir = path.resolve(outputDir);
  const stat = statSafe(dir);
  const payload = readJsonSafe(path.join(dir, 'campaign_payload.json'), null);
  const adsPreviews = findFiles(path.join(dir, 'ads'), (filePath) => IMAGE_EXT.has(path.extname(filePath).toLowerCase()), 200, 2);
  const imgPreviews = findFiles(path.join(dir, 'imgs'), (filePath) => IMAGE_EXT.has(path.extname(filePath).toLowerCase()), 200, 2);
  const videoFiles = findFiles(path.join(dir, 'video'), (filePath) => VIDEO_EXT.has(path.extname(filePath).toLowerCase()), 50, 2);
  const publishFiles = findFiles(dir, (filePath) => /^Publish .+\.md$/i.test(path.basename(filePath)), 10, 1);
  const report = path.join(dir, 'interactive_report.html');
  const mediaUrls = path.join(dir, 'media_urls.json');
  const campaignPayload = path.join(dir, 'campaign_payload.json');
  const toMedia = (filePath) => ({ path: rel(filePath), url: fileUrl(filePath), name: path.basename(filePath) });
  const adsMedia = adsPreviews.map(toMedia);
  const imgsMedia = imgPreviews.map(toMedia);
  const previews = [...adsMedia, ...imgsMedia].slice(0, 8);

  return {
    id: `${projectName}/${path.basename(dir)}`,
    project: projectName,
    name: path.basename(dir),
    task_name: payload?.task_name || path.basename(dir),
    task_date: payload?.task_date || '',
    relPath: rel(dir),
    updatedAt: stat ? stat.mtime.toISOString() : null,
    platforms: inferPlatforms(dir, payload),
    stages: stageFromCampaign(dir),
    counts: {
      ads: countFiles(path.join(dir, 'ads'), (filePath) => IMAGE_EXT.has(path.extname(filePath).toLowerCase()), 1),
      sourceImages: countFiles(path.join(dir, 'imgs'), (filePath) => IMAGE_EXT.has(path.extname(filePath).toLowerCase()), 1),
      videos: videoFiles.length,
      logs: countFiles(path.join(dir, 'logs'), (filePath) => /\.(log|out)$/i.test(filePath), 1),
    },
    previews,
    media: {
      ads: adsMedia,
      images: imgsMedia,
    },
    videos: videoFiles.map((filePath) => ({
      path: rel(filePath),
      url: fileUrl(filePath),
      name: path.basename(filePath),
    })),
    files: {
      report: exists(report) ? rel(report) : null,
      mediaUrls: exists(mediaUrls) ? rel(mediaUrls) : null,
      payload: exists(campaignPayload) ? rel(campaignPayload) : null,
      publish: publishFiles.map(rel),
    },
  };
}

function listProjects() {
  const root = path.join(ROOT, 'prj');
  return readDirSafe(root)
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const projectDir = path.join(root, entry.name);
      const outputsDir = path.join(projectDir, 'outputs');
      const campaigns = readDirSafe(outputsDir)
        .filter((output) => output.isDirectory())
        .map((output) => scanCampaign(entry.name, path.join(outputsDir, output.name)))
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
      const assetPreviews = [
        ...findFiles(path.join(projectDir, 'assets'), (filePath) => IMAGE_EXT.has(path.extname(filePath).toLowerCase()), 6, 3),
        ...findFiles(path.join(projectDir, 'imgs'), (filePath) => IMAGE_EXT.has(path.extname(filePath).toLowerCase()), 6, 2),
      ].slice(0, 6);

      return {
        name: entry.name,
        relPath: rel(projectDir),
        knowledgeFiles: findFiles(path.join(projectDir, 'knowledge'), (filePath) => /\.md$/i.test(filePath), 20, 1).map(rel),
        assetCount: countFiles(path.join(projectDir, 'assets'), (filePath) => {
          const ext = path.extname(filePath).toLowerCase();
          return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext) || AUDIO_EXT.has(ext);
        }, 4),
        outputCount: campaigns.length,
        previews: assetPreviews.map((filePath) => ({
          path: rel(filePath),
          url: fileUrl(filePath),
          name: path.basename(filePath),
        })),
        campaigns,
        latestCampaigns: campaigns.slice(0, 8),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function nextSerialForPrefix(prefix) {
  const safePrefix = String(prefix || 'c').replace(/[^a-zA-Z0-9_-]/g, '') || 'c';
  const re = new RegExp(`^${safePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d{3,5})`);
  let max = 0;
  for (const entry of readDirSafe(PAYLOAD_DIR)) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const match = entry.name.match(re);
    if (match) {
      const n = Number(match[1]);
      if (Number.isFinite(n) && n > max) max = n;
    }
  }
  const next = max + 1;
  return { prefix: safePrefix, next, padded: String(next).padStart(4, '0') };
}

function listPayloads() {
  return readDirSafe(PAYLOAD_DIR)
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => {
      const filePath = path.join(PAYLOAD_DIR, entry.name);
      const stat = statSafe(filePath);
      const payload = readJsonSafe(filePath, {});
      return {
        file: entry.name,
        relPath: rel(filePath),
        task_name: payload.task_name || '',
        task_date: payload.task_date || '',
        project_dir: payload.project_dir || '',
        output_dir: payload.output_dir || payload.output_folder || '',
        business: payload.business || '',
        platforms: Array.isArray(payload.platform_targets) ? payload.platform_targets : [],
        image_source: payload.image_source || '',
        video_mode: payload.video_mode || (payload.video_pro ? 'pro' : 'quick'),
        skip: {
          research: Boolean(payload.skip_research),
          image: Boolean(payload.skip_image),
          video: Boolean(payload.skip_video),
        },
        updatedAt: stat ? stat.mtime.toISOString() : null,
      };
    })
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

function textHead(filePath, max = 18000) {
  try {
    return fs.readFileSync(filePath, 'utf8').slice(0, max);
  } catch {
    return '';
  }
}

function inferScriptCommand(filePath, source = '') {
  const name = path.basename(filePath);
  const relPath = rel(filePath);
  const usage = source.match(/Uso:\s*([^\n]+)/i) || source.match(/Usage:\s*([^\n]+)/i);
  if (usage) return usage[1].trim();
  if (/^batch-/.test(name)) return `node ${relPath} <slugs_csv|all|new>`;
  if (/^gen-/.test(name)) return `node ${relPath} <slug>`;
  if (/^render-/.test(name)) return `node ${relPath} <slug>`;
  return `node ${relPath}`;
}

function extractArgsHint(source) {
  const match = source.match(/Uso:\s*node\s+\S+\.js\s+(.+)/i) || source.match(/Usage:\s*node\s+\S+\.js\s+(.+)/i);
  if (!match) return null;
  const raw = match[1].trim();
  const tokens = [];
  const re = /[<\[]([\w|.\s_-]+)[>\]]/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    tokens.push({ hint: m[1].trim(), required: raw[m.index] === '<' });
  }
  return tokens.length ? { raw, tokens } : { raw, tokens: [] };
}

function parseScriptMeta(filePath) {
  const source = textHead(filePath, 6000);

  // Full doc comment at top
  const docMatch = source.match(/^\/\*\*([\s\S]*?)\*\//);
  const doc = docMatch ? docMatch[1].replace(/^\s*\*\s?/gm, '').trim() : '';

  // Usage line
  const usageMatch = source.match(/(?:Uso|Usage):\s*([^\n]+)/i);
  const usage = usageMatch ? usageMatch[1].trim() : null;

  // process.argv usage hint
  const argvMatch = source.match(/process\.argv\[2\].*?(?:\/\/\s*(.+))?$/m);
  const argvDefault = source.match(/process\.argv\[2\]\s*\|\|\s*['"`]([^'"`]+)['"`]/);

  // Top-level uppercase consts (likely configurable)
  const consts = [];
  const constRe = /^(?:const|let)\s+([A-Z][A-Z0-9_]*)\s*=\s*(['"`]([^'"`\n]*?)['"`]|\d+(?:\.\d+)?|true|false)/gm;
  let m;
  while ((m = constRe.exec(source)) !== null) {
    // Skip boring internal names
    if (['ROOT', 'LOG_DIR', 'OUT', 'DIR'].includes(m[1])) continue;
    let val = m[2];
    if (val.startsWith("'") || val.startsWith('"') || val.startsWith('`')) val = val.slice(1, -1);
    consts.push({ name: m[1], value: val, raw: m[2] });
  }

  // Arrays at top level (slugs, variants, etc.)
  const arrays = [];
  const arrRe = /^(?:const|let)\s+([A-Z][A-Z0-9_]*)\s*=\s*\[([^\]]{0,300})\]/gm;
  while ((m = arrRe.exec(source)) !== null) {
    const items = m[2].match(/['"`]([^'"`]+)['"`]/g)?.map((s) => s.slice(1, -1)) || [];
    if (items.length > 0 && items.length <= 20) {
      arrays.push({ name: m[1], items });
    }
  }

  return {
    doc,
    usage,
    argvDefault: argvDefault ? argvDefault[1] : null,
    consts,
    arrays,
    argsHint: extractArgsHint(source),
  };
}

function classifyScript(filePath) {
  const name = path.basename(filePath);
  const lower = name.toLowerCase();
  const source = textHead(filePath);
  const mentionsInemaVideos = source.includes('prj/inema/videos') || source.includes('gen-lib/scene-templates');
  const mentionsGatilhos = lower.includes('gatilho') || source.toLowerCase().includes('gatilhos');
  const mentionsRerun = lower.includes('rerun') || source.toLowerCase().includes('/rerun');
  const tags = [];
  let type = 'script';
  let category = 'scripts';
  let description = '';

  if (/^batch-/.test(lower)) {
    type = 'batch';
    category = 'lotes';
    tags.push('lotes');
    description = 'Execucao em lote via CLI.';
  } else if (/^gen-/.test(lower)) {
    type = 'generator';
    description = 'Gera assets ou narrativas por CLI.';
  } else if (/^render-/.test(lower)) {
    type = 'renderer';
    description = 'Renderiza entregaveis por CLI.';
  }

  if (mentionsInemaVideos) {
    category = 'inema-videos';
    tags.push('inema-videos');
    description = 'Template standalone que gera ou renderiza videos em prj/inema/videos.';
  }
  if (mentionsGatilhos) {
    tags.push('gatilhos');
    if (!mentionsInemaVideos) category = 'gatilhos';
    description = description || 'Fluxo de gatilhos/hooks.';
  }
  if (mentionsRerun) {
    tags.push('rerun');
    category = 'rerun';
  }

  const outputMatch = source.match(/prj\/inema\/videos\/[^`'")\s]+/);
  return {
    type,
    category,
    tags: [...new Set(tags.length ? tags : [category])],
    group: 'root',
    name,
    path: rel(filePath),
    command: inferScriptCommand(filePath, source),
    argsHint: extractArgsHint(source),
    outputRoot: outputMatch ? outputMatch[0] : mentionsInemaVideos ? 'prj/inema/videos' : '',
    outputExists: mentionsInemaVideos ? exists(path.join(ROOT, 'prj/inema/videos')) : null,
    description,
    runnable: true,
  };
}

function commandServices() {
  return [
    {
      type: 'telegram-command',
      category: 'rerun',
      tags: ['rerun'],
      group: 'telegram',
      name: '/rerun',
      command: '/rerun c0038 3 pro cleanplan',
      outputRoot: 'prj/<projeto>/outputs/<campanha>/',
      description: 'Reprocessa etapas especificas de uma campanha existente.',
    },
    {
      type: 'telegram-command',
      category: 'lotes',
      tags: ['lotes', 'rerun'],
      group: 'telegram',
      name: '/loterun',
      command: '/loterun c10,c11,c12 video pro template data_story',
      outputRoot: 'prj/<projeto>/outputs/<campanha>/video/',
      description: 'Rerun em serie para varias campanhas.',
    },
    {
      type: 'telegram-command',
      category: 'lotes',
      tags: ['lotes'],
      group: 'telegram',
      name: '/lotequick',
      command: '/lotequick campanhas c2,c44,c45 fonte brand modo normal',
      outputRoot: 'prj/<projeto>/imports/<batch>/videos/',
      description: 'Batch de Video Quick para campanhas selecionadas.',
    },
    {
      type: 'telegram-command',
      category: 'lotes',
      tags: ['lotes'],
      group: 'telegram',
      name: '/lotecontinue',
      command: '/lotecontinue <batch_id>',
      outputRoot: 'prj/<projeto>/imports/<batch>/',
      description: 'Retoma um lote pausado ou interrompido.',
    },
    {
      type: 'pipeline-template',
      category: 'gatilhos',
      tags: ['gatilhos', 'rerun'],
      group: 'pipeline',
      name: 'Template gatilhos',
      command: '/loterun c1,c2,c3 video pro template gatilhos cleanall',
      path: 'pipeline/worker-video-gatilhos.js',
      outputRoot: 'prj/<projeto>/outputs/<campanha>/gatilhos/',
      description: 'Gera hooks/ganchos com carousel, narracao e video por gatilho.',
    },
  ];
}

function inemaVideoTemplateServices() {
  const rootExists = exists(path.join(ROOT, 'prj/inema/videos'));
  const videoCount = countFiles(path.join(ROOT, 'prj/inema/videos'), (filePath) => VIDEO_EXT.has(path.extname(filePath).toLowerCase()), 6);
  const base = {
    type: 'video-template',
    category: 'inema-videos',
    tags: ['inema-videos'],
    group: 'standalone',
    outputExists: rootExists,
    videoCount,
  };
  return [
    {
      ...base,
      name: 'CriaProf + GERTRAN',
      command: 'node batch-profissoes.js <slug|all|new>',
      path: 'batch-profissoes.js',
      outputRoot: 'prj/inema/videos/criaprof/ e prj/inema/videos/gertran/',
      description: 'Factory CLI de profissoes: gera imagens, TTS, whisper, CriaProf 1:1 e GERTRAN 9:16.',
    },
    {
      ...base,
      name: 'CriaProf-CTA 9:16',
      command: 'node batch-criaprof-cta.js <slug|all|new>',
      path: 'batch-criaprof-cta.js',
      outputRoot: 'prj/inema/videos/criaprof-cta-916/',
      description: 'Template vertical com hook forte e CTA pesado, variantes prof e generic.',
    },
    {
      ...base,
      name: 'CriaProf-CTA A/B narrativo',
      command: 'node gen-narrations-multi.js <slug> && node render-criaprof-cta-916.js <slug> prof 3',
      path: 'gen-narrations-multi.js',
      outputRoot: 'prj/inema/videos/criaprof-cta-916/<slug>_<date>/video/',
      description: 'Gera v1-v5 de narracao para testar estilos de abertura e trilha.',
    },
    {
      ...base,
      name: 'Extras GERTRAN',
      command: 'node batch-extras.js',
      path: 'batch-extras.js',
      outputRoot: 'prj/inema/videos/extras/<paired|artifacts|decades>/videos/',
      description: 'Tres templates extras 9:16: paired, artifacts e decades.',
    },
    {
      ...base,
      name: 'CriaProf Comic A',
      command: 'node gen-criaprof-comic-A.js <slug> && node render-criaprof-comic-A-cta-916.js <slug>',
      path: 'gen-criaprof-comic-A.js',
      outputRoot: 'prj/inema/videos/criaprof-comic-A/ e criaprof-comic-A-cta-916/',
      description: 'Variação em quadrinho americano do template CriaProf CTA.',
    },
  ];
}

function listServices() {
  const packageJson = readJsonSafe(path.join(ROOT, 'package.json'), {});
  const remotionPackageJson = readJsonSafe(path.join(ROOT, 'remotion-ad', 'package.json'), {});
  const scripts = Object.entries(packageJson.scripts || {}).map(([name, command]) => ({
    type: 'script',
    category: 'scripts',
    tags: ['scripts'],
    group: 'root',
    name,
    command,
    description: 'Script npm do projeto principal.',
  }));
  const remotionScripts = Object.entries(remotionPackageJson.scripts || {}).map(([name, command]) => ({
    type: 'script',
    category: 'scripts',
    tags: ['scripts'],
    group: 'remotion-ad',
    name,
    command: `cd remotion-ad && npm run ${name}`,
    description: 'Script npm do renderer Remotion.',
  }));
  const workers = findFiles(path.join(ROOT, 'pipeline'), (filePath) => /^worker.*\.js$/.test(path.basename(filePath)), 40, 1)
    .map((filePath) => ({
      type: 'worker',
      category: path.basename(filePath).includes('gatilhos') ? 'gatilhos' : 'scripts',
      tags: path.basename(filePath).includes('gatilhos') ? ['gatilhos', 'scripts'] : ['scripts'],
      group: 'pipeline',
      name: path.basename(filePath),
      path: rel(filePath),
      command: `node ${rel(filePath)}`,
      description: path.basename(filePath).includes('gatilhos') ? 'Worker de videos de gatilhos.' : 'Worker do pipeline.',
    }));
  const generators = findFiles(path.join(ROOT, 'pipeline'), (filePath) => /^(generate|render)-.*\.js$/.test(path.basename(filePath)), 50, 1)
    .map((filePath) => ({
      type: 'tool',
      category: 'scripts',
      tags: ['scripts'],
      group: 'pipeline',
      name: path.basename(filePath),
      path: rel(filePath),
      command: `node ${rel(filePath)}`,
      description: 'Ferramenta auxiliar do pipeline.',
    }));
  const rootBatches = readDirSafe(ROOT)
    .filter((entry) => entry.isFile() && /^(batch|gen|render)-.*\.js$/.test(entry.name))
    .map((entry) => classifyScript(path.join(ROOT, entry.name)));

  return [
    ...commandServices(),
    ...inemaVideoTemplateServices(),
    ...scripts,
    ...remotionScripts,
    ...workers,
    ...generators,
    ...rootBatches,
  ].sort((a, b) => `${a.category}:${a.type}:${a.name}`.localeCompare(`${b.category}:${b.type}:${b.name}`));
}

function listLogs() {
  const files = findFiles(path.join(ROOT, 'logs'), (filePath) => /\.(log|out)$/i.test(filePath), 80, 3);
  return files
    .map((filePath) => {
      const stat = statSafe(filePath);
      return {
        name: path.basename(filePath),
        relPath: rel(filePath),
        updatedAt: stat ? stat.mtime.toISOString() : null,
        size: stat ? stat.size : 0,
      };
    })
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .slice(0, 24);
}

function getDashboard() {
  const projects = listProjects();
  const campaigns = projects.flatMap((project) => project.campaigns.map((campaign) => ({
    ...campaign,
    projectPath: project.relPath,
  }))).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  const payloads = listPayloads();
  const services = listServices();
  const totalAds = campaigns.reduce((sum, c) => sum + c.counts.ads, 0);
  const totalImages = campaigns.reduce((sum, c) => sum + c.counts.sourceImages, 0);
  const totalVideos = campaigns.reduce((sum, c) => sum + c.counts.videos, 0);

  return {
    generatedAt: new Date().toISOString(),
    config: getConfig(),
    env: getEnvStatus(),
    projects,
    campaigns,
    payloads,
    services,
    logs: listLogs(),
    summary: {
      projects: projects.length,
      campaigns: campaigns.length,
      payloads: payloads.length,
      services: services.length,
      totalAds,
      totalImages,
      totalVideos,
      runs: runs.size,
    },
  };
}

function getRunList() {
  return Array.from(runs.values())
    .map((run) => ({
      id: run.id,
      payloadFile: run.payloadFile,
      command: run.command,
      status: run.status,
      exitCode: run.exitCode,
      startedAt: run.startedAt,
      endedAt: run.endedAt,
      pid: run.pid,
      stages: run.stages,
      currentStage: run.currentStage,
      bullmqJobId: run.bullmqJobId,
      batch_id: run.batch_id || null,
      pendingApprovalDir: run.pendingApprovalDir || null,
    }))
    .sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt)));
}

const STAGE_MARKERS = [
  { re: /\[STAGE1_DONE\]/i,            stage: 1, status: 'done' },
  { re: /\[STAGE2_IMAGE_READY\]/i,     stage: 2, status: 'images_ready' },
  { re: /\[IMAGE_APPROVAL_NEEDED\]\s*(\S*)/i, stage: 2, status: 'awaiting_approval', dirGroup: 1 },
  { re: /\[STAGE2_DONE\]/i,            stage: 2, status: 'done' },
  { re: /\[STAGE3_DONE\]/i,            stage: 3, status: 'done' },
  { re: /\[STAGE4_DONE\]/i,            stage: 4, status: 'done' },
  { re: /\[STAGE5_DONE\]/i,            stage: 5, status: 'done' },
  { re: /\[BULLMQ_JOB_ID\]\s*([a-zA-Z0-9_-]+)/i, jobIdGroup: 1 },
];

function parseStageMarkers(run, chunk) {
  if (!run.stages) run.stages = { 1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending' };
  for (const m of STAGE_MARKERS) {
    const match = chunk.match(m.re);
    if (!match) continue;
    if (m.jobIdGroup) {
      run.bullmqJobId = match[m.jobIdGroup];
    } else if (m.stage) {
      run.stages[m.stage] = m.status;
      run.currentStage = m.stage;
      if (m.dirGroup && match[m.dirGroup]) run.pendingApprovalDir = match[m.dirGroup];
      if (m.status === 'done' && m.stage === 2) run.pendingApprovalDir = null;
    }
  }
}

function appendRunLog(run, chunk) {
  run.log += chunk;
  if (run.log.length > MAX_RUN_LOG) {
    run.log = run.log.slice(-MAX_RUN_LOG);
  }
  parseStageMarkers(run, chunk);
  if (run.subscribers && run.subscribers.size > 0) {
    for (const fn of run.subscribers) {
      try { fn(chunk); } catch {}
    }
  }
  persistRun(run);
}

const RUNS_DIR = path.join(ROOT, 'logs', 'runs');
function persistRun(run) {
  if (!run || !run.id) return;
  if (run._persistTimer) clearTimeout(run._persistTimer);
  run._persistTimer = setTimeout(() => {
    try {
      fs.mkdirSync(RUNS_DIR, { recursive: true });
      const meta = {
        id: run.id, payloadFile: run.payloadFile, command: run.command,
        status: run.status, exitCode: run.exitCode, startedAt: run.startedAt,
        endedAt: run.endedAt, pid: run.pid, stages: run.stages,
        currentStage: run.currentStage, bullmqJobId: run.bullmqJobId,
        batch_id: run.batch_id || null,
      };
      fs.writeFileSync(path.join(RUNS_DIR, `${run.id}.json`), JSON.stringify(meta, null, 2));
      fs.writeFileSync(path.join(RUNS_DIR, `${run.id}.log`), run.log || '');
    } catch {}
  }, 500);
}

function loadPersistedRuns() {
  try {
    if (!fs.existsSync(RUNS_DIR)) return;
    for (const entry of fs.readdirSync(RUNS_DIR)) {
      if (!entry.endsWith('.json')) continue;
      const id = entry.replace(/\.json$/, '');
      if (runs.has(id)) continue;
      const meta = readJsonSafe(path.join(RUNS_DIR, entry), null);
      if (!meta) continue;
      let log = '';
      try { log = fs.readFileSync(path.join(RUNS_DIR, `${id}.log`), 'utf8'); } catch {}
      const wasRunning = meta.status === 'running';
      runs.set(id, {
        ...meta,
        log,
        subscribers: new Set(),
        status: wasRunning ? 'unknown' : meta.status,
      });
    }
  } catch {}
}
loadPersistedRuns();

function startRun(payloadFile) {
  const target = safeResolve(PAYLOAD_DIR, payloadFile);
  if (!target || !exists(target) || path.extname(target) !== '.json') {
    const error = new Error('Payload file not found');
    error.status = 404;
    throw error;
  }

  const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const args = ['pipeline/orchestrator.js', '--file', rel(target)];
  const payloadJson = readJsonSafe(target, {});
  const run = {
    id,
    payloadFile: path.basename(target),
    command: `${process.execPath} ${args.join(' ')}`,
    status: 'running',
    exitCode: null,
    startedAt: new Date().toISOString(),
    endedAt: null,
    log: '',
    stages: { 1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending' },
    currentStage: null,
    bullmqJobId: null,
    batch_id: payloadJson.batch_id || null,
    subscribers: new Set(),
  };
  runs.set(id, run);

  const child = spawn(process.execPath, args, {
    cwd: ROOT,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  run.pid = child.pid;
  run.child = child;

  child.stdout.on('data', (chunk) => appendRunLog(run, chunk.toString()));
  child.stderr.on('data', (chunk) => appendRunLog(run, chunk.toString()));
  child.on('error', (error) => {
    run.status = 'failed';
    run.endedAt = new Date().toISOString();
    appendRunLog(run, `\n[process error] ${error.message}\n`);
    notifyEnd(run);
  });
  child.on('close', (code) => {
    run.status = run.status === 'cancelled' ? 'cancelled' : (code === 0 ? 'completed' : 'failed');
    run.exitCode = code;
    run.endedAt = new Date().toISOString();
    appendRunLog(run, `\n[exit ${code}]\n`);
    notifyEnd(run);
  });

  return { ...run, log: undefined, subscribers: undefined, child: undefined };
}

function notifyEnd(run) {
  if (run.subscribers) {
    for (const fn of run.subscribers) {
      try { fn(null); } catch {}
    }
    run.subscribers.clear();
  }
}

function writeImageDecision(id, decision) {
  const run = runs.get(id);
  if (!run) return { ok: false, error: 'Run not found' };
  if (!run.pendingApprovalDir) return { ok: false, error: 'No image approval pending for this run' };
  const target = safeResolve(ROOT, path.join(run.pendingApprovalDir, 'imgs'));
  if (!target) return { ok: false, error: 'Invalid output_dir' };
  try {
    fs.mkdirSync(target, { recursive: true });
    const fileName = decision === 'approve' ? 'approved.json' : 'rejected.json';
    fs.writeFileSync(path.join(target, fileName),
      JSON.stringify({ decision, ts: Date.now(), via: 'cockpit' }, null, 2));
    appendRunLog(run, `\n[image ${decision} via cockpit]\n`);
    if (decision === 'approve') {
      run.stages[2] = 'done';
    }
    run.pendingApprovalDir = null;
    return { ok: true, file: path.join(target, fileName) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function getBatches() {
  const all = Array.from(runs.values());
  const groups = new Map();
  for (const run of all) {
    const key = run.batch_id || `solo:${run.id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(run);
  }
  const result = [];
  for (const [key, list] of groups) {
    const sorted = list.sort((a, b) => String(a.startedAt).localeCompare(String(b.startedAt)));
    const counts = { running: 0, completed: 0, failed: 0, cancelled: 0, awaiting: 0, pending: 0 };
    for (const r of sorted) {
      if (r.pendingApprovalDir) counts.awaiting++;
      else if (r.status === 'running') counts.running++;
      else if (r.status === 'completed') counts.completed++;
      else if (r.status === 'failed') counts.failed++;
      else if (r.status === 'cancelled') counts.cancelled++;
      else counts.pending++;
    }
    result.push({
      batch_id: key.startsWith('solo:') ? null : key,
      isSolo: key.startsWith('solo:'),
      total: sorted.length,
      counts,
      startedAt: sorted[0]?.startedAt,
      runs: sorted.map((r) => ({
        id: r.id,
        payloadFile: r.payloadFile,
        status: r.status,
        stages: r.stages,
        currentStage: r.currentStage,
        pendingApprovalDir: r.pendingApprovalDir || null,
        startedAt: r.startedAt,
        endedAt: r.endedAt,
      })),
    });
  }
  return result.sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt)));
}

function cancelRun(id) {
  const run = runs.get(id);
  if (!run) return { ok: false, error: 'Run not found' };
  if (run.status !== 'running') return { ok: false, error: `Run is ${run.status}` };
  run.status = 'cancelled';
  if (run.child && !run.child.killed) {
    try { run.child.kill('SIGTERM'); } catch {}
    setTimeout(() => {
      if (run.child && !run.child.killed) {
        try { run.child.kill('SIGKILL'); } catch {}
      }
    }, 3000);
  }
  appendRunLog(run, `\n[cancelled by user]\n`);
  return { ok: true };
}

function validatePayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') errors.push('Payload invalido.');
  if (!payload.task_name) errors.push('Campo obrigatorio: task_name.');
  if (!payload.task_date) errors.push('Campo obrigatorio: task_date.');
  if (!payload.project_dir) errors.push('Campo obrigatorio: project_dir.');
  if (!Array.isArray(payload.platform_targets)) errors.push('Campo obrigatorio: platform_targets array.');
  return errors;
}

function savePayload(payload, requestedFileName) {
  const errors = validatePayload(payload);
  if (errors.length > 0) {
    const error = new Error(errors.join(' '));
    error.status = 400;
    throw error;
  }

  fs.mkdirSync(PAYLOAD_DIR, { recursive: true });
  const baseName = slugify(requestedFileName || `${payload.task_name}_${payload.task_date}`) || `payload_${Date.now()}`;
  let fileName = baseName.endsWith('.json') ? baseName : `${baseName}.json`;
  fileName = path.basename(fileName);
  const target = path.join(PAYLOAD_DIR, fileName);
  fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`);
  return {
    file: fileName,
    relPath: rel(target),
    payload,
  };
}

async function handleApi(req, res, url) {
  try {
    if (req.method === 'GET' && url.pathname === '/api/dashboard') {
      return sendJson(res, getDashboard());
    }
    if (req.method === 'GET' && url.pathname === '/api/config') {
      return sendJson(res, getConfig());
    }
    if (req.method === 'GET' && url.pathname === '/api/config/defaults') {
      return sendJson(res, getDefaults());
    }
    if (req.method === 'GET' && url.pathname === '/api/providers') {
      return sendJson(res, readJsonSafe(PROVIDERS_PATH, {}));
    }
    if (req.method === 'POST' && url.pathname === '/api/providers') {
      const body = await readRequestBody(req);
      fs.writeFileSync(PROVIDERS_PATH, `${JSON.stringify(body, null, 2)}\n`);
      return sendJson(res, { ok: true });
    }
    if (req.method === 'POST' && url.pathname === '/api/config') {
      const body = await readRequestBody(req);
      saveConfig(body);
      return sendJson(res, { ok: true, config: getConfig() });
    }
    if (req.method === 'GET' && url.pathname === '/api/payloads') {
      return sendJson(res, listPayloads());
    }
    if (req.method === 'GET' && url.pathname === '/api/payloads/next-serial') {
      const prefix = url.searchParams.get('prefix') || 'c';
      return sendJson(res, nextSerialForPrefix(prefix));
    }
    if (req.method === 'GET' && url.pathname.startsWith('/api/payloads/')) {
      const fileName = decodeURIComponent(url.pathname.replace('/api/payloads/', ''));
      const target = safeResolve(PAYLOAD_DIR, fileName);
      if (!target || !exists(target)) return sendJson(res, { error: 'Payload not found' }, 404);
      return sendJson(res, readJsonSafe(target, {}));
    }
    if (req.method === 'POST' && url.pathname === '/api/payloads') {
      const body = await readRequestBody(req);
      return sendJson(res, savePayload(body.payload, body.fileName), 201);
    }
    if (req.method === 'GET' && url.pathname === '/api/runs') {
      return sendJson(res, getRunList());
    }
    if (req.method === 'GET' && /^\/api\/runs\/[^/]+\/stream$/.test(url.pathname)) {
      const id = decodeURIComponent(url.pathname.split('/')[3]);
      const run = runs.get(id);
      if (!run) return sendJson(res, { error: 'Run not found' }, 404);
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      const writeEvent = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      writeEvent('snapshot', {
        log: run.log || '',
        status: run.status,
        stages: run.stages,
        currentStage: run.currentStage,
        bullmqJobId: run.bullmqJobId,
        exitCode: run.exitCode,
      });
      const subscriber = (chunk) => {
        if (chunk === null) {
          writeEvent('end', {
            status: run.status, exitCode: run.exitCode,
            stages: run.stages, endedAt: run.endedAt,
          });
          try { res.end(); } catch {}
          return;
        }
        writeEvent('log', { chunk, stages: run.stages, currentStage: run.currentStage });
      };
      if (!run.subscribers) run.subscribers = new Set();
      run.subscribers.add(subscriber);
      const heartbeat = setInterval(() => res.write(`: hb\n\n`), 15000);
      req.on('close', () => {
        clearInterval(heartbeat);
        if (run.subscribers) run.subscribers.delete(subscriber);
      });
      if (run.status !== 'running') {
        writeEvent('end', { status: run.status, exitCode: run.exitCode, stages: run.stages });
        try { res.end(); } catch {}
      }
      return;
    }
    if (req.method === 'POST' && /^\/api\/runs\/[^/]+\/cancel$/.test(url.pathname)) {
      const id = decodeURIComponent(url.pathname.split('/')[3]);
      return sendJson(res, cancelRun(id));
    }
    if (req.method === 'POST' && /^\/api\/runs\/[^/]+\/approve-images$/.test(url.pathname)) {
      const id = decodeURIComponent(url.pathname.split('/')[3]);
      return sendJson(res, writeImageDecision(id, 'approve'));
    }
    if (req.method === 'POST' && /^\/api\/runs\/[^/]+\/reject-images$/.test(url.pathname)) {
      const id = decodeURIComponent(url.pathname.split('/')[3]);
      return sendJson(res, writeImageDecision(id, 'reject'));
    }
    if (req.method === 'GET' && url.pathname === '/api/batches') {
      return sendJson(res, getBatches());
    }
    if (req.method === 'GET' && url.pathname.startsWith('/api/runs/')) {
      const id = decodeURIComponent(url.pathname.replace('/api/runs/', ''));
      const run = runs.get(id);
      if (!run) return sendJson(res, { error: 'Run not found' }, 404);
      const { subscribers, child, _persistTimer, ...rest } = run;
      return sendJson(res, rest);
    }
    if (req.method === 'POST' && url.pathname === '/api/runs') {
      const body = await readRequestBody(req);
      return sendJson(res, startRun(body.payloadFile), 201);
    }
    if (req.method === 'GET' && url.pathname === '/api/script-meta') {
      const requestedPath = url.searchParams.get('path') || '';
      const target = safeResolve(ROOT, requestedPath);
      if (!target || !exists(target) || path.extname(target) !== '.js') {
        return sendJson(res, { error: 'Script not found' }, 404);
      }
      return sendJson(res, { path: requestedPath, ...parseScriptMeta(target) });
    }
    if (req.method === 'GET' && url.pathname === '/api/queue') {
      const data = await getQueueSnapshot(Number(url.searchParams.get('limit') || 20));
      return sendJson(res, data);
    }
    if (req.method === 'POST' && url.pathname.startsWith('/api/queue/jobs/') && url.pathname.endsWith('/retry')) {
      const id = decodeURIComponent(url.pathname.split('/')[4]);
      return sendJson(res, await queueAction('retry', id));
    }
    if (req.method === 'DELETE' && url.pathname.startsWith('/api/queue/jobs/')) {
      const id = decodeURIComponent(url.pathname.split('/')[4]);
      return sendJson(res, await queueAction('remove', id));
    }
    if (req.method === 'POST' && url.pathname === '/api/queue/clean') {
      const status = url.searchParams.get('status') || 'completed';
      return sendJson(res, await queueAction('clean', null, status));
    }
    if (req.method === 'POST' && url.pathname === '/api/run-script') {
      const body = await readRequestBody(req);
      const scriptPath = body.path ? safeResolve(ROOT, body.path) : null;
      if (!scriptPath || !exists(scriptPath) || path.extname(scriptPath) !== '.js') {
        return sendJson(res, { error: 'Script not found' }, 404);
      }
      const args = Array.isArray(body.args) ? body.args.filter((a) => typeof a === 'string' && a.length < 512) : [];
      const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      const cmdArgs = [rel(scriptPath), ...args];
      const run = {
        id,
        payloadFile: path.basename(scriptPath),
        command: `node ${cmdArgs.join(' ')}`,
        status: 'running',
        exitCode: null,
        startedAt: new Date().toISOString(),
        endedAt: null,
        log: '',
      };
      runs.set(id, run);
      const child = spawn(process.execPath, cmdArgs, {
        cwd: ROOT,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      run.pid = child.pid;
      child.stdout.on('data', (chunk) => appendRunLog(run, chunk.toString()));
      child.stderr.on('data', (chunk) => appendRunLog(run, chunk.toString()));
      child.on('error', (error) => {
        run.status = 'failed';
        run.endedAt = new Date().toISOString();
        appendRunLog(run, `\n[process error] ${error.message}\n`);
      });
      child.on('close', (code) => {
        run.status = code === 0 ? 'completed' : 'failed';
        run.exitCode = code;
        run.endedAt = new Date().toISOString();
        appendRunLog(run, `\n[exit ${code}]\n`);
      });
      return sendJson(res, { id, command: run.command }, 201);
    }
    if (req.method === 'GET' && url.pathname === '/api/file') {
      const requestedPath = url.searchParams.get('path') || '';
      const target = safeResolve(ROOT, requestedPath);
      const ext = path.extname(target || '').toLowerCase();
      const stat = target ? statSafe(target) : null;
      if (!target || !stat || !stat.isFile() || !TEXT_EXT.has(ext) || stat.size > 2_000_000) {
        return sendJson(res, { error: 'File not available' }, 404);
      }
      return sendText(res, fs.readFileSync(target, 'utf8'));
    }
    if (req.method === 'GET' && url.pathname === '/api/download') {
      const requestedPath = url.searchParams.get('path') || '';
      const target = safeResolve(ROOT, requestedPath);
      const ext = path.extname(target || '').toLowerCase();
      const stat = target ? statSafe(target) : null;
      if (!target || !stat || !stat.isFile() || !ASSET_EXT.has(ext)) {
        return sendJson(res, { error: 'File not available' }, 404);
      }
      const filename = path.basename(target);
      res.writeHead(200, {
        'content-type': getContentType(target),
        'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'content-length': stat.size,
      });
      fs.createReadStream(target).pipe(res);
      return;
    }
    if (req.method === 'GET' && url.pathname === '/api/download-zip') {
      const campaignPath = url.searchParams.get('campaign') || '';
      const target = safeResolve(ROOT, campaignPath);
      if (!target || !statSafe(target)?.isDirectory()) {
        return sendJson(res, { error: 'Campaign not found' }, 404);
      }
      const mediaFiles = [
        ...findFiles(path.join(target, 'ads'), (f) => IMAGE_EXT.has(path.extname(f).toLowerCase()), 50, 1),
        ...findFiles(path.join(target, 'imgs'), (f) => IMAGE_EXT.has(path.extname(f).toLowerCase()), 50, 1),
        ...findFiles(path.join(target, 'video'), (f) => VIDEO_EXT.has(path.extname(f).toLowerCase()), 20, 2),
      ];
      if (!mediaFiles.length) {
        return sendJson(res, { error: 'No media files found' }, 404);
      }
      const campaignName = path.basename(target);
      res.writeHead(200, {
        'content-type': 'application/zip',
        'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(campaignName)}.zip`,
      });
      const zipProc = spawn('zip', ['-j', '-', ...mediaFiles]);
      zipProc.stdout.pipe(res);
      zipProc.stderr.on('data', () => {});
      zipProc.on('error', () => { try { res.end(); } catch {} });
      res.on('close', () => zipProc.kill());
      return;
    }
    return sendJson(res, { error: 'Not found' }, 404);
  } catch (error) {
    return sendJson(res, { error: error.message }, error.status || 500);
  }
}

function serveStatic(req, res, url) {
  let target;
  if (url.pathname === '/asset') {
    const requestedPath = url.searchParams.get('path') || '';
    target = safeResolve(ROOT, requestedPath);
    const ext = path.extname(target || '').toLowerCase();
    if (!target || !exists(target) || !ASSET_EXT.has(ext)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
  } else {
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    target = safeResolve(PUBLIC_DIR, decodeURIComponent(pathname).replace(/^\/+/, ''));
    if (!target || !exists(target) || statSafe(target)?.isDirectory()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
  }

  res.writeHead(200, {
    'content-type': getContentType(target),
    'cache-control': url.pathname === '/asset' ? 'private, max-age=60' : 'no-store',
  });
  fs.createReadStream(target).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  if (url.pathname.startsWith('/api/')) {
    handleApi(req, res, url);
    return;
  }
  serveStatic(req, res, url);
});

server.listen(PORT, HOST, () => {
  console.log(`timesmkt3 cockpit listening on ${HOST}:${PORT}`);
  console.log(`access: ${getAccessUrls().join('  ')}`);
});
