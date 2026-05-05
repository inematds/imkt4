## Project Overview

**imkt4** — Fork independente do `timesmkt3 v4.5.4`. Cockpit web para o pipeline INEMA de geração de conteúdo social.

Repositório: https://github.com/inematds/imkt4 (a pasta local segue `/home/nmaldaner/projetos/imkt3/` por inércia — só o nome do projeto/repo é `imkt4`).

A interface principal é o **cockpit web** (`ui/`), não há bot Telegram ativo nesse fork. O pipeline subjacente (agentes, skills, knowledge) é herdado mas evolui de forma autônoma.

> ⚠️ **NUNCA tocar em `/home/nmaldaner/projetos/timesmkt3/`** — é o sistema legado em produção, com PM2 próprio. Qualquer arquivo dentro desta pasta é editável.

---

## Versionamento

Dois esquemas convivem:

| Componente | Esquema | Onde atualizar |
|---|---|---|
| **Cockpit UI** | `v3.RECURSO.BUG` (atual: **v3.5.0**) | `ui/public/app.js` (`UI_VERSION`) + `ui/public/index.html` (`<small class="brand-version">`) |
| **Pipeline herdado** | `v4.5.4` (do timesmkt3) | `package.json` — não bumpar até definir esquema próprio |

`BUG` acumula e nunca zera ao incrementar `RECURSO`. Só zera quando MAJOR muda. A cada mudança em `ui/`, perguntar se é RECURSO ou BUG e atualizar os dois arquivos.

---

## Cockpit UI

- **Stack:** Node `http` nativo (sem Express), frontend vanilla JS monolítico (`ui/public/app.js` ~2500 linhas)
- **Porta:** 5177 (override via `TIMESMKT_UI_PORT`)
- **PM2:** processo `ui`, `cwd=` raiz do repo, `script=ui/server.js`. Subir: `npx pm2 start ui/server.js --name ui --time && npx pm2 save`

---

## System Architecture

Pipeline de 5 etapas com gate de aprovação cada:

1. **Estratégia & Narrativa** — Research → Diretor Criativo → Copywriter
2. **Imagens** — Ad Creative Designer
3. **Vídeo** — Video Quick (default) + Video Pro (sob demanda)
4. **Plataformas** — 6 agentes (só rodam as de `platform_targets`)
5. **Distribuição** — upload + agendar + publicar

Detalhes por stage: `doc/manual-stage{1..5}-*.md`. Aprovações: `doc/pipeline-aprovacoes.md`.

**Modos de aprovação** (via `approval_modes`): `humano` (padrão), `auto`, `agente` (Revisor decide).

**Gate de imagens vs gate de stage:** worker emite `[IMAGE_APPROVAL_NEEDED]` interno, aguardando `imgs/approved.json` para montar HTML do ad. A aprovação real do stage 2 acontece depois, quando `ad_creative_designer` + `copywriter_agent` completam — mecanismos independentes.

**Componentes:**
- Cockpit UI (`ui/server.js`)
- Orchestrator (`pipeline/orchestrator.js`) — enfileira via `enqueueStage()`
- Worker (`pipeline/worker.js`) — emite `[STAGE1_DONE]`, `[STAGE2_IMAGE_READY]`, `[IMAGE_APPROVAL_NEEDED]`

---

## Fila e runtime

**BullMQ isolada:** `ai-content-pipeline-imkt4` (em `pipeline/queues.js:4`). **Nunca renomear para `ai-content-pipeline`** — esse é o do timesmkt3, e colidir faz outputs irem parar em `/timesmkt3/prj/`.

**Redis:** container Docker `redis` (alpine, porta 6379). Compartilhado com timesmkt3, segregação por nome de fila. Se `ECONNREFUSED 6379`: `docker start redis`.

**Worker próprio do imkt4 ainda não existe no PM2.** Sem ele, jobs ficam em "Aguardando" indefinidamente. Para iniciar:
```bash
cd /home/nmaldaner/projetos/imkt3
npx pm2 start pipeline/worker.js --name imkt4-worker --time && npx pm2 save
```

Nunca deixar 2 instâncias do mesmo processo PM2 — antes de `start`, conferir `npx pm2 list` e usar `restart` se já existe.

---

## Estrutura de projetos

`prj/<slug>/` com `assets/`, `knowledge/`, `outputs/`. Todo payload precisa de `project_dir` (ex: `"project_dir": "prj/coldbrew-coffee-co"`). Demo: Cold Brew Coffee Co.

Skip flags no payload: `skip_research`, `skip_image`, `skip_video`. Detalhes em `doc/manual-pipeline-comandos.md`.

---

## Agents

Specs em `skills/<agente>/SKILL.md` — sempre ler o SKILL.md antes de mexer no agente. Agentes de plataforma em `doc/agentes-distribuicao.md`. Templates de Video Pro (`auto`, `data_story`, `explainer`, `narrativo`, `brand_film`) e visual types (`photo`, `chart`, `text_card`, `list`, `split`) em `skills/video-editor-agent/SKILL.md`.

**Override visual no payload (não consumido ainda):** o cockpit grava `visual_direction_override` (ad_layout_type, mood, dominant_colors, etc.). Hoje é só metadado — para virar hard constraint, precisa mexer em `skills/creative-director/SKILL.md`.

**Regra fixa de imagens via API:** modelos (KIE/z-image) devem gerar imagens **limpas de texto** — texto sempre sobreposto via HTML/CSS na montagem.

---

## Comando /import

Copia assets entre campanhas para `prj/<projeto>/imports/`. Sintaxe e exemplos em `doc/sistema.md`.
