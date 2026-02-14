@echo off
chcp 65001 >nul
title Frontend Server - Port 4200

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        Запуск Frontend сервера (Angular)                   ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Проверка node_modules
if not exist "node_modules" (
    echo [WARNING] node_modules не найдены
    echo [INFO] Запуск npm install...
    call npm install
    if errorlevel 1 (
        echo [ОШИБКА] Не удалось установить зависимости
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Запуск Angular Development Server...
echo [INFO] Порт: 4200
echo.

npm start

if errorlevel 1 (
    echo.
    echo [ОШИБКА] Сервер завершился с ошибкой
    pause
    exit /b 1
)
