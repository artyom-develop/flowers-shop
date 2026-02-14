@echo off
chcp 65001 >nul
title Backend Server - Port 3003

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        Запуск Backend сервера (MongoDB Atlas)              ║
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

REM Проверка .env файла
if not exist ".env" (
    echo [WARNING] Файл .env не найден!
    echo [INFO] Скопируйте .env.example в .env и настройте параметры
    pause
    exit /b 1
)

echo [INFO] Подключение к MongoDB Atlas...
echo [INFO] Запуск сервера на порту 3003...
echo.

npm start

if errorlevel 1 (
    echo.
    echo [ОШИБКА] Сервер завершился с ошибкой
    pause
    exit /b 1
)
