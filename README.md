![Centro Universitário IESB](assets/logoIesb.png)

# Novo Trello - Next.js + NestJS

O novo trello composto por duas partes: o front-end em **Next.js** e o back-end em **NestJS**. Ambos os componentes estão no mesmo repositório, separados em pastas distintas: `front-end/` para o Next.js e `back-end/` para o NestJS. 

A seguir, estão as instruções para rodar ambos os ambientes localmente.

## Estrutura do Projeto

- **front-end/**: Contém o código do front-end utilizando Next.js.
- **back-end/**: Contém o código do back-end utilizando NestJS.

---

### Dependências
Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:
- Node.js: [Instalação do Node.js](https://nodejs.org/)
- Docker: [Instalação do Docker](https://docs.docker.com/desktop/install/linux-install/)

Após isso clone o projeto:
  ```bash
  git clone https://github.com/fabrica-bayarea/novoTrello.git
  ```

## Back-end - NestJS

### Tecnologias
- NestJS
- TypeScript
- Prisma
- Postgres
- Docker

### Rodando localmente
1. Mude para a pasta `back-end`:
  ```bash
  cd back-end
  ```

2. Instale as dependências:
  ```bash
  npm install
  ```

3. Crie um container do Postgres:
  ```bash
  docker run --name database_trello \
    -e POSTGRES_PASSWORD=password_postgres -e POSTGRES_USER=user_postgres \
    -d -p 5432:5432 postgres
  ```

4. Criar arquivo .env de acordo com o arquivo .env.example que está na pasta "back-end/"
  
> [!IMPORTANT]  
> É crucial que as variaveis de ambiente usada na criação do container seja a mesma no "DATABASE_URL"

5. Aplique as migrações no banco de dados:
  ```bash
  npx prisma migrate dev
  ```

6. Inicie a aplicação:
  ```bash
  npm run start:dev
  ```

---

7. Acesse [http://localhost:3000](http://localhost:3000) com o seu navegador para ver o resultado.

## Front-end - Next.js

### Tecnologias
- Next.js
- TypeScript
- Docker

### Rodando localmente
1. Mude para a pasta `front-end`:
  ```bash
  cd front-end
  ```

2. Instale as dependências:
  ```bash
  npm install
  ```

3. Inicie a aplicação:
  ```bash
  npm run dev
  ```

4. Acesse [http://localhost:3001](http://localhost:3001) com o seu navegador para ver o resultado.
