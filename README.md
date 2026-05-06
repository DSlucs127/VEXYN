# VEXYN SaaS Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/[SEU_USERNAME]/vexyn-saas)

Portal SaaS modular completo com login, registro, marketplace de aplicações e administração. Construído com Next.js 14, TypeScript, Prisma e PostgreSQL.

## ✨ Funcionalidades

- 🔐 **Sistema de Autenticação** - JWT com cookies HTTP-only
- 👥 **Controle de Usuários** - Roles (USER/ADMIN) e personificação
- 🛒 **Marketplace** - Apps desbloqueáveis por assinatura
- 💰 **App Financeiro** - Controle completo de receitas/despesas/dívidas
- 🎨 **Interface Moderna** - Tema claro/escuro, responsivo
- 📊 **Dashboard** - Visão geral e navegação lateral
- ⚙️ **Painel Admin** - Gerenciamento completo de usuários
- 🚀 **Deploy Pronto** - Configurado para Vercel

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Banco:** PostgreSQL (Supabase/Neon)
- **Autenticação:** JWT + Cookies
- **Estado:** SWR (React Query)
- **UI:** React Icons, Custom Components
- **Deploy:** Vercel (configurado)

## 🚀 Como iniciar

### 🔥 Opção 1: Setup Rápido (Recomendado - Windows)
1. Execute o script simples:
   ```bash
   setup-simple.bat
   ```

Este script irá:
- ✅ Verificar se Node.js está instalado
- 📦 Instalar todas as dependências
- 🔧 Configurar Prisma
- 🗄️ **AGUARDAR** você configurar o banco na nuvem
- 🌱 Popular dados iniciais
- 🚀 Iniciar o servidor

**Banco gratuito:** Veja o guia completo em `SUPABASE-SETUP.md`

### Opção 2: Script Completo (com Docker)
```bash
start-project.bat
```
*Requer Docker Desktop instalado*

### Opção 3: Configuração Manual

#### Com Docker:
```bash
npm install
docker compose up -d
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

#### Sem Docker (Banco na Nuvem):
```bash
npm install
npx prisma generate

# Configure DATABASE_URL no .env primeiro!
npx prisma db push
npx prisma db seed
npm run dev
```

Este script irá automaticamente:
- ✅ Verificar se Docker está instalado
- 📦 Instalar todas as dependências
- 🐳 Iniciar o banco de dados PostgreSQL via Docker
- 🔧 Configurar o Prisma (gerar cliente, aplicar schema, popular dados)
- 🚀 Iniciar o servidor de desenvolvimento

### Opção 2: Configuração Manual

#### Com Docker (Linux/Mac/Windows):
```bash
npm install
docker compose up -d
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

#### Sem Docker (Banco PostgreSQL Local/Nuvem):
1. **Instale PostgreSQL** no seu sistema ou use um serviço na nuvem
2. **Configure o `.env`** com sua conexão:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/vexyn
   # ou para nuvem: postgresql://usuario:senha@host:porta/database
   ```
3. **Execute os comandos:**
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   npm run dev
   ```

### Opção 3: PostgreSQL na Nuvem (Recomendado para desenvolvimento)
- **Supabase:** https://supabase.com (gratuito)
- **Neon:** https://neon.tech (gratuito)
- **ElephantSQL:** https://www.elephantsql.com (gratuito)
- **Railway:** https://railway.app (créditos gratuitos)

Após configurar, copie a connection string para o `.env`.

## 🔐 Admin inicial

- **Email:** `admin@vexyn.app`
- **Senha:** `Vexyn@123`

## 📁 Estrutura do Projeto

- `src/app` - Páginas Next.js (App Router)
- `src/app/api` - Rotas de API (auth, marketplace, admin, finance)
- `src/components` - Componentes reutilizáveis (Toast, Modal, Sidebar, etc.)
- `src/features` - Funcionalidades específicas (finance, admin, marketplace)
- `src/hooks` - Hooks customizados (useForm, useApi)
- `src/lib` - Utilitários (auth, prisma, types)
- `prisma/` - Schema e seeds do banco de dados
- `docker-compose.yml` - Configuração PostgreSQL para desenvolvimento

## 🎯 Funcionalidades

### ✅ Implementadas
- Sistema de autenticação JWT
- Dashboard do usuário
- Painel administrativo com personificação
- Marketplace de apps por assinatura
- App financeiro completo (transações, categorias, recorrência)
- Tema claro/escuro
- Interface responsiva

### 🔄 Melhorias Recentes
- Sistema de notificações Toast
- Modal reutilizável
- Loading states animados
- Hook useForm para validação
- Hook useApi para chamadas HTTP
- Navegação por abas no app financeiro

## 🛠️ Tecnologias

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Banco:** PostgreSQL com Prisma ORM
- **Autenticação:** JWT com cookies HTTP-only
- **Estado:** SWR para cache e sincronização
- **Icons:** React Icons (MD, IO5, RI)
- **Container:** Docker Compose

## 🐘 Configuração do Banco de Dados

O projeto usa PostgreSQL com as seguintes tabelas principais:
- `User` - Usuários do sistema
- `AppFeature` - Apps disponíveis no marketplace
- `Subscription` - Assinaturas de apps
- `Transaction` - Transações financeiras

### Problemas Comuns e Soluções

#### ❌ "docker não é reconhecido como um comando"
**Solução:** Instale o Docker Desktop
1. Baixe em: https://www.docker.com/products/docker-desktop
2. Instale e reinicie o computador
3. Execute o script novamente

#### ❌ "Falha ao aplicar esquema do banco"
**Possíveis causas:**
- Banco não iniciou completamente (aguarde mais tempo)
- Porta 5432 ocupada por outro programa
- Problemas de conexão

**Soluções:**
```bash
# Parar e reiniciar o banco
docker compose down
docker compose up -d

# Verificar se está rodando
docker ps

# Logs do banco
docker compose logs db
```

#### ❌ "Erro de conexão com o banco"
**Para desenvolvimento sem Docker:**
1. Instale PostgreSQL localmente ou use nuvem
2. Atualize o `DATABASE_URL` no `.env`:
   ```env
   # Exemplo local
   DATABASE_URL=postgresql://postgres:senha@localhost:5432/vexyn

   # Exemplo Supabase
   DATABASE_URL=postgresql://usuario:senha@db.xxx.supabase.co:5432/postgres
   ```

#### 🔧 Resetar banco de dados
```bash
# Parar containers
docker compose down

# Remover volumes (perde todos os dados)
docker compose down -v

# Reiniciar do zero
docker compose up -d
npx prisma db push
npx prisma db seed
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Verificação ESLint
```

## 📝 Notas de Desenvolvimento

- O projeto usa TypeScript strict mode
- Todas as senhas são hasheadas com bcrypt
- Sessões JWT expiram em 7 dias
- O banco de desenvolvimento roda em container Docker
- Componentes seguem padrão de design system customizado
