# --------------------------
# Etapa inicial: Construção
# --------------------------
FROM node:22-slim AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências (package.json e pnpm-lock.yaml) para o container
COPY package.json pnpm-lock.yaml ./

# Instala as dependências EXATAS do lockfile (build reprodutível).
# Antes usávamos `npm install`, que ignorava o pnpm-lock.yaml e resolvia
# versões novas a cada build — o que quebrava o deploy quando um transitivo
# (ex: recharts) mudava tipos entre builds.
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate \
  && pnpm install --frozen-lockfile

# Copia todos os arquivos do projeto para o container
COPY . .

# Executa o comando de build para gerar os arquivos otimizados da aplicação
RUN pnpm run build

# ---------------------
# Etapa final: produção
# ---------------------
FROM node:22-slim AS production

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Comando para criar usuário
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copia os arquivos necessários da etapa de build
COPY --from=build --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=build --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=build --chown=appuser:appgroup /app/public ./public

# Define o usuário para executar a aplicação
USER appuser

# Configura o ambiente como produção
ENV NODE_ENV=production

# Expõe a porta do container
EXPOSE 3000

# Inicia a aplicação Next.js no modo de produção
CMD ["node", "server.js"]