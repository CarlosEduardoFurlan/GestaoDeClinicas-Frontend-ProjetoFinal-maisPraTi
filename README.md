# +PraClinic — Frontend

Aplicação de gestão clínica em React 19, TypeScript, React Router 7, Vite 6,
Tailwind CSS 4 e Axios. Bun 1.4.4 e `bun.lock` são a referência de instalação;
Node 24 executa os smokes isolados. Backend de referência: `develop`
`e183b6bc490af6b60a11b0fb1604986c1ca40e66`, base `/api`.

## Executar localmente

Na raiz deste repositório:

```sh
bun install --frozen-lockfile
```

Copie `.env.example` para `.env.local` e configure a API local:

```dotenv
VITE_API_URL=http://localhost:8080/api
```

No ambiente do backend, defina `APP_CORS_ALLOWED_ORIGINS=http://localhost:3000`.
Esse valor pertence ao ambiente backend. Não use wildcard.

```sh
bun run dev
```

O frontend usa `http://localhost:3000`; `strictPort` impede troca silenciosa de
porta. Reinicie Vite após mudar o ambiente. Variáveis `VITE_*` são públicas e
definidas no build: nunca inclua credenciais ou secrets.

Se Bun não estiver no PATH, use o pacote oficial temporariamente:
`npm exec --yes --package=bun@1.4.4 -- bun install --frozen-lockfile`.
No PowerShell que bloqueia scripts `.ps1`, use `npm.cmd`. O `package-lock.json`
local preexistente não é o lockfile oficial e não integra esta estabilização.

## Funcionamento e acesso

O cliente Axios central trata Bearer, timeout, cancelamento e erros. Login usa
`/auth/login` e `/auth/me`; somente o accessToken é persistido. Reload revalida a
sessão. 401 de sessão limpa a identidade; 403 preserva o login. Logout também
reinicia as telas dependentes da sessão. Não existe refresh token no contrato.

| Perfil | Acesso funcional |
| --- | --- |
| ADMIN | Cadastros e agenda globais; prontuários somente leitura |
| RECEPTIONIST | Pacientes, agenda e consultas; profissionais/especialidades somente leitura; sem Users ou conteúdo clínico |
| PROFESSIONAL | Agenda, consultas e prontuários próprios; especialidades somente leitura; sem cadastros globais de Patients, Professionals ou Users |

Menu e guards compartilham a matriz de perfis. O backend continua responsável
por autorização e ownership.

Agenda e Consultas representam Appointment; Schedule fornece disponibilidade.
O agendamento usa um único formulário, também reutilizado em PatientDetails.
Prontuários preserva `id`, `appointmentId` e `notes`, combinando MedicalRecord e
Appointment na apresentação. ADMIN vê as consultas e registros do paciente;
RECEPTIONIST não monta a aba clínica. Dashboard deriva indicadores das APIs
existentes, sem endpoints próprios. Datas e horas clínicas permanecem locais.
Não existe exclusão de prontuário; cancelar consulta preserva seu histórico.

As páginas carregam por rota com fallback de loading. O menu mobile, as tabelas
com scroll local e os modais com foco/teclado foram homologados em Chrome real.
`/schedules`, Settings e DesignSystem não são rotas do produto; URLs desconhecidas
continuam exibindo a página 404. O catálogo demonstrativo e componentes isolados
sem uso foram removidos; tokens e componentes funcionais permanecem em `src/`.

## Gates e CI

```sh
bun run lint
bun run build
bun run smoke
node scripts/smoke-agendamentos.mjs
node scripts/smoke-clinica-dashboard.mjs
```

Os mesmos scripts podem ser executados com `npm run`. `lint` verifica TypeScript
(`tsc --noEmit`), sem ESLint. Smokes usam HTTP isolado/esbuild e não dependem de
backend, banco, credenciais ou secrets; não substituem a homologação real.

O workflow **Frontend validation** executa instalação congelada e esses cinco
gates em PRs para `develop`/`main`, push em `develop` e disparo manual. Sua execução
remota só poderá ser confirmada depois da publicação desta branch.

## Deploy e release

O workflow de GitHub Pages mantém push em `main` e disparo manual. Valida a
configuração pública da API, executa lint/smokes, faz um único build e copia
`dist/index.html` para `dist/404.html`. A base calculada no Actions é
`/GestaoDeClinicas-Frontend-ProjetoFinal-maisPraTi/`.

**Deploy funcional bloqueado até definir o ambiente real:** configure a variável
Actions `VITE_API_URL` no ambiente `github-pages` (ou no repositório), com a URL
HTTPS pública correta da API, incluindo sua base `/api`. O workflow anterior não
injetava essa variável. O novo guard interrompe o deploy se ela estiver ausente,
inválida, local ou usar um dos domínios de exemplo identificados. Essa validação
é sintática; disponibilidade e configuração do ambiente ainda precisam ser
confirmadas. Nenhuma URL de produção foi inventada nesta execução.

O backend deve permitir a origem real do frontend publicado por
`APP_CORS_ALLOWED_ORIGINS`. A homologação local do fallback não comprova o
ambiente Pages remoto: seu documento de rota profunda responde 404, serve a SPA
e permite ao Router resolver a rota. Assets e API devem responder normalmente.

O Bloco 5 foi preparado somente localmente, sem push, PR, merge ou deploy. Uma
futura PR `develop -> main` deverá revisar a release integral e os bloqueios de
ambiente, preservando o histórico compartilhado.

## Evidências

- [Estabilização final e homologação](docs/ESTABILIZACAO_FINAL.md)
- [Fundação e browser](docs/HOMOLOGACAO_BROWSER.md)
- [Cadastros](docs/INTEGRACAO_CADASTROS.md)
- [Agenda e consultas](docs/INTEGRACAO_AGENDAMENTOS.md)
- [Prontuários e Dashboard](docs/INTEGRACAO_CLINICA_DASHBOARD.md)

Relatórios anteriores registram o estado de cada rodada. O relatório de
estabilização descreve as decisões e medidas atuais.
