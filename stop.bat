@echo off
chcp 65001 >nul
title Остановка серверов

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        Остановка Backend и Frontend серверов               ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Поиск и остановка процессов Node.js...

REM Остановка процессов на порту 3003 (Backend)
echo [1/2] Остановка Backend (порт 3003)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3003" ^| find "LISTENING"') do (
    echo Завершение процесса %%a
    taskkill /F /PID %%a >nul 2>&1
)

REM Остановка процессов на порту 4200 (Frontend)
echo [2/2] Остановка Frontend (порт 4200)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":4200" ^| find "LISTENING"') do (
    echo Завершение процесса %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [OK] Серверы остановлены
echo.

pause
