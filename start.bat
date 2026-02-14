@echo off
chcp 65001 >nul
title Запуск интернет-магазина

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        Запуск Backend и Frontend сервера                   ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Проверка существования папок
if not exist "store_backend" (
    echo [ОШИБКА] Папка store_backend не найдена!
    pause
    exit /b 1
)

if not exist "store_for_angular" (
    echo [ОШИБКА] Папка store_for_angular не найдена!
    pause
    exit /b 1
)

REM Проверка node_modules в backend
echo [INFO] Проверка зависимостей...
cd store_backend
if not exist "node_modules" (
    echo [WARNING] node_modules не найдены в store_backend
    echo [INFO] Установка зависимостей backend...
    call npm install
    if errorlevel 1 (
        echo [ОШИБКА] Не удалось установить зависимости backend
        cd ..
        pause
        exit /b 1
    )
)
cd ..

REM Проверка node_modules в frontend
cd store_for_angular
if not exist "node_modules" (
    echo [WARNING] node_modules не найдены в store_for_angular
    echo [INFO] Установка зависимостей frontend...
    call npm install
    if errorlevel 1 (
        echo [ОШИБКА] Не удалось установить зависимости frontend
        cd ..
        pause
        exit /b 1
    )
)
cd ..

echo.
echo [1/2] Запуск Backend сервера (Node.js + Express + MongoDB Atlas)...
cd store_backend
start "Backend Server - Port 3003" cmd /k "npm start"
cd ..

echo [2/2] Ожидание запуска backend (5 сек)...
timeout /t 5 /nobreak >nul

echo [3/3] Запуск Frontend сервера (Angular)...
cd store_for_angular
start "Frontend Server - Port 4200" cmd /k "npm start"
cd ..

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║   Серверы запущены в отдельных окнах:                      ║
echo ║   - Backend:  http://localhost:3003                        ║
echo ║   - Frontend: http://localhost:4200                        ║
echo ║                                                            ║
echo ║   Дождитесь полной загрузки обоих серверов!                ║
echo ║   Backend: "Server started successfully"                   ║
echo ║   Frontend: "Compiled successfully"                        ║
echo ║                                                            ║
echo ║   Для остановки закройте окна серверов                     ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

pause
