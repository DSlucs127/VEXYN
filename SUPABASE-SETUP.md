# Guia Rápido: Configurar Supabase para VEXYN

## 📋 Passos para configurar:

### 1. Criar conta no Supabase
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Crie conta gratuita (GitHub/Google/Email)
4. Verifique seu email

### 2. Criar novo projeto
1. Clique em "New project"
2. Preencha:
   - **Name:** vexyn-dev (ou qualquer nome)
   - **Database Password:** Escolha uma senha forte
   - **Region:** São Paulo (ou mais próxima)
3. Clique em "Create new project"

### 3. Aguardar configuração
- Aguarde ~2 minutos até o projeto ficar pronto
- Você verá uma tela de boas-vindas

### 4. Obter connection string
1. No menu lateral esquerdo, clique em **Settings**
2. Clique em **Database**
3. Role para baixo até **Connection string**
4. Clique na aba **URI**
5. **COPIE** toda a string que começa com `postgresql://`

### 5. Configurar no VEXYN
1. Abra o arquivo `.env` no projeto VEXYN
2. Substitua a linha `DATABASE_URL` pela string copiada:
   ```env
   DATABASE_URL="postgresql://postgres:[SENHA]@db.[PROJETO-ID].supabase.co:5432/postgres"
   ```
3. Salve o arquivo

### 6. Executar setup
Agora execute no terminal:
```bash
npx prisma db push
npx prisma db seed
npm run dev
```

## ✅ Verificar se funcionou

1. Acesse: http://localhost:3000
2. Clique em "Entrar"
3. Use as credenciais:
   - Email: `admin@vexyn.app`
   - Senha: `Vexyn@123`

## 🆘 Problemas comuns

### "FATAL: password authentication failed"
- Verifique se a senha no DATABASE_URL está correta
- Certifique-se de que copiou a URI completa do Supabase

### "Connection refused" ou "timeout"
- Aguarde alguns minutos após criar o projeto
- Verifique se o projeto está ativo no Supabase
- Teste a conexão: `npx prisma db push`

### "Database does not exist"
- Certifique-se de que está usando a URI correta (não a pooled connection)
- Verifique se o projeto Supabase está ativo

## 🔧 Comandos úteis

```bash
# Testar conexão
npx prisma db push --preview-feature

# Ver dados
npx prisma studio

# Resetar dados
npx prisma db seed
```

## 💡 Dicas

- **Custo:** Supabase oferece 500MB gratuito + 50MB de arquivos
- **Backup:** Dados são automaticamente backupados
- **Performance:** Bom para desenvolvimento e pequenos projetos
- **Produção:** Considere upgrade para projetos maiores

---

**Pronto!** Agora você tem um banco PostgreSQL na nuvem funcionando. 🎉