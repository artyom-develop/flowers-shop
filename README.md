# Запуск проекта

## Быстрый старт

### Запуск Backend и Frontend одновременно

Из корневой папки проекта:
```bash
start.bat
```

Это запустит:
- Backend сервер на порту **3003**
- Frontend сервер на порту **4200**

### Остановка серверов

```bash
stop.bat
```

Автоматически остановит все процессы на портах 3003 и 4200.

### Раздельный запуск

#### Backend
```bash
cd store_backend
start.bat
# или
npm start
```

#### Frontend
```bash
cd store_for_angular
start.bat
# или
npm start
```

## Настройка перед первым запуском

### 1. Настройка MongoDB Atlas

1. Откройте файл `store_backend\.env`
2. Замените `<db_password>` на ваш пароль от MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://artem2006pax_db_user:ВАШ_ПАРОЛЬ@cluster0.8ftkocu.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority
```

### 2. Установка зависимостей и миграций

**Автоматическая установка (РЕКОМЕНДУЕТСЯ):**

```bash
# Windows
install.bat

# Linux/Mac
./install.sh
```

Скрипт автоматически:
- ✓ Установит зависимости Backend
- ✓ Применит все миграции к базе данных
- ✓ Установит зависимости Frontend

**Или вручную:**

```bash
# Backend
cd store_backend
npm install
npx migrate-mongo up
cd ..

# Frontend
cd store_for_angular
npm install
```

## Доступ к приложению

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3003/api
- **Health Check**: http://localhost:3003/health
- **Test Images**: http://localhost:3003/test-images.html

## Режимы работы

### Development (с hot reload)
Backend:
```bash
cd store_backend
npm run dev
```

Frontend:
```bash
cd store_for_angular
npm start
```

### Production (с PM2)
```bash
cd store_backend
npm run pm2:start
```

## Полезные команды

### Backend
- `npm start` - запуск сервера
- `npm run dev` - запуск с nodemon (auto-reload)
- `npm run pm2:start` - запуск с PM2
- `npm run pm2:stop` - остановка PM2
- `npm run pm2:restart` - перезапуск PM2

### Frontend
- `npm start` - запуск dev сервера
- `npm run build` - сборка для продакшн
- `npm test` - запуск тестов

## BAT файлы

### start.bat (корневая папка)
Запускает Backend и Frontend в отдельных окнах с проверками:
- ✅ Проверка существования папок
- ✅ Автоматическая установка зависимостей
- ✅ Правильная последовательность запуска
- ✅ Информативные сообщения

### stop.bat (корневая папка)
Останавливает все процессы на портах 3003 и 4200

### store_backend/start.bat
Запуск только Backend с проверками:
- ✅ Проверка node_modules
- ✅ Проверка .env файла
- ✅ Обработка ошибок

### store_for_angular/start.bat
Запуск только Frontend с проверками:
- ✅ Проверка node_modules
- ✅ Обработка ошибок

## Troubleshooting

### Backend падает при запуске

1. **Проверьте .env файл:**
   ```bash
   cd store_backend
   type .env
   ```
   Убедитесь, что MONGO_URI содержит правильный пароль.

2. **Проверьте подключение к MongoDB Atlas:**
   - Проверьте Network Access в MongoDB Atlas
   - Добавьте ваш IP адрес в белый список

3. **Переустановите зависимости:**
   ```bash
   cd store_backend
   rmdir /s /q node_modules
   npm install
   ```

4. **Проверьте порт 3003:**
   ```bash
   netstat -ano | findstr :3003
   ```
   Если порт занят, остановите процесс или измените порт в .env

### Frontend не запускается

1. **Переустановите зависимости:**
   ```bash
   cd store_for_angular
   rmdir /s /q node_modules
   npm install
   ```

2. **Проверьте порт 4200:**
   ```bash
   netstat -ano | findstr :4200
   ```

3. **Очистите кэш Angular:**
   ```bash
   npm cache clean --force
   ```

### Серверы не останавливаются

Используйте `stop.bat` или вручную:
```bash
# Найти процесс
netstat -ano | findstr :3003
# Убить процесс (замените PID на реальный)
taskkill /F /PID <PID>
```

## Архитектура

Подробная документация по архитектуре Backend доступна в файле `store_backend/ARCHITECTURE.md`

## Дополнительная документация

- [ARCHITECTURE.md](store_backend/ARCHITECTURE.md) - архитектура Backend
- [DATABASE.md](store_backend/DATABASE.md) - миграции и данные БД
- [MIGRATION.md](MIGRATION.md) - миграция на MongoDB Atlas
- [STATIC_FILES_SETUP.md](STATIC_FILES_SETUP.md) - настройка статических файлов
- [LOADER_SYSTEM.md](store_for_angular/LOADER_SYSTEM.md) - система лоадеров на фронтенде
