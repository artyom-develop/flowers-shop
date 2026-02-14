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
echo [1/3] Установка зависимостей Backend...
cd store_backend
call npm install
if errorlevel 1 (
    echo [ОШИБКА] Не удалось установить зависимости backend
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend зависимости установлены

REM Проверка .env файла
if not exist ".env" (
    echo [ВНИМАНИЕ] Файл .env не найден!
    echo Создайте .env файл с настройками MongoDB Atlas
    cd ..
    pause
    exit /b 1
)

REM Запуск миграций
echo.
echo [2/3] Применение миграций базы данных...
call npx migrate-mongo up
if errorlevel 1 (
    echo [ОШИБКА] Не удалось применить миграции
    echo Проверьте подключение к MongoDB Atlas в .env файле
    cd ..
    pause
    exit /b 1
)
echo [OK] Миграции успешно применены
cd ..

REM Установка зависимостей Frontend
echo.
echo [3/3] Установка зависимостей Frontend...
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
