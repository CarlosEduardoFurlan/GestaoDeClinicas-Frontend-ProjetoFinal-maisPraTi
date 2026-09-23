# Praclinic — Frontend

Frontend profissional, moderno e escalável do sistema de gestão clínica e médica **Praclinic**, desenvolvido com **React**, **TypeScript**, **Vite** e um **Design System proprietário**. A aplicação foi projetada e implementada com rigorosos padrões de engenharia de software (SOLID, Clean Architecture, componentização atômica e tipagem estrita), preparada para consumir a API REST versionada em `/api/v1`.

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura de Pastas](#-arquitetura-de-pastas)
- [Design System & UI Tokens](#-design-system--ui-tokens)
- [Módulos & Funcionalidades](#-módulos--funcionalidades)
- [Camada HTTP & Tratamento de Erros](#-camada-http--tratamento-de-erros)
- [Como Executar](#-como-executar)
- [Padrões de Qualidade & Boas Práticas](#-padrões-de-qualidade--boas-práticas)

---

## 🔭 Visão Geral

O **Praclinic** é uma plataforma completa de gestão em saúde concebida para clínicas, consultórios e centros médicos. O frontend foi construído com foco em:
- **Design System próprio**: sem dependência de bibliotecas de componentes externas pesadas (sem Material UI, Ant Design ou Bootstrap), garantindo controle estético total e altíssima performance.
- **Experiência SaaS Médica**: interface limpa, intuitiva, acessível (WCAG AA) e totalmente responsiva (Desktop, Tablet e Mobile).
- **Separação de Camadas**: isolamento rigoroso entre UI, estado, regras de negócio e infraestrutura de comunicação HTTP.
- **Preparação para Produção**: integração pronta para backend REST (`/api/v1`), com tratamento semântico de status HTTP e feedback via notificações instantâneas (Toasts).

---

## 🛠️ Stack Tecnológica

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Roteamento**: [React Router](https://reactrouter.com/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com tokens semânticos e variáveis CSS
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Métricas & Gráficos**: [Recharts](https://recharts.org/)
- **Camada HTTP**: Fetch API / Axios encapsulado com tipagem genérica e tratamento de exceções

---

## 📂 Arquitetura de Pastas

A estrutura do projeto segue a separação por responsabilidades e domínios de negócio:

```text
src/
├── app/                  # Configurações raiz da aplicação e roteador central
│   └── router/           # Definição e mapeamento de rotas protegidas e públicas
├── components/           # Design System e componentes reutilizáveis
│   ├── ui/               # Componentes atômicos (Button, Input, Select, Badge, Card, Modal, Table...)
│   ├── layout/           # Componentes estruturais (Navbar, Sidebar, Footer, PageHeader...)
│   ├── forms/            # Componentes e controles de formulários
│   └── feedback/         # Estados de carregamento, alertas e Toast notifications
├── config/               # Constantes de ambiente e configurações globais
├── contexts/             # Provedores de contexto React (AuthContext, ToastContext)
├── layouts/              # Templates de layout (MainLayout com Sidebar/Navbar responsivos)
├── lib/                  # Utilitários de classes e helpers (cn, tailwind-merge)
├── pages/                # Telas da aplicação por domínio clínico
│   ├── Dashboard/        # Indicadores de atendimentos, métricas e gráficos clínicos
│   ├── Specialties/      # Gestão de Especialidades Médicas (CRUD e escopo clínico)
│   ├── Professionals/    # Gestão de Profissionais de Saúde & Grade de Atendimento
│   ├── Patients/         # Cadastro e acompanhamento de pacientes
│   ├── Appointments/     # Agenda e agendamento de consultas médicas
│   ├── Consultations/    # Fluxo de atendimento clínico em andamento
│   ├── MedicalRecords/   # Prontuário Eletrônico do Paciente (PEP)
│   ├── Users/            # Gestão de usuários, papéis e permissões de acesso
│   └── Login/            # Autenticação segura e controle de sessão
├── services/             # Infraestrutura e comunicação externa
│   ├── http/             # Cliente HTTP centralizado (baseURL, headers, interceptors)
│   └── api/              # Módulos de serviço por entidade (specialties, professionals, etc.)
├── styles/               # Tokens globais, tipografia e variáveis CSS
└── types/                # Interfaces e tipos estritos compartilhados em TypeScript
