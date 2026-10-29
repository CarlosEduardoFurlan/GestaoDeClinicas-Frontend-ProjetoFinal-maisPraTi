# Homologação real em navegador — 26/10/2026

Este relatório complementa e supera a pendência de navegador registrada em
HOMOLOGACAO_FUNDACAO.md. Nenhum módulo adicional foi integrado.

## Estado inicial

Feature: feature/integracao-frontend-backend em 7de067d, com os cinco commits
264525f, f586479, 89a2644, 127b12e e 477a6da preservados. Aplicação na raiz.
Working tree inicialmente sem mudanças rastreadas; package-lock.json local não
rastreado permaneceu intocado. Fetch confirmou develop em 7615cb8.

## Browser utilizado

Google Chrome instalado localmente, engine real 156.0.8078.48, modo headless,
controlado por Playwright instalado exclusivamente em pasta temporária.
Perfil de browser separado, sem utilizar dados pessoais/sessões do Chrome do usuário.
A ferramenta de computador continuou indisponível; foi aplicado o fallback
explicitamente autorizado nesta rodada. Não houve instalação permanente de testes.

## Ambiente

- PostgreSQL 18.3 exclusivo, banco vazio homologacao em 127.0.0.1:55432, SCRAM.
- Spring Boot em localhost:8080; baseline develop 5e2f9422426a8b6adcfa69d1254ddcf29a55c19f.
- Flyway V1-V15 e JPA ddl-auto=validate confirmados.
- Runtime JDK 26 já instalado; código/migrations backend preservados.
- Vite em localhost:3000, strictPort, VITE_API_URL=http://localhost:8080/api.
- CORS do processo: APP_CORS_ALLOWED_ORIGINS=http://localhost:3000.
- Contas fictícias ADMIN, RECEPTIONIST e PROFESSIONAL, senhas e JWT secret aleatórios.
- PROFESSIONAL com vínculo real User -> Professional persistido no banco exclusivo.
- Nenhuma credencial, hash, token ou arquivo de credenciais foi versionado.

## Instalação e gates

Instalação congelada via pacote oficial temporário de Bun 1.4.4:
`npm exec --yes --package=bun -- bun install --frozen-lockfile --ignore-scripts`.
O lockfile oficial bun.lock não mudou; package.json também não foi alterado.
`npm run lint` passou (tsc --noEmit, não ESLint).
`npm run build` passou com Vite 6.4.3; permanece aviso conhecido de chunk >500 kB.

## Resultados observados no Chrome

| Teste | Resultado |
| --- | --- |
| Login ADMIN | PASSOU: POST real, /me e nome/perfil reais no Navbar |
| Login RECEPTIONIST | PASSOU: identidade real e perfil Recepção |
| Login PROFESSIONAL | PASSOU: identidade real e professionalId correto |
| Login inválido | PASSOU: senha incorreta gera 401 com erro visível, sem autenticar |
| E-mail inválido | PASSOU: validação nativa do formulário bloqueia envio |
| Cadastro público | PASSOU: ausente; nenhum PATIENT/DOCTOR/MEDICO no login |
| Reload ADMIN | PASSOU: token preservado, nova chamada /me, identidade restaurada |
| Logout | PASSOU: remove token e identidade, redireciona para /login |
| Reload após logout | PASSOU: permanece deslogado |
| Rota sem sessão | PASSOU: /specialties direciona para /login |
| URL /users ADMIN | PASSOU: acesso administrativo permitido |
| URL /users RECEPTIONIST | PASSOU: acesso negado sem logout |
| URLs PROFESSIONAL | PASSOU: /users, /professionals e /patients negados sem logout |
| Menus por perfil | PASSOU: itens globais/proibidos não aparecem |
| Specialties ADMIN | PASSOU: GET, criação, edição e exclusão pela UI, persistência real |
| UUID | PASSOU: resposta POST traz UUID; consulta real confirma o mesmo registro |
| Description null | PASSOU: exibida como travessão, sem exception |
| Loading | PASSOU: mensagem visível durante espera controlada de envio de GET real |
| Empty state | PASSOU: filtro sem resultado apresenta mensagem própria |
| Submit pending | PASSOU: botão desabilitado, formulário aberto, apenas um POST |
| Sucesso | PASSOU: sem toast/fechamento antes do retorno; lista muda depois da confirmação |
| Specialties RECEPTIONIST | PASSOU: leitura real, sem Novo/Editar/Excluir |
| Specialties PROFESSIONAL | PASSOU: leitura real, sem Novo/Editar/Excluir |
| 400 na UI | PASSOU: nome duplicado, erro do backend, formulário aberto, sem falso sucesso |
| 409 na UI | PASSOU: FK real, mensagem controlada, linha e sessão preservadas |
| 401 na UI | PASSOU: token inválido removido, identidade limpa e redirect para login |
| JWT expirado | PASSOU: JWT com assinatura válida e exp passado gera 401; UI limpa token |
| 403 real no cliente | PASSOU: Axios da aplicação recebe 403 em /users, preserva token; rota permitida continua funcionando |
| Multi-tab logout | PASSOU: sair em A remove a sessão de B |
| Multi-tab login | PASSOU: login/novo login em A revalidam identidade em B |
| Console | PASSOU: zero pageerrors, sem Promise/Axios não tratado ou warnings críticos |
| Network | PASSOU: métodos/caminhos reais e Bearer nas rotas autenticadas |
| CORS | PASSOU: origem 3000 permitida; origem 3001 rejeitada |

O atraso usado para observar loading e pending apenas segurou o envio no browser;
todas as requisições foram continuadas para o Spring real. Não houve resposta
mockada, substituição de payload ou simulação do backend. O 403 foi exercitado
no Axios real da aplicação pelo contexto do browser, além das negativas visuais
dos guards. O token expirado foi assinado somente em memória, sem modificar TTL.

## Evidências e console

Screenshots temporários de Login, ADMIN, leitura dos dois perfis, acesso negado,
400 e 409 foram capturados fora do repositório. Foram inspecionadas imagens reais
da interface; não foram incluídas automaticamente no Git. Logs e relatório
registram apenas métodos, caminhos, status e presença de Bearer, nunca seu valor.
Mensagens nativas de recurso HTTP 400/401/403/404/409 são esperadas nos testes
negativos; não constituem exception não tratada da aplicação.

## Correções e escopo

Nenhuma regressão funcional da fundação foi encontrada; não houve correção
especulativa. Mudanças desta execução são documentação das evidências.
Professionals, Users, Patients, Schedule, Appointments, MedicalRecords e Dashboard
continuam fora da integração funcional desta rodada e mantêm seus mocks.
O acesso ADMIN à página Users foi somente teste de guarda, sem integrar o módulo.
O cadastro de Professional foi somente provisionamento da conta de homologação.

## Publicação e CI

Todos os requisitos de homologação em browser foram aprovados antes da publicação.
A PR deve apontar de feature/integracao-frontend-backend para develop, preservando
a organização na raiz. O workflow existente faz deploy para main ou execução
manual; não há workflow de PR configurado. A ausência de checks não deve ser
descrita como uma CI verde. Identificador da PR e resultado do merge são registrados
na descrição da PR e no relatório final da execução.

## Pós-merge e limpeza

Após merge, repetir lint, build e smoke de login/reload/logout/Specialties GET
no mesmo Chrome real e com nova instância PostgreSQL exclusiva.
Cada rodada encerra Chrome, frontend, API e PostgreSQL e remove seu próprio cluster.
Ferramentas/screenshots temporários desta execução são removidos ao concluir.
Recursos de rodadas anteriores, banco pessoal e instância PostgreSQL preexistente
não são removidos. Arquivos temporários de homologação não são dependências do projeto.
