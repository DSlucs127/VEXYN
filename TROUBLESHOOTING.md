# 🔧 Troubleshooting: Conexão com Supabase

## ❌ Problema: "Can't reach database server"

Se você está recebendo este erro ao executar `npx prisma db push`, aqui estão as soluções:

### 1. Verificar senha do banco
A senha deve estar correta no arquivo `.env`. Você forneceu: `mwFYo3LPgZjsEliI`

### 2. Verificar connection string
Certifique-se que o `.env` contém:
```env
DATABASE_URL="postgresql://postgres:mwFYo3LPgZjsEliI@db.jwvntcabjlvkpvvmumec.supabase.co:5432/postgres"
```

### 3. Verificar restrições de IP no Supabase
1. Acesse https://supabase.com/dashboard/project/jwvntcabjlvkpvvmumec/settings/database
2. Vá para "Network restrictions"
3. Certifique-se que "Allow all IPv4 addresses" está habilitado
4. Ou adicione seu IP atual à lista de permitidos

### 4. Verificar status do projeto
O projeto deve estar "ACTIVE_HEALTHY". Você pode verificar isso em:
https://supabase.com/dashboard/project/jwvntcabjlvkpvvmumec

### 5. Testar conexão manualmente
```bash
# Instalar psql se não tiver
# Windows: https://www.postgresql.org/download/windows/

# Testar conexão
psql "postgresql://postgres:mwFYo3LPgZjsEliI@db.jwvntcabjlvkpvvmumec.supabase.co:5432/postgres" -c "SELECT version();"
```

### 6. Resetar senha do banco (se necessário)
1. No dashboard do Supabase
2. Settings → Database → Reset database password
3. Atualizar o `.env` com a nova senha

### 7. Verificar se há VPN/Firewall bloqueando
Desative temporariamente VPN ou firewall para testar.

## ✅ Como testar se funcionou

Execute estes comandos em ordem:

```bash
# 1. Testar conexão
npx prisma db push --preview-feature

# 2. Aplicar schema
npx prisma db push

# 3. Popular dados
npx prisma db seed

# 4. Iniciar servidor
npm run dev
```

## 🚨 Se ainda não funcionar

1. **Crie um novo projeto Supabase** com uma senha mais simples
2. **Use Neon.tech** (mais permissivo): https://neon.tech
3. **Use Railway** (créditos gratuitos): https://railway.app

## 📞 Suporte

Se nada funcionar, abra um issue no GitHub com:
- Logs completos do erro
- Seu IP atual
- Print do dashboard do Supabase