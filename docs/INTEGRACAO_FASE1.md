# Integração frontend — primeira rodada

Referência backend: `5e2f9422426a8b6adcfa69d1254ddcf29a55c19f`.
Conclusão registrada em 26/10/2026. Nenhuma alteração de backend, push, PR ou merge.

## ESTADO INICIAL

Frontend em develop `7615cb837c6213d9e8821ca6e2793ecf44519139`, já sincronizado
localmente antes desta rodada. Único arquivo não rastreado inicial:
`clinica-frontend/package-lock.json`. Esse arquivo foi preservado e excluído dos commits.
SHA256 inicial/final: `747A3653D95FE7BC7FF672681D0A2B1CE249B64CF6D283CAFAD60B95DD8E2705`.

## BRANCH

`feature/integracao-frontend-backend`, criada a partir da develop local confirmada.

## SINCRONIZAÇÃO COM DEVELOP

Executados status, branch, remotes e `git fetch --all --prune`. HEAD e origin/develop
foram confirmados no mesmo SHA acima. Não foi necessário pull ou switch de develop:
ela já era a branch atual e estava no commit remoto. O lockfile não rastreado não
foi sobrescrito, removido ou incluído. Nenhum arquivo de usuário foi descartado.

## TYPESCRIPT

Adicionado `src/vite-env.d.ts` com referência padrão `vite/client` e variável
VITE_API_URL tipada. Adicionados os tipos oficiais de React e React DOM ao manifest
e bun.lock. Não foi usado cast global para any. O script lint continua executando
somente `tsc --noEmit`; não foi instalado ESLint.

## ENVIRONMENT

`.env.example` documenta `VITE_API_URL=http://localhost:8080/api`, sem secrets.
Nenhum .env real foi criado ou versionado. Configuração ausente gera erro explícito.
Vite usa strictPort com a porta 3000 do script dev. A inicialização foi confirmada
em `http://localhost:3000`; o servidor temporário foi encerrado depois da verificação.
Configurar no ambiente backend `APP_CORS_ALLOWED_ORIGINS=http://localhost:3000`.

## API CLIENT

Uma instância Axios com baseURL do Vite, Content-Type JSON, timeout de 15 segundos
e Bearer automático. Login não envia token antigo. Requests podem receber AbortSignal.
A API não usa paginação ou parâmetros de filtro inventados.

## ERROR HANDLING

ApiError/ApiErrorResponse preservam timestamp, status, error, message, path e details.
400 disponibiliza validações ao formulário; 403 informa falta de permissão sem
encerrar sessão; 404 informa inexistência; 409 informa conflito. Timeout e falha
de rede têm mensagens próprias. Requisições canceladas continuam distinguíveis.
401 fora do login remove token e notifica AuthContext. Resposta tardia de uma
sessão antiga não invalida uma nova. Nenhum alert é usado.

## AUTH

Removidos ADMIN inicial, login fake, temporizadores e cadastro público do Login.
Fluxo: POST /auth/login, armazenamento de accessToken, GET /auth/me e atualização
da identidade autenticada com userId, name, email, profile e professionalId.
Senhas não são persistidas. A interface usa somente ADMIN/RECEPTIONIST/PROFESSIONAL.
Nome e perfil no Navbar vêm da identidade real, sem fallback fictício.

## SESSION

Sem token não há autenticação. Com token, o carregamento chama /auth/me e aguarda
a validação antes de renderizar rotas protegidas. Não há confiança em JWT decodificado
no cliente. 401 encerra a sessão; rede/403 na restauração permitem nova tentativa.
Logout remove token, identidade e remonta contexto de negócio/páginas para descartar
estado da sessão anterior. Alterações do token em outra aba também revalidam a sessão.
O contrato não fornece refresh token nem logout remoto; não foram inventados.

## ROUTE GUARDS

SessionGuard protege o shell e aguarda restauração. RouteGuard aplica perfis por
rota inclusive no acesso direto por URL. Acesso sem sessão vai a /login; perfil
sem permissão vê acesso negado com retorno seguro ao Dashboard. Rotas desconhecidas,
incluindo Settings/DesignSystem, mostram página não encontrada; os componentes de
DesignSystem permanecem no código.

## NAVIGATION / PERMISSIONS

`config/permissions.ts` é compartilhado pelo menu e guards.

| Área | ADMIN | RECEPTIONIST | PROFESSIONAL |
| --- | --- | --- | --- |
| Users | Acesso | Sem acesso | Sem acesso |
| Specialties | CRUD | Leitura | Leitura |
| Professionals | CRUD visual | Leitura | Sem cadastro global |
| Patients | Ler/criar/editar | Ler/criar/editar | Sem listagem global |
| Patient DELETE | Nenhuma ação | Nenhuma ação | Nenhuma ação |
| MedicalRecords | Leitura | Sem acesso | Escrita preparada para etapa futura |
| Agenda/Consultas | Acesso | Acesso | Acesso sem criação/cancelamento administrativo |
| Schedule | Rota preparada | Rota preparada | Rota preparada |

Nas páginas ainda mockadas, foram ajustados somente controles por perfil:
recepção não vê escrita em Professionals nem prontuários/aba clínica; ADMIN não vê
escrita clínica; PROFESSIONAL não vê nova consulta administrativa. A integração de
ownership, slots e transições nas páginas mockadas permanece para a próxima fase.
Os dados fictícios dessas páginas não devem ser interpretados como dados autorizados
ou filtrados pelo backend. Segurança real permanece no servidor.

## TYPES / DTOs

Tipos separados para request, update, response e sessão em `src/types/index.ts`.
Inclui ApiErrorResponse, LoginRequest/Response, AuthenticatedUser, AddressRequest/Response,
UserRequest/UpdateRequest/Response, SpecialtyRequest/Response, PatientCreateRequest/
UpdateRequest/Response, ProfessionalCreateRequest/UpdateRequest/Response,
ScheduleRequest/Response, AppointmentCreateRequest/StatusUpdateRequest/Response,
MedicalRecordCreateRequest/UpdateRequest/Response e StatusResponse.
UUID é string. Patient usa endereço aninhado, gender de um caractere conforme
validação backend, e update sem CPF. Professional inclui specialtyId e endereço
na resposta. Descrição de Specialty e created imediato são tratados como nulos.

## SERVICES

Criados AuthService (login/me) e SpecialtyService (GET/POST/PUT/DELETE).
Chamadas HTTP ficam em services, fora de TSX. PatientService/AppointmentService
receberam contratos tipados e correção dos endpoints existentes: update de status
usa PUT /appointments/{id} com statusId, e não há DELETE de Patient exposto no service.
Os mocks preexistentes de listagem de ambos e criação de Patient permanecem
explicitamente pendentes; nenhuma dessas páginas passou a consumir esses services.
Nenhum ConsultationService ou endpoint /consultations foi criado.

## SPECIALTIES

Lista obtida por GET /specialties com cancelamento ao desmontar, loading, erro com
nova tentativa e estados vazios distintos para base vazia ou filtro sem resultado.
Filtro local tolera description null. Nome é obrigatório e tem máximo de 50 caracteres.
O estado de formulário é separado do DTO; descrição vazia é enviada como null.
ADMIN cria, edita e exclui por UUID retornado pela API. Outros perfis não veem
ações/modais de escrita. Handlers também verificam perfil e impedem envio duplicado.
Sucesso e atualização da lista só ocorrem depois da confirmação HTTP. Erros preservam
formulário/lista; exclusão com FK/conflito não remove a linha antecipadamente.

## MOCKS REMOVIDOS

Somente Auth/Login e Specialties tiveram seus mocks substituídos por integração.
Mocks de negócio no AppContext e nas outras páginas foram preservados. Ajustes
visuais de permissão não representam integração desses módulos.

## ARQUIVOS ALTERADOS

Todos os caminhos abaixo são relativos a clinica-frontend:

- `.env.example`, `README.md`, `package.json`, `bun.lock`, `vite.config.ts`.
- `src/vite-env.d.ts`, `src/types/index.ts`.
- `src/lib/session.ts`, `src/lib/api-error.ts`.
- `src/services/api.ts`, `auth.service.ts`, `specialty.service.ts`, `patient.service.ts`, `appointment.service.ts`.
- `src/contexts/AuthContext.tsx`, `src/App.tsx`.
- `src/app/RouteGuard.tsx`, `src/app/routes.tsx`, `src/config/permissions.ts`.
- `src/components/navigation/Navbar/Navbar.tsx`, `Sidebar/Sidebar.tsx`.
- `src/pages/Login/LoginPage.tsx`, `Specialties/SpecialtiesPage.tsx`.
- Ajustes de permissões em `Appointments`, `Consultations`, `Dashboard`, `MedicalRecords`,
  `Patients/PatientsPage.tsx`, `Patients/PatientDetailsPage.tsx`, `Professionals`.
- `scripts/smoke-api.mjs`, `docs/INTEGRACAO_FASE1.md`.

## COMMITS

- `264525f` — fix: alinha contratos vite e cliente http da api.
- `f586479` — feat: integra autenticacao e ciclo de sessao.
- `89a2644` — feat: aplica permissoes por perfil nas rotas e acoes.
- `127b12e` — feat: integra especialidades com permissoes e estados de requisicao.
- Commit final de smoke/documentação; consultar git log para seu identificador.

Todos locais. Nenhum push, PR ou merge.

## npm run lint

PASSOU com TypeScript 5.8.x. Executado novamente após instalar pelo bun.lock congelado.

## npm run build

PASSOU com Vite 6.4.3 após instalação congelada. 1773 módulos; JS 575,29 kB
(gzip 161,68 kB), CSS 50,23 kB. Continua o aviso de chunk acima de 500 kB;
não houve falha de compilação. As tentativas bloqueadas pelo sandbox foram
reexecutadas autorizadamente, sem alteração para contornar o gate.

## TESTES MANUAIS

Vite iniciou na porta 3000. GETs de /login, /specialties e módulo TSX transformado
retornaram 200; esses checks validam disponibilidade/transformação, não interação UI.

`npm run smoke` PASSOU usando Node/assert e HTTP isolado em loopback, sem framework
novo, sem banco e sem credenciais reais. Verifica os módulos efetivos de API/services:

- Credencial inválida não encerra sessão global; login não envia Bearer anterior.
- Login, /me e leitura de Specialties nos três perfis; professionalId nulo/próprio.
- Matriz de perfis e rejeição de escrita por recepção/profissional.
- CRUD, UUID da resposta e description/created nulos.
- 400 com details, 403 preservando token, 404 e 409 sem perda de dados.
- 401 de sessão/token inválido removendo token e notificando contexto.
- Resposta 401 tardia sem encerrar uma sessão mais nova.
- Cancelamento, limpeza de token, timeout e erro de rede.

NÃO EXECUTADOS: login em navegador com ADMIN/RECEPTIONIST/PROFESSIONAL reais,
reload real do navegador, menus/guards por interação, token JWT realmente expirado
e CRUD persistido no backend Spring Boot. A porta 8080 não tinha backend ativo,
nem PostgreSQL ativo em 5432. A ferramenta de navegador não expôs browsers/apps e
informou pipe nativo indisponível. O smoke isolado não comprova esses testes ponta a ponta.

## PROBLEMAS ENCONTRADOS

Vite constava simultaneamente em dependencies/devDependencies; mantido apenas em
devDependencies. Typings React estavam ausentes; adicionados ao lockfile existente.
Aviso de bundle grande permanece para otimização posterior. O package-lock local
preexistente continua não rastreado e não acompanha as novas dependências; o lockfile
versionado e validado é bun.lock.

## BLOQUEIOS

Nenhum dos quatro bloqueios de contrato da auditoria anterior permanece:
/auth/me, /statuses, Patient com Address e Professional com specialtyId/Address
foram confirmados no código e docs da baseline congelada.
Permanece pendente a homologação ponta a ponta por indisponibilidade do ambiente
ativo/navegador. Nenhuma mudança de backend foi realizada para acomodar o frontend.

## PRÓXIMA ETAPA RECOMENDADA

Revisar esta rodada e executar a homologação com backend/CORS/contas de teste reais.
Após aceite, integrar Professionals, Users e Patients usando os DTOs finais.
Em seguida integrar Schedule, Appointment compartilhado por Agenda/Consultas,
MedicalRecords e Dashboard. Não avançar esses módulos ou abrir PR nesta rodada.

## STATUS

FUNDAÇÃO FRONTEND INTEGRADA E PRONTA PARA PRÓXIMOS MÓDULOS

A implementação e gates locais estão concluídos; os testes reais de navegador/API
indicados acima permanecem pendentes e não foram declarados como aprovados.
