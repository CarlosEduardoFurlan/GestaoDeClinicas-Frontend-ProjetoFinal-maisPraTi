# Bloco 4 — integração clínica e Dashboard

Data: 26/10/2026. **BLOCO 4 INTEGRADO E PRONTO PARA REVISÃO**.
Entrega exclusivamente local: sem push, PR, merge, deploy ou alteração de main.
Não foi iniciado o Bloco 5.

## Estado inicial e baselines

Frontend develop: `c24c5570d7d41ec5af05fc2d83e4d91f62b3c892`.
Backend develop congelada: `e183b6bc490af6b60a11b0fb1604986c1ca40e66`.
Em ambos os repositórios foram conferidos raiz, status, branch, remotes,
fetch/prune e histórico. Frontend atualizada com fast-forward seguro e HEAD
igual a origin/develop antes de criar `feature/integracao-clinica-dashboard`.
Backend limpo, permaneceu no mesmo SHA, sem alteração de implementação/schema.

Preservados fora dos commits: linha local adicional de .gitignore e
package-lock.json não rastreado. SHA256 deste último antes/depois:
`747A3653D95FE7BC7FF672681D0A2B1CE249B64CF6D283CAFAD60B95DD8E2705`.
package.json e bun.lock intactos. Nenhuma dependência permanente adicionada.

## Contrato MedicalRecord e service

Fonte de verdade: docs/API.md, MedicalRecordController/Service e DTOs, além dos
contratos já integrados de Appointment e Patient.
MedicalRecordResponse continua contendo somente **id, appointmentId, notes**.
Os tipos preparados já correspondem à baseline e foram reutilizados sem campos
novos. MedicalRecordService usa Axios central e AbortSignal opcional:

| Método | Endpoint / resultado |
| --- | --- |
| getAll | GET /api/medical-records → array simples |
| getById | GET /api/medical-records/{id} → response real |
| create | POST /api/medical-records → { appointmentId, notes } |
| update | PUT /api/medical-records/{id} → { notes } |

Não existe método ou botão DELETE. Nenhum HTTP em TSX. Não há paginação falsa,
novos endpoints clínicos, campos estruturados ou funcionalidades de prontuário
avançado. Notes é texto obrigatório na UI, sem limite artificial de caracteres.

## Join e página Prontuários

MedicalRecordService.getAll e AppointmentService.getAll são carregados como
conjunto dependente. View model local relaciona record.appointmentId com
appointment.id; o DTO permanece intacto. Dados exibidos: paciente, profissional,
data, hora, status da consulta como informação e notes. Nenhum CPF, telefone,
idade ou especialidade é buscado/exibido nesse fluxo.

Layout preservado: lista à esquerda, detalhe à direita, modal Novo Prontuário e
modal Editar Observações. Lista ordenada por data/hora decrescente, filtros
locais por paciente/data e, para ADMIN, profissional. Visualização e abertura de
edição consultam GET ID real. Se a referência de consulta estiver indisponível,
a UI informa isso, sem fabricar identidade ou associar outro paciente.

Criação usa somente Appointments retornados ao profissional pelo backend e
remove opções já presentes em seus MedicalRecords. Não exige Concluída: foram
validadas opção Agendada e ausência de bloqueio por Cancelada. O backend continua
autoridade de ownership/UNIQUE. PUT não permite trocar consulta, paciente,
profissional, data ou hora; contém somente notes.

Após sucesso HTTP, estado/refetch usa response/UUID real. Em conflito 409,
modal e notes são mantidos, não há falso sucesso e o refetch remove a consulta
agora ocupada das opções. Não se persiste nada apenas em memória.

## Segurança e perfis

| Área | ADMIN | RECEPTIONIST | PROFESSIONAL |
| --- | --- | --- | --- |
| MedicalRecords | GET global/ID, somente leitura | Sem menu, URL/API negados | GET próprios, POST sobre própria consulta e PUT próprio |
| Autoria clínica | Sem Novo/Editar; POST/PUT backend403 | Nenhuma | Somente próprio, validado no servidor |
| PatientDetails Consultas | Leitura e agendamento | Leitura e agendamento | Continua sem acesso global a Patients |
| PatientDetails Registros Clínicos | Leitura do paciente aberto | Aba ausente, nenhum request clínico | Não utiliza essa rota |
| Dashboard | Appointments + Patients, três cards | Appointments + Patients, três cards | Apenas Appointments próprios, dois cards |

MedicalRecordsPage funciona somente com /medical-records e /appointments para
os dois perfis autorizados. Não depende de PatientService/ProfessionalService
globais. Dois profissionais reais provaram isolamento na lista e 403 para
GET/PUT alheios e criação sobre consulta alheia. 403 preserva sessão.
Não foi ampliada qualquer permissão/route guard.

## PatientDetails

Identidade cadastral continua vindo de GET /patients/{UUID}. Aba Consultas usa
GET /appointments e filtra appointment.patientId pelo Patient aberto. Exibe data,
hora, profissional e StatusBadge real. Mensagens de indisponibilidade removidas;
empty, erro/retry e loading reais por aba.

Agendar Consulta reutiliza AppointmentFormModal do Bloco 3, com uma única prop
opcional initialPatientId. Dentro do PatientDetails o paciente é pré-selecionado
e fixo; no fluxo global o seletor continua livre e vazio inicialmente.
Disponibilidade e reserva seguem o mesmo useSchedulingData/AppointmentService.
Nova consulta aparece por refetch no detalhe, na tabela Consultas e na Agenda
com o mesmo UUID. ADMIN e RECEPTIONIST tiveram criação real201 validada.

Registros Clínicos monta somente para ADMIN. O join MedicalRecord → Appointment
filtra então o patientId correspondente; mostra data/hora, profissional e notes,
sem autoria/edição. A aba fica invisível à recepção e nenhum GET MedicalRecords
é feito por PatientDetails nesse perfil, comprovado no Network.

## Dashboard e cálculos

Sem DashboardService, /api/dashboard, /api/metrics, /api/reports ou novo KPI.
Somente derivações de apresentação dos arrays autorizados:

- Consultas Hoje: todas as Appointments da data local atual, incluindo os cinco
  status oficiais; contagem rotulada consultas, sem chamá-las todas de agendadas.
- Próximas Consultas: data/hora posterior ao momento local, excluindo Cancelada
  e Concluída. Precisão de segundos/frações preservada pela normalização LocalTime.
- Total de Pacientes: PatientService.getAll().length somente ADMIN/RECEPTIONIST.
  PROFESSIONAL não mostra esse card nem faz GET /patients; não foi substituído
  por outra métrica. Grid adapta-se a dois cards.

Lista do dia usa UUID, time, patientName, professionalName e statusName, ordenada
por horário. Sem especialidade fabricada nem busca global de Professional.
Nova Consulta para ADMIN/RECEPTIONIST navega ao fluxo Consultas existente, sem
outro formulário. PROFESSIONAL não vê essa ação.

Calendário lateral gera sete dias da semana local, com navegação anterior,
próxima e retorno à semana atual efetivos. Datas de 2024 e números fictícios
removidos. Não altera os indicadores de hoje ao navegar o calendário lateral.
Relógio local da página é atualizado a cada 30 segundos e ao atualizar dados,
com timer limpo ao desmontar. Não converte LocalDate/LocalTime clínicos para UTC.

Dados obrigatórios são carregados atomicamente. Falha de Patients para ADMIN/
RECEPTIONIST ou de Appointments para qualquer perfil bloqueia o painel e oferece
retry, sem apresentar métricas parciais como completas.

## AppContext e preservação da fundação

Busca por imports/usos confirmou que nenhum fluxo funcional consumia o contexto
simulado. Somente App.tsx montava o provider. AppContext.tsx e seus arrays de
pacientes/consultas fictícias foram removidos. SessionApp mantém a key de
sessionVersion diretamente no RouterProvider, preservando o descarte das telas
na troca/encerramento de sessão.

AuthContext, cliente Axios, normalização de erros, sessão, guards, matriz de
perfis, sidebar/header e os services de cadastros/agendamentos não foram
reimplementados. Única adaptação no formulário anterior: paciente opcionalmente
pré-selecionado para reutilização no detalhe. Fluxo global foi revalidado.

## Gates intermediários

| Gate | Lint | Build | Browser/backend real |
| --- | --- | --- | --- |
| A — service/types/MedicalRecords antes de PatientDetails | Passou | Passou | MEDICAL_RECORDS_REAL_OK / BLOCO4_GATE_OK records |
| B — PatientDetails antes de Dashboard | Passou | Passou | PATIENT_DETAILS_REAL_OK / BLOCO4_GATE_OK patient |
| C — Dashboard e consolidação após remoção do contexto | Passou | Passou | Todos os três módulos repetidos: BLOCO4_GATE_OK all |

Lint é tsc --noEmit. Build Vite passou; permanece o aviso conhecido de bundle
acima de 500 kB, sem tentativa de otimização geral nesta etapa.

Smokes locais aprovados:

```text
npm run smoke
node scripts/smoke-agendamentos.mjs
node scripts/smoke-clinica-dashboard.mjs
```

O novo smoke usa somente Node/assert/esbuild existentes, cobrindo join por UUID,
isolamento por Patient, órfão sem identidade fabricada, ordenação e DTO intacto;
opções sem duplicidade e sem restrição de status inventada; dia local, estados
finais, ordenação e precisão de LocalTime em America/Cuiaba,
Pacific/Kiritimati e America/Los_Angeles. Não substitui a homologação real.

## Ambiente real e fixtures

- PostgreSQL 18 exclusivo em 127.0.0.1:55432, SCRAM, banco homologacao.
- Backend develop e183b6b real, JAR Java 26, Flyway V1–V15 e JPA validate.
- Vite real localhost:3000; API localhost:8080/api.
- APP_CORS_ALLOWED_ORIGINS=http://localhost:3000 e
  VITE_API_URL=http://localhost:8080/api.
- Chrome 156.0.8078.48, headless via Playwright temporário fora do projeto;
  contexto 1600×1100, timezone America/Cuiaba.
- ADMIN, RECEPTIONIST, dois PROFESSIONALS vinculados, Specialty, Professionals/
  Addresses, Patients, Schedules e Appointments reais nos cinco status.
- MedicalRecords de fixtures foram criados exclusivamente por POST autorizado
  como PROFESSIONAL. Um Patient vazio foi criado para testar empty states.

Durante o teste Dashboard, o relógio do browser foi fixado às 23h30 do dia local
das fixtures, quando UTC já pertence ao dia seguinte. Isso prova dia local sem
alterar o backend ou simular respostas. Um dia futuro sem consultas também foi
usado para validar zero/empty, restaurando depois o relógio do teste.

Requests reais foram atrasadas para observar loading/pending. Nenhuma response
HTTP de negócio foi simulada. Falhas de transporte controladas testaram retry
e impediram joins/métricas parciais. Uma fixture MedicalRecord concorrente foi
removida por SQL somente no banco descartável entre a listagem e o clique, para
provar GET ID 404. A aplicação não oferece DELETE clínico.

Backend, Vite e todos os clusters foram encerrados/removidos em finally.
PostgreSQL pessoal existente não foi alterado. Ferramentas Playwright, scripts
de browser e capturas temporárias removidos ao finalizar a inspeção visual.
Sem credenciais, secrets ou tokens versionados/no relatório.

## Casos e evidências no Chrome

| Área | Resultado |
| --- | --- |
| Professional criação | POST 201 com UUID real e response apenas id/appointmentId/notes; consulta Agendada aceita; textarea sem maxlength artificial, texto superior a500 caracteres persistido |
| Pending | POST manteve modal, botão desabilitado e nenhum sucesso antes da resposta |
| Professional edição | GET ID, PUT contendo somente notes; F5 preservou conteúdo |
| Duplicidade | Concorrente criou registro após seleção; POST UI409, modal/notes preservados, refetch e remoção da opção ocupada, sem falso sucesso |
| Ownership | A não lista registros de B; B não lista os de A; GET/PUT alheios e POST em consulta alheia403, sessão ativa |
| ADMIN clínico | Lista ambos, visualiza GET ID; sem Novo/Editar; POST/PUT backend403 |
| RECEPTIONIST clínico | Sem menu, URL direta negada e GET backend403; sessão ativa |
| Patient Consultas | Somente UUIDs daquele patientId; nenhum Appointment de outro paciente; dados/status reais |
| Patient agendamento | ADMIN/RECEPTIONIST usam modal compartilhado com paciente fixo; POST 201 persiste e aparece em Agenda/Consultas; fluxo global mantém paciente selecionável |
| Patient Registros | ADMIN vê apenas join daquele Patient, somente leitura; recepção não vê aba nem faz request MedicalRecords |
| Dashboard ADMIN/recepção | Três contagens iguais às fontes reais, lista ordenada, cinco badges oficiais, data local e F5 persistente |
| Dashboard PROFESSIONAL | Fonte filtrada pelo backend para cada profissional; dois cards, sem total global ou Nova Consulta; nenhum GET Patients/Professionals/MedicalRecords nesse fluxo |
| Calendário | Semana local real de sete dias, anterior/próxima funcionais |
| Empty/erro/retry | Prontuários, abas do Patient e Dashboard; falha em uma fonte não monta join ou métrica parcial |
| 400 | Notes ausente em request real gera validação 400 |
| 401 | Token inválido no cliente clínico limpa sessão e leva ao login |
| 403 | Permissão/ownership negados preservam sessão |
| 404 | Appointment inexistente no POST e MedicalRecord obsoleto no GET ID, com erro/retry visual |
| 409 | Duplicidade MedicalRecord real comprovada na UI |

Console: nenhuma exceção React, Promise rejection, Axios cru, loop, warning
crítico ou key inválida. Mensagens nativas dos HTTP esperados foram separadas
dos erros de aplicação, assim como falhas de transporte deliberadas e o favicon
opcional ausente já conhecido na baseline.

Network: GET MedicalRecords/lista/ID, POST e PUT reais; GET Appointments e
Patients apenas nos perfis autorizados. Bearer confirmado. Ausentes DELETE
MedicalRecord e APIs dashboard/reports/metrics/consultations inventadas.

Capturas inspecionadas: Prontuários PROFESSIONAL, PatientDetails ADMIN/Registros,
Dashboard ADMIN e Dashboard PROFESSIONAL. Mantidos layout lista/detalhe, cards,
calendário e tabela; adequados somente dados/ações/estados e permissões.

## Mocks removidos e restantes

Removidos INITIAL_RECORDS/AVAILABLE_CONSULTATIONS, identidades/endereço clínico
inventado, IDs Date.now como persistência, campos clínicos antigos não suportados,
arrays e métricas 12/4/348 do Dashboard, calendário fixo e placeholders das abas
agora integradas. AppContext simulado também removido após análise de usos.

Busca global não encontrou mock de negócio remanescente nas páginas funcionais
do menu. Preservados exemplos internos do DesignSystem (sem rota funcional) e
fixtures legítimas de testes. Date.now restante em ToastContext gera apenas ID
transitório de notificação, sem persistência de entidade de negócio.

A rota técnica **/schedules** continua com PlaceholderPage, guardada e fora da
navegação final. Schedule real já é consumido na Agenda /appointments. A rota
não é código morto porque ainda responde a URL direta; não foi removida nem
substituída por outra interface nesta etapa. Decisão registrada para Bloco 5.

## Commits e inventário

- 9498070 — feat: integra prontuarios clinicos.
- fdea8a3 — feat: integra consultas e registros no detalhe do paciente.
- 5093a3a — feat: integra dashboard com dados reais.
- 0f0b8cb — test: cobre joins clinicos e metricas locais.
- Commit docs: registra integracao clinica e dashboard — README e este relatório;
  hash final em git log.

```text
src/services/medical-record.service.ts
src/lib/clinical.ts
src/lib/dashboard.ts
src/hooks/useClinicalData.ts
src/hooks/useDashboardData.ts
src/components/medical-records/MedicalRecordFormModal.tsx
src/components/appointments/AppointmentFormModal.tsx
src/pages/MedicalRecords/MedicalRecordsPage.tsx
src/pages/Patients/PatientDetailsPage.tsx
src/pages/Patients/PatientAppointments.tsx
src/pages/Patients/PatientClinicalRecords.tsx
src/pages/Dashboard/DashboardPage.tsx
src/App.tsx
src/contexts/AppContext.tsx (removido)
scripts/smoke-clinica-dashboard.mjs
README.md
docs/INTEGRACAO_CLINICA_DASHBOARD.md
```

## Bugs backend, bloqueios e Bloco 5

Nenhum bug backend impeditivo foi encontrado. Baseline permaneceu intacta e
os erros de validação/permissão/ausência/conflito corresponderam aos contratos.
Nenhum bloqueio de implementação frontend pendente.

Itens para revisão/estabilização posterior: decidir destino da rota técnica
/schedules, revisão final dos quatro blocos, aviso conhecido de bundle e favicon
opcional. Não foram iniciados otimização geral, refactor estético, CI frontend,
deploy, novas funcionalidades ou merge em main.

Revisar o Bloco 4 local antes de autorizar publicação. Sem push/PR/merge nesta
execução; não avançar para acabamento/deploy sem nova instrução.
