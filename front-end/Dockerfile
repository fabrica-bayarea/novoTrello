# --------------------------
# Etapa inicial: Construção
# --------------------------
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --quiet --no-fund --loglevel=error

COPY . .

RUN npm run build

# ---------------------
# Etapa final: produção
# ---------------------
FROM node:22-slim AS production

WORKDIR /app

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copia arquivos da build
COPY --from=build --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=build --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=build --chown=appuser:appgroup /app/public ./public

# Copia dependências (essenciais para standalone funcionar)
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/package.json ./package.json

USER appuser

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
