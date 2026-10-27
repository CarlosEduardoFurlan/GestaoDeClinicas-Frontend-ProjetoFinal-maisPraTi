# Bloco 5 — estabilização final local

Data: 27/10/2026 (America/Cuiaba). Branch: `chore/estabilizacao-final`.

## Baselines e limites

- Frontend/develop e origin/develop: `e1628d866747ab74b575a5332984fdcedba27086`.
- Backend/develop: `e183b6bc490af6b60a11b0fb1604986c1ca40e66`, intacto.
- Main remota: `327ed8c2a1a4cce04bdbf4dd5768a08bb208562d`, sem atualização.
- `.gitignore` local adicional e `package-lock.json` não rastreado preservados
  fora dos commits. SHA256 do package-lock antes/depois:
  `747A3653D95FE7BC7FF672681D0A2B1CE249B64CF6D283CAFAD60B95DD8E2705`.
- Sem mudanças de negócio, DTO, permissões, endpoints, backend ou migrations.
- Sem push, PR, merge ou deploy nesta execução. Commits apenas locais.

## Auditoria global

Busca por mock, fake, dummy, fixture, hardcoded, Date.now, Math.random, TODO,
FIXME, placeholder, “em desenvolvimento”, localhost, 2024, CRM, triagem, PATIENT,
DOCTOR, MEDICO e `/api/consultations`, `/api/dashboard`, `/api/reports`,
`/api/metrics`, seguida de inspeção de rotas, imports e dependências.

| Classe | Achados e decisão |
| --- | --- |
| A — funcional/legítimo | Patient/PatientResponse/patientId são contratos reais; placeholders de inputs são dicas; Date.now/Math.random geram somente ID transitório de toast; ano do Footer é dinâmico. URLs locais ficam no exemplo de desenvolvimento e testes. Preservados. |
| B — fixture/teste | Servidores HTTP, usuários e registros simulados dos três smokes são isolados, sem rota de produto ou credenciais reais. Preservados. |
| C — demonstração interna | DesignSystem isolado mostrava exemplos, números ilustrativos e avatar externo; não era documentação necessária nem exportava tokens usados pelo produto. Removido com componentes exclusivos. |
| D — código morto | Grafo de imports desde main.tsx: 15 TSX inacessíveis; plugin AI Studio sem public/assets/aistudio; metadata.json com capacidade Gemini sem implementação; script clean Unix para server.js inexistente. Removidos. |
| E — problema real | /schedules pendente sem fluxo próprio; sidebar fixa em telas pequenas; modais sem foco/teclado e nomes associados; ações sem quebra de linha; HTML anunciando Design System; favicon ausente; carregamento monolítico; ausência de CI e de injeção de API no deploy. Corrigidos. |

Não há mock de negócio em rota funcional, papel PATIENT/DOCTOR/MEDICO, campos
clínicos antigos ou endpoints inventados. Termos em relatórios anteriores são
evidência histórica. A classificação dos resultados na baseline está no apêndice.

## Rotas, DesignSystem e código morto

`/schedules` não tinha link ou consumidor funcional além da rota placeholder e
entrada em routeProfiles. Ambos removidos. A API Schedule continua na Agenda.
Settings, DesignSystem e caminhos desconhecidos resolvem a página 404.

Removidos: DesignSystemPage, AuthLayout, BarChart, LineChart, ChartCard, Card,
StatCard, DataTable, Table, Avatar, Badge, Checkbox, Divider, Select e Switch.
Tokens CSS e Button/Input/Spinner/Modal funcionais preservados. A checagem extra
`tsc --noEmit --noUnusedLocals --noUnusedParameters` passou após remover seis
imports sem uso. Nenhum consumidor de AppContext reapareceu.

## Dependências e Vite

Busca no código, scripts e configurações não encontrou uso funcional de
`@google/genai`, `dotenv`, `express`, `motion`, `recharts`, `@types/express`,
`autoprefixer` ou `tsx`. Removidos e bun.lock atualizado com Bun 1.4.4.
Instalação congelada passou: 194 pacotes no lock, sem upgrade intencional dos
mantidos. Entradas cookie/debug/ms apenas reposicionadas pelo resolvedor.
Axios, React/DOM/Router, Lucide, clsx/tailwind-merge, Vite/TypeScript/Tailwind e
esbuild (usado nos smokes) permanecem.

Plugin aistudioMediaPlugin e metadata.json eram resíduos sem consumidor/asset.
Vite conserva aliases, strictPort e cálculo de base do Actions. Dev/build foram
validados depois. Sem manualChunks ou aumento de chunkSizeWarningLimit.

## Favicon e desempenho medido

`public/favicon.svg` reutiliza cruz e cor primária do +PraClinic, sem recurso
externo. HTML usa pt-BR, título/descrição do produto e `%BASE_URL%` no favicon.
Favicon respondeu 200 no Vite e na simulação Pages.

| Build | JS inicial | Gzip inicial | CSS | Gzip CSS |
| --- | ---: | ---: | ---: | ---: |
| Baseline | 518,42 kB | 156,36 kB | 39,90 kB | 7,85 kB |
| Final local | 424,97 kB | 138,28 kB | 34,58 kB | 7,34 kB |
| Simulação Pages | 425,08 kB | 138,36 kB | 34,58 kB | 7,34 kB |

Redução do JS inicial: 93,45 kB (18,0%); gzip: 18,08 kB (11,6%). São medidas de
artefatos, sem alegar melhora de tempo de carregamento não medida.

Dez páginas usam React.lazy: Login, Dashboard, Agenda, Consultas, Patients,
PatientDetails, MedicalRecords, Professionals, Specialties e Users. Um padrão
RouteLoading/Suspense com Spinner e role=status atende todas. Guards ficam antes
do lazy restrito. Chunks comuns são extraídos naturalmente pelo Vite.

Build final: 31 arquivos JS (dez páginas, 20 dependências comuns e o inicial).
Páginas: 2,97 a 11,71 kB; maior: Professionals (3,62 kB gzip). O aviso de 500 kB
desapareceu por divisão natural, sem esconder warning ou alterar thresholds.

## Responsividade, mobile e acessibilidade

Nove rotas ADMIN em cada viewport: 360x800, 390x844, 768x1024, 1024x768,
1366x768 e 1600x900. Documento sem overflow horizontal. Tabelas/grade conservam
scroll horizontal local; nenhum campo crítico ocultado. Padding/Footer adaptam.

Sidebar desktop a partir de 1024 px. Abaixo, botão abre dialog nativo com menu
por perfil, foco contido, Escape, fechamento ao navegar e retorno ao acionador.
Mudar para desktop fecha o drawer. NavLink raiz usa end para aria-current correto.

Modais usam dialog.showModal: conteúdo externo inerte, Tab/Shift+Tab contidos,
Escape passa pelo onClose existente, respeitando pending. Foco inicial em campo
habilitado quando disponível e restauração ao fechar. Títulos/descrições ligados
por aria-labelledby/describedby. Altura com 100dvh, margem, scroll e ações que
quebram linha em telas estreitas.

Sete formulários em 360 px: Patient, Professional, User, Specialty, Schedule,
Appointment e MedicalRecord. Verificados limites do viewport, ausência de
overflow horizontal, scroll, Cancelar, foco e Escape. MedicalRecord também foi
salvo/editado nessa largura. Salvar administrativo e agendamento foram exercidos
no E2E desktop; smokes cobrem os contratos dos outros cadastros.

Login por Enter; botão administrativo por Space; ação de tabela por Enter.
PatientDetails: roving tabIndex, setas/Home/End, tab/panel e filtro por perfil.
Menu/conta têm nome e aria-expanded. Foco visível global, skip link, reduced-motion,
erros associados do Input e contraste muted/login Footer melhorados.
Required/disabled e validação nativa preservados; erros globais com role=alert.
Não é certificação WCAG nem homologação de todos os browsers/leitores de tela.

Em 390x844: login real no artefato Pages e uso real de menu, Dashboard, Patients,
PatientDetails, Agenda, Consultas e modal no Vite. Screenshots inspecionados.

## CI e deploy

Novo ci.yml: Frontend validation, PR develop/main, push develop e manual;
contents:read, Bun 1.4.4, Node 24, frozen install, lint, build e três smokes.
Não usa banco/Java/API remota/credenciais. Não executado no GitHub: sem push.

Deploy mantém main/manual, Pages, Bun frozen e cópia index -> 404.html.
Recebe VITE_API_URL de Actions vars, valida configuração e executa lint/smokes
antes de um único build. Sem disparo. Guard rejeita URL ausente/malformada, HTTP,
loopback, credenciais, query/hash e domínios de exemplo reconhecidos. É checagem
sintática, sem verificar disponibilidade ou identidade do backend.

Oito casos negativos do guard foram executados localmente e rejeitados: variável
ausente, HTTP local, localhost HTTPS, loopback HTTPS, domínio reservado invalid,
domínio example.org, credenciais na URL e query. Nenhum valor de produção foi
necessário para esses testes.

## GitHub Pages e bloqueios de produção

Build simulado com GITHUB_ACTIONS=true, GITHUB_REPOSITORY correto e VITE_API_URL
reservada somente de teste, passada no processo, sem versionar configuração falsa.
Assets/favicon com base `/GestaoDeClinicas-Frontend-ProjetoFinal-maisPraTi/`.
Servidor local serviu 404.html em rotas profundas; Router resolveu Login e
PatientDetails após F5.

Chrome confirmou Login baixando seu chunk/dependências, Dashboard sem baixar
todos os módulos e Patients sob demanda. A API do host reservado de teste foi
encaminhada pelo harness temporário ao backend real, sem mudar CORS/backend.
Esse encaminhamento serve ao teste, não configura produção.

Documento de rota profunda responde HTTP 404 por desenho do fallback Pages;
isso é separado de falha de favicon/chunk/API/React, que não ocorreram.
Homologação remota depende do ambiente publicado, não autorizado nesta execução.

**Bloqueios para release funcional:** definir API HTTPS pública real e
VITE_API_URL no build github-pages; configurar a origem publicada em
APP_CORS_ALLOWED_ORIGINS no backend, sem wildcard; confirmar disponibilidade,
autenticação e CORS na entrega. O workflow anterior não injetava VITE_API_URL;
valores remotos eventualmente existentes não foram presumidos. Nenhum domínio
de produção foi inventado e backend permaneceu intacto.

## Homologação real e gates

PostgreSQL 18 exclusivo, SCRAM, porta 55432, schema novo; backend JAR Java 26 na
baseline e183b6b, Flyway V1-V15 e JPA validate; Vite3000; Chrome 156.0.8078.48.
Playwright instalado somente temporariamente fora do projeto.

- ADMIN: login, nove rotas funcionais, criar/editar especialidade por teclado e
  F5; prontuário global somente leitura e PatientDetails com join real.
- RECEPTIONIST: Dashboard, Agenda, Consultas, Patients/Details, Professionals e
  Specialties somente leitura; Users/MedicalRecords por URL negados; sem aba
  clínica ou request MedicalRecord em PatientDetails.
- PROFESSIONAL: Dashboard sem Patients/KPI global, Agenda/Consultas próprias,
  Specialties leitura, prontuários próprios; URLs globais negadas; registro
  alheio ausente e GET direto 403.
- E2E UI: Patient/Professional reais -> criar Schedule -> agendar Appointment ->
  confirmar -> PRO inicia -> conclui -> cria MedicalRecord -> edita notes ->
  F5 -> ADMIN lê e encontra no detalhe do paciente.
- Sem React exception, Promise rejection, warning crítico/key, Axios cru,
  erro de asset/lazy ou favicon404. Network sem endpoints inventados/DELETE
  clínico; Bearer correto. 403 esperado separado pela API do harness, sem tokens
  em logs.

Passaram: frozen install, lint/build/smoke por npm/Bun, smoke-agendamentos,
smoke-clinica-dashboard, checagem de imports, browser desktop/mobile e Pages.
Sequência equivalente ao CI passou localmente; não declara CI remoto verde.

## Revisão e encerramento

README atualizado com stack, execução, ambiente, API/perfis, arquitetura, gates,
CI e deploy. Relatórios anteriores mantidos como históricos. Diff revisado e
busca de secrets realizada antes dos commits. Serviços temporários encerrados
e ferramentas/cluster descartáveis removidos.

Pendências externas: revisão do Bloco 5, futura publicação autorizada, CI real
no GitHub, revisão integral develop -> main, configuração da produção e sua
homologação. Nenhum desenvolvimento adicional de funcionalidade neste bloco.

STATUS FINAL: BLOCO 5 ESTABILIZADO E PRONTO PARA REVISAO DE RELEASE

## Apêndice — classificação da busca na baseline

Busca textual sobre arquivos versionados da baseline e1628d8; bun.lock excluído
desta busca de conteúdo de produto e auditado separadamente como metadado de
dependências. Cada linha correspondente está identificada abaixo. Números são
da baseline, anteriores às remoções/ajustes. Documentos históricos: classe A;
fixtures HTTP dos smokes: B; exemplos DesignSystem: C; placeholder: E.

| Arquivo | Classe | Linhas correspondentes |
| --- | --- | --- |
| `.env.example` | A | 2, 5 |
| `README.md` | A | 15, 16, 47, 57, 67, 86, 90, 100 |
| `README.md` | E | 20 |
| `docs/HOMOLOGACAO_BROWSER.md` | A | 24, 27, 28, 50, 57, 76, 81, 90, 98, 99, 105 |
| `docs/HOMOLOGACAO_FUNDACAO.md` | A | 32, 51, 76, 81, 116, 117 |
| `docs/INTEGRACAO_AGENDAMENTOS.md` | A | 67, 70, 71, 74, 86, 95, 98, 99, 103, 104, 112, 114, 136, 153, 214, 218, 219, 222, 223, 229, 232, 240, 244, 300, 303, 306, 308, 352 |
| `docs/INTEGRACAO_CADASTROS.md` | A | 29, 64, 72, 81, 104, 106, 116, 126, 127, 143, 144, 145, 146, 149, 157, 172, 173, 175, 197, 198, 200, 202, 203, 204, 207, 222, 236, 239, 240, 241 |
| `docs/INTEGRACAO_CLINICA_DASHBOARD.md` | A | 20, 22, 47, 52, 59, 93, 94, 95, 98, 103, 105, 106, 111, 118, 120, 124, 131, 132, 135, 141, 146, 167, 168, 169, 183, 188, 192, 193, 194, 198, 199, 200, 203, 209, 213, 229, 230, 231, 233, 235, 248, 251, 255, 258, 259, 262, 264, 267, 290, 291, 292 |
| `docs/INTEGRACAO_FASE1.md` | A | 33, 36, 37, 56, 88, 89, 94, 97, 105, 109, 116, 118, 119, 134, 136, 137, 142, 147, 153, 164, 211, 219 |
| `scripts/smoke-agendamentos.mjs` | B | 7 |
| `scripts/smoke-api.mjs` | B | 106 |
| `scripts/smoke-clinica-dashboard.mjs` | B | 9, 10, 15, 21 |
| `src/app/routes.tsx` | A | 5, 6, 43, 44, 47, 48 |
| `src/app/routes.tsx` | E | 15, 16, 20, 60 |
| `src/components/appointments/AppointmentActions.tsx` | A | 13, 18 |
| `src/components/appointments/AppointmentDetailsModal.tsx` | A | 27 |
| `src/components/appointments/AppointmentFormModal.tsx` | A | 9, 16, 18, 24, 26, 39, 40, 45, 49, 51, 63, 65, 82, 83, 88 |
| `src/components/medical-records/MedicalRecordFormModal.tsx` | A | 30 |
| `src/components/navigation/Footer/Footer.tsx` | A | 7 |
| `src/components/ui/Input/Input.tsx` | A | 15 |
| `src/config/navigation.ts` | A | 39 |
| `src/config/permissions.ts` | A | 11 |
| `src/contexts/ToastContext.tsx` | A | 34 |
| `src/hooks/useDashboardData.ts` | A | 3, 5, 7, 8, 17, 19, 21, 24 |
| `src/pages/Appointments/AppointmentsPage.tsx` | A | 57, 73, 74 |
| `src/pages/Consultations/ConsultationsPage.tsx` | A | 44, 72, 89, 90, 91, 100, 101, 114 |
| `src/pages/Dashboard/DashboardPage.tsx` | A | 13, 14, 24, 30, 33, 40 |
| `src/pages/DesignSystem/DesignSystemPage.tsx` | C | 61, 62, 63 |
| `src/pages/MedicalRecords/MedicalRecordsPage.tsx` | A | 32, 58, 59, 65, 67, 72 |
| `src/pages/Patients/PatientAppointments.tsx` | A | 11, 13, 16, 20, 26 |
| `src/pages/Patients/PatientClinicalRecords.tsx` | A | 7, 10 |
| `src/pages/Patients/PatientDetailsPage.tsx` | A | 7, 9, 10, 11, 12, 14, 18, 23, 25, 31, 32, 34, 42, 44, 46 |
| `src/pages/Patients/PatientFormModal.tsx` | A | 6, 9, 11, 12, 26, 27, 29, 33, 36, 37, 38, 39, 40, 42 |
| `src/pages/Patients/PatientsPage.tsx` | A | 9, 11, 12, 14, 15, 19, 24, 27, 31, 35, 38, 43 |
| `src/pages/Professionals/ProfessionalsPage.tsx` | A | 77 |
| `src/pages/Specialties/SpecialtiesPage.tsx` | A | 134 |
| `src/pages/Users/UsersPage.tsx` | A | 89, 90 |
| `src/services/patient.service.ts` | A | 2, 4, 5, 6, 7, 8 |
| `src/types/index.ts` | A | 32, 39, 40, 59, 63 |

Total: 296 linhas correspondentes. Código morto D foi identificado pelo grafo
de imports e inspeção da configuração, descritos acima; não pela mera presença
de uma palavra da busca. PATIENT dentro de nomes de contratos não é papel de usuário.

## Commits locais e arquivos alterados

- `355b802 chore: remove codigo e dependencias sem uso`
- `2156591 perf: divide carregamento das rotas e remove placeholder`
- `9ca6eff fix: melhora responsividade acessibilidade e foco`
- `e93720f fix: adiciona favicon e identifica a aplicacao`
- `9cc2fa8 ci: adiciona validacao frontend e gates de deploy`
- Documentação consolidada em commit local separado.

51 arquivos no escopo, incluindo remoções:

```text
.github/workflows/ci.yml
.github/workflows/deploy.yml
README.md
bun.lock
docs/ESTABILIZACAO_FINAL.md
index.html
metadata.json
package.json
public/favicon.svg
scripts/validate-deploy.mjs
src/app/routes.tsx
src/components/appointments/AppointmentFormModal.tsx
src/components/appointments/ScheduleFormModal.tsx
src/components/charts/BarChart.tsx
src/components/charts/ChartCard.tsx
src/components/charts/LineChart.tsx
src/components/data-display/Card/Card.tsx
src/components/data-display/Card/StatCard.tsx
src/components/data-display/Table/DataTable.tsx
src/components/data-display/Table/Table.tsx
src/components/forms/AddressFields.tsx
src/components/forms/FormField.tsx
src/components/medical-records/MedicalRecordFormModal.tsx
src/components/navigation/Footer/Footer.tsx
src/components/navigation/Navbar/Navbar.tsx
src/components/navigation/Sidebar/Sidebar.tsx
src/components/overlay/Modal/Modal.tsx
src/components/ui/Avatar/Avatar.tsx
src/components/ui/Badge/Badge.tsx
src/components/ui/Checkbox/Checkbox.tsx
src/components/ui/Divider/Divider.tsx
src/components/ui/Input/Input.tsx
src/components/ui/Select/Select.tsx
src/components/ui/Spinner/Spinner.tsx
src/components/ui/Switch/Switch.tsx
src/config/navigation.ts
src/config/permissions.ts
src/index.css
src/layouts/AppShell/AppShell.tsx
src/layouts/AuthLayout/AuthLayout.tsx
src/pages/Consultations/ConsultationsPage.tsx
src/pages/DesignSystem/DesignSystemPage.tsx
src/pages/Login/LoginPage.tsx
src/pages/Patients/PatientAppointments.tsx
src/pages/Patients/PatientDetailsPage.tsx
src/pages/Patients/PatientFormModal.tsx
src/pages/Professionals/ProfessionalsPage.tsx
src/pages/Specialties/SpecialtiesPage.tsx
src/pages/Users/UsersPage.tsx
src/styles/tokens.css
vite.config.ts
```
