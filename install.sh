#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        Установка зависимостей проекта                      ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ОШИБКА] Node.js не установлен!${NC}"
    echo -e "${BLUE}Установите Node.js: https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}Node.js версия: $(node -v)${NC}"
echo -e "${GREEN}NPM версия: $(npm -v)${NC}"
echo ""

# Установка зависимостей Backend
echo -e "${BLUE}[1/3] Установка зависимостей Backend...${NC}"
cd store_backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ОШИБКА] Не удалось установить зависимости backend${NC}"
    cd ..
    exit 1
fi
echo -e "${GREEN}✓ Backend зависимости установлены${NC}"

# Проверка .env файла
if [ ! -f ".env" ]; then
    echo -e "${RED}[ВНИМАНИЕ] Файл .env не найден!${NC}"
    echo -e "${BLUE}Создайте .env файл с настройками MongoDB Atlas${NC}"
    cd ..
    exit 1
fi

# Запуск миграций
echo ""
echo -e "${BLUE}[2/3] Применение миграций базы данных...${NC}"
npx migrate-mongo up
if [ $? -ne 0 ]; then
    echo -e "${RED}[ОШИБКА] Не удалось применить миграции${NC}"
    echo -e "${BLUE}Проверьте подключение к MongoDB Atlas в .env файле${NC}"
    cd ..
    exit 1
fi
echo -e "${GREEN}✓ Миграции успешно применены${NC}"
cd ..

# Установка зависимостей Frontend
echo -e "${BLUE}[3/3] Установка зависимостей Frontend...${NC}"
cd store_for_angular
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ОШИБКА] Не удалось установить зависимости frontend${NC}"
    cd ..
    exit 1
fi
echo -e "${GREEN}✓ Frontend зависимости установлены${NC}"
cd ..

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   ✓ Все зависимости успешно установлены!                   ║"
echo "║                                                            ║"
echo "║   Теперь можно запустить проект:                           ║"
echo "║   ./start.sh (Linux/Mac)                                   ║"
echo "║   start.bat (Windows)                                      ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
