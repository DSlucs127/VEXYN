# VEXYN - Configuração sem Docker

Este guia mostra como configurar o VEXYN sem usar Docker, usando PostgreSQL local ou na nuvem.

## Opção 1: PostgreSQL Local (Windows)

### 1. Instalar PostgreSQL
1. Baixe o instalador: https://www.postgresql.org/download/windows/
2. Execute o instalador como administrador
3. Durante a instalação:
   - Senha: `postgres` (ou escolha outra)
   - Porta: `5432` (padrão)
4. Anote a senha escolhida

### 2. Criar banco de dados
1. Abra pgAdmin (instalado com PostgreSQL)
2. Conecte ao servidor (senha definida na instalação)
3. Clique direito em "Databases" → "Create" → "Database"
4. Nome: `vexyn`
5. Owner: `postgres`

### 3. Configurar ambiente
```bash
# Copie o arquivo de exemplo
copy .env.example .env

# Edite o .env com sua senha
# DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/vexyn
```

### 4. Executar setup
```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

## Opção 2: PostgreSQL na Nuvem (Recomendado)

### Supabase (Gratuito)
1. Acesse: https://supabase.com
2. Crie conta gratuita
3. Crie novo projeto
4. Vá em Settings → Database → Connection string
5. Copie a URI e atualize o `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:[SENHA]@db.[PROJETO].supabase.co:5432/postgres
   ```

### Neon (Gratuito)
1. Acesse: https://neon.tech
2. Crie conta gratuita
3. Crie novo projeto
4. Copie a connection string e atualize o `.env`

### Railway (Créditos gratuitos)
1. Acesse: https://railway.app
2. Crie conta (recebe $5 em créditos)
3. Crie novo projeto PostgreSQL
4. Copie a DATABASE_URL das variáveis de ambiente

## Após configurar o banco

Execute estes comandos em ordem:

```bash
# 1. Instalar dependências
npm install

# 2. Gerar cliente Prisma
npx prisma generate

# 3. Aplicar schema no banco
npx prisma db push

# 4. Popular com dados iniciais
npx prisma db seed

# 5. Iniciar servidor
npm run dev
```

## Verificar se funcionou

1. Acesse: http://localhost:3000
2. Clique em "Entrar"
3. Use as credenciais:
   - Email: admin@vexyn.app
   - Senha: Vexyn@123

## Problemas comuns

### "FATAL: password authentication failed"
- Verifique a senha no DATABASE_URL
- Certifique-se que o usuário existe no PostgreSQL

### "Connection refused"
- Verifique se PostgreSQL está rodando
- Confirme a porta (5432)
- Para PostgreSQL local, verifique o serviço no Gerenciador de Tarefas

### "Database does not exist"
- Crie o banco manualmente ou use `npx prisma db push` (ele cria automaticamente)

## Comandos úteis

```bash
# Ver status do banco
npx prisma db push --preview-feature

# Resetar dados
npx prisma db seed

# Abrir Prisma Studio (interface gráfica)
npx prisma studio

# Ver logs do banco (se usar Docker)
docker compose logs db
```