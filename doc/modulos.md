# Módulos do Sistema

Mapa simples de todos os módulos do `pipeline/` e das specs de agentes em `skills/`.

---

## Pipeline (`pipeline/`)

### Infraestrutura

| Arquivo | O que faz |
|---|---|
| `redis.js` | Conexão com Redis |
| `queues.js` | Define as filas BullMQ |
| `orchestrator.js` | Recebe o payload e enfileira os jobs |

### Workers (executores de etapa)

| Arquivo | O que faz |
|---|---|
| `worker.js` | Worker principal; roda os agentes de texto (pesquisa, criativo, copywriter) |
| `worker-ad-creative.js` | Gera o HTML do ad + screenshot PNG |
| `worker-video.js` | Vídeo quick (slideshow ffmpeg) |
| `worker-video-pro.js` | Vídeo pro (Remotion, narração, templates) |
| `worker-video-report.js` | Vídeo do relatório de resultados |
| `worker-video-gatilhos.js` | Vídeo de gatilhos mentais |
| `worker-platforms.js` | Agentes de distribuição (IG, YT, TikTok...) |
| `worker-assets.js` | Montagem de assets auxiliares |
| `worker-runtime.js` | Utilitários compartilhados pelos workers |

### Geração de Imagem

| Arquivo | O que faz |
|---|---|
| `generate-image-kie.js` | Provider KIE (modelo de imagem) |
| `generate-image-inemaimg.js` | Provider InemaImg |
| `generate-image-piramyd.js` | Provider Piramyd |
| `generate-image-pollinations.js` | Provider Pollinations (gratuito) |

### Renderização

| Arquivo | O que faz |
|---|---|
| `render-slide-png.js` | Renderiza slides PNG via Playwright |
| `render-visual-png.js` | Renderiza visuais de cena (chart, text_card, etc.) via Playwright |
| `render-video-ffmpeg.js` | Monta vídeo final via ffmpeg |
| `render-video.js` / `render-video-remotion.js` | Renderização Remotion |

### Áudio

| Arquivo | O que faz |
|---|---|
| `generate-audio.js` | TTS (Chatterbox → Fish → ElevenLabs) |
| `audio-enrich.js` | Enriquece áudio com música de fundo/SFX |
| `video-audio.js` | Mescla trilha no vídeo |

### Utilitários

| Arquivo | O que faz |
|---|---|
| `capture-screenshots.js` | Playwright genérico |
| `scene-plan-validator.js` | Valida o plano de cenas antes de renderizar |
| `search-music-freesound.js` | Busca música no Freesound |
| `supabase-upload.js` | Upload de mídia + URL pública |
| `publish_now.js` | Publica imediatamente nas plataformas |
| `generate-pascoa-carousel.js` | Gerador especial de carrossel Páscoa |

---

## Skills (`skills/`)

São as **specs dos agentes** — prompts, responsabilidades e outputs esperados. Cada pasta tem um `SKILL.md`.

| Skill | O que faz |
|---|---|
| `creative-director` | Recebe o briefing, define a narrativa e estrutura da campanha |
| `marketing-research-agent` | Pesquisa mercado/concorrência via Tavily |
| `copywriter-agent` | Gera os textos finais (legenda, headline, CTA) |
| `ad-creative-designer` | Layout HTML do anúncio |
| `video-editor-agent` | Roteiro e cenas do vídeo (quick e pro) |
| `distribution-agent` | Upload + publicação nas plataformas |
| `agente-revisor` | Avalia saídas e aprova/rejeita automaticamente |
| `image-generation` | Guia de prompts para geração de imagem |
| `photography-director` | Direção de fotografia para as cenas |
| `video-art-direction` | 12 presets visuais (cinematic, bold, minimal...) |
| `video-composition` | Regras de composição de cena |
| `video-quick` | Spec específica do modo quick |
| `video-engineering` | Detalhes técnicos de renderização |
| `typography-on-image` | Regras de tipografia sobreposta em imagem |
| `providers` | Configuração dos providers de imagem/TTS |
| `orchestrator` | Spec do orquestrador |
| `media-help` | Auxiliar de mídia |
| `remotion-best-practices` | Boas práticas Remotion |
