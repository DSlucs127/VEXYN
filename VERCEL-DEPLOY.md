# 🚀 VEXYN - Deploy no Vercel

## 📋 Pré-requisitos

1. **Conta no Vercel** (gratuita): https://vercel.com
2. **GitHub/GitLab** para conectar o repositório
3. **Projeto Supabase** configurado

## 🔧 Configuração do Banco (Supabase)

### 1. Obter senha do banco
1. Acesse: https://supabase.com/dashboard/project/rwsgtbacfaaxsahyucsk/settings/database
2. Copie a senha em "Database password"
3. **IMPORTANTE:** Anote esta senha!

### 2. Configurar variáveis de ambiente no Vercel
Após conectar o repositório no Vercel, adicione estas variáveis:

```
DATABASE_URL=postgresql://postgres:[SUA_SENHA_AQUI]@db.rwsgtbacfaaxsahyucsk.supabase.co:5432/postgres
JWT_SECRET=super-secret-jwt-key-change-in-production-2026-vexyn-saas
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://rwsgtbacfaaxsahyucsk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3c2d0YmFjZmFheHNhaHl1Y3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTYxNTksImV4cCI6MjA5MzYzMjE1OX0.Wr_kGuX9iBmeoeIR_t55T9n6DKJ5abbZBuvhA0zzjpo
```

## 📦 Deploy Passo a Passo

### 1. Preparar o projeto
```bash
# No diretório do projeto VEXYN
git add .
git commit -m "feat: prepare for production deployment"
git push origin main
```

### 2. Conectar no Vercel
1. Acesse https://vercel.com
2. Clique "New Project"
3. Conecte seu repositório GitHub/GitLab
4. Selecione o repositório `VEXYN`

### 3. Configurar build settings
- **Framework Preset:** Next.js
- **Root Directory:** `./` (deixe vazio)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### 4. Adicionar Environment Variables
Cole todas as variáveis do passo 2 acima.

### 5. Deploy
1. Clique "Deploy"
2. Aguarde ~2-3 minutos
3. **Seu site estará online!** 🎉

## 🔧 Pós-deploy

### Executar migrações do banco
Após o primeiro deploy, execute no terminal local:

```bash
# Configurar DATABASE_URL localmente primeiro
npx prisma db push --preview-feature

# Aplicar schema
npx prisma db push

# Popular dados iniciais
npx prisma db seed
```

### Verificar deploy
1. Acesse a URL gerada pelo Vercel
2. Teste o login: `admin@vexyn.app` / `Vexyn@123`

## 🚨 Troubleshooting

### Build falha
- Verifique se todas as env vars estão corretas
- Certifique-se que `DATABASE_URL` tem a senha certa

### Erro de banco
- Execute as migrações manualmente
- Verifique se o Supabase permite conexões externas

### App não carrega
- Verifique logs no Vercel dashboard
- Confirme se `NEXTAUTH_URL` está correto

## 🎯 Funcionalidades do Deploy

✅ **Landing page** responsiva
✅ **Sistema de autenticação** JWT
✅ **Dashboard do usuário**
✅ **Painel administrativo**
✅ **Marketplace de apps**
✅ **App financeiro** completo
✅ **Tema claro/escuro**
✅ **Banco PostgreSQL** na nuvem

## 💡 Próximos passos

- Configurar domínio customizado
- Adicionar analytics
- Otimizar performance
- Configurar backups automáticos