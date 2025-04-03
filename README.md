![Centro Universitário IESB](assets/logoIesb.png)

# 🚀 Novo Trello - Next.js + NestJS

Uma plataforma de gerenciamento de tarefas baseada no modelo Kanban, desenvolvida com **Next.js** (front-end) e **NestJS** (back-end). Oferece funcionalidades como criação de quadros, listas e cartões, autenticação, atribuição de responsáveis, notificações e integração com outros serviços.

## 📂 Estrutura do Projeto

```plaintext
novoTrello
├── back-end/ ............. API backend construída com NestJS e Prisma.
│   ├── src/
│   ├── prisma/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
├── front-end/ ............ Aplicação frontend desenvolvida com Next.js.
│   ├── app/
│   ├── Dockerfile
│   └── package.json
├── assets/
├── docker-compose.yaml ... Configuração para executar toda a stack via Docker.
├── start.js .............. Script de inicialização automatizado.
├── README.md ............. Documentação.
└── LICENSE.md ............ Licença do projeto.
```

## 📦 Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas no seu ambiente de desenvolvimento:

- **Node.js**: [Guia de instalação](https://nodejs.org/)
- **Docker**: [Guia de instalação](https://docs.docker.com/desktop/install/linux-install/)

## 🔥 Como Executar a Aplicação

### Tecnologias Utilizadas

- **Next.js**
- **NestJS**
- **Prisma**
- **PostgreSQL**
- **Docker**

### Passos para Rodar Localmente

1. Clone o repositório:

  ```bash
  git clone https://github.com/fabrica-bayarea/novoTrello.git
  ```

2. Inicie a aplicação:

  ```bash
  node start.js
  ```

> **Nota:**  
> Você pode personalizar as configurações copiando o arquivo `.env.example` para `.env` e ajustando conforme necessário.

## 🛠️ Desenvolvimento

Para obter informações detalhadas sobre como executar o projeto em modo de desenvolvimento, consulte os arquivos README localizados nas pastas `back-end` e `front-end`. Para orientações sobre como contribuir com o projeto, veja o arquivo [CONTRIBUTING.md](CONTRIBUTING.md).

## 📝 Licença

Distribuído sob a Licença GPL3. Veja [LICENSE](LICENSE.md) para mais informações.

## 📞 Contato ou Suporte

Se você tiver perguntas, encontrar um bug, tiver sugestões para novos recursos ou precisar de ajuda, abra um issue no repositório do GitHub. Isso garante que sua preocupação seja visível para outros, possa ser discutida colaborativamente e ajude a construir um arquivo público de soluções para consultas semelhantes no futuro.

## 👥 Colaboradores
Agradecemos a todos os incríveis colaboradores que tornaram este projeto possível:

|<img src="https://github.com/aureliovieirarocha.png" width="100">|<img src="https://github.com/ApenasGui.png" width="100">|<img src="https://github.com/vgabriel-pereira.png" width="100">|<img src="https://github.com/gabrieldnf.png" width="100">|
|:-:|:-:|:-:|:-:|
|[Aurélio Vieira Rocha](https://github.com/aureliovieirarocha)|[Guilherme](https://github.com/ApenasGui)|[Victor Gabriel Pereira](https://github.com/vgabriel-pereira)|[Gabriel D. N. F.](https://github.com/gabrieldnf)|

|<img src="https://github.com/CauaMata14.png" width="100">|<img src="https://github.com/ArthurRabel.png" width="100">|<img src="https://github.com/GeorgesCarmo.png" width="100">|
|:-:|:-:|:-:|
|[Caua Mata](https://github.com/CauaMata14)|[Arthur Rabelo](https://github.com/ArthurRabel)|[GeorgesCarmo](https://github.com/GeorgesCarmo)|
