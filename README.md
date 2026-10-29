# +PraClinic — Frontend

SPA de gestão clínica integrada à API Render, com autenticação, cadastros, agenda, consultas, prontuários e Dashboard.

## Tecnologias e pré-requisitos

React 19, TypeScript 5.8, Vite 6, React Router 7, Axios, Tailwind CSS 4 e Lucide. Use Bun 1.4.4 e Node 24. `bun.lock` é o lockfile oficial.

## Configuração e execução

Na raiz:

```sh
bun install --frozen-lockfile
```

Copie `.env.example` para `.env.local` ignorado e configure `VITE_API_URL` para a API do ambiente. Para desenvolvimento local:

```dotenv
VITE_API_URL=http://localhost:8080/api
```

Configure `APP_CORS_ALLOWED_ORIGINS=http://localhost:3000` somente no backend local e execute:

```sh
bun run dev
```

Frontend em `http://localhost:3000`, com strictPort. Reinicie Vite ao alterar o ambiente. Variáveis VITE_* são públicas: nunca conter credenciais. Não existe cadastro público ou senha padrão; use uma conta provisionada no ambiente escolhido.

## Testes e build

```sh
bun run lint
bun run build
bun run smoke
node scripts/smoke-agendamentos.mjs
node scripts/smoke-clinica-dashboard.mjs
```

Lint executa `tsc --noEmit`. Os smokes isolados não precisam de banco/backend nem credenciais. Frontend validation executa os gates em PRs para develop/main e push em develop.

## Produção

- Frontend: https://carloseduardofurlan.github.io/GestaoDeClinicas-Frontend-ProjetoFinal-maisPraTi/
- API: https://praclinic-api.onrender.com/api
- GitHub Pages usa GitHub Actions e deploy automático da main. `VITE_API_URL` é variável pública do environment `github-pages`.
- O fallback 404.html permite rotas profundas. O timeout HTTP é 120 segundos para acomodar cold starts, sem retry automático ou keepalive.

## Arquitetura

[Arquitetura, sessão, permissões, fluxos e operação](docs/ARQUITETURA.md).
