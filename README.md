# +PraClinic — Frontend

React + TypeScript + Vite. Contrato de referência: backend `develop` em
`5e2f9422426a8b6adcfa69d1254ddcf29a55c19f`, base `/api`.

## Estado desta rodada

Integrados: login, identidade autenticada (`/auth/me`), restauração de sessão,
logout, rotas/menus por perfil, CRUD de Especialidades, Usuários e Profissionais,
além de criação, atualização, listagem e detalhes cadastrais de Pacientes.

Schedule, Agenda, Consultas, Prontuários e Dashboard ainda usam demonstrações
locais. Seus dados não representam o backend. As abas clínicas nos detalhes do
paciente preservam sua estrutura, com indicação de indisponibilidade e sem
associar histórico fictício ao paciente real.
Agenda e Consultas são duas visualizações do mesmo recurso Appointment.
O catálogo DesignSystem permanece no código, sem rota funcional. Settings não é
um módulo disponível.

A fundação foi homologada em Chrome real com backend/PostgreSQL isolados:
[resultados e limites da homologação](docs/HOMOLOGACAO_BROWSER.md).
O Bloco 2 tem contratos, permissões, gates e limitações registrados em
[Integração dos cadastros](docs/INTEGRACAO_CADASTROS.md).

## Executar

Na raiz deste repositório, instalar as dependências do `bun.lock`:

```text
bun install --frozen-lockfile
```

Se Bun não estiver no PATH, pode-se executar o binário do pacote oficial sem mudar
o lockfile: `npm exec --yes --package=bun -- bun install --frozen-lockfile`.
O `package-lock.json` local preexistente não é o lockfile oficial desta branch.

Copiar `.env.example` para `.env.local` e configurar:

```text
VITE_API_URL=http://localhost:8080/api
```

Variáveis VITE são públicas no bundle. Não incluir credenciais ou secrets.
Reiniciar Vite depois de alterar a configuração. A URL é definida no build.
A aplicação informa um erro de configuração se VITE_API_URL estiver ausente.

No ambiente do backend, configurar:

```text
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Essa variável pertence ao ambiente backend, não ao arquivo de código do servidor.
Não usar wildcard.

```text
npm run dev
```

Origem: `http://localhost:3000`. strictPort mantém a porta previsível: se ocupada,
o servidor falha em vez de escolher silenciosamente outra origem.
No PowerShell que bloqueia npm.ps1, usar `npm.cmd` nos mesmos comandos.

## Sessão e permissões

Login envia email/password, armazena apenas o accessToken em localStorage
(`auth_token`) e consulta `/auth/me`. O usuário administrativo e a identidade
AuthenticatedUser são contratos separados. Nenhuma senha é persistida.

Reload valida o token pelo backend. 401 fora do login limpa token, identidade e
estados dependentes e redireciona ao login. 403 preserva a sessão. Falha de rede
na restauração oferece nova tentativa; logout limpa o token. A validação de
expiração ocorre no backend, sem confiar em decodificação local do JWT.
Não existe refresh token ou endpoint de logout no contrato atual.

Perfis: ADMIN, RECEPTIONIST, PROFESSIONAL. A mesma matriz controla menu e acesso
direto às rotas. A UI não substitui autorização/ownership do backend.

Especialidades permite leitura para todos os perfis; escrita somente para ADMIN.
Usuários permite CRUD somente para ADMIN. Profissionais permite CRUD para ADMIN
e leitura para RECEPTIONIST. Pacientes permite leitura, criação e atualização
para ADMIN/RECEPTIONIST; não oferece exclusão. PROFESSIONAL não acessa esses
três cadastros globais. E-mail de User e CPF de Patient são somente leitura na
edição. A criação de Professional inclui sua conta de perfil PROFESSIONAL;
a edição do cadastro profissional não altera credenciais.
Listagens retornam arrays; filtro é local. Descrição/created podem ser nulos.
Sucessos de mutação aparecem somente após a resposta da API. Falhas mantêm o
formulário e disponibilizam message/details.

## Verificar

```text
npm run lint
npm run build
npm run smoke
```

`lint` é TypeScript (`tsc --noEmit`), não ESLint.
O smoke usa Node, assert e esbuild já disponível no projeto, sem framework novo.
Ele sobe um servidor HTTP descartável em loopback e verifica cliente/services,
Bearer, contratos, CRUD, permissões da matriz, erros, cancelamento e isolamento
entre sessões. Não usa backend, banco ou credenciais reais e não substitui
validação em navegador com a API Spring Boot.

O aviso de chunk acima de 500 kB continua conhecido; otimização de carregamento
fica para uma fase posterior.
