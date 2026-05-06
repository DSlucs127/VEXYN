@echo off
echo ========================================
echo    VEXYN - Setup Simples (Sem Docker)
echo ========================================
echo.

echo 🔧 Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: Node.js nao esta instalado
    echo.
    echo 📋 Baixe em: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado
echo.

echo 📦 Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

echo 🔧 Gerando cliente Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao gerar cliente Prisma
    pause
    exit /b 1
)
echo ✅ Cliente Prisma gerado
echo.

echo ⚠️  IMPORTANTE: Configure o banco de dados
echo.
echo Antes de continuar, voce precisa:
echo 1. Criar uma conta gratuita no Supabase: https://supabase.com
echo 2. Criar um novo projeto
echo 3. Ir em Settings → Database → Connection string
echo 4. Copiar a URI e colar no arquivo .env (DATABASE_URL)
echo.
echo Ou use outro servico como Neon: https://neon.tech
echo.
pause

echo 🔄 Aplicando schema no banco...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao aplicar schema no banco
    echo.
    echo 💡 Verifique se:
    echo - A DATABASE_URL no .env esta correta
    echo - O banco esta acessivel
    echo - As credenciais estao certas
    echo.
    pause
    exit /b 1
)
echo ✅ Schema aplicado no banco
echo.

echo 🌱 Populando banco com dados iniciais...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao popular banco
    echo.
    echo 💡 Verifique a conexao com o banco
    pause
    exit /b 1
)
echo ✅ Banco populado com dados iniciais
echo.

echo ========================================
echo     🎉 SETUP CONCLUIDO!
echo ========================================
echo.
echo 🚀 Para iniciar o servidor:
echo npm run dev
echo.
echo 🌐 Acesse em: http://localhost:3000
echo.
echo 👤 Conta admin inicial:
echo Email: admin@vexyn.app
echo Senha: Vexyn@123
echo.
echo Pressione qualquer tecla para iniciar...
pause > nul

echo.
echo ========================================
echo    Iniciando servidor de desenvolvimento...
echo ========================================
echo.
call npm run dev