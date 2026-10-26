# Homologação da fundação — 26/10/2026

## ESTADO INICIAL

Branch feature/integracao-frontend-backend, HEAD 477a6da. Os cinco commits anteriores
estavam presentes: 264525f, f586479, 89a2644, 127b12e e 477a6da.
Executados git status, branch, remotes, log e fetch --all --prune.
Os arquivos de clinica-frontend/ haviam sido movidos para a raiz localmente.
O usuário confirmou explicitamente manter essa organização. A comparação de blobs
confirmou que a movimentação preservava o conteúdo dos arquivos da rodada anterior.
Não foram descartadas alterações locais.

## PACKAGE MANAGER / LOCKFILE

Bun não estava disponível globalmente no PATH. Foi usado o pacote oficial com
`npm exec --yes --package=bun -- bun install --frozen-lockfile --ignore-scripts`.
Bun 1.4.4 verificou 276 instalações/369 pacotes sem mudar o lockfile.
O regime de instalação permanece bun.lock; não houve migração para npm.
package-lock.json preexistente preservado e não incluído no commit.
SHA256 antes/depois: 747A3653D95FE7BC7FF672681D0A2B1CE249B64CF6D283CAFAD60B95DD8E2705.

## BACKEND UTILIZADO

develop 5e2f9422426a8b6adcfa69d1254ddcf29a55c19f, working tree limpa antes/depois.
Nenhum código, migration ou configuração versionada do backend foi alterado.
`mvnw.cmd -DskipTests package` passou. Isso é build, não execução dos testes Maven.
O pom exige Java 26; o java do PATH era Java 21. O runtime foi iniciado explicitamente
com o JDK 26 já instalado em .jdks/openjdk-26.0.2.1, sem alterar a configuração global.
Spring iniciou em localhost:8080, com secret JWT aleatório mantido somente em memória.

## POSTGRESQL

PostgreSQL 18.3, cluster exclusivo temporário, endereço 127.0.0.1:55432,
banco homologacao e autenticação SCRAM. A instância preexistente não foi alterada.
Diretório temporário com ACL restrita ao usuário atual. Senha de banco aleatória;
arquivo temporário usado no initdb removido após inicialização.
Flyway V1-V15 confirmado por 15 migrations bem-sucedidas em flyway_schema_history.
JPA inicializado com ddl-auto=validate da baseline.
Contas fictícias criadas com BCrypt: ADMIN por bootstrap SQL local, RECEPTIONIST
pelo endpoint administrativo e PROFESSIONAL pelo contrato de criação aninhada,
com vínculo real User -> Professional. Nenhuma senha, hash ou token consta deste relatório.
Os processos temporários do banco e da API foram encerrados após os testes.
O cluster protegido de evidências permanece temporariamente fora do repositório.

## FRONTEND

Aplicação na raiz, conforme decisão do usuário. VITE_API_URL configurada localmente
como http://localhost:8080/api em .env.local ignorado pelo Git. Não foram versionados
arquivos de ambiente reais ou secrets. Vite 6.4.3 iniciou na porta 3000 com strictPort.
GET /login retornou 200. Isso valida disponibilidade HTTP, não interação de navegador.
O servidor temporário foi encerrado. README ajustado para instalação na raiz e uso de Bun.

## LOGIN ADMIN

PASSOU por HTTP real: BCrypt, login e /auth/me retornando nome/perfil corretos.
Senha incorreta retornou 401; e-mail malformado retornou 400.
Exibição de nome/perfil na interface ainda não validada em navegador.

## LOGIN RECEPTIONIST

PASSOU por HTTP real: login e identidade de RECEPTIONIST; leitura de especialidades.
Login e menus visuais em navegador permanecem pendentes.

## LOGIN PROFESSIONAL

PASSOU por HTTP real: login, identidade de PROFESSIONAL e professionalId igual ao
Professional persistido para a conta. Testes visuais permanecem pendentes.

## SESSION / RELOAD / LOGOUT

Não homologados no navegador. As chamadas /auth/me foram feitas com tokens reais,
mas isso não comprova restauração da página, remoção do localStorage pelo frontend,
redirecionamento ou descarte dos estados React. Não foi usado mock como substituto
para declarar esses itens aprovados.

## ROUTE GUARDS

Backend real negou /users para recepção/profissional e /patients e /professionals
para PROFESSIONAL, com 403. Acesso direto por URL e feedback visual do RouteGuard
permanecem pendentes em navegador.

## SPECIALTIES

PASSOU por HTTP real com dados persistidos:

- ADMIN: POST 201 com UUID e description null; PUT 200; DELETE 204.
- Após exclusão, GET por UUID retornou 404.
- RECEPTIONIST e PROFESSIONAL: GET 200; POST/PUT/DELETE 403.
- Nome vazio retornou 400 com details de validação.
- Exclusão da especialidade vinculada ao Professional retornou 409 de FK.

Loading, botões de escrita, pending, descrição nula na tabela, toasts após resposta
e manutenção do formulário em erro ainda dependem de homologação visual real.
Não foram integradas páginas adicionais; criação de User/Professional foi apenas
provisionamento das contas de teste no banco exclusivo.

## 401

API real retornou 401 para token ausente/inválido e para JWT corretamente assinado,
mas expirado há uma hora. O JWT expirado foi gerado somente em memória com a chave
temporária da instância, sem reduzir TTL ou alterar o backend.
Limpeza/redirecionamento no navegador ainda pendentes.

## 403

API real negou escrita de especialidades aos dois perfis sem permissão. Depois de
cada conjunto de negativas, /auth/me com o mesmo token retornou 200.
Isso confirma validade do token no servidor; não comprova a preservação do estado
da interface no navegador, que permanece pendente.

## CORS

PASSOU por HTTP real: preflight de http://localhost:3000 aceito com origem exata;
preflight de http://localhost:3001 negado com 403, sem Access-Control-Allow-Origin.
APP_CORS_ALLOWED_ORIGINS definido apenas no ambiente do processo Spring.
Nenhum wildcard ou alteração no código backend.

## MULTI-TAB

Não executado: faltou navegador automatizável. Login/logout entre abas continuam
pendentes, sem alegação de aprovação por testes HTTP.

## CORREÇÕES

Somente a reorganização local autorizada para a raiz foi registrada, e o README
passou a indicar essa localização e instalação por Bun. Nenhuma regressão de código
da fundação foi demonstrada nos testes realizados, portanto não houve correção
especulativa ou avanço de módulos.

## COMMITS

Os cinco commits anteriores foram preservados. Esta etapa acrescenta um commit
local de reorganização autorizada e evidências; consultar git log para seu hash.
package-lock.json permanece fora do commit. Nenhum push foi realizado.

## LINT

PASSOU: npm run lint, equivalente a tsc --noEmit. Não existe alegação de ESLint.

## BUILD

PASSOU: npm run build com Vite 6.4.3. 1773 módulos, JS 575,29 kB
(gzip 161,68 kB). Aviso conhecido de bundle acima de 500 kB permanece.
Falhas iniciais de sandbox foram reexecutadas autorizadamente.

## PR

Não aberta. O usuário condicionou publicação à homologação; os testes de navegador
obrigatórios ainda não foram possíveis.

## CI

Não executada remotamente: sem push/PR. O workflow existente é deploy em push para
main ou workflow_dispatch; não há gate de PR configurado nessa revisão.
Nenhuma execução de deploy foi disparada.

## MERGE

Não realizado, pois a condição de homologação real completa não foi satisfeita.

## DEVELOP FINAL

develop não foi modificada; referência confirmada após fetch: 7615cb8.
Não houve pós-merge porque não ocorreu merge.

## PENDÊNCIAS

A ferramenta de computador retornou apps/browsers vazios e erro de pipe nativo
indisponível. A tentativa de abrir Chrome retornou Browser is not available: chrome.
É necessário disponibilizar acesso ao navegador para concluir: login dos três
perfis na UI, credenciais inválidas, reload, logout, rotas diretas, ações e estados
de Especialidades, 401/403 na interface e sincronização entre abas.
Somente depois desses gates: push da feature, PR para develop, checks, merge e
validação de develop. Não foi solicitada ou realizada integração de novos módulos.

## STATUS FINAL

FUNDAÇÃO FRONTEND AINDA NÃO HOMOLOGADA
