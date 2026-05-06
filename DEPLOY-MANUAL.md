# 📦 Deploy Manual do VEXYN no Vercel

Como não conseguimos executar o script bash no Windows, vamos fazer o deploy manualmente.

## 🚀 Passos para Deploy Manual

### 1. Preparar arquivos estáticos
```bash
# Criar build de produção
npm run build

# Verificar se .next foi criado
dir .next
```

### 2. Fazer upload para Vercel
1. Acesse https://vercel.com
2. Clique "New Project"
3. **Import Git Repository** (recomendado)
4. Conecte seu repositório GitHub/GitLab
5. Configure as variáveis de ambiente

### 3. Ou usar Vercel CLI (se instalado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configurar variáveis
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NEXTAUTH_URL
```

## 📋 Variáveis de Ambiente Necessárias

No Vercel Dashboard → Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres:[SUA_SENHA]@db.rwsgtbacfaaxsahyucsk.supabase.co:5432/postgres
JWT_SECRET=super-secret-jwt-key-change-in-production-2026-vexyn-saas
NEXTAUTH_URL=https://[SEU_DOMINIO].vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://rwsgtbacfaaxsahyucsk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3c2d0YmFjZmFheHNhaHl1Y3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTYxNTksImV4cCI6MjA5MzYzMjE1OX0.Wr_kGuX9iBmeoeIR_t55T9n6DKJ5abbZBuvhA0zzjpo
```

## 🔧 Pós-deploy Configuration

Após o deploy, você precisará:

1. **Executar migrações do banco:**
```bash
# Localmente, com DATABASE_URL configurada
npx prisma db push
npx prisma db seed
```

2. **Configurar rede no Supabase:**
   - Acesse https://supabase.com/dashboard/project/rwsgtbacfaaxsahyucsk/settings/database
   - Em "Network restrictions", adicione o IP do Vercel ou permita todos

## ✅ Verificação Final

- ✅ Site online no Vercel
- ✅ Login funcionando: admin@vexyn.app / Vexyn@123
- ✅ Dashboard acessível
- ✅ Marketplace funcionando
- ✅ App financeiro disponível

## 🎯 URLs Importantes

- **Supabase Dashboard:** https://supabase.com/dashboard/project/rwsgtbacfaaxsahyucsk
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Site Produção:** [Será gerado pelo Vercel]

---

**🎉 Parabéns! Seu SaaS VEXYN está pronto para produção!**