# Plano: LLM Provider Switching + Multi-Campaign Queue

**Data:** 2026-04-06  
**Versão alvo:** timesmkt3 v4.4.x

---

## Feature 1 — LLM Provider Abstraction

### Situação atual

Em `pipeline/worker-runtime.js:84-93`, o runner hardcoda `claude` como comando e passa `--model sonnet|opus` via flag CLI. Não existe abstração — o sistema só fala Claude.

### Arquitetura proposta

```
pipeline/
└── llm/
    ├── index.js          ← registry: resolve provider + tier → runner
    ├── providers/
    │   ├── claude.js     ← atual (claude -p --model)
    │   ├── openai.js     ← futuro (chat completions API)
    │   └── gemini.js     ← futuro
    └── tiers.js          ← mapa: fast/premium → provider-specific model ID
```

### Mapa de tiers (`tiers.js`)

Define dois níveis de serviço fixos: **`fast`** e **`premium`**.  
Cada provider mapeia esses tiers para seu modelo equivalente:

```js
export const TIER_MAP = {
  claude: {
    fast:    'claude-sonnet-4-6',   // atual: sonnet
    premium: 'claude-opus-4-6',     // atual: opus
  },
  openai: {
    fast:    'gpt-4o-mini',
    premium: 'gpt-4o',
  },
  gemini: {
    fast:    'gemini-2.0-flash',
    premium: 'gemini-2.5-pro',
  },
};
```

### `providers/claude.js` — extrai lógica atual de `worker-runtime.js`

```js
// Recebe: { prompt, agentName, outputDir, timeoutMs, tier }
// Retorna: Promise<string> — stdout do processo
export async function run({ prompt, agentName, outputDir, timeoutMs, tier }) {
  const modelId = TIER_MAP.claude[tier];
  return spawnClaude(prompt, modelId, ...);
}
```

### `llm/index.js` — ponto central

```js
export function getLLMRunner(provider = process.env.LLM_PROVIDER || 'claude') {
  return require(`./providers/${provider}.js`);
}
```

### Configuração via `.env`

```env
LLM_PROVIDER=claude          # claude | openai | gemini
LLM_TIER_FAST=fast           # tier para agentes rápidos (pesquisa, copy, plataformas)
LLM_TIER_PREMIUM=premium     # tier para agentes pesados (creative director, video)
```

### Mapeamento de agentes → tier

Cada agente no `orchestrator.js` já tem um campo `model: 'sonnet'|'opus'`.  
Isso vira `tier: 'fast'|'premium'`. O runner resolve o modelo real baseado no provider ativo.

### Mudanças de código

| Arquivo | O que muda |
|---|---|
| `pipeline/worker-runtime.js` | `createClaudeRunner()` → `createLLMRunner()` que chama `llm/index.js` |
| `pipeline/orchestrator.js` | `model: 'sonnet'` → `tier: 'fast'`, `model: 'opus'` → `tier: 'premium'` |
| `.env.example` | Adicionar `LLM_PROVIDER`, `LLM_TIER_FAST`, `LLM_TIER_PREMIUM` |
| `pipeline/llm/` | Criar estrutura nova |

**Nenhuma mudança nos agent handlers** — eles só chamam `runClaude(prompt, agentName, ...)`, que passa a ser `runLLM(prompt, agentName, ...)`.

> **Nota importante:** Providers não-Claude não usam CLI subprocess — usam API diretamente via SDK. O `providers/openai.js` chama `openai.chat.completions.create()` e formata o prompt como mensagem de sistema. Isso significa que as skills (arquivos `.md`) continuam sendo o "system prompt" mas são injetadas diferentemente por cada provider.

---

## Feature 2 — Multi-Campaign Queue (Fila de Campanhas)

### Situação atual

Hoje cada campanha é startada individualmente pelo bot. Não existe conceito de "lote de campanhas". O `orchestrator.js` gerencia a fila de **agents dentro de uma campanha**, mas não de campanhas entre si.

### Arquitetura proposta

**Novo layer: Campaign Queue (acima do Pipeline)**

```
telegram/bot.js
    └── [/batch <project> <camp1> <camp2> ...]
            ↓
        pipeline/campaign-queue.js    ← NOVO
            ├── addCampaign(payload)
            ├── runNext()             ← série
            └── runAll()              ← paralelo (limite configurável)
                    ↓
            pipeline/orchestrator.js  ← existente, sem mudança
```

### `pipeline/campaign-queue.js` — estrutura

```js
// Usa Redis para persistência da fila entre restarts

class CampaignQueue {
  // Adiciona campanha à fila (sem iniciar)
  async enqueue(payload) { ... }

  // Inicia próxima campanha quando a atual terminar (modo série)
  async runSerial() { ... }

  // Inicia até N campanhas em paralelo
  async runParallel(concurrency = 2) { ... }

  // Status de todas as campanhas na fila
  async status() { ... }
}
```

### Formato do comando no bot

```
# Fila em série (padrão)
/batch coldbrew-coffee-co pascoa_2026 verao_2026 lancamento_produto

# Fila paralela (até 2 simultâneas)
/batch coldbrew-coffee-co --parallel=2 pascoa_2026 verao_2026 lancamento_produto

# Múltiplos projetos
/batch coldbrew-coffee-co:pascoa_2026 outro-projeto:campanha_b --parallel=1
```

### Estado da fila salvo em Redis

```json
{
  "campaign_queue": [
    { "id": "q1", "project": "coldbrew-coffee-co", "name": "pascoa_2026", "status": "running", "started_at": "..." },
    { "id": "q2", "project": "coldbrew-coffee-co", "name": "verao_2026",  "status": "pending" },
    { "id": "q3", "project": "outro-projeto",       "name": "campanha_b", "status": "pending" }
  ],
  "mode": "serial",
  "concurrency": 1
}
```

### Fluxo série

```
[q1 inicia] → [q1 STAGE5_DONE emitido] → [campaign-queue detecta] → [q2 inicia] → ...
```

### Fluxo paralelo

```
[q1 inicia] → [q2 inicia imediatamente] → [q3 aguarda slot livre]
```

### Progresso no Telegram

```
🗂️ Fila de Campanhas — coldbrew-coffee-co
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ pascoa_2026        — Concluída
🔄 verao_2026         — Stage 2/5 (Imagens)
⏳ lancamento_produto — Aguardando
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Modo: Série | 1/3 concluídas
```

### Mudanças de código

| Arquivo | O que muda |
|---|---|
| `pipeline/campaign-queue.js` | Criar — gerencia fila de campanhas via Redis |
| `telegram/bot.js` | Adicionar handler `/batch` |
| `telegram/bot-runtime.js` | `runPipelineV3` emite evento `campaign:done` quando stage 5 conclui |
| `pipeline/orchestrator.js` | Sem mudança |

---

## Sequência de implementação

### Sprint 1 — LLM Abstraction (menor risco, maior valor)

1. Criar `pipeline/llm/tiers.js` + `providers/claude.js` (extrai código atual)
2. Criar `pipeline/llm/index.js` com registry
3. Atualizar `worker-runtime.js` para usar `llm/index.js`
4. Atualizar `orchestrator.js`: `model` → `tier`
5. Atualizar `.env.example`
6. Testar com `LLM_PROVIDER=claude` (deve funcionar igual hoje)

### Sprint 2 — Multi-Campaign Queue

1. Criar `pipeline/campaign-queue.js`
2. Adicionar `/batch` no `bot.js`
3. Implementar modo série primeiro (mais simples)
4. Adicionar progresso no Telegram
5. Implementar modo paralelo
6. Testes com 2 campanhas reais

---

## Riscos e decisões abertas

| Item | Risco | Decisão sugerida |
|---|---|---|
| Providers não-Claude não têm CLI — usam API | Skills (`.md`) precisam virar system prompts | Cada `providers/X.js` injeta o skill como `role: system` |
| Paralelo pode saturar Redis/CPU | Muitas campanhas simultâneas | Limitar `concurrency` default a 2, máximo 3 |
| Aprovações manuais bloqueiam série | Campanha q2 aguarda q1 aprovar stage por stage | Bot notifica por campanha individualmente; usuário aprova cada uma |
| LLM não-Claude pode não entender o formato de output esperado | Agentes esperam JSON estruturado | Adicionar instruções de formato explícitas no system prompt de cada provider |
