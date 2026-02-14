@echo off
chcp 65001 >nul
title Установка зависимостей проекта

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        Установка зависимостей проекта                      ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Проверка Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Node.js не установлен!
    echo Установите Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js версия:
node -v
echo NPM версия:
npm -v
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

REM Установка зависимостей Backend
echo [1/2] Установка зависимостей Backend...
cd store_backend
call npm install
if errorlevel 1 (
    echo [ОШИБКА] Не удалось установить зависимости backend
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend зависимости установлены
cd ..

REM Установка зависимостей Frontend
echo.
echo [2/2] Установка зависимостей Frontend...
cd store_for_angular
call npm install
if errorlevel 1 (
    echo [ОШИБКА] Не удалось установить зависимости frontend
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend зависимости установлены
cd ..

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║   ✓ Все зависимости успешно установлены!                   ║
echo ║                                                            ║
echo ║   Теперь можно запустить проект:                           ║
echo ║   start.bat                                                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

pause
