# Integração do Bloco 2 — cadastros

Data: 26/10/2026. Resultado: **BLOCO 2 INTEGRADO E PRONTO PARA REVISÃO**.
Trabalho exclusivamente local, sem push, PR ou merge.

## Estado inicial e escopo

Frontend: develop atualizada com fast-forward, HEAD igual a origin/develop
`567b65d7766ed4b547ccd9c4e050bce9586c4a59`, após PR #7.
Branch nova: `feature/integracao-cadastros`. Aplicação mantida na raiz do
repositório frontend, conforme autorização anterior.
Backend: develop congelada em `5e2f9422426a8b6adcfa69d1254ddcf29a55c19f`,
working tree limpa, sem alterações nesta execução.

Inspeção inicial: status, branch, remotes, fetch/prune e histórico; atualizada a
base antes de criar a branch. Preservados a linha local adicional de .gitignore
para node_modules e o package-lock.json não rastreado. Nenhum dos dois entra nos
commits. SHA256 do package-lock.json antes/depois:
`747A3653D95FE7BC7FF672681D0A2B1CE249B64CF6D283CAFAD60B95DD8E2705`.

Fonte de verdade: docs/API.md, controllers, services e DTOs da baseline backend.
Sem alteração de AuthContext, Login, cliente Axios, normalização de erros,
sessão, guards, matriz de permissões ou Specialties. Nenhuma dependência
permanente adicionada; package.json e bun.lock preservados. Instalação feita
com Bun e --frozen-lockfile --ignore-scripts.

## Contratos e endpoints

Todos os services usam o Axios central, retornos tipados e AbortSignal opcional.
Páginas não fazem chamadas HTTP diretamente. Listagens são arrays simples;
busca e filtros locais, contagens reais e UUID como key, sem paginação inventada.

| Recurso | Endpoints utilizados | ADMIN | RECEPTIONIST | PROFESSIONAL |
| --- | --- | --- | --- | --- |
| Users | GET/POST /api/users; GET/PUT/DELETE /api/users/{id} | CRUD | Negado | Negado |
| Professionals | GET/POST /api/professionals; GET/PUT/DELETE /api/professionals/{id} | CRUD | Leitura | Negado globalmente |
| Patients | GET/POST /api/patients; GET/PUT /api/patients/{id} | Leitura/criação/edição | Leitura/criação/edição | Negado globalmente |
| Specialties | GET /api/specialties para opções reais | Leitura/escrita da fundação | Leitura | Leitura |

### Users

POST: name, email, password, profile. Profiles exclusivamente ADMIN,
RECEPTIONIST, PROFESSIONAL. PUT: name, password, profile; e-mail somente leitura.
A senha é obrigatória também na edição, conforme o contrato, começa vazia e não
é recuperada da response. Respeitados limites de nome/e-mail de 100 caracteres
e senha de 20. Sem vínculo fictício ou profile Patient.

GET por ID antes de editar. DELETE com confirmação; linha removida somente após
HTTP 204. Atualização/exclusão da própria conta utiliza restauração de identidade
ou logout já existentes na fundação.

### Professionals

POST único cria Professional + Address + User. Não há seleção de conta existente
nem POST prévio em /users. Conta criada com profile fixo PROFESSIONAL. E-mail de
contato do profissional é separado do e-mail de login.

PUT contém dados profissionais, register, telefones, e-mail de contato,
specialtyId e address; não contém user, senha, profile ou alteração de vínculo.
GET por ID preenche edição/visualização. Seletor usa specialty.id real como value
e specialty.name como label. Campos reais de endereço: address, number inteiro,
complement separado, district, city, uf, zipCode. Não há status fictício nem grade
semanal simulada dentro do formulário cadastral. Falha/ausência de especialidades
bloqueia envio e oferece recuperação apropriada.

RECEPTIONIST vê somente listagem e visualização dos campos da response, sem
botões de escrita. DELETE válido preserva a conta User, conforme backend.

### Patients

Service real: getAll, getById, create, update. Não existe método delete nem botão
Excluir. Nome, CPF, dateBirth, telephone opcional, cellPhone obrigatório, email
opcional, gender e endereço completo refletem o DTO. Valores opcionais vazios
viram null. Datas são ISO na API, nascimento deve estar no passado; exibição
brasileira sem conversão de timezone. Gênero apresenta Feminino/F e Masculino/M;
não envia FEMALE/MALE. Valor já existente diferente é preservado da response,
sem oferecer opções clínicas inventadas para novos cadastros.

CPF somente leitura na edição e ausente do PUT. Endereço preenchido com response
real, atualizado aninhado, sem seleção de addressId nem service de endereço.
Detalhes usam useParams e GET /patients/{id}; não há paciente fixo. Identidade,
contatos e endereço são reais. Formulário compartilhado entre listagem/detalhes.

## Gates, na ordem exigida

Cada módulo teve lint + build + Chrome/backend real antes do módulo seguinte.

| Gate | Lint (tsc --noEmit) | Build Vite | Backend + navegador |
| --- | --- | --- | --- |
| Users, antes de Professionals | Passou | Passou | USERS_REAL_OK / CADASTROS_GATE_OK users |
| Professionals, antes de Patients | Passou | Passou | PROFESSIONALS_REAL_OK / CADASTROS_GATE_OK professionals |
| Patients e regressão dos três | Passou | Passou | PATIENTS_REAL_OK / CADASTROS_GATE_OK patients |

`npm run smoke` existente também passou: login/me, perfis, 400/401/403/404/409,
Bearer, cancelamento, timeout, erro de rede e isolamento de sessão. Este smoke
usa HTTP descartável, separado da homologação real descrita abaixo.
Build mantém o aviso conhecido de chunk acima de 500 kB, sem erro de compilação.
O sandbox restringiu a execução do esbuild; o build foi concluído com a execução
local autorizada, sem modificar configuração para contornar o ambiente.

## Ambiente da homologação real

- Chrome instalado 156.0.8078.48, headless, Playwright temporário fora do projeto.
- Contexto novo de navegador em cada execução, viewport 1440 × 1100.
- PostgreSQL 18 exclusivo em 127.0.0.1:55432, banco homologacao, SCRAM,
  credenciais aleatórias em memória/arquivos temporários restritos.
- Backend Spring Boot da baseline, Java 26; Flyway V1–V15 aplicadas e
  Hibernate ddl-auto=validate; API http://localhost:8080/api.
- Frontend Vite http://localhost:3000;
  VITE_API_URL=http://localhost:8080/api;
  APP_CORS_ALLOWED_ORIGINS=http://localhost:3000 no ambiente backend.
- Contas descartáveis ADMIN, RECEPTIONIST, PROFESSIONAL. Sem credenciais
  operacionais, tokens ou senhas no relatório/commits.
- Uma fixture de Schedule foi criada apenas para provocar FK de exclusão.
  Não houve integração ou alteração desse módulo/interface.
- Backend, Vite e cluster encerrados em finally; cluster removido. Serviço
  PostgreSQL pessoal existente não foi alterado. Artefatos temporários de teste
  e instalação temporária do Playwright removidos após a auditoria visual.

A automação operou formulários, modais, tabelas, menus e URLs no Chrome. As
mutações principais aconteceram pela UI; fetch real no navegador foi utilizado
apenas para fixtures e conferir dados persistidos/permissões. Nenhuma response
HTTP de CRUD foi simulada. Interceptação temporária apenas atrasou requests
reais para conferir loading/pending e abortou exatamente três GETs para testar
falha de transporte e retry.

## Casos executados no navegador

| Área | Evidência verificada |
| --- | --- |
| Users ADMIN | GET lista/ID, POST 201 UUID sem password, PUT 200 sem email, DELETE 204 confirmado; três profiles oficiais; senha vazia e e-mail readOnly na edição |
| Users erros | E-mail duplicado 400 mantém formulário; linha desatualizada retorna 404 controlado; exclusão com FK preserva linha/modal (limitação 500 abaixo) |
| Users perfis | RECEPTIONIST e PROFESSIONAL sem menu e com URL direta negada, sessão preservada |
| Professional ADMIN | POST 201 com User PROFESSIONAL criado junto, Address completo e specialtyId UUID; User conferido sem password; GET ID; PUT 200 sem user/credenciais; vínculo preservado e cidade/UF persistidos |
| Professional exclusão | FK retorna 409, modal/linha preservados; exclusão sem dependências retorna 204; conta User continua existente |
| Professional erros/perfis | Registro duplicado 400 mantém formulário; GET ID inexistente 404; RECEPTIONIST lê/visualiza sem escrita na UI e POST backend 403; PROFESSIONAL URL global negada |
| Patient ADMIN | Array vazio real; POST 201 com gender F e número inteiro; opcionais null; GET ID correspondente à URL; detalhes reais; PUT 200 sem CPF; CPF/addressId preservados e cidade/UF atualizados |
| Patient erros/perfis | CPF duplicado 400 mantém modal; UUID inexistente 404 com retry; sem Delete; RECEPTIONIST lista/cria/edita e preserva CPF/addressId; PROFESSIONAL rota negada e GET backend 403 |
| Specialties regressão | RECEPTIONIST e PROFESSIONAL somente leitura |
| Estado/feedback | Loading nos três cadastros; empty filtrado e Patient vazio real; submit pendente/desabilitado nos três, sem sucesso antecipado; sucesso somente após HTTP |
| Retry | Cada listagem recebeu falha deliberada de conexão, mostrou erro normalizado e recuperou dados com novo GET 200 real |
| Sessão | 403 preserva token; 401 real provocado com token inválido no cliente Axios remove token e redireciona ao login |
| Console | Nenhuma exceção React/Promise, Axios cru, loop ou warning crítico; mensagens nativas esperadas dos HTTP de erro e exatamente três ERR_CONNECTION_FAILED deliberados |
| Network | Endpoints reais, UUIDs da response e Bearer verificados; nenhum token divulgado |

Capturas inspecionadas: dados cadastrais do paciente após edição, formulário com
erro de CPF duplicado e visualização do profissional pela recepção. Layouts de
cards/tabelas/modais existentes preservados, com campos/estados necessários ao
contrato. Capturas temporárias não entram nos commits.

### Limitação confirmada do backend congelado

Ao excluir um User associado a Professional referenciado por Schedule, o
backend responde **HTTP 500**, mensagem normalizada **Erro interno no servidor**,
em vez do 409 descrito para conflito. Reproduzido em execuções independentes.
O frontend não remove a linha, mantém confirmação e apresenta erro controlado.
Não transforma 500 em 409 e não apresenta falso sucesso. A exclusão diretamente
de Professional com essa FK retornou **409**, validando também esse tratamento.

Esta divergência está registrada para revisão separada do backend; não impede
CRUD válido nem autoriza modificar a baseline nesta execução. Nenhum cenário
artificial de 409 foi inventado para Patient: o 409 real seguro foi o DELETE de
Professional. Patient utiliza a mesma normalização central para erros HTTP.

## Mocks e fronteira funcional

Removidos dos fluxos integrados: arrays/IDs fictícios, Date.now como persistência,
setTimeout do PatientService, vínculos falsos, endereços/especialidades simulados,
paciente fixo em /patients/:id e paginações sem suporte no contrato.

Preservados: módulos Schedule, Agenda, Appointments/Consultations, MedicalRecords
e Dashboard. As abas Consultas/Registros Clínicos de PatientDetails mantêm a
estrutura visual com mensagem de indisponibilidade, sem consultas novas ou
histórico inventado ligado ao paciente real. Há comentário explícito de escopo
no código. O acesso a Registros Clínicos continua restrito conforme a matriz.

Nenhum módulo deste bloco consome AppContext; conferido por busca no código.
AppContext global preservado para não ampliar a alteração para módulos simulados.

## Arquivos e commits

- `bf9bfda` — feat: integra usuarios administrativos: UsersPage,
  user.service e useApiList.
- `7442c34` — feat: integra cadastro de profissionais: ProfessionalsPage,
  professional.service, FormField e AddressFields.
- `de3e4eb` — feat: integra pacientes e detalhes cadastrais:
  PatientsPage, PatientDetailsPage, PatientFormModal e patient.service.
- Commit de documentação — docs: registra integracao do bloco de cadastros:
  README.md e este relatório. Hashes finais disponíveis em git log.

Inventário completo de arquivos de aplicação:

```text
src/hooks/useApiList.ts
src/components/forms/FormField.tsx
src/components/forms/AddressFields.tsx
src/services/user.service.ts
src/services/professional.service.ts
src/services/patient.service.ts
src/pages/Users/UsersPage.tsx
src/pages/Professionals/ProfessionalsPage.tsx
src/pages/Patients/PatientsPage.tsx
src/pages/Patients/PatientDetailsPage.tsx
src/pages/Patients/PatientFormModal.tsx
README.md
docs/INTEGRACAO_CADASTROS.md
```

## Bloqueios e próxima etapa

Nenhum bloqueio de integração frontend pendente. Limitação 500 de exclusão de
User com dependências documentada, sem correção de backend nesta branch.
Revisar este Bloco 2 e decidir separadamente sobre a divergência de status HTTP.
Nenhum push/PR/merge realizado; publicação aguarda nova instrução. Os demais
módulos seguem para próximas etapas, fora desta entrega.
