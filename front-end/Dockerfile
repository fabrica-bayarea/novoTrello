# --------------------------
# Etapa inicial: Construção
# --------------------------
FROM node:22-slim AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências (package.json e package-lock.json) para o container
COPY package*.json ./

# Instala as dependências de forma limpa
RUN npm install --quiet --no-fund --loglevel=error

# Copia todos os arquivos do projeto para o container
COPY . .

# Executa o comando de build para gerar os arquivos otimizados da aplicação
RUN npm run build

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