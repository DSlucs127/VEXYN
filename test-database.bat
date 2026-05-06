@echo off
echo Testando conexao com Supabase...
echo.

npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao aplicar schema no banco
    pause
    exit /b 1
)

echo ✅ Schema aplicado com sucesso!
echo.

npx prisma db seed
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao popular banco
    pause
    exit /b 1
)

echo ✅ Banco populado com sucesso!
echo.
echo 🎉 SETUP CONCLUIDO!
echo.
echo Execute: npm run dev
echo.
echo Acesse: http://localhost:3000
echo Login: admin@vexyn.app / Vexyn@123
echo.
pause