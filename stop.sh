#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        Остановка Backend и Frontend серверов               ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${BLUE}[INFO] Поиск и остановка процессов Node.js...${NC}"

# Остановка процессов на порту 3003 (Backend)
echo -e "${BLUE}[1/2] Остановка Backend (порт 3003)...${NC}"
lsof -ti:3003 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backend остановлен${NC}"
else
    echo -e "${BLUE}Backend не запущен${NC}"
fi

# Остановка процессов на порту 4200 (Frontend)
echo -e "${BLUE}[2/2] Остановка Frontend (порт 4200)...${NC}"
lsof -ti:4200 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Frontend остановлен${NC}"
else
    echo -e "${BLUE}Frontend не запущен${NC}"
fi

echo ""
echo -e "${GREEN}[OK] Серверы остановлены${NC}"
echo ""
