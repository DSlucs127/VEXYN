@echo off
echo ========================================
echo    VEXYN - Inicializando Projeto
echo ========================================
echo.

echo Verificando dependencias do sistema...
echo.

REM Verificar se Docker esta instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: Docker nao esta instalado ou nao esta no PATH
    echo.
    echo 📋 SOLUCOES DISPONIVEIS:
    echo.
    echo [1] Instalar Docker Desktop (recomendado)
    echo    Download: https://www.docker.com/products/docker-desktop
    echo.
    echo [2] Usar PostgreSQL sem Docker
    echo    Guia: CONFIGURACAO-SEM-DOCKER.md
    echo.
    echo [3] Usar servico na nuvem (Supabase, Neon, etc.)
    echo    Guia: README.md#configuracao-do-banco-de-dados
    echo.
    echo 🔄 O que voce gostaria de fazer?
    echo.
    echo Aperte qualquer tecla para ver opcoes avancadas...
    pause > nul
    goto :show_options
)

goto :docker_ok

:show_options
cls
echo ========================================
echo    VEXYN - Opcoes de Configuracao
echo ========================================
echo.
echo Escolha uma opcao:
echo.
echo [1] Abrir guia de instalacao do Docker
echo [2] Abrir guia sem Docker (PostgreSQL local)
echo [3] Abrir guia de servicos na nuvem
echo [4] Continuar tentando com Docker
echo [5] Sair
echo.
set /p choice="Digite sua escolha (1-5): "

if "%choice%"=="1" (
    start https://www.docker.com/products/docker-desktop
    echo.
    echo 📋 Apos instalar o Docker, execute este script novamente.
    pause
    exit /b 0
)
if "%choice%"=="2" (
    start CONFIGURACAO-SEM-DOCKER.md
    echo.
    echo 📋 Leia o guia aberto e siga as instrucoes.
    pause
    exit /b 0
)
if "%choice%"=="3" (
    start README.md
    echo.
    echo 📋 Leia a secao "Configuracao do Banco de Dados" no README.
    pause
    exit /b 0
)
if "%choice%"=="4" (
    echo 🔄 Tentando novamente com Docker...
    goto :docker_check_retry
)
if "%choice%"=="5" (
    echo 👋 Ate logo!
    exit /b 0
)

echo ❌ Opcao invalida. Tente novamente.
goto :show_options

:docker_check_retry
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker ainda nao esta disponivel.
    goto :show_options
)

:docker_ok

echo ✅ Docker encontrado!
echo.

echo Passo 1: Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas!
echo.

echo Passo 2: Iniciando banco de dados...
call docker compose up -d
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao iniciar banco de dados
    echo.
    echo 💡 Dicas para resolver:
    echo - Verifique se o Docker Desktop esta executando
    echo - Feche outros programas que possam usar a porta 5432
    echo - Execute: docker compose down ^&^& docker compose up -d
    echo.
    pause
    exit /b 1
)
echo ✅ Banco de dados iniciado!
echo Aguardando banco ficar pronto...
timeout /t 8 /nobreak > nul
echo.

echo Passo 3: Gerando cliente Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao gerar cliente Prisma
    pause
    exit /b 1
)
echo ✅ Cliente Prisma gerado!
echo.

echo Passo 4: Aplicando esquema do banco...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao aplicar esquema do banco
    echo.
    echo 💡 Verifique se o banco esta rodando e acessivel
    pause
    exit /b 1
)
echo ✅ Schema aplicado!
echo.

echo Passo 5: Populando banco com dados iniciais...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao popular banco de dados
    pause
    exit /b 1
)
echo ✅ Banco populado com dados iniciais!
echo.

echo ========================================
echo     🎉 PROJETO PRONTO PARA DESENVOLVIMENTO!
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
echo Pressione qualquer tecla para iniciar o servidor...
pause > nul

echo.
echo ========================================
echo    Iniciando servidor de desenvolvimento...
echo ========================================
echo.
call npm run dev