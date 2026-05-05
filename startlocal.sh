#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Erro: comando obrigatorio nao encontrado: $1" >&2
    exit 1
  fi
}

require_cmd node
require_cmd npm
require_cmd docker
require_cmd npx

if [ ! -f .env ]; then
  echo "Erro: arquivo .env nao encontrado em $ROOT_DIR" >&2
  echo "Crie com: cp .env.example .env" >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Dependencias da raiz ausentes. Rodando npm install..."
  npm install
fi

if [ ! -d remotion-ad/node_modules ]; then
  echo "Dependencias de remotion-ad ausentes. Rodando npm install..."
  (cd remotion-ad && npm install)
fi

if ! docker ps --format '{{.Names}}' | grep -Fxq redis; then
  if docker ps -a --format '{{.Names}}' | grep -Fxq redis; then
    echo "Iniciando container redis existente..."
    docker start redis >/dev/null
  else
    echo "Criando container redis..."
    docker run -d --name redis -p 6379:6379 --restart unless-stopped redis:alpine >/dev/null
  fi
fi

if npx pm2 describe timesmkt3-bot >/dev/null 2>&1 || npx pm2 describe timesmkt3-worker >/dev/null 2>&1; then
  echo "Reiniciando processos locais no PM2..."
  npx pm2 restart ecosystem.config.cjs
else
  echo "Iniciando bot e worker no PM2..."
  npx pm2 start ecosystem.config.cjs
fi

npx pm2 save >/dev/null

echo
echo "Ambiente local em execucao."
echo
npx pm2 list
echo
echo "Logs:"
echo "  npx pm2 logs timesmkt3-bot --lines 50"
echo "  npx pm2 logs timesmkt3-worker --lines 50"
