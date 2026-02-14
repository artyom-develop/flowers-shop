#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        Запуск Backend и Frontend сервера                   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Проверка существования папок
if [ ! -d "store_backend" ]; then
    echo -e "${RED}[ОШИБКА] Папка store_backend не найдена!${NC}"
    exit 1
fi

if [ ! -d "store_for_angular" ]; then
    echo -e "${RED}[ОШИБКА] Папка store_for_angular не найдена!${NC}"
    exit 1
fi

# Проверка node_modules в backend
echo -e "${BLUE}[INFO] Проверка зависимостей...${NC}"
cd store_backend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[WARNING] node_modules не найдены в store_backend${NC}"
    echo -e "${BLUE}[INFO] Установка зависимостей backend...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ОШИБКА] Не удалось установить зависимости backend${NC}"
        cd ..
        exit 1
    fi
fi
cd ..

# Проверка node_modules в frontend
cd store_for_angular
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[WARNING] node_modules не найдены в store_for_angular${NC}"
    echo -e "${BLUE}[INFO] Установка зависимостей frontend...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ОШИБКА] Не удалось установить зависимости frontend${NC}"
        cd ..
        exit 1
    fi
fi
cd ..

echo ""
echo -e "${GREEN}[1/2] Запуск Backend сервера (Node.js + Express + MongoDB Atlas)...${NC}"
cd store_backend

# Запуск backend в фоне
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && npm start"'
else
    # Linux
    gnome-terminal -- bash -c "cd $(pwd) && npm start; exec bash" 2>/dev/null || \
    xterm -e "cd $(pwd) && npm start" 2>/dev/null || \
    konsole -e "cd $(pwd) && npm start" 2>/dev/null || \
    npm start &
fi
cd ..

echo -e "${BLUE}[2/2] Ожидание запуска backend (5 сек)...${NC}"
sleep 5

echo -e "${GREEN}[3/3] Запуск Frontend сервера (Angular)...${NC}"
cd store_for_angular

# Запуск frontend в фоне
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && npm start"'
else
    # Linux
    gnome-terminal -- bash -c "cd $(pwd) && npm start; exec bash" 2>/dev/null || \
    xterm -e "cd $(pwd) && npm start" 2>/dev/null || \
    konsole -e "cd $(pwd) && npm start" 2>/dev/null || \
    npm start &
fi
cd ..

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   Серверы запущены:                                        ║"
echo "║   - Backend:  http://localhost:3003                        ║"
echo "║   - Frontend: http://localhost:4200                        ║"
echo "║                                                            ║"
echo "║   Дождитесь полной загрузки обоих серверов!                ║"
echo "║   Backend: \"Server started successfully\"                   ║"
echo "║   Frontend: \"Compiled successfully\"                        ║"
echo "║                                                            ║"
echo "║   Для остановки используйте ./stop.sh                      ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
