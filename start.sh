#!/bin/bash

# Verifica se o Docker ou Podman está instalado
if command -v docker &>/dev/null; then
    compose_command="docker compose up -d"
elif command -v podman &>/dev/null; then
    compose_command="podman compose up -d"
else
    echo "Erro: Nem Docker nem Podman estão instalados."
    exit 1
fi

# Verifica se o arquivo .env existe, se não, copia o .env.example
[ ! -f ".env" ] && cp ".env.example" ".env"

# Executa o comando
if ! $compose_command; then
    echo "Erro ao executar o comando de iniciar."
    exit 1
fi
