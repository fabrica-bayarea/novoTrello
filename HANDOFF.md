# 🤝 Guia de Continuidade — Sprint Tracker

> Para a comunidade da **Fábrica Bay Area / IESB**.
> O projeto foi **entregue e está em produção**. Este documento existe para que qualquer pessoa nova consiga entender, rodar, evoluir e manter o Sprint Tracker **sem depender de quem construiu**.

**Status:** ✅ Entregue · 🟢 Em produção em [bayarea.dataiesb.com/sprint](https://bayarea.dataiesb.com/sprint)
**Licença:** GPL-3.0 · **Repositório:** [github.com/fabrica-bayarea/Sprint-Tracker](https://github.com/fabrica-bayarea/Sprint-Tracker)

---

## 1. O que é

Plataforma web de **gestão ágil de sprints no modelo Kanban**: quadros, listas e cartões, planejamento de sprints (planejada → ativa → histórico), colaboração em equipe e automações. Feita sob medida para os times da Fábrica.

## 2. Links e documentos

| Recurso | Onde |
|---|---|
| Repositório | https://github.com/fabrica-bayarea/Sprint-Tracker |
| Aplicação (produção) | https://bayarea.dataiesb.com/sprint |
| Rodar com Docker | [`DOCKER.md`](DOCKER.md) |
| Deploy / infraestrutura | [`DEPLOYMENT.md`](DEPLOYMENT.md) |
| Como contribuir | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Este guia de continuidade | `HANDOFF.md` |

## 3. Arquitetura (resumo)

```
Usuário ─▶ Nginx (ingress) ─┬─▶ Front-end (Next.js)
                            └─▶ Back-end (NestJS) ─┬─▶ PostgreSQL (RDS)
                                                   └─▶ S3
```

- **Front-end** — TypeScript · Next.js 16 (App Router, `basePath: /sprint`) · React 19 · TanStack Query · Zustand · Tailwind 4 · shadcn/ui
- **Back-end** — TypeScript · NestJS 11 · Prisma 6 · API REST · Auth JWT em cookie (`sprinttacker-session`) · Swagger
- **Banco** — PostgreSQL (migrations via Prisma)
- **Infra** — Docker · AWS **EKS** (namespace `bayarea-web`) · **RDS** (banco `sprint_tracker`) · **S3** · **ECR** · **GitHub Actions** (CI/CD) · Nginx

## 4. Estrutura do repositório

```
back-end/    API NestJS (módulos: auth, board, board-member, list, task,
             task-comment, task-log, sprint, label, email, events, notification…)
             prisma/  → schema + migrations
front-end/   App Next.js (app/, features/, components/, stores/, lib/)
k8s/prod/    Manifests de produção (backend.yaml, frontend.yaml)
docs/        DEPLOYMENT.md e afins
.github/workflows/  ci-cd.yml · ci-pr.yaml · security.yml
```

**Entidades do domínio:** `User · Board · BoardMember · Invite · List · Task · TaskComment · TaskLabel · Label · TaskLog · Sprint · Notification`

## 5. Rodando localmente (em 1 comando)

Pré-requisitos: **Git** e **Docker**.

```bash
git clone https://github.com/fabrica-bayarea/Sprint-Tracker.git
cd Sprint-Tracker
cp .env.example .env    # ajuste se precisar
bash start.sh           # sobe tudo via docker compose
```

- Front: `http://localhost:3001` · Back: `http://localhost:3000` (Swagger em `/docs`)
- Detalhes e troubleshooting: [`DOCKER.md`](DOCKER.md)
- Modo dev (fora do Docker): ver os READMEs em `back-end/` e `front-end/`.

## 6. Fluxo de contribuição

1. Crie uma **branch** a partir da `main` (`feat/...`, `fix/...`, `docs/...`).
2. Faça as mudanças + **valide** (`tsc`, build, testes quando houver).
3. Abra um **Pull Request** para a `main` → review → merge.
4. Detalhes e convenções: [`CONTRIBUTING.md`](CONTRIBUTING.md).

**Deploy:** o merge na `main` dispara o **CI/CD (GitHub Actions)** → build → push no ECR → `kubectl set image` no EKS + `prisma migrate deploy`. Ver [`DEPLOYMENT.md`](DEPLOYMENT.md).

## 7. Estado atual & pontos de atenção

O que está **pronto e no ar**:
- Quadros, listas, tarefas (status, responsáveis, labels, comentários, log), sprints (planejada/ativa/histórico/encerramento), autenticação, membros/papéis/convites, notificações.
- **Sprints multi-board** — a sprint é do dono e agrega tarefas de vários quadros, com automação bidirecional **status↔coluna** (validada ponta a ponta).
- **Segurança** — os alertas do code scanning (Trivy/CodeQL/Semgrep) foram tratados; hardening `securityContext` nos Deployments; imagens rodando como usuário não-root.

⚠️ **Pontos que a próxima pessoa deve saber:**
- **3 alertas de segurança foram *dispensados* de propósito** (false-positive/won't-fix), não são bugs:
  - ReDoS em `front-end/lib/utils/validateId.ts` — o regex `^[a-zA-Z0-9_-]{1,128}$` é seguro (sem backtracking catastrófico).
  - CSP do helmet em `back-end/src/main.ts` — é um achado *positivo*.
  - `pathname` no `header/index.tsx` — dead-code **intencional** (`false && …`) para reativar as tabs de sprint no futuro.
- **Automação status↔coluna** só funciona em colunas cujo `List.status` está setado. As colunas com nome padrão foram mapeadas por migration; **falta uma UI** para mapear colunas novas/fora do padrão (precisa de `status` no `CreateListDto`/`UpdateListDto` + o dropdown no front).
- **Banco:** produção usa o database **`sprint_tracker`** no RDS. Existe também um **`bayarea_dev`** provisionado para um futuro ambiente de DEV isolado (ainda não conectado à app).

## 8. Roadmap sugerido (por onde continuar)

1. **UI de mapeamento coluna→status** — completar o opt-in da automação (back `DTO`/`service` + front).
2. **Ambiente de DEV isolado** — conectar o `bayarea_dev` com credenciais próprias (não reusar as de prod) e dados sanitizados; útil para QA e para o time de segurança.
3. **Poker Planning** — estimativas em equipe (já desenhado com o PO).
4. **Observabilidade** — métricas e dashboards de sprint (burndown, throughput).
5. **Testes E2E** e documentação viva das features.

## 9. Time & créditos

Construído por **~18 pessoas** da comunidade da Fábrica Bay Area ao longo de ~15 meses (mar/2025 → jun/2026), com **354 commits** e **99 PRs**. A lista de colaboradores está no [`README.md`](README.md#colaboradores). 🙏

## 10. Precisa de ajuda?

Abra uma **issue** no repositório descrevendo o contexto — assim a resposta fica pública e ajuda quem vier depois. Para dúvidas de arquitetura/deploy, comece por [`DEPLOYMENT.md`](DEPLOYMENT.md) e este guia.

---

*O projeto agora é da comunidade. Bom código! 🚀*
