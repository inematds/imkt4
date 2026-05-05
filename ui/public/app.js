// ── Versão do cockpit: v3.RECURSO.BUG
// RECURSO: incrementa a cada nova feature; BUG: incrementa a cada fix, NUNCA zera ao mudar RECURSO.
// Só zera BUG quando MAJOR (3) muda. Atualizar aqui e em index.html (.brand-version) a cada mudança.
const UI_VERSION = 'v3.8.0';
document.title = `iMKT3 ${UI_VERSION}`;

const PLATFORM_OPTIONS = ['instagram', 'youtube', 'tiktok', 'facebook', 'threads', 'linkedin'];

const TTS_PROVIDER_VOICES = {
  auto:           ['rachel', 'bella', 'domi', 'antoni', 'josh', 'arnold'],
  'chatterbox-vc':['rachel', 'bella'],
  fish:           ['rachel', 'bella', 'domi', 'antoni', 'josh', 'arnold'],
  elevenlabs:     ['rachel', 'bella', 'domi', 'antoni', 'josh', 'arnold'],
  minimax:        ['rachel', 'bella'],
};

const VOICE_LABELS = {
  rachel: 'Rachel — calorosa/emocional',
  bella:  'Bella — clara/storytelling',
  domi:   'Domi — confiante',
  antoni: 'Antoni — profissional',
  josh:   'Josh — grave/caloroso',
  arnold: 'Arnold — forte/energético',
};

function ttsVoiceOptions(provider, selectedVoice) {
  const voices = TTS_PROVIDER_VOICES[provider] || TTS_PROVIDER_VOICES.auto;
  const sel = voices.includes(selectedVoice) ? selectedVoice : voices[0];
  return voices.map((v) => `<option value="${v}" ${v === sel ? 'selected' : ''}>${escapeHtml(VOICE_LABELS[v] || v)}</option>`).join('');
}

function applyTtsProviderChange(providerSelectId, voiceSelectId) {
  const provSel = qs(`#${providerSelectId}`);
  const voiceSel = qs(`#${voiceSelectId}`);
  if (!provSel || !voiceSel) return;
  const voices = TTS_PROVIDER_VOICES[provSel.value] || TTS_PROVIDER_VOICES.auto;
  const current = voiceSel.value;
  voiceSel.innerHTML = voices.map((v) => `<option value="${v}" ${v === current ? 'selected' : ''}>${escapeHtml(VOICE_LABELS[v] || v)}</option>`).join('');
  if (!voices.includes(voiceSel.value)) voiceSel.value = voices[0];
}

const IMAGE_PROVIDER_MAP = {
  api: [
    { value: 'kie',         label: 'KIE.ai',         models: ['z-image', 'z-image-turbo', 'flux-kontext-pro', 'flux-kontext-max', 'gpt-image-1', 'seedream', 'grok-imagine', 'qwen-edit-2511', 'ernie'] },
    { value: 'pollinations', label: 'Pollinations',   models: ['flux', 'flux-2', 'turbo', 'nano-banana-2'] },
    { value: 'piramyd',     label: 'Piramyd',         models: ['flux-2', 'flux2-klein', 'flux2-dev'] },
    { value: 'inemaimg',    label: 'inemaimg local',  models: ['flux2-klein', 'seedream'] },
  ],
  free: [
    { value: 'pexels',    label: 'Pexels',    models: [] },
    { value: 'unsplash',  label: 'Unsplash',  models: [] },
    { value: 'pixabay',   label: 'Pixabay',   models: [] },
  ],
};
const APPROVAL_OPTIONS = ['humano', 'agente', 'auto'];
const APPROVAL_STAGE_LABELS = {
  stage1: 'Estrategia e narrativa',
  stage2: 'Imagens',
  stage3: 'Video',
  stage4: 'Plataformas',
  stage5: 'Distribuicao',
};

const state = {
  view: 'config',
  configTab: 'geral',
  configVideoTab: 'geral',
  providers: null,
  dashboard: null,
  selectedCampaignId: null,
  selectedPayloadFile: null,
  selectedRunId: null,
  generatorPayloads: [],
  previewDirty: false,
  generatorNextSerial: null,
  generatorErrors: [],
  toolCategory: 'all',
  batchCategory: 'all',
  imageViewer: { list: [], index: 0, label: '' },
  queue: null,
  queueGroupOpen: { active: true, waiting: true, failed: true, delayed: false, completed: false },
};

const views = {
  config:    { title: 'Config',    node: 'configView' },
  inventory: { title: 'Campanhas', node: 'inventoryView' },
  tools:     { title: 'Serviços',  node: 'toolsView' },
  batches:   { title: 'Lotes',     node: 'batchesView' },
  generator: { title: 'Gerador',   node: 'generatorView' },
  runs:      { title: 'Monitor',    node: 'runsView' },
  queue:     { title: 'Fila BullMQ', node: 'queueView' },
};

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(iso) {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.error || `HTTP ${response.status}`);
  }
  return data;
}

function toast(message) {
  const node = qs('#toast');
  node.textContent = message;
  node.classList.add('is-visible');
  window.clearTimeout(toast._timer);
  toast._timer = window.setTimeout(() => node.classList.remove('is-visible'), 2800);
}

function setView(view) {
  state.view = view;
  qsa('.nav-item').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === view);
  });
  Object.entries(views).forEach(([key, meta]) => {
    qs(`#${meta.node}`).classList.toggle('is-active', key === view);
  });
  qs('#viewTitle').textContent = views[view].title;
  render();
}

async function refresh() {
  [state.dashboard, state.providers] = await Promise.all([
    api('/api/dashboard'),
    api('/api/providers'),
  ]);
  syncProviderMaps();
  if (!state.selectedCampaignId && state.dashboard.campaigns[0]) {
    state.selectedCampaignId = state.dashboard.campaigns[0].id;
  }
  if (!state.selectedPayloadFile && state.dashboard.payloads[0]) {
    state.selectedPayloadFile = state.dashboard.payloads[0].file;
  }
  render();
}

function syncProviderMaps() {
  const p = state.providers || {};
  if (p.image) {
    Object.assign(IMAGE_PROVIDER_MAP, p.image);
  }
  if (p.tts?.providers) {
    p.tts.providers.forEach((prov) => {
      TTS_PROVIDER_VOICES[prov.value] = prov.voices;
    });
  }
  if (p.tts?.voice_labels) {
    Object.assign(VOICE_LABELS, p.tts.voice_labels);
  }
}

function render() {
  if (!state.dashboard) return;
  renderMetrics();
  renderEnvCompact();
  if (state.view === 'config') renderConfig();
  if (state.view === 'inventory') renderInventory();
  if (state.view === 'tools') renderTools();
  if (state.view === 'batches') renderBatches();
  if (state.view === 'generator') { renderGenerator(); fetchNextSerial(); scheduleGeneratorPreview(0); }
  if (state.view === 'runs') renderRuns();
  if (state.view === 'queue') renderQueue();
}

function renderMetrics() {
  const summary = state.dashboard.summary;
  const metrics = [
    ['Projetos', summary.projects],
    ['Campanhas', summary.campaigns],
    ['Videos', summary.totalVideos ?? '—'],
    ['Imagens', (summary.totalImages ?? 0) + (summary.totalAds ?? 0)],
    ['Ads', summary.totalAds ?? '—'],
    ['Payloads', summary.payloads],
    ['Servicos', summary.services],
  ];
  qs('#metrics').innerHTML = metrics.map(([label, value]) => `
    <div class="metric">
      <strong>${escapeHtml(String(value))}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join('');
}

function renderEnvCompact() {
  qs('#envCompact').innerHTML = state.dashboard.env.map((item) => `
    <div class="env-row">
      <span>${escapeHtml(item.label)}</span>
      <span class="env-dot ${item.configured ? 'ok' : ''}" title="${item.configured ? 'configurado' : 'pendente'}"></span>
    </div>
  `).join('');
}

function projectOptions(selected) {
  return state.dashboard.projects.map((project) => {
    const value = project.relPath;
    return `<option value="${escapeHtml(value)}" ${selected === value ? 'selected' : ''}>${escapeHtml(project.name)}</option>`;
  }).join('');
}

function platformChecks(selected = [], prefix = 'platform') {
  return PLATFORM_OPTIONS.map((platform) => `
    <label class="check-pill">
      <input type="checkbox" name="${prefix}" value="${platform}" ${selected.includes(platform) ? 'checked' : ''}>
      ${platform}
    </label>
  `).join('');
}

function approvalSelect(stage, value) {
  return `
    <label class="field">
      <span>${escapeHtml(APPROVAL_STAGE_LABELS[stage] || stage)}</span>
      <select name="approval_${stage}">
        ${APPROVAL_OPTIONS.map((option) => `<option value="${option}" ${option === value ? 'selected' : ''}>${option}</option>`).join('')}
      </select>
    </label>
  `;
}

function optionList(options, selected) {
  return options.map((option) => {
    const value = Array.isArray(option) ? option[0] : option;
    const label = Array.isArray(option) ? option[1] : option;
    return `<option value="${escapeHtml(value)}" ${selected === value ? 'selected' : ''}>${escapeHtml(label)}</option>`;
  }).join('');
}

function valueLines(value) {
  if (Array.isArray(value)) return value.join('\n');
  return value || '';
}

function imageFormatChecks(selected = []) {
  const formats = [
    ['carousel_1080x1080', 'Carousel 1:1'],
    ['story_1080x1920', 'Story/Reels 9:16'],
    ['thumbnail_1280x720', 'Thumbnail 16:9'],
  ];
  return formats.map(([value, label]) => `
    <label class="check-pill">
      <input type="checkbox" name="image_format" value="${value}" ${selected.includes(value) ? 'checked' : ''}>
      ${label}
    </label>
  `).join('');
}

function videoFormatChecks(selected = []) {
  const formats = [
    ['9:16', 'Vertical 9:16'],
    ['1:1', 'Quadrado 1:1'],
    ['16:9', 'Horizontal 16:9'],
  ];
  return formats.map(([value, label]) => `
    <label class="check-pill">
      <input type="checkbox" name="video_format_item" value="${value}" ${selected.includes(value) ? 'checked' : ''}>
      ${label}
    </label>
  `).join('');
}

function voiceOptions(selected) {
  return optionList([
    ['rachel', 'Rachel - calorosa/emocional'],
    ['bella', 'Bella - clara/storytelling'],
    ['domi', 'Domi - confiante'],
    ['antoni', 'Antoni - profissional'],
    ['josh', 'Josh - grave/caloroso'],
    ['arnold', 'Arnold - forte/energetico'],
  ], selected || 'rachel');
}

function ttsProviderOptions(selected) {
  return optionList([
    ['auto', 'Auto: Chatterbox > Fish > ElevenLabs > MiniMax'],
    ['chatterbox-vc', 'Chatterbox VC local'],
    ['fish', 'Fish Audio'],
    ['elevenlabs', 'ElevenLabs'],
    ['minimax', 'MiniMax'],
  ], selected || 'auto');
}

function audioModeOptions(selected) {
  return optionList([
    ['narration', 'Narracao'],
    ['both', 'Narracao + musica'],
    ['none', 'Sem narracao'],
  ], selected || 'narration');
}

function renderCadastros() {
  const p = state.providers || {};
  const imgApi = (p.image?.api || IMAGE_PROVIDER_MAP.api || []);
  const ttsList = (p.tts?.providers || []);
  const audioModes = (p.audio_modes || []);
  const videoTemplates = (p.video_templates || []);

  function tagList(items, groupKey, itemKey) {
    return items.map((item) => `
      <span class="reg-tag">
        ${escapeHtml(item)}
        <button type="button" class="reg-tag-remove" data-action="cad-remove" data-group="${groupKey}" data-item="${escapeHtml(item)}" data-key="${itemKey}" title="Remover">×</button>
      </span>
    `).join('') || '<span class="muted" style="font-size:12px">Nenhum</span>';
  }

  function addItemForm(groupKey, itemKey, placeholder) {
    return `
      <form class="reg-add-form" data-action="cad-add" data-group="${groupKey}" data-key="${itemKey}">
        <input class="reg-add-input" placeholder="${escapeHtml(placeholder)}" required>
        <button type="submit" class="button ghost" style="min-height:32px;padding:4px 10px;font-size:12px">+ Adicionar</button>
      </form>
    `;
  }

  function providerCard(prov, group, itemPlaceholder) {
    return `
      <div class="cad-card">
        <div class="cad-card-head">
          <div style="display:flex;align-items:center;gap:8px;min-width:0">
            <span class="cad-card-title">${escapeHtml(prov.label)}</span>
            <code class="cad-card-key">${escapeHtml(prov.value)}</code>
          </div>
          <button type="button" class="cad-remove-provider" data-action="cad-remove-provider" data-group="${group}" data-key="${escapeHtml(prov.value)}" title="Remover provider">Remover</button>
        </div>
        <div class="reg-tags">${tagList(group === 'img_api' ? prov.models : prov.voices, group, prov.value)}</div>
        ${addItemForm(group, prov.value, itemPlaceholder)}
      </div>
    `;
  }

  function newProviderForm(group) {
    return `
      <div class="cad-card cad-card-new">
        <div class="cad-card-head">
          <span class="cad-card-title" style="color:var(--muted)">Novo provider</span>
        </div>
        <form class="reg-add-form" style="flex-direction:column;gap:8px" data-action="cad-add-provider" data-group="${group}">
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <input class="reg-add-input" name="prov_value" placeholder="value (ex: midjourney)" required style="flex:1;min-width:120px">
            <input class="reg-add-input" name="prov_label" placeholder="label (ex: Midjourney)" required style="flex:1;min-width:120px">
          </div>
          <div>
            <button type="submit" class="button" style="min-height:32px;padding:4px 14px;font-size:12px">+ Criar provider</button>
          </div>
        </form>
      </div>
    `;
  }

  const imgSection = imgApi.map((prov) => providerCard(prov, 'img_api', 'novo-modelo')).join('') + newProviderForm('img_api');

  const ttsSection = ttsList.map((prov) => providerCard(prov, 'tts', 'nova-voz (ex: sarah)')).join('') + newProviderForm('tts');

  const audioSection = `
    <div class="cad-card">
      <div class="cad-card-head">
        <span class="cad-card-title">Modos de áudio</span>
      </div>
      <div class="reg-tags">
        ${audioModes.map((m) => `
          <span class="reg-tag">
            ${escapeHtml(m.label)} <code style="font-size:10px;opacity:.6">${escapeHtml(m.value)}</code>
            <button type="button" class="reg-tag-remove" data-action="cad-remove" data-group="audio_modes" data-item="${escapeHtml(m.value)}" title="Remover">×</button>
          </span>
        `).join('')}
      </div>
      <form class="reg-add-form" data-action="cad-add" data-group="audio_modes" data-key="">
        <input class="reg-add-input" id="cadAudioValue" placeholder="value (ex: music_only)" required style="width:140px">
        <input class="reg-add-input" id="cadAudioLabel" placeholder="label (ex: Só música)" required style="width:150px">
        <button type="submit" class="button ghost" style="min-height:32px;padding:4px 10px;font-size:12px">+ Adicionar</button>
      </form>
    </div>
  `;

  const templateSection = `
    <div class="cad-card">
      <div class="cad-card-head">
        <span class="cad-card-title">Templates de vídeo Pro</span>
      </div>
      <div class="reg-tags">
        ${videoTemplates.map((t) => `
          <span class="reg-tag">
            ${escapeHtml(t.label)} <code style="font-size:10px;opacity:.6">${escapeHtml(t.value)}</code>
            <button type="button" class="reg-tag-remove" data-action="cad-remove" data-group="video_templates" data-item="${escapeHtml(t.value)}" title="Remover">×</button>
          </span>
        `).join('')}
      </div>
      <form class="reg-add-form" data-action="cad-add" data-group="video_templates" data-key="">
        <input class="reg-add-input" id="cadTplValue" placeholder="value (ex: cinematic)" required style="width:140px">
        <input class="reg-add-input" id="cadTplLabel" placeholder="label (ex: Cinemático)" required style="width:150px">
        <button type="submit" class="button ghost" style="min-height:32px;padding:4px 10px;font-size:12px">+ Adicionar</button>
      </form>
    </div>
  `;

  return `
    <div class="csec">
      <div class="csec-head">Modelos de imagem por provider</div>
      <div class="cad-grid">${imgSection}</div>
    </div>
    <div class="csec">
      <div class="csec-head">Vozes por provider TTS</div>
      <div class="cad-grid">${ttsSection}</div>
    </div>
    <div class="csec">
      <div class="csec-head">Modos de áudio e templates de vídeo</div>
      <div class="cad-grid">${audioSection}${templateSection}</div>
    </div>
  `;
}

async function saveProviders() {
  await api('/api/providers', { method: 'POST', body: JSON.stringify(state.providers) });
  syncProviderMaps();
  renderConfig();
  toast('Cadastros salvos');
}

function imgProviderOptions(source, selectedProvider) {
  const list = IMAGE_PROVIDER_MAP[source] || [];
  return list.map((p) => `<option value="${p.value}" ${p.value === selectedProvider ? 'selected' : ''}>${escapeHtml(p.label)}</option>`).join('');
}

function imgModelsForProvider(source, provider) {
  const list = IMAGE_PROVIDER_MAP[source] || [];
  const found = list.find((p) => p.value === provider);
  return found ? found.models : [];
}

function applyImgSourceChange(source) {
  const providerField = qs('#imgProviderField');
  const modelField = qs('#imgModelField');
  if (!providerField) return;

  const providers = IMAGE_PROVIDER_MAP[source] || [];
  if (providers.length === 0) {
    providerField.style.display = 'none';
    if (modelField) modelField.style.display = 'none';
    return;
  }
  providerField.style.display = '';
  const providerSelect = qs('#imgProviderSelect');
  const currentProvider = providerSelect?.value || providers[0].value;
  const validProvider = providers.find((p) => p.value === currentProvider) ? currentProvider : providers[0].value;
  providerSelect.innerHTML = imgProviderOptions(source, validProvider);
  applyImgProviderChange(source, validProvider);
}

function applyImgProviderChange(source, provider) {
  const modelField = qs('#imgModelField');
  if (!modelField) return;
  if (source !== 'api') {
    modelField.style.display = 'none';
    return;
  }
  modelField.style.display = '';
  const models = imgModelsForProvider(source, provider);
  const datalist = qs('#imgModelDatalist');
  const customInput = qs('#imgModelCustom');
  if (datalist) {
    datalist.innerHTML = models.map((m) => `<option value="${m}"></option>`).join('');
  }
  if (customInput && !models.includes(customInput.value)) {
    customInput.value = models[0] || '';
  }
}

function renderConfig() {
  const config = state.dashboard.config || {};
  const approvals = config.approval_modes || {};
  const tab = state.configTab || 'geral';
  const videoTab = state.configVideoTab || 'geral';

  const tabs = [
    ['geral', 'Geral'],
    ['imagem', 'Imagem'],
    ['video', 'Vídeo'],
    ['pipeline', 'Pipeline'],
    ['cadastros', 'Cadastros'],
    ['ambiente', 'Ambiente'],
  ];

  const tabNav = `
    <div class="config-tabs">
      ${tabs.map(([key, label]) => `
        <button class="config-tab ${tab === key ? 'is-active' : ''}" data-action="config-tab" data-tab="${key}">${label}</button>
      `).join('')}
    </div>
  `;

  let tabContent = '';

  if (tab === 'geral') {
    tabContent = `
      <div class="csec">
        <div class="csec-head">Projeto e idioma</div>
        <div class="form-grid">
          <label class="field">
            <span>Projeto padrão</span>
            <select name="project_dir">${projectOptions(config.project_dir)}</select>
          </label>
          <label class="field">
            <span>Idioma</span>
            <input name="language" value="${escapeHtml(config.language || 'pt-BR')}">
          </label>
        </div>
      </div>
      <div class="csec">
        <div class="csec-head">Flags do pipeline</div>
        <div class="flags-grid">
          ${checkbox('skip_research', 'Pular pesquisa', config.skip_research)}
          ${checkbox('skip_image', 'Pular imagens', config.skip_image)}
          ${checkbox('skip_video', 'Pular vídeo', config.skip_video)}
          ${checkbox('dry_run', 'Dry run', config.dry_run)}
          ${checkbox('simulate_uploads', 'Simular uploads', config.simulate_uploads)}
          ${checkbox('notifications', 'Notificações', config.notifications)}
        </div>
      </div>
      <div class="csec">
        <div class="csec-head">Lotes</div>
        <div class="form-grid">
          <label class="field">
            <span>Prefixo</span>
            <input name="batch_prefix" value="${escapeHtml(config.batch?.name_prefix || 'c')}">
          </label>
          <label class="field">
            <span>Tamanho padrão</span>
            <input type="number" min="1" max="50" name="batch_count" value="${escapeHtml(config.batch?.default_count || 3)}">
          </label>
          <label class="field">
            <span>Delay entre itens (s)</span>
            <input type="number" min="0" max="3600" name="batch_delay" value="${escapeHtml(config.batch?.delay_seconds || 0)}">
          </label>
        </div>
      </div>
    `;
  }

  if (tab === 'imagem') {
    const imgSource = config.image_source || 'api';
    const imgProvider = imgSource === 'free' ? (config.free_image_provider || 'pexels') : (config.image_provider || 'kie');
    const imgModel = config.image_model || 'z-image';
    const hasProvider = (IMAGE_PROVIDER_MAP[imgSource] || []).length > 0;
    const hasModel = imgSource === 'api';
    const providerModels = imgModelsForProvider(imgSource, imgProvider);

    tabContent = `
      <div class="csec">
        <div class="csec-head">Fonte → Provider → Modelo</div>
        <div class="img-hierarchy">
          <label class="field">
            <span>Fonte</span>
            <select name="image_source" id="imgSourceSelect">
              ${optionList([['api','API / IA'],['free','Banco grátis'],['brand','Assets da marca'],['folder','Pasta local'],['screenshot','Screenshot de URL'],['solid','Fundo sólido']], imgSource)}
            </select>
          </label>

          <div class="img-sub" id="imgProviderField" ${hasProvider ? '' : 'style="display:none"'}>
            <label class="field">
              <span>Provider</span>
              <select name="image_provider" id="imgProviderSelect">
                ${imgProviderOptions(imgSource, imgProvider)}
              </select>
            </label>
          </div>

          <div class="img-sub" id="imgModelField" ${hasModel ? '' : 'style="display:none"'}>
            <label class="field">
              <span>Modelo</span>
              <input name="image_model" id="imgModelCustom" list="imgModelDatalist"
                value="${escapeHtml(imgModel)}"
                placeholder="escolha ou digite um modelo">
              <datalist id="imgModelDatalist">
                ${providerModels.map((m) => `<option value="${m}"></option>`).join('')}
              </datalist>
              <div class="img-model-chips">
                ${providerModels.map((m) => `<button type="button" class="model-chip ${m === imgModel ? 'is-active' : ''}" data-action="pick-model" data-model="${escapeHtml(m)}">${escapeHtml(m)}</button>`).join('')}
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="csec">
        <div class="csec-head">Quantidade e fundo</div>
        <div class="form-grid">
          <label class="field">
            <span>Quantidade</span>
            <input type="number" min="1" max="30" name="image_count" value="${escapeHtml(config.image_count || 10)}">
          </label>
          <label class="field">
            <span>Fundo para 1:1</span>
            <select name="image_bg_mode">
              ${optionList([['dark','Fundo escuro'],['blur','Blur da imagem']], config.image_bg_mode || 'dark')}
            </select>
          </label>
          <label class="field">
            <span>Cor fundo sólido</span>
            <input name="image_background_color" value="${escapeHtml(config.image_background_color || '#0D0D0D')}">
          </label>
        </div>
      </div>

      <div class="csec">
        <div class="csec-head">Referências e contexto</div>
        <div class="form-grid">
          <label class="field full">
            <span>Pasta local para imagens</span>
            <input name="image_folder" placeholder="prj/inema/assets/logo" value="${escapeHtml(config.image_folder || '')}">
          </label>
          <label class="field full">
            <span>Imagem ou pasta de referência</span>
            <input name="image_reference" placeholder="prj/inema/assets/logo/logo.jpg" value="${escapeHtml(config.image_reference || '')}">
          </label>
          <label class="field full">
            <span>Nota para referência visual</span>
            <input name="image_reference_note" placeholder="ex: manter paleta, luz e enquadramento" value="${escapeHtml(config.image_reference_note || '')}">
          </label>
          <label class="field full">
            <span>URLs para screenshot</span>
            <textarea name="screenshot_urls" placeholder="https://exemplo.com&#10;https://outra-pagina.com">${escapeHtml(valueLines(config.screenshot_urls))}</textarea>
          </label>
        </div>
      </div>

      <div class="csec">
        <div class="csec-head">Formatos e sobreposição</div>
        <div class="form-grid">
          <div class="field full">
            <span class="label">Formatos de imagem</span>
            <div class="check-row">${imageFormatChecks(config.image_formats || ['carousel_1080x1080'])}</div>
          </div>
          <div class="field full">
            <div class="check-row">
              ${checkbox('use_brand_overlay', 'Brand overlay', config.use_brand_overlay)}
              <span class="badge">brand_identity.md</span>
              <span class="badge">product_campaign.md</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (tab === 'video') {
    const vtabs = [['geral','Geral & áudio'],['quick','Quick'],['pro','Pro']];
    const vTabNav = `
      <div class="video-subtabs">
        ${vtabs.map(([k, l]) => `
          <button class="video-subtab ${videoTab === k ? 'is-active' : ''}" data-action="video-subtab" data-vtab="${k}">${l}</button>
        `).join('')}
      </div>
    `;

    let vContent = '';
    if (videoTab === 'geral') {
      vContent = `
        <div class="form-grid">
          <label class="field">
            <span>Modo de vídeo</span>
            <select name="video_mode">
              ${optionList([['quick','Quick'],['pro','Pro'],['both','Quick + Pro'],['none','Sem vídeo']], config.video_mode || 'quick')}
            </select>
          </label>
          <label class="field">
            <span>Quantidade de vídeos</span>
            <input type="number" min="1" max="10" name="video_count" value="${escapeHtml(config.video_count || 1)}">
          </label>
          <label class="field">
            <span>Formato legado</span>
            <input name="video_format" value="${escapeHtml(config.video_format || 'reel_1080x1920')}">
          </label>
          <label class="field">
            <span>Preset visual</span>
            <select name="style_preset">
              ${optionList([['inema_hightech','INEMA hightech'],['01_hero_film','Hero film'],['02_product_demo','Product demo'],['03_explainer','Explainer'],['10_problem_solution','Problema e solução'],['13_kinetic_typography','Kinetic typography'],['14_short_vertical','Short vertical'],['20_performance_ad','Performance ad']], config.style_preset || 'inema_hightech')}
            </select>
          </label>
          <div class="field full">
            <span class="label">Formatos solicitados</span>
            <div class="check-row">${videoFormatChecks(config.video_formats || ['9:16'])}</div>
          </div>
        </div>
        <div class="csec" style="margin-top:16px">
          <div class="csec-head">Áudio e voz padrão (fallback para Quick e Pro)</div>
          <div class="tts-hierarchy">
            <label class="field">
              <span>Modo de áudio</span>
              <select name="video_audio">${audioModeOptions(config.video_audio || 'narration')}</select>
            </label>
            <div class="img-sub">
              <label class="field">
                <span>Provider TTS</span>
                <select name="tts_provider" id="ttsFallbackProvider" onchange="applyTtsProviderChange('ttsFallbackProvider','ttsFallbackVoice')">
                  ${ttsProviderOptions(config.tts_provider || 'auto')}
                </select>
              </label>
              <div class="img-sub" style="margin-top:10px">
                <label class="field">
                  <span>Voz</span>
                  <select name="narrator" id="ttsFallbackVoice">
                    ${ttsVoiceOptions(config.tts_provider || 'auto', config.narrator || config.voice || 'rachel')}
                  </select>
                </label>
              </div>
            </div>
            <label class="field" style="margin-top:10px;max-width:360px">
              <span>Narração existente</span>
              <input name="existing_narration_file" placeholder="prj/inema/outputs/.../audio/narration.mp3" value="${escapeHtml(config.existing_narration_file || '')}">
            </label>
          </div>
        </div>
      `;
    }
    if (videoTab === 'quick') {
      vContent = `
        <div class="form-grid">
          <label class="field">
            <span>Modo de áudio</span>
            <select name="quick_video_audio">${audioModeOptions(config.quick_video_audio || config.video_audio || 'narration')}</select>
          </label>
          <div></div>
          <div class="field tts-hier-wrap">
            <span class="label">Provider TTS</span>
            <select name="quick_tts_provider" id="ttsQuickProvider" onchange="applyTtsProviderChange('ttsQuickProvider','ttsQuickVoice')">
              ${ttsProviderOptions(config.quick_tts_provider || config.tts_provider || 'auto')}
            </select>
          </div>
          <div class="field tts-hier-wrap tts-voice-sub">
            <span class="label">Voz</span>
            <select name="quick_narrator" id="ttsQuickVoice">
              ${ttsVoiceOptions(config.quick_tts_provider || config.tts_provider || 'auto', config.quick_narrator || config.narrator || 'rachel')}
            </select>
          </div>
          <label class="field">
            <span>Fonte do roteiro</span>
            <select name="quick_narration_source">
              ${optionList([['narrative_short','Narrativa resumida'],['copywriter_video_narration','video_narration Copywriter'],['creative_brief','Creative brief'],['manual_existing','Arquivo de narração']], config.quick_narration_source || 'narrative_short')}
            </select>
          </label>
          <label class="field">
            <span>Modo Quick</span>
            <select name="quick_mode">
              ${optionList([['normal','Normal'],['enxuto','Enxuto / lote']], config.quick_mode || 'normal')}
            </select>
          </label>
          <label class="field">
            <span>Fundo para 1:1</span>
            <select name="image_bg_mode">
              ${optionList([['dark','Fundo escuro'],['blur','Blur da imagem']], config.image_bg_mode || 'dark')}
            </select>
          </label>
          <label class="field">
            <span>Duração (s)</span>
            <input type="number" min="10" max="60" name="quick_duration" value="${escapeHtml(config.quick_duration || 18)}">
          </label>
          <label class="field">
            <span>Narração (s)</span>
            <input type="number" min="5" max="55" name="quick_narration_seconds" value="${escapeHtml(config.quick_narration_seconds || 15)}">
          </label>
          <label class="field">
            <span>Palavras</span>
            <input type="number" min="10" max="180" name="quick_narration_words" value="${escapeHtml(config.quick_narration_words || 45)}">
          </label>
          <label class="field">
            <span>Cenas</span>
            <input type="number" min="3" max="12" name="quick_scene_count" value="${escapeHtml(config.quick_scene_count || 6)}">
          </label>
          <label class="field">
            <span>Hold final (s)</span>
            <input type="number" min="0" max="10" name="quick_hold_seconds" value="${escapeHtml(config.quick_hold_seconds || 3)}">
          </label>
          <label class="field full">
            <span>Narração existente</span>
            <input name="quick_existing_narration_file" placeholder="prj/inema/outputs/.../audio/quick.mp3" value="${escapeHtml(config.quick_existing_narration_file || '')}">
          </label>
        </div>
      `;
    }
    if (videoTab === 'pro') {
      vContent = `
        <div class="form-grid">
          <label class="field">
            <span>Modo de áudio</span>
            <select name="pro_video_audio">${audioModeOptions(config.pro_video_audio || config.video_audio || 'narration')}</select>
          </label>
          <div></div>
          <div class="field tts-hier-wrap">
            <span class="label">Provider TTS</span>
            <select name="pro_tts_provider" id="ttsProProvider" onchange="applyTtsProviderChange('ttsProProvider','ttsProVoice')">
              ${ttsProviderOptions(config.pro_tts_provider || config.tts_provider || 'auto')}
            </select>
          </div>
          <div class="field tts-hier-wrap tts-voice-sub">
            <span class="label">Voz</span>
            <select name="pro_narrator" id="ttsProVoice">
              ${ttsVoiceOptions(config.pro_tts_provider || config.tts_provider || 'auto', config.pro_narrator || config.narrator || 'rachel')}
            </select>
          </div>
          <label class="field">
            <span>Fonte do roteiro</span>
            <select name="pro_narration_source">
              ${optionList([['creative_brief','Creative brief + marca'],['copywriter_video_narration','video_narration Copywriter'],['research_brief','Pesquisa + creative brief'],['manual_existing','Arquivo de narração']], config.pro_narration_source || 'creative_brief')}
            </select>
          </label>
          <label class="field">
            <span>Duração (s)</span>
            <input type="number" min="10" max="180" name="pro_duration" value="${escapeHtml(config.pro_duration || config.video_duration || 60)}">
          </label>
          <label class="field">
            <span>Palavras/segundo</span>
            <input type="number" min="1" max="4" step="0.1" name="pro_words_per_second" value="${escapeHtml(config.pro_words_per_second || 2.5)}">
          </label>
          <label class="field">
            <span>Palavras</span>
            <input type="number" min="30" max="600" name="pro_narration_words" value="${escapeHtml(config.pro_narration_words || Math.round((config.pro_duration || config.video_duration || 60) * 2.5))}">
          </label>
          <label class="field">
            <span>Template</span>
            <select name="video_template">
              ${optionList([['auto','Auto'],['data_story','Data story'],['explainer','Explainer'],['narrativo','Narrativo'],['brand_film','Brand film'],['report','Report'],['gatilhos','Gatilhos']], config.video_template || 'auto')}
            </select>
          </label>
          <label class="field">
            <span>Photography Director</span>
            <select name="photo_quality">
              ${optionList([['simples','Simples / Sonnet'],['premium','Premium / Opus']], config.photo_quality || 'simples')}
            </select>
          </label>
          <label class="field">
            <span>Scene Plan</span>
            <select name="scene_quality">
              ${optionList([['simples','Simples / Sonnet'],['premium','Premium / Opus']], config.scene_quality || 'simples')}
            </select>
          </label>
          <label class="field full">
            <span>Narração existente</span>
            <input name="pro_existing_narration_file" placeholder="prj/inema/outputs/.../audio/pro.mp3" value="${escapeHtml(config.pro_existing_narration_file || '')}">
          </label>
          <div class="field full">
            <div class="check-row">
              ${checkbox('video_draft', 'Renderizar draft Pro', config.video_draft)}
              ${checkbox('skip_completed', 'Pular se vídeo já existe', config.skip_completed)}
            </div>
          </div>
        </div>
      `;
    }

    tabContent = `${vTabNav}<div class="video-tab-content">${vContent}</div>`;
  }

  if (tab === 'pipeline') {
    tabContent = `
      <div class="csec">
        <div class="csec-head">Plataformas padrão</div>
        <div class="check-row">${platformChecks(config.platform_targets || [], 'config_platform')}</div>
      </div>
      <div class="csec">
        <div class="csec-head">Aprovações por stage</div>
        <div class="grid-3">
          ${['stage1','stage2','stage3','stage4','stage5'].map((s) => approvalSelect(s, approvals[s] || 'humano')).join('')}
        </div>
      </div>
    `;
  }

  if (tab === 'cadastros') {
    tabContent = renderCadastros();
  }

  if (tab === 'ambiente') {
    tabContent = `
      <div class="env-compact-grid">
        ${state.dashboard.env.map((item) => `
          <div class="env-compact-item">
            <div>
              <div class="env-compact-label">${escapeHtml(item.label)}</div>
              <div class="env-compact-keys">${escapeHtml(item.env.join(', '))}</div>
            </div>
            <span class="badge ${item.configured ? 'ok' : 'empty'}">${item.configured ? 'ok' : 'pendente'}</span>
          </div>
        `).join('')}
      </div>
      <p class="muted" style="margin-top:14px;font-size:12px">Verificado em ${formatDate(state.dashboard.generatedAt)}</p>
    `;
  }

  qs('#configView').innerHTML = `
    <form class="panel" id="configForm">
      <div class="section-title">
        <h2>Defaults do pipeline</h2>
        <div style="display:flex;gap:8px">
          <button class="button ghost" type="button" data-action="reset-config">Resetar</button>
          <button class="button" type="submit">Salvar defaults</button>
        </div>
      </div>
      ${tabNav}
      <div class="config-tab-content">
        ${tabContent}
      </div>
    </form>
  `;
}

function checkbox(name, label, checked) {
  return `
    <label class="check-pill">
      <input type="checkbox" name="${name}" ${checked ? 'checked' : ''}>
      ${escapeHtml(label)}
    </label>
  `;
}

function collectConfigForm(form) {
  const data = new FormData(form);
  const videoMode = data.get('video_mode');
  const screenshotUrls = String(data.get('screenshot_urls') || '')
    .split(/\n|,/)
    .map((value) => value.trim())
    .filter(Boolean);
  const imageFormats = data.getAll('image_format');
  const videoFormats = data.getAll('video_format_item');
  const narrator = data.get('narrator') || 'rachel';
  const quickNarrator = data.get('quick_narrator') || narrator;
  const proNarrator = data.get('pro_narrator') || narrator;
  const proDuration = Number(data.get('pro_duration') || 60);
  const proWordsPerSecond = Number(data.get('pro_words_per_second') || 2.5);
  return {
    project_dir: data.get('project_dir'),
    language: data.get('language') || 'pt-BR',
    platform_targets: data.getAll('config_platform'),
    approval_modes: {
      stage1: data.get('approval_stage1'),
      stage2: data.get('approval_stage2'),
      stage3: data.get('approval_stage3'),
      stage4: data.get('approval_stage4'),
      stage5: data.get('approval_stage5'),
    },
    notifications: data.has('notifications'),
    skip_research: data.has('skip_research'),
    skip_image: data.has('skip_image'),
    skip_video: data.has('skip_video') || videoMode === 'none',
    image_source: data.get('image_source'),
    image_provider: data.get('image_source') === 'free' ? ((state.dashboard.config || {}).image_provider || 'kie') : (data.get('image_provider') || 'kie'),
    image_model: data.get('image_model') || 'z-image',
    free_image_provider: data.get('image_source') === 'free' ? (data.get('image_provider') || 'pexels') : ((state.dashboard.config || {}).free_image_provider || 'pexels'),
    image_count: Number(data.get('image_count') || 10),
    image_formats: imageFormats.length ? imageFormats : ['carousel_1080x1080'],
    image_folder: data.get('image_folder') || '',
    image_reference: data.get('image_reference') || '',
    image_reference_note: data.get('image_reference_note') || '',
    image_background_color: data.get('image_background_color') || '#0D0D0D',
    screenshot_urls: screenshotUrls,
    video_mode: videoMode,
    video_quick: videoMode === 'quick' || videoMode === 'both',
    video_pro: videoMode === 'pro' || videoMode === 'both',
    video_count: Number(data.get('video_count') || 1),
    video_audio: data.get('video_audio') || 'narration',
    video_duration: proDuration,
    video_format: data.get('video_format') || 'reel_1080x1920',
    video_formats: videoFormats.length ? videoFormats : ['9:16'],
    quick_mode: data.get('quick_mode') || 'normal',
    quick_video_audio: data.get('quick_video_audio') || data.get('video_audio') || 'narration',
    quick_tts_provider: data.get('quick_tts_provider') || data.get('tts_provider') || 'auto',
    quick_narrator: quickNarrator,
    quick_narration_source: data.get('quick_narration_source') || 'narrative_short',
    quick_duration: Number(data.get('quick_duration') || 18),
    quick_narration_seconds: Number(data.get('quick_narration_seconds') || 15),
    quick_narration_words: Number(data.get('quick_narration_words') || 45),
    quick_scene_count: Number(data.get('quick_scene_count') || 6),
    quick_hold_seconds: Number(data.get('quick_hold_seconds') || 3),
    quick_existing_narration_file: data.get('quick_existing_narration_file') || '',
    video_template: data.get('video_template') || 'auto',
    pro_video_audio: data.get('pro_video_audio') || data.get('video_audio') || 'narration',
    pro_tts_provider: data.get('pro_tts_provider') || data.get('tts_provider') || 'auto',
    pro_narrator: proNarrator,
    pro_narration_source: data.get('pro_narration_source') || 'creative_brief',
    pro_duration: proDuration,
    pro_words_per_second: proWordsPerSecond,
    pro_narration_words: Number(data.get('pro_narration_words') || Math.round(proDuration * proWordsPerSecond)),
    pro_existing_narration_file: data.get('pro_existing_narration_file') || '',
    style_preset: data.get('style_preset') || 'inema_hightech',
    photo_quality: data.get('photo_quality') || 'simples',
    scene_quality: data.get('scene_quality') || 'simples',
    video_draft: data.has('video_draft'),
    image_bg_mode: data.get('image_bg_mode') || 'dark',
    skip_completed: data.has('skip_completed'),
    tts_provider: data.get('tts_provider') || 'auto',
    narrator,
    voice: narrator,
    existing_narration_file: data.get('existing_narration_file') || '',
    simulate_uploads: data.has('simulate_uploads'),
    dry_run: data.has('dry_run'),
    use_brand_overlay: data.has('use_brand_overlay'),
    batch: {
      default_count: Number(data.get('batch_count') || 3),
      name_prefix: data.get('batch_prefix') || 'c',
      delay_seconds: Number(data.get('batch_delay') || 0),
    },
  };
}

const STAGE_ICONS = { stage1: '✦', stage2: '◈', stage3: '▶', stage4: '◉', stage5: '↑' };
const STAGE_LABELS_SHORT = { stage1: 'Estratégia', stage2: 'Imagens', stage3: 'Vídeo', stage4: 'Plataformas', stage5: 'Distribuição' };

function stageProgress(stages) {
  const done = stages.filter((s) => s.status === 'done').length;
  return Math.round((done / stages.length) * 100);
}

function renderInventory() {
  const wasSearchFocused = document.activeElement?.id === 'inventorySearch';
  const searchCursor = wasSearchFocused ? qs('#inventorySearch')?.selectionStart ?? null : null;
  const projectFilter = qs('#inventoryProject')?.value || 'all';
  const search = (qs('#inventorySearch')?.value || '').toLowerCase();
  const campaigns = state.dashboard.campaigns.filter((campaign) => {
    const matchesProject = projectFilter === 'all' || campaign.project === projectFilter;
    const haystack = `${campaign.name} ${campaign.task_name} ${campaign.project} ${campaign.platforms.join(' ')}`.toLowerCase();
    return matchesProject && (!search || haystack.includes(search));
  });
  const selected = state.dashboard.campaigns.find((campaign) => campaign.id === state.selectedCampaignId) || campaigns[0];

  qs('#inventoryView').innerHTML = `
    <div class="inv-toolbar">
      <div class="inv-search-wrap">
        <input id="inventorySearch" class="inv-search" placeholder="Buscar campanhas..." value="${escapeHtml(search)}">
      </div>
      <select id="inventoryProject" class="inv-project-select">
        <option value="all">Todos os projetos</option>
        ${state.dashboard.projects.map((project) => `<option value="${escapeHtml(project.name)}" ${project.name === projectFilter ? 'selected' : ''}>${escapeHtml(project.name)}</option>`).join('')}
      </select>
      <span class="inv-count">${campaigns.length} campanha${campaigns.length !== 1 ? 's' : ''}</span>
    </div>

    <div class="inv-layout">
      <div class="inv-list-col">
        <div class="inv-list">
          ${campaigns.map(renderCampaignRow).join('') || '<p class="muted" style="padding:16px">Nenhuma campanha encontrada.</p>'}
        </div>
      </div>

      <div class="inv-detail-col">
        ${selected ? renderCampaignDetail(selected) : '<p class="muted" style="padding:24px">Selecione uma campanha.</p>'}
      </div>
    </div>
  `;
  if (wasSearchFocused) {
    const searchEl = qs('#inventorySearch');
    if (searchEl) {
      searchEl.focus();
      try { searchEl.setSelectionRange(searchCursor, searchCursor); } catch {}
    }
  }
}

function renderCampaignRow(campaign) {
  const isSelected = campaign.id === state.selectedCampaignId;
  const progress = stageProgress(campaign.stages);
  const doneStages = campaign.stages.filter((s) => s.status === 'done').length;
  const hasContent = campaign.counts.ads > 0 || campaign.counts.sourceImages > 0 || campaign.counts.videos > 0;

  return `
    <button class="inv-row ${isSelected ? 'is-selected' : ''}" data-action="select-campaign" data-id="${escapeHtml(campaign.id)}">
      <div class="inv-row-top">
        <span class="inv-row-name">${escapeHtml(campaign.name)}</span>
        <span class="inv-row-date">${escapeHtml(campaign.task_date || '—')}</span>
      </div>
      <div class="inv-row-meta">
        <span class="inv-row-project">${escapeHtml(campaign.project)}</span>
        ${hasContent ? `<span class="inv-row-counts">
          ${campaign.counts.ads > 0 ? `<span class="inv-cnt ads" title="Ads">${campaign.counts.ads} ad${campaign.counts.ads !== 1 ? 's' : ''}</span>` : ''}
          ${campaign.counts.sourceImages > 0 ? `<span class="inv-cnt imgs" title="Imagens">${campaign.counts.sourceImages} img</span>` : ''}
          ${campaign.counts.videos > 0 ? `<span class="inv-cnt vids" title="Vídeos">${campaign.counts.videos} vid</span>` : ''}
        </span>` : ''}
      </div>
      <div class="inv-row-progress">
        <div class="inv-progress-track">
          <div class="inv-progress-fill" style="width:${progress}%"></div>
        </div>
        <span class="inv-progress-label">${doneStages}/${campaign.stages.length}</span>
      </div>
    </button>
  `;
}

function renderMediaGroup(campaign, key, label) {
  const list = campaign.media?.[key] || [];
  if (!list.length) return '';
  const visible = list.slice(0, 12);
  const more = list.length - visible.length;
  return `
    <div class="inv-media-group">
      <div class="inv-media-head">
        <span class="inv-media-label">${escapeHtml(label)}</span>
        <span class="inv-media-count">${list.length} ${list.length === 1 ? 'arquivo' : 'arquivos'}</span>
      </div>
      <div class="inv-preview-strip">
        ${visible.map((preview, idx) => `
          <div class="inv-preview-wrap">
            <button type="button" class="inv-preview-thumb" data-action="open-image" data-campaign-id="${escapeHtml(campaign.id)}" data-group="${key}" data-index="${idx}" title="${escapeHtml(preview.name)}">
              <img src="${preview.url}" alt="${escapeHtml(preview.name)}" loading="lazy">
            </button>
            <a class="inv-preview-dl" href="/api/download?path=${encodeURIComponent(preview.path)}" download title="Baixar">↓</a>
          </div>
        `).join('')}
        ${more > 0 ? `<button type="button" class="inv-preview-more" data-action="open-image" data-campaign-id="${escapeHtml(campaign.id)}" data-group="${key}" data-index="${visible.length}">+${more}</button>` : ''}
      </div>
    </div>
  `;
}

function renderCampaignDetail(campaign) {
  const progress = stageProgress(campaign.stages);
  const hasMedia = campaign.counts.ads > 0 || campaign.counts.sourceImages > 0 || campaign.counts.videos > 0;

  return `
    <div class="inv-detail">
      <div class="inv-detail-header">
        <div class="inv-detail-title-wrap">
          <h2 class="inv-detail-title">${escapeHtml(campaign.name)}</h2>
          <span class="inv-detail-project">${escapeHtml(campaign.project)}</span>
        </div>
        <div class="inv-detail-meta-right">
          <span class="inv-detail-date">${formatDate(campaign.updatedAt)}</span>
          ${hasMedia ? `<a class="inv-zip-btn" href="/api/download-zip?campaign=${encodeURIComponent(campaign.relPath)}" download title="Baixar todas as mídias">↓ ZIP</a>` : ''}
        </div>
      </div>

      ${renderMediaGroup(campaign, 'ads', 'Ads finalizados')}
      ${renderMediaGroup(campaign, 'images', 'Imagens base (geradas)')}

      <div class="inv-detail-counts">
        <div class="inv-detail-count">
          <span class="inv-detail-count-num">${campaign.counts.ads}</span>
          <span class="inv-detail-count-label">Ads</span>
        </div>
        <div class="inv-detail-count">
          <span class="inv-detail-count-num">${campaign.counts.sourceImages}</span>
          <span class="inv-detail-count-label">Imagens</span>
        </div>
        <div class="inv-detail-count">
          <span class="inv-detail-count-num">${campaign.counts.videos}</span>
          <span class="inv-detail-count-label">Vídeos</span>
        </div>
        <div class="inv-detail-count">
          <span class="inv-detail-count-num">${campaign.platforms.length}</span>
          <span class="inv-detail-count-label">Canais</span>
        </div>
      </div>

      <div class="inv-stages">
        <div class="inv-stages-header">
          <span>Etapa</span>
          <span>Detalhes</span>
          <span>Parâmetros</span>
          <span>Status</span>
        </div>
        ${campaign.stages.map((stage) => {
          const hasFiles = stage.files && stage.files.length > 0;
          const hasParams = !!(campaign.files.payload && STAGE_PAYLOAD_KEYS[stage.key]);
          const stageLabel = escapeHtml(STAGE_LABELS_SHORT[stage.key] || stage.label);
          const payloadAttr = hasParams ? `data-payload="${escapeHtml(campaign.files.payload)}"` : '';
          return `
            <div class="inv-stage-row ${stage.status}">
              <div class="inv-stage-name">
                <span class="inv-stage-icon">${STAGE_ICONS[stage.key] || '·'}</span>
                <span class="inv-stage-label">${stageLabel}</span>
              </div>
              <div class="inv-stage-detail-col">
                <span class="inv-stage-detail">${escapeHtml(stage.detail)}</span>
                ${hasFiles ? `<button class="inv-stage-files-btn" type="button" data-action="show-stage-detail" data-files="${escapeHtml(JSON.stringify(stage.files))}" data-label="${stageLabel}">${stage.files.length} arquivo${stage.files.length !== 1 ? 's' : ''} gerados</button>` : '<span class="inv-stage-no-files">—</span>'}
              </div>
              <div class="inv-stage-params-col">
                ${hasParams
                  ? `<button class="inv-stage-params-btn" type="button" data-action="show-stage-params" data-stage-key="${escapeHtml(stage.key)}" data-label="${stageLabel}" ${payloadAttr}>⚙ Ver parâmetros</button>`
                  : '<span class="inv-stage-no-files">—</span>'}
              </div>
              <div class="inv-stage-status-col">
                <span class="inv-stage-badge ${stage.status}">${stage.status === 'done' ? 'ok' : stage.status === 'waiting' ? 'aguard.' : '—'}</span>
              </div>
            </div>
          `;
        }).join('')}
        <div class="inv-stage-progress-bar">
          <div class="inv-stage-progress-fill" style="width:${progress}%"></div>
        </div>
      </div>

      ${campaign.platforms.length ? `
        <div class="inv-platforms">
          ${campaign.platforms.map((platform) => `<span class="inv-platform-chip">${escapeHtml(platform)}</span>`).join('')}
        </div>
      ` : ''}

      <div class="inv-actions">
        ${campaign.files.report ? `<a class="button ghost" href="/asset?path=${encodeURIComponent(campaign.files.report)}" target="_blank" rel="noreferrer">Relatório</a>` : ''}
        ${campaign.files.payload ? `<button class="button ghost" data-action="open-file" data-path="${escapeHtml(campaign.files.payload)}">Payload</button>` : ''}
        ${campaign.files.mediaUrls ? `<button class="button ghost" data-action="open-file" data-path="${escapeHtml(campaign.files.mediaUrls)}">Media URLs</button>` : ''}
        ${campaign.files.publish.map((file) => `<button class="button ghost" data-action="open-file" data-path="${escapeHtml(file)}">Publish MD</button>`).join('')}
      </div>

      ${campaign.videos.length ? `
        <div class="inv-videos">
          <p class="inv-section-label">Vídeos</p>
          <div class="inv-video-list">
            ${campaign.videos.map((video) => `
              <div class="inv-video-item">
                <a href="${video.url}" target="_blank" rel="noreferrer" class="inv-video-play">
                  <span class="inv-video-icon">▶</span>
                  <span class="inv-video-name">${escapeHtml(video.name)}</span>
                </a>
                <a class="inv-video-dl" href="/api/download?path=${encodeURIComponent(video.path)}" download title="Baixar">↓</a>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <p class="inv-detail-path">${escapeHtml(campaign.relPath)}</p>
    </div>
  `;
}

const SERVICE_TYPES = [
  ['all',      'Todos'],
  ['worker',   'Workers'],
  ['tool',     'Tools'],
  ['script',   'Scripts npm'],
];

const BATCH_CATEGORIES = [
  ['all',          'Todos'],
  ['lotes',        'Lotes'],
  ['gatilhos',     'Gatilhos'],
  ['rerun',        'Rerun'],
  ['inema-videos', 'INEMA vídeos'],
];

function serviceTypeMatches(service, type) {
  if (type === 'all') return true;
  return service.type === type;
}

function batchCatMatches(service, cat) {
  if (cat === 'all') return true;
  return service.category === cat || (service.tags || []).includes(cat);
}

function isServiceType(service) {
  return ['worker', 'tool', 'script'].includes(service.type) && service.category === 'scripts';
}

function isBatchType(service) {
  return ['lotes', 'gatilhos', 'rerun', 'inema-videos'].includes(service.category) ||
    (service.tags || []).some((t) => ['lotes', 'gatilhos', 'rerun', 'inema-videos'].includes(t));
}

function renderTools() {
  const typeFilter = state.toolCategory || 'all';
  const search = (qs('#toolSearch')?.value || '').toLowerCase();

  const allServices = state.dashboard.services.filter(isServiceType);
  const filtered = allServices.filter((s) => {
    const haystack = `${s.name} ${s.type} ${s.group || ''} ${s.command || ''} ${s.description || ''}`.toLowerCase();
    return serviceTypeMatches(s, typeFilter) && (!search || haystack.includes(search));
  });

  const byGroup = filtered.reduce((acc, s) => {
    const g = s.group || 'outros';
    (acc[g] = acc[g] || []).push(s);
    return acc;
  }, {});

  qs('#toolsView').innerHTML = `
    <div class="svc-toolbar">
      <div class="svc-type-tabs">
        ${SERVICE_TYPES.map(([key, label]) => {
          const count = allServices.filter((s) => serviceTypeMatches(s, key)).length;
          return `<button class="svc-tab ${typeFilter === key ? 'is-active' : ''}" data-action="select-tool-category" data-category="${key}">${escapeHtml(label)} <span class="svc-tab-count">${count}</span></button>`;
        }).join('')}
      </div>
      <input id="toolSearch" class="svc-search" placeholder="Filtrar por nome, comando, grupo..." value="${escapeHtml(search)}">
    </div>

    ${Object.keys(byGroup).length === 0
      ? '<p class="muted" style="padding:24px">Nada encontrado.</p>'
      : Object.entries(byGroup).map(([group, items]) => `
        <div class="svc-group">
          <div class="svc-group-header">
            <span class="svc-group-name">${escapeHtml(group)}</span>
            <span class="svc-group-count">${items.length}</span>
          </div>
          <div class="svc-table">
            <div class="svc-table-head">
              <span>Nome</span><span>Tipo</span><span>Comando</span><span></span>
            </div>
            ${items.map((s) => `
              <div class="svc-row">
                <div class="svc-row-name">
                  <span class="svc-name">${escapeHtml(s.name)}</span>
                  ${s.description ? `<span class="svc-desc">${escapeHtml(s.description)}</span>` : ''}
                </div>
                <span class="svc-type-badge svc-type-${escapeHtml(s.type)}">${escapeHtml(s.type)}</span>
                <code class="svc-cmd">${escapeHtml(s.command || s.path || '—')}</code>
                <div class="svc-row-actions">
                  ${s.path ? `<button class="button ghost" style="font-size:11px;padding:3px 8px" data-action="open-file" data-path="${escapeHtml(s.path)}">Ver</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
  `;
}

function renderBatches() {
  const catFilter = state.batchCategory || 'all';
  const search = (qs('#batchSearch')?.value || '').toLowerCase();

  const allBatches = state.dashboard.services.filter(isBatchType);
  const filtered = allBatches.filter((s) => {
    const haystack = `${s.name} ${s.category || ''} ${s.command || ''} ${s.description || ''} ${(s.tags || []).join(' ')}`.toLowerCase();
    return batchCatMatches(s, catFilter) && (!search || haystack.includes(search));
  });

  const byCategory = filtered.reduce((acc, s) => {
    const c = s.category || 'outros';
    (acc[c] = acc[c] || []).push(s);
    return acc;
  }, {});

  qs('#batchesView').innerHTML = `
    <div class="svc-toolbar">
      <div class="svc-type-tabs">
        ${BATCH_CATEGORIES.map(([key, label]) => {
          const count = allBatches.filter((s) => batchCatMatches(s, key)).length;
          return `<button class="svc-tab ${catFilter === key ? 'is-active' : ''}" data-action="select-batch-category" data-category="${key}">${escapeHtml(label)} <span class="svc-tab-count">${count}</span></button>`;
        }).join('')}
      </div>
      <input id="batchSearch" class="svc-search" placeholder="Filtrar lotes, scripts, templates..." value="${escapeHtml(search)}">
    </div>

    ${Object.keys(byCategory).length === 0
      ? '<p class="muted" style="padding:24px">Nada encontrado.</p>'
      : Object.entries(byCategory).map(([cat, items]) => `
        <div class="svc-group">
          <div class="svc-group-header">
            <span class="svc-group-name">${escapeHtml(cat)}</span>
            <span class="svc-group-count">${items.length}</span>
          </div>
          <div class="batch-grid">
            ${items.map(renderBatchCard).join('')}
          </div>
        </div>
      `).join('')}
  `;
}

function renderBatchCard(service) {
  const tags = (service.tags || []).filter((t) => t !== service.category);
  const isTelegramCmd = service.type === 'telegram-command';
  return `
    <div class="batch-card">
      <div class="batch-card-top">
        <span class="batch-card-name">${escapeHtml(service.name)}</span>
        <span class="batch-cat-badge batch-cat-${escapeHtml(service.category || 'outros')}">${escapeHtml(service.category || service.type)}</span>
      </div>
      ${service.description ? `<p class="batch-card-desc">${escapeHtml(service.description)}</p>` : ''}
      <code class="batch-card-cmd">${escapeHtml(service.command || service.path || '—')}</code>
      ${tags.length ? `<div class="batch-card-tags">${tags.map((t) => `<span class="batch-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
      ${service.outputRoot ? `<div class="batch-card-output">→ ${escapeHtml(service.outputRoot)}</div>` : ''}
      <div class="batch-card-actions">
        ${service.path ? `<button class="button ghost" style="font-size:11px;padding:3px 8px" data-action="open-file" data-path="${escapeHtml(service.path)}">Ver arquivo</button>` : ''}
        ${service.runnable && !isTelegramCmd
          ? `<button class="button" style="font-size:11px;padding:3px 10px" data-action="open-run-dialog" data-path="${escapeHtml(service.path || '')}" data-name="${escapeHtml(service.name)}">▶ Executar</button>`
          : isTelegramCmd ? `<span class="batch-telegram-hint">via Telegram</span>` : ''}
      </div>
    </div>
  `;
}

function renderGenerator() {
  const config = state.dashboard.config || {};
  const payloadList = state.dashboard.payloads;
  const selectedPayload = payloadList.find((payload) => payload.file === state.selectedPayloadFile) || payloadList[0];
  const preview = state.generatorPayloads.length
    ? JSON.stringify(state.generatorPayloads.length === 1 ? state.generatorPayloads[0] : state.generatorPayloads, null, 2)
    : buildGeneratorPreview(config);
  const nextSerial = state.generatorNextSerial;
  const errors = state.generatorErrors || [];

  qs('#generatorView').innerHTML = `
    <div class="grid-2">
      <form class="panel" id="generatorForm">
        <div class="section-title">
          <h2>Novo lote</h2>
          <span class="badge" id="generatorPayloadCount">0 payloads</span>
        </div>

        ${errors.length ? `<div class="generator-errors">${errors.map((e) => `<div class="generator-error">! ${escapeHtml(e)}</div>`).join('')}</div>` : ''}

        <div class="form-grid">
          <label class="field">
            <span>Template</span>
            <select name="template">
              <option value="campanha_completa">Campanha completa (Quick)</option>
              <option value="video_quick">Video Quick</option>
              <option value="video_pro">Video Pro</option>
              <option value="carrossel_sem_video">Carrossel sem video</option>
              <option value="servico_assets">Servico de assets (so stage 2)</option>
            </select>
          </label>
          <label class="field">
            <span>Projeto</span>
            <select name="project_dir">${projectOptions(config.project_dir)}</select>
          </label>
          <label class="field">
            <span>Data base</span>
            <input type="date" name="task_date" value="${today()}">
          </label>
          <label class="field">
            <span>Prefixo</span>
            <input name="prefix" value="${escapeHtml(config.batch?.name_prefix || 'c')}">
            <small class="field-hint" id="nextSerialHint">${nextSerial ? `proximo: ${nextSerial.prefix}${nextSerial.padded}` : 'consultando...'}</small>
          </label>
          <label class="field">
            <span>Fonte de imagem</span>
            <select name="image_source">
              ${['api', 'free', 'brand', 'folder', 'solid', 'screenshot'].map((value) => `<option value="${value}" ${value === config.image_source ? 'selected' : ''}>${value}</option>`).join('')}
            </select>
          </label>
          <label class="field full">
            <span>Negocio / marca</span>
            <input name="business" value="INEMA - Ecossistema de IA e Transformacao Digital">
          </label>
          <label class="field full">
            <span>Topicos, um por linha <em class="field-em">(1 topico = 1 payload)</em></span>
            <textarea name="topics" placeholder="agentes de IA para vendas&#10;automacoes para clinicas&#10;vibe coding para gestores"></textarea>
          </label>
          <label class="field full">
            <span>Brief base</span>
            <textarea name="brief" placeholder="Objetivo, publico, tom, CTA e restricoes do lote."></textarea>
          </label>
          <div class="field full">
            <span class="label">Plataformas</span>
            <div class="check-row">${platformChecks(config.platform_targets || [], 'generator_platform')}</div>
          </div>
        </div>

        <details class="form-details">
          <summary>Direção visual <em>(override do Creative Director)</em></summary>
          <p class="form-details-hint">Vazio = agente decide pelo tema. Preenchido = vira hard constraint no <code>creative_brief.visual_direction</code> antes do Ad Creative Designer rodar. Use para forçar consistência entre campanhas.</p>
          <div class="form-grid">
            <label class="field">
              <span>Layout type</span>
              <select name="ad_layout_type">
                ${['auto', 'product_focus', 'split', 'lifestyle'].map((v) => `<option value="${v}" ${v === (config.ad_layout_type || 'auto') ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </label>
            <label class="field">
              <span>Mood / atmosfera</span>
              <input name="visual_mood" value="${escapeHtml(config.visual_mood || '')}" placeholder="ex: dark premium, intelectual incisivo">
            </label>
            <label class="field">
              <span>Cores dominantes <em>(hex, vírgula)</em></span>
              <input name="dominant_colors" value="${escapeHtml(config.dominant_colors || '')}" placeholder="#0D0D0D, #0099FF, #FFFFFF">
            </label>
            <label class="field">
              <span>Cores de acento <em>(hex, vírgula)</em></span>
              <input name="accent_colors" value="${escapeHtml(config.accent_colors || '')}" placeholder="#FFD700, #CC0000">
            </label>
            <label class="field full">
              <span>Photography style</span>
              <textarea name="photography_style" rows="2" placeholder="ex: composições dark-first com elementos simbólicos, profissionais sérios em ambiente moderno...">${escapeHtml(config.photography_style || '')}</textarea>
            </label>
            <label class="field">
              <span>Typography mood</span>
              <input name="typography_mood" value="${escapeHtml(config.typography_mood || '')}" placeholder="ex: bold e impactante; clean e espaçado">
            </label>
          </div>
        </details>

        <div class="button-row">
          <button type="button" class="button secondary" data-action="preview-batch">Gerar preview</button>
          <button type="button" class="button" data-action="save-batch">Salvar payloads</button>
          <button type="button" class="button warn" data-action="save-and-run-first">Salvar e executar primeiro</button>
        </div>
      </form>

      <div class="panel">
        <div class="section-title">
          <h2>Preview JSON</h2>
          <span class="badge">${state.generatorPayloads.length || 1}</span>
        </div>
        <textarea class="code-area" id="payloadPreview">${escapeHtml(preview)}</textarea>
      </div>
    </div>

    <div class="split-list" style="margin-top:16px">
      <div class="panel">
        <div class="section-title">
          <h2>Payloads salvos</h2>
          <span class="badge">${payloadList.length}</span>
        </div>
        <div class="list">
          ${payloadList.map((payload) => `
            <button class="list-row ${payload.file === state.selectedPayloadFile ? 'is-selected' : ''}" data-action="select-payload" data-file="${escapeHtml(payload.file)}">
              <span class="row-title">${escapeHtml(payload.file)}</span>
              <span class="row-subtitle">${escapeHtml(payload.project_dir || '-')} - ${escapeHtml(payload.platforms.join(', ') || 'sem plataformas')}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="panel">
        ${selectedPayload ? renderPayloadDetail(selectedPayload) : '<p class="muted">Nenhum payload salvo.</p>'}
      </div>
    </div>
  `;
}

function buildGeneratorPreview(config) {
  const payload = buildPayloadsFromForm(config, true)[0];
  return JSON.stringify(payload, null, 2);
}

function readGeneratorForm() {
  const form = qs('#generatorForm');
  if (!form) return null;
  const data = new FormData(form);
  const splitColors = (raw) => String(raw || '')
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    template: data.get('template'),
    project_dir: data.get('project_dir'),
    task_date: data.get('task_date') || today(),
    prefix: data.get('prefix') || 'c',
    image_source: data.get('image_source') || 'api',
    business: data.get('business') || '',
    topics: String(data.get('topics') || '').split('\n').map((line) => line.trim()).filter(Boolean),
    brief: data.get('brief') || '',
    platforms: data.getAll('generator_platform'),
    ad_layout_type: data.get('ad_layout_type') || 'auto',
    visual_mood: (data.get('visual_mood') || '').trim(),
    dominant_colors: splitColors(data.get('dominant_colors')),
    accent_colors: splitColors(data.get('accent_colors')),
    photography_style: (data.get('photography_style') || '').trim(),
    typography_mood: (data.get('typography_mood') || '').trim(),
  };
}

function validateGeneratorForm(values) {
  const errors = [];
  if (!values.topics || values.topics.length === 0) errors.push('Adicione ao menos 1 topico (uma linha por payload).');
  if (!values.platforms || values.platforms.length === 0) errors.push('Selecione ao menos 1 plataforma.');
  if (!values.project_dir) errors.push('Escolha um projeto.');
  if (!values.task_date) errors.push('Defina a data base.');
  return errors;
}

function makeBatchId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const hms = `${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
  return `b_${ymd}_${hms}`;
}

function buildPayloadsFromForm(config, fallbackOnly = false) {
  const formValues = readGeneratorForm();
  const splitColors = (raw) => Array.isArray(raw) ? raw : String(raw || '').split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  const values = formValues || {
    template: 'campanha_completa',
    project_dir: config.project_dir,
    task_date: today(),
    prefix: config.batch?.name_prefix || 'c',
    image_source: config.image_source || 'api',
    business: 'INEMA - Ecossistema de IA e Transformacao Digital',
    topics: ['nova campanha'],
    brief: '',
    platforms: config.platform_targets || ['instagram'],
    ad_layout_type: config.ad_layout_type || 'auto',
    visual_mood: config.visual_mood || '',
    dominant_colors: splitColors(config.dominant_colors),
    accent_colors: splitColors(config.accent_colors),
    photography_style: config.photography_style || '',
    typography_mood: config.typography_mood || '',
  };
  const topics = values.topics.length ? values.topics : ['nova campanha'];
  const list = fallbackOnly ? topics.slice(0, 1) : topics;

  const startSerial = state.generatorNextSerial && state.generatorNextSerial.prefix === values.prefix
    ? state.generatorNextSerial.next
    : 1;
  const batchId = list.length > 1 ? makeBatchId() : null;

  return list.map((topic, index) => {
    const serialNum = startSerial + index;
    const serial = `${values.prefix}${String(serialNum).padStart(4, '0')}`;
    const taskName = `${serial}_${slugify(topic)}`;
    const visualOverride = {};
    if (values.ad_layout_type && values.ad_layout_type !== 'auto') visualOverride.ad_layout_type = values.ad_layout_type;
    if (values.visual_mood) visualOverride.mood = values.visual_mood;
    if (values.dominant_colors?.length) visualOverride.dominant_colors = values.dominant_colors;
    if (values.accent_colors?.length) visualOverride.accent_colors = values.accent_colors;
    if (values.photography_style) visualOverride.photography_style = values.photography_style;
    if (values.typography_mood) visualOverride.typography_mood = values.typography_mood;

    const base = {
      ...config,
      task_name: taskName,
      task_date: values.task_date,
      business: values.business,
      description: topic,
      campaign_brief: [values.brief, topic].filter(Boolean).join('\n\n'),
      project_dir: values.project_dir,
      output_dir: `${values.project_dir}/outputs/${taskName}`,
      platform_targets: values.platforms,
      image_source: values.image_source,
      ...(batchId ? { batch_id: batchId } : {}),
      ...(Object.keys(visualOverride).length ? { visual_direction_override: visualOverride } : {}),
    };
    delete base.ad_layout_type;
    delete base.visual_mood;
    delete base.dominant_colors;
    delete base.accent_colors;
    delete base.photography_style;
    delete base.typography_mood;

    if (values.template === 'carrossel_sem_video') {
      base.skip_video = true;
      base.video_quick = false;
      base.video_pro = false;
      base.video_mode = 'none';
    }
    if (values.template === 'video_quick') {
      base.skip_video = false;
      base.video_quick = true;
      base.video_pro = false;
      base.video_mode = 'quick';
    }
    if (values.template === 'video_pro') {
      base.skip_video = false;
      base.video_quick = false;
      base.video_pro = true;
      base.video_mode = 'pro';
    }
    if (values.template === 'servico_assets') {
      base.platform_targets = [];
      base.skip_research = true;
      base.skip_video = true;
      base.video_quick = false;
      base.video_pro = false;
      base.video_mode = 'none';
    }

    return base;
  });
}

function renderPayloadDetail(payload) {
  return `
    <div class="section-title">
      <div>
        <h2>${escapeHtml(payload.file)}</h2>
        <p class="muted">${escapeHtml(payload.output_dir || 'sem output_dir')}</p>
      </div>
      <span class="badge">${formatDate(payload.updatedAt)}</span>
    </div>
    <div class="chip-row">
      ${payload.platforms.map((platform) => `<span class="badge">${escapeHtml(platform)}</span>`).join('')}
      <span class="badge">${escapeHtml(payload.image_source || 'imagem n/d')}</span>
      <span class="badge">${escapeHtml(payload.video_mode || 'video n/d')}</span>
    </div>
    <div class="button-row">
      <button class="button ghost" data-action="open-payload-json" data-file="${escapeHtml(payload.file)}">Ver JSON</button>
      <button class="button warn" data-action="run-payload" data-file="${escapeHtml(payload.file)}">Executar</button>
    </div>
  `;
}

const QUEUE_GROUP_META = {
  active:    { label: 'Ativos',     color: '#0c7c59', icon: '▶' },
  waiting:   { label: 'Aguardando', color: '#d97706', icon: '⏸' },
  delayed:   { label: 'Atrasados',  color: '#6b7280', icon: '⏱' },
  failed:    { label: 'Falharam',   color: '#dc2626', icon: '✕' },
  completed: { label: 'Concluídos', color: '#475569', icon: '✓' },
};

function fmtJobAge(ts) {
  if (!ts) return '—';
  const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec/60)}m ${sec%60}s`;
  return `${Math.floor(sec/3600)}h ${Math.floor((sec%3600)/60)}m`;
}

function renderQueueJobRow(job, group) {
  const isFailed = group === 'failed';
  const isActive = group === 'active';
  const isCompleted = group === 'completed';
  const ageRef = isCompleted ? (job.finishedOn || job.timestamp) : (job.processedOn || job.timestamp);
  return `
    <div class="queue-job ${group}">
      <div class="queue-job-main">
        <code class="queue-job-id">#${escapeHtml(job.id)}</code>
        <span class="queue-job-name">${escapeHtml(job.name)}</span>
        ${job.task_name ? `<span class="queue-job-task">${escapeHtml(job.task_name)}</span>` : ''}
      </div>
      <div class="queue-job-meta">
        ${isActive && job.progress > 0 ? `<span class="queue-job-progress">${Math.round(job.progress)}%</span>` : ''}
        <span class="queue-job-age" title="${new Date(ageRef||0).toISOString()}">${fmtJobAge(ageRef)}</span>
        ${job.attempts > 0 ? `<span class="queue-job-attempts">${job.attempts}/${job.maxAttempts}</span>` : ''}
        ${isFailed ? `<button class="queue-job-btn retry" data-action="queue-retry" data-id="${escapeHtml(job.id)}">↻ Retry</button>` : ''}
        <button class="queue-job-btn remove" data-action="queue-remove" data-id="${escapeHtml(job.id)}" title="Remover">×</button>
      </div>
      ${isFailed && job.failedReason ? `<div class="queue-job-error">${escapeHtml(job.failedReason)}</div>` : ''}
    </div>
  `;
}

function renderQueue() {
  api('/api/queue?limit=30')
    .then((data) => {
      state.queue = data;
      paintQueue();
    })
    .catch((err) => {
      qs('#queueView').innerHTML = `<div class="panel"><p class="muted">Erro ao carregar fila: ${escapeHtml(err.message)}</p></div>`;
    });
}

function paintQueue() {
  const data = state.queue;
  if (!data) return;
  if (!data.ok) {
    qs('#queueView').innerHTML = `<div class="panel"><p class="muted">${escapeHtml(data.error || 'Fila indisponível')}</p></div>`;
    return;
  }
  const counts = data.counts;
  const total = (counts.wait||0) + (counts.active||0) + (counts.completed||0) + (counts.failed||0) + (counts.delayed||0);

  const groups = ['active', 'waiting', 'delayed', 'failed', 'completed'];
  const groupKey = (g) => g === 'waiting' ? 'wait' : g;

  qs('#queueView').innerHTML = `
    <div class="queue-summary panel">
      <div class="queue-meta">
        <div class="queue-meta-item">
          <span class="queue-meta-label">Fila</span>
          <code>${escapeHtml(data.queueName)}</code>
        </div>
        <div class="queue-meta-item">
          <span class="queue-meta-label">Redis</span>
          <code>${escapeHtml(data.redisHost)}:6379</code>
        </div>
        <div class="queue-meta-item">
          <span class="queue-meta-label">Worker</span>
          <span class="queue-ok" title="Fila isolada — só consumida por worker do imkt3">isolada (imkt3)</span>
        </div>
      </div>
      <div class="queue-counts">
        ${groups.map((g) => `
          <div class="queue-count ${g}">
            <span class="queue-count-num">${counts[groupKey(g)] || 0}</span>
            <span class="queue-count-label">${QUEUE_GROUP_META[g].label}</span>
          </div>
        `).join('')}
      </div>
      <div class="queue-actions">
        <button class="button ghost" data-action="queue-refresh">↻ Atualizar</button>
        <button class="button ghost" data-action="queue-clean" data-status="completed">Limpar concluídos</button>
        <button class="button ghost warn" data-action="queue-clean" data-status="failed">Limpar falhados</button>
      </div>
    </div>

    <div class="queue-groups">
      ${groups.map((g) => {
        const jobs = data.jobs[g] || [];
        const count = counts[groupKey(g)] || 0;
        const open = state.queueGroupOpen[g];
        const meta = QUEUE_GROUP_META[g];
        return `
          <div class="queue-group ${g} ${open ? 'is-open' : ''}">
            <button class="queue-group-head" data-action="queue-toggle" data-group="${g}">
              <span class="queue-group-caret">${open ? '▾' : '▸'}</span>
              <span class="queue-group-icon" style="color:${meta.color}">${meta.icon}</span>
              <span class="queue-group-label">${meta.label}</span>
              <span class="queue-group-count">${count}</span>
            </button>
            ${open ? `
              <div class="queue-group-body">
                ${jobs.length ? jobs.map((j) => renderQueueJobRow(j, g)).join('') : `<div class="queue-empty">Nenhum job ${meta.label.toLowerCase()}</div>`}
                ${count > jobs.length ? `<div class="queue-more">+${count - jobs.length} mais (mostrando ${jobs.length})</div>` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
  void total;
}

const STAGE_LABELS = ['Estrategia', 'Imagens', 'Video', 'Plataformas', 'Distrib.'];

function stageStatusClass(s) {
  if (!s || s === 'pending') return 'pending';
  if (s === 'awaiting_approval') return 'await';
  if (s === 'images_ready') return 'await';
  if (s === 'done') return 'done';
  if (s === 'failed') return 'failed';
  return 'pending';
}

function renderStageTimeline(stages, currentStage) {
  const s = stages || {};
  return `
    <div class="stage-timeline">
      ${[1, 2, 3, 4, 5].map((n) => {
        const status = s[n] || 'pending';
        const klass = stageStatusClass(status);
        const isCurrent = currentStage === n && status !== 'done';
        const icon = status === 'done' ? '✓' : status === 'awaiting_approval' ? '✋' : status === 'failed' ? '✕' : (isCurrent ? '●' : '○');
        return `
          <div class="stage-cell ${klass} ${isCurrent ? 'is-current' : ''}" title="${escapeHtml(status)}">
            <span class="stage-icon">${icon}</span>
            <span class="stage-num">${n}</span>
            <span class="stage-label">${STAGE_LABELS[n - 1]}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function shortRunStatus(run) {
  if (run.status === 'running') {
    const current = run.currentStage ? `stage ${run.currentStage}/5` : 'iniciando';
    return current;
  }
  return run.status;
}

function renderRuns() {
  api('/api/batches')
    .then((batches) => {
      const flatRuns = batches.flatMap((b) => b.runs);
      const selected = state.selectedRunId
        ? flatRuns.find((run) => run.id === state.selectedRunId)
        : flatRuns[0];
      if (selected && !state.selectedRunId) state.selectedRunId = selected.id;

      qs('#runsView').innerHTML = `
        <div class="split-list">
          <div class="panel">
            <div class="section-title">
              <h2>Monitor</h2>
              <span class="badge">${flatRuns.length}</span>
            </div>
            <div class="list">
              ${batches.map(renderBatchGroup).join('') || '<p class="muted">Nenhuma execucao registrada.</p>'}
            </div>
          </div>
          <div class="panel" id="runDetail">
            ${selected ? '<p class="muted">Carregando log...</p>' : '<p class="muted">Selecione uma execucao.</p>'}
          </div>
        </div>
      `;
      if (selected) loadRun(selected.id);
    })
    .catch((error) => toast(error.message));
}

function renderBatchGroup(batch) {
  const c = batch.counts;
  const summary = [
    c.running ? `${c.running}▶` : null,
    c.awaiting ? `${c.awaiting}✋` : null,
    c.completed ? `${c.completed}✓` : null,
    c.failed ? `${c.failed}✕` : null,
    c.cancelled ? `${c.cancelled}⊘` : null,
  ].filter(Boolean).join(' · ');

  if (batch.isSolo) {
    return batch.runs.map((run) => renderRunRow(run)).join('');
  }
  return `
    <div class="batch-group">
      <div class="batch-group-head">
        <span class="batch-group-title">${escapeHtml(batch.batch_id)}</span>
        <span class="batch-group-summary">${escapeHtml(summary || `${batch.total} runs`)}</span>
      </div>
      ${batch.runs.map((run) => renderRunRow(run)).join('')}
    </div>
  `;
}

function renderRunRow(run) {
  const tag = run.pendingApprovalDir ? '✋ aprovar' : shortRunStatus(run);
  return `
    <button class="list-row ${run.id === state.selectedRunId ? 'is-selected' : ''}" data-action="select-run" data-id="${escapeHtml(run.id)}">
      <span class="row-title">${escapeHtml(run.payloadFile)}</span>
      <span class="row-subtitle">${escapeHtml(tag)} · ${formatDate(run.startedAt)}</span>
      <div class="run-row-stages">${renderStageTimeline(run.stages, run.currentStage)}</div>
    </button>
  `;
}

let _runStream = null;
function closeRunStream() {
  if (_runStream) { try { _runStream.close(); } catch {} _runStream = null; }
}

function paintRunDetail(run) {
  const detail = qs('#runDetail');
  if (!detail) return;
  const canCancel = run.status === 'running';
  const needApproval = !!run.pendingApprovalDir;
  detail.innerHTML = `
    <div class="section-title">
      <div>
        <h2>${escapeHtml(run.payloadFile)}</h2>
        <p class="muted">${escapeHtml(run.command || '')}</p>
        ${run.bullmqJobId ? `<p class="muted">BullMQ job: <code>${escapeHtml(run.bullmqJobId)}</code></p>` : ''}
        ${run.batch_id ? `<p class="muted">Lote: <code>${escapeHtml(run.batch_id)}</code></p>` : ''}
      </div>
      <span class="badge ${run.status === 'completed' ? 'ok' : run.status === 'running' ? 'waiting' : 'empty'}">${escapeHtml(run.status)}</span>
    </div>
    ${renderStageTimeline(run.stages, run.currentStage)}
    ${needApproval ? `
      <div class="approval-panel">
        <div class="approval-title">✋ Aprovacao de imagens pendente</div>
        <p class="muted approval-dir">${escapeHtml(run.pendingApprovalDir)}/imgs/</p>
        <div class="run-actions">
          <button class="button" data-action="approve-images" data-id="${escapeHtml(run.id)}">Aprovar imagens</button>
          <button class="button warn" data-action="reject-images" data-id="${escapeHtml(run.id)}">Rejeitar</button>
          <button class="button ghost" data-action="open-file" data-path="${escapeHtml(run.pendingApprovalDir)}/imgs">Abrir pasta</button>
        </div>
      </div>
    ` : ''}
    <div class="run-actions">
      ${canCancel ? `<button class="button warn" data-action="cancel-run" data-id="${escapeHtml(run.id)}">Cancelar</button>` : ''}
      <button class="button ghost" data-action="open-payload-json" data-file="${escapeHtml(run.payloadFile)}">Ver payload</button>
    </div>
    <pre class="run-log" id="runLog">${escapeHtml(run.log || '')}</pre>
  `;
  const logEl = qs('#runLog');
  if (logEl) logEl.scrollTop = logEl.scrollHeight;
}

function loadRun(id) {
  closeRunStream();
  api(`/api/runs/${encodeURIComponent(id)}`)
    .then((run) => {
      paintRunDetail(run);
      if (run.status === 'running') startRunStream(id);
    })
    .catch((e) => toast(e.message));
}

function startRunStream(id) {
  const url = `/api/runs/${encodeURIComponent(id)}/stream`;
  const es = new EventSource(url);
  _runStream = es;
  es.addEventListener('snapshot', (e) => {
    const data = JSON.parse(e.data);
    const logEl = qs('#runLog');
    if (logEl) {
      logEl.textContent = data.log || '';
      logEl.scrollTop = logEl.scrollHeight;
    }
    updateStageTimelineDom(data.stages, data.currentStage);
  });
  es.addEventListener('log', (e) => {
    const data = JSON.parse(e.data);
    const logEl = qs('#runLog');
    if (logEl) {
      const wasAtBottom = logEl.scrollTop + logEl.clientHeight >= logEl.scrollHeight - 30;
      logEl.textContent += data.chunk || '';
      if (wasAtBottom) logEl.scrollTop = logEl.scrollHeight;
    }
    updateStageTimelineDom(data.stages, data.currentStage);
  });
  es.addEventListener('end', (e) => {
    const data = JSON.parse(e.data);
    closeRunStream();
    updateStageTimelineDom(data.stages, null);
    setTimeout(() => loadRun(id), 200);
  });
  es.onerror = () => {
    closeRunStream();
  };
}

function updateStageTimelineDom(stages, currentStage) {
  const detail = qs('#runDetail');
  if (!detail) return;
  const tl = detail.querySelector('.stage-timeline');
  if (!tl) return;
  tl.outerHTML = renderStageTimeline(stages, currentStage);
}

async function openFile(path) {
  const text = await fetch(`/api/file?path=${encodeURIComponent(path)}`).then((response) => {
    if (!response.ok) throw new Error('Arquivo indisponivel');
    return response.text();
  });
  qs('#fileDialogTitle').textContent = path;
  qs('#fileDialogBody').textContent = text;
  qs('#fileDialog').showModal();
}

const PARAM_LABELS = {
  // Geral
  task_name: 'Nome da tarefa', task_date: 'Data', project_dir: 'Projeto',
  campaign_brief: 'Brief', business: 'Negócio', language: 'Idioma',
  platform_targets: 'Plataformas', approval_modes: 'Modos de aprovação',
  notifications: 'Notificações',
  skip_research: 'Pular research', skip_image: 'Pular imagens', skip_video: 'Pular vídeo',
  // Imagens
  image_source: 'Fonte', image_provider: 'Provider', image_model: 'Modelo',
  free_image_provider: 'Provider gratuito', image_count: 'Qtd. imagens',
  image_formats: 'Formatos', image_background_color: 'Cor de fundo',
  image_bg_mode: 'Modo de fundo', photo_quality: 'Qualidade foto',
  style_preset: 'Preset visual', use_brand_overlay: 'Overlay de marca',
  image_reference: 'Referência', image_reference_note: 'Nota referência',
  screenshot_urls: 'URLs screenshot',
  // Vídeo geral
  video_mode: 'Modo', video_quick: 'Quick ativo', video_pro: 'Pro ativo',
  video_count: 'Qtd. vídeos', video_format: 'Formato', video_formats: 'Formatos',
  video_duration: 'Duração (s)', video_audio: 'Áudio', video_template: 'Template',
  scene_quality: 'Qualidade cenas', video_draft: 'Modo rascunho',
  // Quick
  quick_mode: 'Quick — modo', quick_video_audio: 'Quick — áudio',
  quick_tts_provider: 'Quick — TTS provider', quick_narrator: 'Quick — narrador',
  quick_narration_source: 'Quick — fonte narração', quick_duration: 'Quick — duração (s)',
  quick_scene_count: 'Quick — nº cenas', quick_narration_words: 'Quick — palavras narração',
  quick_narration_seconds: 'Quick — seg. narração', quick_hold_seconds: 'Quick — hold (s)',
  quick_existing_narration_file: 'Quick — narração existente',
  // Pro
  pro_video_audio: 'Pro — áudio', pro_tts_provider: 'Pro — TTS provider',
  pro_narrator: 'Pro — narrador', pro_narration_source: 'Pro — fonte narração',
  pro_duration: 'Pro — duração (s)', pro_words_per_second: 'Pro — palavras/s',
  pro_narration_words: 'Pro — palavras narração', pro_existing_narration_file: 'Pro — narração existente',
  // Legados / outros
  tts_provider: 'TTS provider', narrator: 'Narrador', voice: 'Voz',
  music_mode: 'Modo música', audio_mode: 'Modo áudio', music_volume: 'Volume música',
  existing_narration_file: 'Narração existente',
  // Distribuição
  simulate_uploads: 'Simular uploads', dry_run: 'Dry run',
};

async function openRunDialog(scriptPath, scriptName) {
  qs('#runDialogTitle').textContent = scriptName;
  qs('#runDialogBody').innerHTML = '<p class="params-loading">Carregando metadados...</p>';
  qs('#runDialog').showModal();

  let meta;
  try {
    meta = await api(`/api/script-meta?path=${encodeURIComponent(scriptPath)}`);
  } catch {
    qs('#runDialogBody').innerHTML = '<p class="params-empty">Erro ao ler o script.</p>';
    return;
  }

  const hint = meta.argsHint;

  const argsSection = hint && hint.tokens.length > 0
    ? hint.tokens.map((tok, i) => {
        const options = tok.hint.split('|').map((v) => v.trim()).filter(Boolean);
        const isSelect = options.length > 1;
        return `
          <div class="run-form-field">
            <label class="run-form-label">
              Argumento ${i + 1} — <code>${escapeHtml(tok.hint)}</code>
              ${!tok.required ? '<span class="run-form-optional">(opcional)</span>' : ''}
            </label>
            ${isSelect
              ? `<select class="run-form-input" name="arg_${i}">
                  ${options.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('')}
                 </select>`
              : `<input class="run-form-input" name="arg_${i}" placeholder="${escapeHtml(tok.hint)}" ${tok.required ? 'required' : ''}>`}
          </div>`;
      }).join('')
    : `<div class="run-form-field">
        <label class="run-form-label">Argumento <span class="run-form-optional">(opcional)</span></label>
        <input class="run-form-input" name="arg_0" placeholder="ex: all  ou  slug1,slug2">
       </div>`;

  const constsSection = meta.consts.length > 0 ? `
    <div class="run-section">
      <div class="run-section-title">Constantes do script</div>
      <div class="run-consts-table">
        ${meta.consts.map((c) => `
          <div class="run-const-row">
            <code class="run-const-name">${escapeHtml(c.name)}</code>
            <span class="run-const-val">${escapeHtml(c.value)}</span>
          </div>`).join('')}
      </div>
    </div>` : '';

  const arraysSection = meta.arrays.length > 0 ? `
    <div class="run-section">
      <div class="run-section-title">Arrays configurados</div>
      ${meta.arrays.map((a) => `
        <div class="run-array-row">
          <code class="run-const-name">${escapeHtml(a.name)}</code>
          <div class="run-array-items">${a.items.map((v) => `<span class="batch-tag">${escapeHtml(v)}</span>`).join('')}</div>
        </div>`).join('')}
    </div>` : '';

  qs('#runDialogBody').innerHTML = `
    ${meta.doc ? `<div class="run-doc">${escapeHtml(meta.doc).replace(/\n/g, '<br>')}</div>` : ''}

    ${meta.usage ? `<div class="run-section">
      <div class="run-section-title">Uso</div>
      <code class="run-usage-cmd">${escapeHtml(meta.usage)}</code>
    </div>` : ''}

    <form class="run-form" id="runDialogForm" data-action="run-batch-script" data-path="${escapeHtml(scriptPath)}">
      <div class="run-section">
        <div class="run-section-title">Argumentos</div>
        ${argsSection}
      </div>
      ${constsSection}
      ${arraysSection}
      <div class="run-form-actions">
        <button type="submit" class="button">▶ Executar agora</button>
        <button type="button" class="button ghost" data-action="close-run-dialog">Cancelar</button>
        ${meta.path ? `<button type="button" class="button ghost" data-action="open-file" data-path="${escapeHtml(meta.path)}" style="margin-left:auto">Ver código</button>` : ''}
      </div>
    </form>
  `;
}

async function openStageParams(label, stageKey, payloadPath) {
  qs('#paramsDialogTitle').textContent = label;
  qs('#paramsDialogBody').innerHTML = '<p class="params-loading">Carregando...</p>';
  qs('#paramsDialog').showModal();

  try {
    const raw = await fetch(`/api/file?path=${encodeURIComponent(payloadPath)}`).then((r) => (r.ok ? r.text() : null));
    if (!raw) { qs('#paramsDialogBody').innerHTML = '<p class="params-empty">Payload não disponível.</p>'; return; }

    const payload = JSON.parse(raw);
    const keys = STAGE_PAYLOAD_KEYS[stageKey] || [];
    const rows = keys.filter((k) => k in payload);

    if (!rows.length) { qs('#paramsDialogBody').innerHTML = '<p class="params-empty">Sem parâmetros registrados para esta etapa.</p>'; return; }

    qs('#paramsDialogBody').innerHTML = rows.map((k) => {
      const val = payload[k];
      const display = Array.isArray(val) ? val.join(', ') : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val ?? '—');
      const isMultiline = display.includes('\n');
      return `
        <div class="param-row">
          <span class="param-key">${escapeHtml(PARAM_LABELS[k] || k)}</span>
          ${isMultiline
            ? `<pre class="param-val-pre">${escapeHtml(display)}</pre>`
            : `<span class="param-val">${escapeHtml(display)}</span>`}
        </div>
      `;
    }).join('');
  } catch (err) {
    qs('#paramsDialogBody').innerHTML = `<p class="params-empty">Erro: ${escapeHtml(err.message)}</p>`;
  }
}

const STAGE_PAYLOAD_KEYS = {
  stage1: [
    'task_name', 'task_date', 'project_dir', 'language', 'business', 'campaign_brief',
    'platform_targets', 'approval_modes', 'notifications', 'skip_research',
  ],
  stage2: [
    'image_source', 'image_provider', 'image_model', 'free_image_provider',
    'image_count', 'image_formats', 'image_background_color', 'image_bg_mode',
    'photo_quality', 'style_preset', 'use_brand_overlay',
    'image_reference', 'image_reference_note', 'screenshot_urls', 'skip_image',
  ],
  stage3: [
    'video_mode', 'video_quick', 'video_pro', 'video_count', 'video_format', 'video_formats',
    'video_template', 'scene_quality', 'video_draft', 'style_preset',
    'quick_mode', 'quick_video_audio', 'quick_tts_provider', 'quick_narrator',
    'quick_narration_source', 'quick_duration', 'quick_scene_count',
    'quick_narration_words', 'quick_narration_seconds', 'quick_hold_seconds',
    'quick_existing_narration_file',
    'pro_video_audio', 'pro_tts_provider', 'pro_narrator', 'pro_narration_source',
    'pro_duration', 'pro_words_per_second', 'pro_narration_words', 'pro_existing_narration_file',
    'tts_provider', 'narrator', 'voice', 'existing_narration_file', 'skip_video',
  ],
  stage4: [
    'platform_targets', 'approval_modes',
  ],
  stage5: [
    'platform_targets', 'simulate_uploads', 'dry_run',
  ],
};

function openImageViewer(campaignId, group, startIndex) {
  const campaign = state.dashboard?.campaigns?.find((c) => c.id === campaignId);
  if (!campaign) return;
  const list = campaign.media?.[group] || [];
  if (!list.length) return;
  const labels = { ads: 'Ads finalizados', images: 'Imagens base' };
  state.imageViewer = {
    list,
    index: Math.max(0, Math.min(Number(startIndex) || 0, list.length - 1)),
    label: labels[group] || group,
  };
  qs('#imageDialog').showModal();
  paintImageViewer();
}

function paintImageViewer() {
  const { list, index, label } = state.imageViewer;
  if (!list.length) return;
  const item = list[index];
  qs('#imageDialogGroup').textContent = label;
  qs('#imageDialogName').textContent = item.name;
  qs('#imageDialogCounter').textContent = `${index + 1}/${list.length}`;
  qs('#imageDialogImg').src = item.url;
  qs('#imageDialogImg').alt = item.name;
  qs('#imageDialogDownload').href = `/api/download?path=${encodeURIComponent(item.path)}`;
  qs('#imageDialogDownload').setAttribute('download', item.name);
  const prev = qs('[data-action="image-prev"]');
  const next = qs('[data-action="image-next"]');
  if (prev) prev.disabled = list.length < 2;
  if (next) next.disabled = list.length < 2;
}

function stepImageViewer(delta) {
  const { list, index } = state.imageViewer;
  if (!list.length) return;
  state.imageViewer.index = (index + delta + list.length) % list.length;
  paintImageViewer();
}

async function openStageDetail(label, files) {
  qs('#fileDialogTitle').textContent = label;
  qs('#fileDialogBody').textContent = 'Carregando...';
  qs('#fileDialog').showModal();

  const parts = await Promise.all(
    files.map(async (f) => {
      try {
        const text = await fetch(`/api/file?path=${encodeURIComponent(f)}`).then((r) => (r.ok ? r.text() : null));
        if (!text) return null;
        const name = f.split('/').pop();
        return `▸▸ ${name}\n${'─'.repeat(60)}\n${text}`;
      } catch {
        return null;
      }
    })
  );

  qs('#fileDialogBody').textContent = parts.filter(Boolean).join('\n\n') || '(nenhum arquivo disponível para esta etapa)';
}

async function openPayloadJson(file) {
  const payload = await api(`/api/payloads/${encodeURIComponent(file)}`);
  qs('#fileDialogTitle').textContent = file;
  qs('#fileDialogBody').textContent = JSON.stringify(payload, null, 2);
  qs('#fileDialog').showModal();
}

async function saveBatch(runFirst = false) {
  const config = state.dashboard.config || {};
  const formValues = readGeneratorForm();
  if (formValues) {
    const errs = validateGeneratorForm(formValues);
    if (errs.length) {
      state.generatorErrors = errs;
      updateGeneratorPreviewLive();
      toast(errs[0]);
      return;
    }
  }

  let payloads;
  const text = qs('#payloadPreview')?.value;
  if (state.previewDirty && text && text.trim()) {
    try {
      const parsed = JSON.parse(text);
      payloads = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      toast(`JSON do preview invalido: ${e.message}`);
      return;
    }
  } else {
    payloads = buildPayloadsFromForm(config);
  }

  const saved = [];
  for (const payload of payloads) {
    const result = await api('/api/payloads', {
      method: 'POST',
      body: JSON.stringify({ payload, fileName: `${payload.task_name}.json` }),
    });
    saved.push(result.file);
  }
  toast(`${saved.length} payload(s) salvo(s)`);
  state.generatorPayloads = [];
  state.previewDirty = false;
  await refresh();
  await fetchNextSerial();
  if (runFirst && saved[0]) {
    await runPayload(saved[0]);
  }
}

async function runPayload(file) {
  const run = await api('/api/runs', {
    method: 'POST',
    body: JSON.stringify({ payloadFile: file }),
  });
  state.selectedRunId = run.id;
  toast(`Execucao iniciada: ${file}`);
  setView('runs');
}

document.addEventListener('click', async (event) => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    setView(viewButton.dataset.view);
    return;
  }

  const actionNode = event.target.closest('[data-action]');
  if (!actionNode) return;
  const action = actionNode.dataset.action;

  try {
    if (action === 'refresh') await refresh();
    if (action === 'cad-remove') {
      const { group, item, key } = actionNode.dataset;
      const p = state.providers;
      if (group === 'img_api') {
        const prov = p.image.api.find((x) => x.value === key);
        if (prov) prov.models = prov.models.filter((m) => m !== item);
      } else if (group === 'tts') {
        const prov = p.tts.providers.find((x) => x.value === key);
        if (prov) prov.voices = prov.voices.filter((v) => v !== item);
      } else if (group === 'audio_modes') {
        p.audio_modes = p.audio_modes.filter((m) => m.value !== item);
      } else if (group === 'video_templates') {
        p.video_templates = p.video_templates.filter((t) => t.value !== item);
      }
      await saveProviders();
      return;
    }
    if (action === 'pick-model') {
      const input = qs('#imgModelCustom');
      if (input) {
        input.value = actionNode.dataset.model;
        qsa('.model-chip').forEach((c) => c.classList.toggle('is-active', c.dataset.model === actionNode.dataset.model));
      }
      return;
    }
    if (action === 'config-tab') {
      state.configTab = actionNode.dataset.tab;
      renderConfig();
      return;
    }
    if (action === 'video-subtab') {
      state.configVideoTab = actionNode.dataset.vtab;
      renderConfig();
      return;
    }
    if (action === 'cad-remove-provider') {
      const { group, key } = actionNode.dataset;
      if (!confirm(`Remover provider "${key}"? Todos os modelos/vozes cadastrados serão perdidos.`)) return;
      const p = state.providers;
      if (group === 'img_api') p.image.api = p.image.api.filter((x) => x.value !== key);
      else if (group === 'tts') p.tts.providers = p.tts.providers.filter((x) => x.value !== key);
      await saveProviders();
      return;
    }
    if (action === 'reset-config') {
      if (!confirm('Resetar todos os campos para os valores padrão de defaults.json?')) return;
      const defaults = await api('/api/config/defaults');
      state.dashboard.config = defaults;
      renderConfig();
      toast('Campos resetados para os defaults');
    }
    if (action === 'select-campaign') {
      state.selectedCampaignId = actionNode.dataset.id;
      renderInventory();
    }
    if (action === 'select-payload') {
      state.selectedPayloadFile = actionNode.dataset.file;
      renderGenerator();
    }
    if (action === 'select-tool-category') {
      state.toolCategory = actionNode.dataset.category;
      renderTools();
    }
    if (action === 'select-batch-category') {
      state.batchCategory = actionNode.dataset.category;
      renderBatches();
    }
    if (action === 'toggle-batch-run') {
      const panel = qs(`#${actionNode.dataset.card}-panel`);
      if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
    if (action === 'select-run') {
      state.selectedRunId = actionNode.dataset.id;
      renderRuns();
    }
    if (action === 'cancel-run') {
      const id = actionNode.dataset.id;
      if (!confirm('Cancelar esta execucao?')) return;
      const r = await api(`/api/runs/${encodeURIComponent(id)}/cancel`, { method: 'POST' });
      if (r.ok) toast('Execucao cancelada');
      else toast(r.error || 'Falha ao cancelar');
      loadRun(id);
      return;
    }
    if (action === 'approve-images') {
      const id = actionNode.dataset.id;
      const r = await api(`/api/runs/${encodeURIComponent(id)}/approve-images`, { method: 'POST' });
      if (r.ok) toast('Imagens aprovadas');
      else toast(r.error || 'Falha ao aprovar');
      loadRun(id);
      return;
    }
    if (action === 'reject-images') {
      const id = actionNode.dataset.id;
      if (!confirm('Rejeitar imagens? O pipeline para nesta etapa.')) return;
      const r = await api(`/api/runs/${encodeURIComponent(id)}/reject-images`, { method: 'POST' });
      if (r.ok) toast('Imagens rejeitadas');
      else toast(r.error || 'Falha ao rejeitar');
      loadRun(id);
      return;
    }
    if (action === 'open-file') await openFile(actionNode.dataset.path);
    if (action === 'show-stage-detail') {
      const files = JSON.parse(actionNode.dataset.files || '[]');
      await openStageDetail(actionNode.dataset.label || 'Etapa', files);
      return;
    }
    if (action === 'show-stage-params') {
      await openStageParams(
        actionNode.dataset.label || 'Etapa',
        actionNode.dataset.stageKey || '',
        actionNode.dataset.payload || ''
      );
      return;
    }
    if (action === 'close-params') {
      qs('#paramsDialog').close();
      return;
    }
    if (action === 'close-run-dialog') {
      qs('#runDialog').close();
      return;
    }
    if (action === 'open-run-dialog') {
      await openRunDialog(actionNode.dataset.path || '', actionNode.dataset.name || '');
      return;
    }
    if (action === 'open-image') {
      openImageViewer(
        actionNode.dataset.campaignId || state.selectedCampaignId,
        actionNode.dataset.group,
        actionNode.dataset.index,
      );
      return;
    }
    if (action === 'image-prev') { stepImageViewer(-1); return; }
    if (action === 'image-next') { stepImageViewer(1); return; }
    if (action === 'close-image') { qs('#imageDialog').close(); return; }
    if (action === 'queue-refresh') { renderQueue(); return; }
    if (action === 'queue-toggle') {
      const g = actionNode.dataset.group;
      state.queueGroupOpen[g] = !state.queueGroupOpen[g];
      paintQueue();
      return;
    }
    if (action === 'queue-retry') {
      await api(`/api/queue/jobs/${encodeURIComponent(actionNode.dataset.id)}/retry`, { method: 'POST' });
      toast(`Job ${actionNode.dataset.id} reenviado`);
      renderQueue();
      return;
    }
    if (action === 'queue-remove') {
      if (!confirm(`Remover job ${actionNode.dataset.id}?`)) return;
      await api(`/api/queue/jobs/${encodeURIComponent(actionNode.dataset.id)}`, { method: 'DELETE' });
      toast('Job removido');
      renderQueue();
      return;
    }
    if (action === 'queue-clean') {
      const status = actionNode.dataset.status;
      if (!confirm(`Limpar todos os jobs ${status}?`)) return;
      const r = await api(`/api/queue/clean?status=${status}`, { method: 'POST' });
      toast(`${r.removed || 0} jobs removidos`);
      renderQueue();
      return;
    }
    if (action === 'open-payload-json') await openPayloadJson(actionNode.dataset.file);
    if (action === 'close-file') qs('#fileDialog').close();
    if (action === 'preview-batch') {
      state.generatorPayloads = buildPayloadsFromForm(state.dashboard.config || {});
      const preview = qs('#payloadPreview');
      if (preview) {
        preview.value = JSON.stringify(
          state.generatorPayloads.length === 1 ? state.generatorPayloads[0] : state.generatorPayloads,
          null,
          2
        );
        state.previewDirty = false;
      }
    }
    if (action === 'save-batch') await saveBatch(false);
    if (action === 'save-and-run-first') await saveBatch(true);
    if (action === 'run-payload') await runPayload(actionNode.dataset.file);
  } catch (error) {
    toast(error.message);
  }
});

document.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    if (event.target.id === 'configForm') {
      const config = collectConfigForm(event.target);
      await api('/api/config', { method: 'POST', body: JSON.stringify(config) });
      toast('Defaults salvos');
      await refresh();
      return;
    }

    const cadAction = event.target.dataset.action;
    if (cadAction === 'cad-add') {
      const { group, key } = event.target.dataset;
      const inputs = Array.from(event.target.querySelectorAll('input'));
      const value = inputs[0]?.value.trim();
      const label = inputs[1]?.value.trim();
      if (!value) return;

      const p = state.providers;
      if (group === 'img_api') {
        const prov = p.image.api.find((x) => x.value === key);
        if (prov && !prov.models.includes(value)) prov.models.push(value);
      } else if (group === 'tts') {
        const prov = p.tts.providers.find((x) => x.value === key);
        if (prov && !prov.voices.includes(value)) {
          prov.voices.push(value);
          if (label) p.tts.voice_labels[value] = label;
        }
      } else if (group === 'audio_modes') {
        if (!p.audio_modes.find((m) => m.value === value)) {
          p.audio_modes.push({ value, label: label || value });
        }
      } else if (group === 'video_templates') {
        if (!p.video_templates.find((t) => t.value === value)) {
          p.video_templates.push({ value, label: label || value });
        }
      }
      await saveProviders();
      return;
    }

    if (cadAction === 'cad-add-provider') {
      const { group } = event.target.dataset;
      const value = event.target.querySelector('[name=prov_value]')?.value.trim();
      const label = event.target.querySelector('[name=prov_label]')?.value.trim();
      if (!value || !label) return;
      const p = state.providers;
      if (group === 'img_api' && !p.image.api.find((x) => x.value === value)) {
        p.image.api.push({ value, label, models: [] });
      } else if (group === 'tts' && !p.tts.providers.find((x) => x.value === value)) {
        p.tts.providers.push({ value, label, voices: [] });
      }
      await saveProviders();
      return;
    }

    if (cadAction === 'run-batch-script') {
      const scriptPath = event.target.dataset.path;
      if (!scriptPath) return;
      const inputs = Array.from(event.target.querySelectorAll('[name^=arg_]'))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      const args = inputs.map((i) => i.value.trim()).filter(Boolean);
      const result = await api('/api/run-script', {
        method: 'POST',
        body: JSON.stringify({ path: scriptPath, args }),
      });
      toast(`Execução iniciada — ${result.command}`);
      // Collapse the form
      const form = event.target;
      const panel = form.closest('[id$="-panel"]');
      if (panel) panel.style.display = 'none';
      // Switch to runs view
      state.view = 'runs';
      state.selectedRunId = result.id;
      qsa('.view').forEach((v) => v.classList.remove('is-active'));
      qs('#runsView')?.classList.add('is-active');
      qsa('.nav-item').forEach((b) => b.classList.toggle('is-active', b.dataset.view === 'runs'));
      qs('#viewTitle').textContent = 'Execuções';
      await refresh();
      return;
    }
  } catch (error) {
    toast(error.message);
  }
});

document.addEventListener('input', (event) => {
  if (event.target.id === 'payloadPreview') {
    state.previewDirty = true;
  }
  if (['inventorySearch', 'inventoryProject'].includes(event.target.id)) {
    renderInventory();
  }
  if (event.target.id === 'toolSearch') {
    renderTools();
  }
  if (event.target.id === 'batchSearch') {
    renderBatches();
  }
  if (event.target.closest && event.target.closest('#generatorForm')) {
    scheduleGeneratorPreview();
    if (event.target.name === 'prefix') scheduleNextSerialFetch();
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'inventoryProject') {
    renderInventory();
  }
  if (event.target.id === 'imgSourceSelect') {
    applyImgSourceChange(event.target.value);
  }
  if (event.target.id === 'imgProviderSelect') {
    const source = qs('#imgSourceSelect')?.value || 'api';
    applyImgProviderChange(source, event.target.value);
  }
  if (event.target.closest && event.target.closest('#generatorForm')) {
    scheduleGeneratorPreview();
    if (event.target.name === 'prefix') scheduleNextSerialFetch();
  }
});

let _generatorPreviewTimer = null;
function scheduleGeneratorPreview(delay = 250) {
  if (_generatorPreviewTimer) clearTimeout(_generatorPreviewTimer);
  _generatorPreviewTimer = setTimeout(() => updateGeneratorPreviewLive(), delay);
}

function updateGeneratorPreviewLive() {
  const form = qs('#generatorForm');
  if (!form) return;
  const config = state.dashboard?.config || {};
  const values = readGeneratorForm();
  if (!values) return;
  const errors = validateGeneratorForm(values);
  state.generatorErrors = errors;
  const errBox = qs('#generatorView .generator-errors');
  if (errBox) {
    errBox.innerHTML = errors.map((e) => `<div class="generator-error">! ${escapeHtml(e)}</div>`).join('');
    errBox.style.display = errors.length ? '' : 'none';
  } else if (errors.length) {
    const hostForm = qs('#generatorForm');
    const div = document.createElement('div');
    div.className = 'generator-errors';
    div.innerHTML = errors.map((e) => `<div class="generator-error">! ${escapeHtml(e)}</div>`).join('');
    hostForm.querySelector('.section-title')?.after(div);
  }

  if (errors.length === 0) {
    state.generatorPayloads = buildPayloadsFromForm(config);
    const preview = qs('#payloadPreview');
    if (preview && !state.previewDirty) {
      preview.value = JSON.stringify(
        state.generatorPayloads.length === 1 ? state.generatorPayloads[0] : state.generatorPayloads,
        null, 2);
    }
  }
  const countBadge = qs('#generatorPayloadCount');
  if (countBadge) countBadge.textContent = `${values.topics.length} payload${values.topics.length === 1 ? '' : 's'}`;
}

let _nextSerialTimer = null;
function scheduleNextSerialFetch(delay = 300) {
  if (_nextSerialTimer) clearTimeout(_nextSerialTimer);
  _nextSerialTimer = setTimeout(() => fetchNextSerial(), delay);
}

async function fetchNextSerial() {
  const prefix = qs('#generatorForm [name=prefix]')?.value || 'c';
  try {
    const data = await api(`/api/payloads/next-serial?prefix=${encodeURIComponent(prefix)}`);
    state.generatorNextSerial = data;
    const hint = qs('#nextSerialHint');
    if (hint) hint.textContent = `proximo: ${data.prefix}${data.padded}`;
    scheduleGeneratorPreview(0);
  } catch (e) {
    const hint = qs('#nextSerialHint');
    if (hint) hint.textContent = 'erro ao consultar serial';
  }
}

// Close dialogs: X button or click on backdrop
['fileDialog', 'paramsDialog', 'runDialog', 'imageDialog'].forEach((id) => {
  const dlg = qs(`#${id}`);
  if (!dlg) return;
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
});

// Keyboard navigation for image viewer
document.addEventListener('keydown', (e) => {
  const dlg = qs('#imageDialog');
  if (!dlg || !dlg.open) return;
  if (e.key === 'ArrowLeft') { e.preventDefault(); stepImageViewer(-1); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); stepImageViewer(1); }
});

refresh().catch((error) => {
  document.body.innerHTML = `<pre>${escapeHtml(error.stack || error.message)}</pre>`;
});

window.setInterval(() => {
  if (state.view === 'runs' && !_runStream) renderRunsListOnly();
  if (state.view === 'queue') renderQueue();
}, 3000);

function renderRunsListOnly() {
  api('/api/batches').then((batches) => {
    const listHost = qs('#runsView .list');
    if (!listHost) { renderRuns(); return; }
    listHost.innerHTML = batches.map(renderBatchGroup).join('') || '<p class="muted">Nenhuma execucao registrada.</p>';
  }).catch(() => {});
}
