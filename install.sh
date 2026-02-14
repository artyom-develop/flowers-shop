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
echo -e "${BLUE}[1/2] Установка зависимостей Backend...${NC}"
cd store_backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ОШИБКА] Не удалось установить зависимости backend${NC}"
    cd ..
    exit 1
fi
echo -e "${GREEN}✓ Backend зависимости установлены${NC}"
cd ..

# Установка зависимостей Frontend
echo -e "${BLUE}[2/2] Установка зависимостей Frontend...${NC}"
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
