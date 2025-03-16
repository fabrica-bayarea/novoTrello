# Diretrizes do Projeto

Este documento descreve as convenções e boas práticas seguidas neste projeto, incluindo as convenções de mensagens de commit, nomenclatura de branches e outras regras importantes para manter o código limpo e consistente.

---

## Idioma do Projeto

Para manter a consistência e facilitar a colaboração com desenvolvedores internacionais, **todos os commits, issues, pull requests e o código devem ser escritos em inglês**. 

**Exceção**: As documentações (como README, guias e outros arquivos de ajuda) podem ser escritas em português.

## Convenção de Mensagens de Commit

Seguimos a especificação **Conventional Commits** para garantir clareza, consistência e automação para versionamento e changelogs. O formato da mensagem de commit é:

### Tipos de Commit

- **feat**: Uma nova funcionalidade adicionada ao código (ex.: adicionar um novo endpoint da API, adicionar um componente de UI).
- **fix**: Correção de um bug (ex.: corrigir um recurso quebrado ou resolver um problema).
- **docs**: Atualização de documentação (ex.: atualizar README, adicionar comentários).
- **style**: Mudanças de estilo no código (ex.: formatação, mudanças de lint, sem alteração de funcionalidade).
- **refactor**: Mudanças no código que não corrigem um bug nem adicionam uma funcionalidade (ex.: limpar código, melhorar performance).
- **perf**: Melhorias de performance (ex.: otimizar uma função ou consulta).
- **test**: Adição ou modificação de testes (ex.: testes unitários, testes de integração).
- **chore**: Tarefas rotineiras ou manutenção que não modificam o código de produção (ex.: atualizar dependências, configurações de CI/CD).
- **build**: Mudanças relacionadas ao processo de build ou dependências (ex.: atualizar a configuração do Webpack, mudanças no Docker).

### Exemplos de Mensagens de Commit

- `feat(auth): add user registration endpoint`
- `fix(auth): resolve password hashing bug`
- `docs(readme): update instructions for setting up Docker`
- `style(button): correct button padding`
- `refactor(api): clean up user controller`
- `perf(search): optimize search query performance`
- `test(auth): add tests for login endpoint`
- `chore(deps): update Node.js version`
- `build(ci): update GitHub Actions workflow`

### Diretrizes para Mensagens de Commit

- Mantenha a linha de assunto com **menos de 72 caracteres**.
- Forneça uma **mensagem clara e concisa** descrevendo o que foi alterado.
- Se necessário, inclua o **motivo** da mudança no corpo da mensagem.

---

## Nomenclatura de Branches

Seguimos as seguintes convenções para nomeação de branches:

- **main**: A branch principal contendo o código pronto para produção.
- **feature/**: Usada para novas funcionalidades ou mudanças (ex.: `feature/user-authentication`).
- **bugfix/**: Usada para correções de bugs (ex.: `bugfix/fix-login-issue`).
- **hotfix/**: Usada para correções urgentes que precisam ser enviadas para produção imediatamente (ex.: `hotfix/crash-on-login`).
- **release/**: Usada para preparar novas versões para lançamento (ex.: `release/v1.0.0`).
- **chore/**: Usada para tarefas rotineiras e manutenção (ex.: `chore/update-dependencies`).

---

## Diretrizes de Estilo de Código

Utilizamos a ferramenta **ESLint** para garantir que o código esteja formatado de maneira consistente em todo o projeto.

- **ESLint**: Usado para garantir a qualidade e consistência do código JavaScript/TypeScript.

### Regras de Formatação

- Use **2 espaços** para indentação.
- Prefira **aspas simples** para strings (exceto para JSON).
- **Sempre** adicione uma **nova linha ao final dos arquivos**.
- Não deve haver **espaços em branco** no final das linhas.

---

## Diretrizes para Pull Requests (PR)

Ao criar um pull request:

1. Certifique-se de que sua branch está atualizada com a branch principal (`main`).
2. Forneça um título claro e uma descrição para o PR.
3. Vincule problemas relevantes, se aplicável (ex.: `Fixes #123`).
4. Certifique-se de que todos os testes estão passando antes de solicitar uma revisão.
5. Rebase ou faça merge das últimas mudanças da branch principal antes de mesclar o PR.
