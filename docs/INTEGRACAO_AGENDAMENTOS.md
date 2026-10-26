# Bloco 3 — Schedule, Appointment, Agenda e Consultas

Data: 26/10/2026. Status: **BLOCO 3 INTEGRADO E PRONTO PARA REVISÃO**.
Execução local: sem push, PR, merge ou publicação.

## Estado inicial e baselines

Frontend develop: `48f67258cf3002e78895b637de7e214ff20dc0df`.
Confirmados raiz, status, branch, remotes, fetch/prune, histórico e atualização
fast-forward segura. HEAD igual a origin/develop antes de criar a branch nova
`feature/integracao-agendamentos`.

Backend develop: `9daa1c5567774ba9aa6726082f3747b01fab1343`, sem alterações.
Consultados docs/API.md, controllers, DTOs, services, entities e regras de acesso.
Backend permaneceu nessa baseline durante a homologação.

Itens locais preservados fora dos commits: alteração adicional de .gitignore e
package-lock.json não rastreado. SHA256 deste último antes/depois:
`747A3653D95FE7BC7FF672681D0A2B1CE249B64CF6D283CAFAD60B95DD8E2705`.
package.json e bun.lock intactos; nenhuma dependência permanente adicionada.
Playwright foi instalado exclusivamente fora do projeto para homologação.

## Fonte de verdade e fronteira funcional

Schedule é um slot de disponibilidade. Appointment é a consulta marcada.
Agenda (`/appointments`) e Consultas (`/consultations`) são duas experiências
sobre os mesmos Appointments/UUIDs. Não existe ConsultationService ou endpoint
/api/consultations. Nenhum campo de duração, sala, convênio, triagem ou grade
recorrente foi inventado.

MedicalRecords/Prontuários, Dashboard, PatientDetails e sua estrutura de abas
não foram alterados. Abas Consultas/Registros Clínicos de PatientDetails seguem
indisponíveis, conforme escopo permitido. A fundação de autenticação, sessão,
cliente Axios, erros, guards, sidebar/header, Specialties, Users, Professionals
e Patients foi preservada.

Agenda e Consultas não consomem AppContext. O contexto global foi preservado.
Não se mantém uma base global simulada de Appointments. Cada montagem das telas
ou atualização consulta o backend; após mutações, os dados são recarregados.

## Services, types e endpoints

Services tipados usam exclusivamente o Axios central e AbortSignal opcional.
Não há HTTP em TSX. Listagens retornam arrays simples, sem PaginatedResponse,
query params inventados ou filtros backend não documentados.

| Service | Métodos / HTTP |
| --- | --- |
| ScheduleService | getAll → GET /api/schedules; create → POST /api/schedules |
| AppointmentService | getAll → GET /api/appointments; getById → GET /api/appointments/{id}; create → POST /api/appointments; updateStatus → PUT /api/appointments/{id}; cancel → DELETE /api/appointments/{id} |
| StatusService | getAll → GET /api/statuses |

ScheduleRequest: professionalId, date, time. Response acrescenta id,
professionalName e created. Não há update/delete/bloqueio de Schedule.

AppointmentCreateRequest: patientId, professionalId, date, time e notes opcional.
Não envia statusId nem especialidade. Backend atribui Agendada.
AppointmentStatusUpdateRequest contém somente statusId. Não há reagendamento
nem alteração de patient, professional, date, time ou notes via PUT.
Response usa id, patientId/patientName, professionalId/professionalName, date,
time, statusId/statusName, notes, created. UUID é string, vindo da API.

Types existentes foram conferidos contra DTOs da baseline. Catálogo de status
fornece UUID real e description; nenhum UUID de status hardcoded no código.
PatientService e ProfessionalService integrados fornecem seletores de criação,
com id como value e nome como label. PROFESSIONAL não consulta esses cadastros
globais nos fluxos deste bloco.

## Matriz de perfis

| Operação | ADMIN | RECEPTIONIST | PROFESSIONAL |
| --- | --- | --- | --- |
| GET Schedule | Todos | Todos | Próprios, filtrados pelo backend |
| Criar Schedule | Qualquer profissional real | Sem ação / backend 403 | professionalId da sessão, somente próprio |
| GET Appointment | Todos | Todos | Próprios, filtrados pelo backend |
| Criar Appointment | Sim | Sim | Sem ação / backend 403 |
| Agendada → Confirmada | Sim | Sim | Não |
| Confirmada → Em atendimento | Sim | Não | Somente próprio |
| Em atendimento → Concluída | Sim | Não | Somente próprio |
| Cancelar Agendada/Confirmada | DELETE lógico | DELETE lógico | Não |
| Ações em Concluída/Cancelada | Nenhuma | Nenhuma | Nenhuma |

O cliente mostra somente transições válidas; o backend continua autoridade.
Para PROFESSIONAL sem professionalId, abrir horário é bloqueado com mensagem
controlada. Não há dropdown de outro profissional para esse perfil. Consulta
por ID alheio e tentativa de atuar em registro alheio foram negadas por 403 real.

## Agenda e disponibilidade

Design de calendário, toolbar, cards e modais preservado. Navegação Dia/Semana,
Hoje, anterior/próximo e data funciona com dados reais. Semana inclui sete dias:
o backend não restringe slots a segunda–sexta. Linhas vêm dos horários reais,
inclusive segundos; não há HOURS fixo nem duração final fictícia. Há múltiplos
profissionais na mesma célula sem perda de consultas.

Slot livre: Schedule cuja combinação professionalId/date/time não possui
Appointment diferente de Cancelada. Todos os outros estados, incluindo
Concluída, ocupam o slot. Cancelamentos permanecem visíveis como histórico ao
lado da disponibilidade novamente livre. O cálculo é apenas UX; a reserva é
sempre confirmada pela API.

Clique em slot livre preenche profissional/data/hora. Botão Nova Consulta usa
o mesmo formulário nas duas telas. Ao criar slot/consulta na Agenda, a grade
acompanha a data retornada, inclusive quando pertence a outra semana.
Cards ocupados abrem leitura por GET ID; clique não cancela nem reativa consultas.

Datas são YYYY-MM-DD e horários mantêm LocalTime retornado pelo backend. Payload
não converte para UTC. Aritmética de calendário usa meio-dia local; exibição
brasileira parte dos componentes da string. timeKey compara HH:mm/HH:mm:ss de
forma equivalente, preservando segundos/frações significativos.

## Consultas, status e cancelamento

Tabela real mostra patientName, professionalName, date, time e statusName.
Notas aparecem somente no modal de detalhes GET ID. Filtros de busca, status,
data e profissional são locais; PROFESSIONAL não possui seletor global.
Ações genéricas Editar/Excluir e paginação falsa foram removidas.

PUT usa o UUID da descrição necessária no catálogo real. Se o catálogo não
contiver o status necessário, a ação fica bloqueada e há mensagem/retry; não se
fabrica UUID. Concluída e Cancelada são finais.

Cancelamento exige confirmação visual e chama DELETE. Após 204, o frontend
recarrega Schedule/Appointment, sem remover o registro como exclusão física.
A consulta continua com Cancelada e o slot volta a estar disponível. Uma nova
reserva cria outro UUID, preservando o histórico cancelado.

## Loading, erros, retry e operações pendentes

Agenda e Consultas possuem loading, empty, error/retry e atualização manual.
useSchedulingData carrega Schedule/Appointment como um conjunto: se uma leitura
falha, não apresenta disponibilidade calculada com metade dos dados. Requests
anteriores são abortadas ao atualizar/desmontar; não há cache persistente entre
sessões. Estado local da página é substituído pela fonte backend após refetch.

Formulários e ações possuem pending e trava de operação em ref, bloqueando
submit repetido. Modais não fecham durante envio nem em falha. Sucesso somente
após HTTP confirmado. Alteração de status/cancelamento refaz leituras inclusive
em erro para corrigir ações obsoletas. Erro de refetch é exibido com retry.

Em 409 de criação, formulário/seleções válidas são mantidos e Schedule/Appointment
são recarregados. Um horário ocupado durante a edição desaparece das opções,
bloqueando novo envio com seleção inválida. Nenhum lock frontend foi criado.

| Erro | Evidência real |
| --- | --- |
| 400 | Schedule duplicado e transição Confirmada → Confirmada obsoleta na UI; mensagem controlada e estado atualizado |
| 401 | Token inválido no Axios de Agenda encerra sessão, limpa token e leva ao login |
| 403 | Recepção POST Schedule/transição clínica; PROFESSIONAL em operações/IDs vedados; sessão preservada |
| 404 | Professional inexistente ao criar Schedule; detalhe de Appointment obsoleto mostra erro/retry |
| 409 | Slot ocupado depois da seleção UI; formulário preservado, sem falso sucesso, disponibilidade recarregada |

## Gates intermediários e testes

| Etapa | Lint | Build | Homologação |
| --- | --- | --- | --- |
| A: services/types | Passou | Passou | Contratos conferidos com backend |
| B: Schedule/Agenda antes de Consultas | Passou | Passou | AGENDA_REAL_OK e BLOCO3_GATE_OK agenda |
| C: Consultas/Appointment | Passou | Passou | CONSULTAS_REAL_OK e BLOCO3_GATE_OK all |
| Ajuste de navegação para nova data | Passou | Passou | Gate completo repetido; sábado/modo Dia aprovados |

Lint é tsc --noEmit. Build Vite concluiu; persiste o aviso conhecido de chunk
acima de 500 kB. Nenhuma alteração de configuração/dependência para ocultá-lo.

`npm run smoke` existente passou, conferindo regressão da fundação.
`node scripts/smoke-agendamentos.mjs` passou, sem framework/dependência nova:

- Ocupação por profissional/data/hora e estados ativos, incluindo Concluída.
- Slot liberado por Cancelada e bloqueado por nova reserva no mesmo horário.
- Equivalência de segundos zero e preservação de segundos/frações significativos.
- Matriz completa de transições/cancelamento por perfil e ownership defensivo.
- Calendário local em America/Cuiaba, Pacific/Kiritimati e America/Los_Angeles,
  virada de ano, ano bissexto e fins de semana.

## Ambiente real e método

PostgreSQL 18 exclusivo em 127.0.0.1:55432, SCRAM, banco homologacao,
credenciais aleatórias temporárias. Backend JAR Java 26 da develop congelada,
Flyway V1–V15, JPA ddl-auto=validate. Frontend Vite real em localhost:3000 e
API localhost:8080/api. Configurações:

```text
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
VITE_API_URL=http://localhost:8080/api
```

Chrome instalado 156.0.8078.48, headless via Playwright temporário, contexto
isolado 1600 × 1100. Dados reais descartáveis: ADMIN, RECEPTIONIST, dois
PROFESSIONAL vinculados e uma conta PROFESSIONAL sem vínculo, Specialty, dois
Patients, Professionals/Addresses, Schedules e Appointments.

Automação operou UI para fluxos principais; API real foi usada também para
fixtures, verificação de persistência e negativas de permissão/ownership.
Nenhuma response HTTP de CRUD foi simulada. Requests reais foram atrasadas
para observar loading/pending. Exatamente dois GETs tiveram transporte
interrompido para testar erro/retry nas duas telas.

Para testar catálogo ausente, apenas no banco descartável, a descrição
Confirmada foi alterada temporariamente e restaurada em finally antes das
transições; a UI bloqueou o botão e recuperou o catálogo por GET real.
Para detalhe 404, uma fixture descartável de Appointment foi removida por SQL
entre a listagem e o clique de visualizar. Isso é preparação de teste, não
operação oferecida pela UI; cancelamentos da UI continuaram exclusivamente lógicos.

Todos os processos de teste e clusters foram encerrados/removidos em finally.
PostgreSQL pessoal existente não foi alterado. Ferramentas/capturas temporárias
foram removidas ao concluir a inspeção visual. Sem secrets/tokens no relatório
ou nos commits.

## Cenários aprovados no browser

- ADMIN cria Schedule com UUID real e LocalTime com segundos; persistência após
  F5; duplicidade controlada; cria Appointment a partir de slot pré-preenchido.
- RECEPTIONIST lê Agenda sem criar Schedule, POST indevido retorna 403; cria
  Appointment real e não recebe slots já ocupados no formulário.
- PROFESSIONAL vê Schedule próprio, cria usando professionalId de /auth/me sem
  seletor global; criar horário alheio retorna 403; conta sem vínculo é bloqueada.
- Appointment criado na Agenda aparece na tabela com mesmo UUID; criação na
  tabela aparece na Agenda. ADMIN percorre Confirmada, Em atendimento e Concluída;
  cada mudança feita em Consultas é refletida na Agenda após navegação/refetch.
- RECEPTIONIST confirma Agendada e cancela Agendada/Confirmada. Não vê ações
  clínicas. DELETE 204 mantém registro Cancelada e libera slot. Nova reserva
  naquele slot cria outro UUID, mantendo Cancelada visível nas duas experiências.
- PROFESSIONAL vê lista própria filtrada pelo servidor, consulta ID próprio,
  inicia e conclui atendimento próprio. Não cria/cancela/confirma, não acessa ou
  altera consulta alheia; 403 comprovado. Segundo profissional também fica isolado.
- Status clínico e Schedule persistem após F5. Estados finais não têm ações.
- Concorrente real ocupa slot após a seleção do formulário: POST UI retorna 409,
  sem falso sucesso; Schedule/Appointment são recarregados e slot some das opções.
- ADMIN e RECEPTIONIST reservam em paralelo: exatamente um 201 e um 409;
  conferida uma única reserva ativa no banco por API.
- Status alterado por outro request deixa botão obsoleto: 400 real, erro
  controlado e refetch atualiza o estado exibido.
- Criação de Schedule e Appointment em sábado de outra semana; grade acompanha
  data retornada. Modo Dia e anterior/próximo funcionam sem dados inventados.
- Loading/empty nas duas telas, recuperação de falha de rede, 401, 403, 404,
  catálogo incompleto e retry aprovados.
- Console: nenhuma React exception, Promise rejection, Axios cru, loop, key
  inválida ou warning crítico. Mensagens nativas de HTTP esperados e exatamente
  duas ERR_CONNECTION_FAILED deliberadas foram separadas de regressões.
- Network verificou GET/POST schedules, GET/lista/ID/POST/PUT/DELETE appointments
  e GET statuses reais com Bearer, sem divulgar tokens.

Capturas de Agenda ADMIN, formulário de conflito 409 e tabela PROFESSIONAL foram
inspecionadas. Identidade visual mantida; nenhuma mudança de sidebar/header.

## Divergência backend encontrada

Schedule duplicado sequencial retorna **400**, mensagem **Horário já cadastrado
para este profissional.**, pelo BusinessException explícito em ScheduleService.
O roteiro deste Bloco 3 esperava 409. Reproduzido nos gates de Agenda e completo.
Não foi alterado o backend, nem convertido artificialmente 400 em 409 no cliente.
A UI trata o erro normalizado e mantém o formulário.

Esta diferença de status HTTP não impede criar/consumir Schedule nem usar os
slots. Deve ser revisada separadamente, caso se deseje uniformizar o contrato.
O fluxo de dupla reserva de Appointment retorna o **409 esperado**, inclusive
sob concorrência real, e foi homologado na UI. Nenhum bug backend que torne o
contrato impossível de consumir foi encontrado; nenhum fluxo foi mascarado.

## Mocks removidos e preservados

Removidos somente de Schedule/Agenda/Consultas: arrays de consultas/pacientes/
profissionais fictícios, IDs Date.now, datas fixas, HOURS fixo, duração inventada,
status Reservado/Cancelado e alternância local de cancelamento/reativação,
seleção de status inicial, edição/reagendamento sem contrato e paginação falsa.
Nenhuma lista persistente mistura Appointment real e mock.

Preservados: MedicalRecords/Prontuários, Dashboard e PatientDetails sem integração
clínica. AppContext global permanece. Não foi iniciada a etapa seguinte.

## Commits e arquivos

- dc92c51 — feat: prepara services reais de agendamentos.
- 5d8f558 — feat: integra disponibilidade e consultas na agenda.
- fcd79c1 — feat: integra consultas e estados de agendamento.
- 1eecc62 — test: cobre disponibilidade estados e datas locais.
- Commit docs: registra integracao de agendamentos — README e este relatório;
  hash final disponível em git log.

```text
src/types/index.ts
src/services/schedule.service.ts
src/services/appointment.service.ts
src/services/status.service.ts
src/lib/appointments.ts
src/hooks/useSchedulingData.ts
src/components/appointments/SelectField.tsx
src/components/appointments/StatusBadge.tsx
src/components/appointments/ScheduleFormModal.tsx
src/components/appointments/AppointmentFormModal.tsx
src/components/appointments/AppointmentDetailsModal.tsx
src/components/appointments/AppointmentActions.tsx
src/pages/Appointments/AppointmentsPage.tsx
src/pages/Consultations/ConsultationsPage.tsx
scripts/smoke-agendamentos.mjs
README.md
docs/INTEGRACAO_AGENDAMENTOS.md
```

## Bloqueios e próxima etapa

Nenhum bloqueio frontend pendente. Divergência 400/409 de Schedule duplicado
registrada para revisão, com backend intacto. Build mantém aviso conhecido de
bundle. Itens locais conhecidos seguem fora dos commits.

Revisar o Bloco 3 e a decisão de status HTTP do Schedule antes de autorizar
publicação. Sem push, PR ou merge nesta execução. Não iniciar MedicalRecord,
Prontuários, Dashboard ou Registros Clínicos de PatientDetails.
