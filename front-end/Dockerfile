# --------------------------
# Etapa inicial: Construção
# --------------------------
FROM node:22.12-slim AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências (package.json e package-lock.json) para o container
COPY package*.json ./

# Instala as dependências de forma limpa, garantindo consistência com o package-lock.json
RUN npm ci

# Copia todos os arquivos do projeto para o container
COPY . .

# Executa o comando de build para gerar os arquivos otimizados da aplicação
RUN npm run build

# ---------------------
# Etapa final: produção
# ---------------------
FROM node:22.12-slim AS production

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos necessários da etapa de build
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public

# Configura o ambiente como produção
ENV NODE_ENV=production

# Expõe a porta do container
EXPOSE 3000

# Inicia a aplicação Next.js no modo de produção
CMD ["npm", "run", "start"]
