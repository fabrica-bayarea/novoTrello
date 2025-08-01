#!/bin/bash
set -euo pipefail

# Função para exibir erro e sair
error_exit() {
    echo "Erro: $1" >&2
    exit 1
}

# Verifica se o Docker está instalado
if ! command -v docker &>/dev/null; then
    error_exit "Docker não está instalado."
fi

compose_command="docker compose up -d"

# Verifica se o arquivo .env existe, se não, copia o .env.example
if [ ! -f ".env" ]; then
    echo "Arquivo .env não encontrado, copiando de .env.example..."
    cp ".env.example" ".env"
fi

# Executa o docker compose
if ! $compose_command; then
    error_exit "Erro ao executar 'docker compose up -d'."
fi

echo "Deploy finalizado com sucesso."
