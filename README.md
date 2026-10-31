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

- Frontend principal na Vercel: https://praclinic.vercel.app
- API: https://praclinic-api.onrender.com/api
- GitHub Pages permanece como publicação secundária/compatibilidade: https://carloseduardofurlan.github.io/GestaoDeClinicas-Frontend-ProjetoFinal-maisPraTi/
- Ambas publicam automaticamente a main. A Vercel usa Vite e fallback SPA via `vercel.json`; Pages usa GitHub Actions e `404.html`. `VITE_API_URL` é pública e definida em Production na Vercel e no environment `github-pages`.
- O timeout HTTP é 120 segundos para acomodar cold starts, sem retry automático ou keepalive.

## Acesso de demonstração

Estas contas são exclusivamente fictícias e foram criadas para avaliação acadêmica do +PraClinic. Não representam usuários ou pacientes reais. As credenciais abaixo são intencionalmente públicas e pertencem somente a esse ambiente de demonstração.

- Aplicação: https://praclinic.vercel.app
- API: https://praclinic-api.onrender.com

| Perfil | Usuário | Senha |
| --- | --- | --- |
| Administrador | admin.demo@praclinic.invalid | AdminDemo!26 |
| Recepção | recepcao.demo@praclinic.invalid | RecepcaoDemo!26 |
| Profissional — Clínica Geral | helena.demo@praclinic.invalid | HelenaDemo!26 |
| Profissional — Cardiologia | rafael.demo@praclinic.invalid | RafaelDemo!26 |
| Profissional — Dermatologia | camila.demo@praclinic.invalid | CamilaDemo!26 |
| Profissional — Pediatria | andre.demo@praclinic.invalid | AndreDemo!26 |

## O que testar

### Administrador

- Dashboard global, usuários, pacientes, profissionais e especialidades.
- Agenda, agendamento e transições permitidas das consultas.
- Leitura global dos prontuários fictícios.

### Recepção

- Dashboard, pacientes, agenda e consultas.
- Profissionais e especialidades em leitura.
- Agendar, confirmar e cancelar consultas nos estados permitidos.
- Usuários e prontuários ficam bloqueados para esse perfil.

### Profissional

- Dashboard, agenda e consultas próprios; abertura de horários próprios.
- Iniciar e concluir consultas próprias, criar e editar prontuários próprios.
- Especialidades em leitura. Pacientes globais, profissionais globais e usuários ficam bloqueados.

## Arquitetura

[Arquitetura, sessão, permissões, fluxos e operação](docs/ARQUITETURA.md).
