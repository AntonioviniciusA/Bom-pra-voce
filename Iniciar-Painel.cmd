@echo off
setlocal
cd /d "%~dp0painel-local"
call npm start
if errorlevel 1 goto falha
exit /b 0

:falha
echo.
echo Nao foi possivel iniciar o painel. Confira a mensagem acima.
pause
exit /b 1
