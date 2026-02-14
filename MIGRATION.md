# Миграция на MongoDB Atlas

## Выполненные изменения

### 1. Подключение к MongoDB Atlas
- Обновлено подключение на `mongodb+srv://artem2006pax_db_user:<db_password>@cluster0.8ftkocu.mongodb.net/`
- Используется MongoDB Atlas вместо локального MongoDB
- **ВАЖНО**: Замените `<db_password>` в файле `.env` на ваш реальный пароль

### 2. Улучшенная архитектура Backend

#### Новая структура:
```
store_backend/
├── src/
│   ├── db/
│   │   └── mongoose.js          # Новый: класс для управления подключением к БД
│   ├── middleware/
│   │   ├── index.js             # Новый: централизованная настройка middleware
│   │   ├── auth.middleware.js   # Новый: настройка Passport JWT
│   │   ├── cors.middleware.js   # Новый: настройка CORS
│   │   ├── session.middleware.js # Новый: настройка сессий
│   │   ├── logger.middleware.js  # Новый: Winston логирование
│   │   └── security.middleware.js # Новый: Helmet и Rate limiting
│   └── ...
├── server.js                     # Новый: улучшенная точка входа
└── app.js                        # Старый файл (можно удалить)
```

#### Преимущества новой архитектуры:
- ✅ Модульная структура с разделением ответственности
- ✅ Async/await вместо callbacks
- ✅ Централизованная обработка ошибок
- ✅ Улучшенное логирование (Winston)
- ✅ Health check endpoint (`GET /health`)
- ✅ Graceful shutdown
- ✅ Лучшая безопасность (Helmet, Rate limiting)

### 3. Упрощенный запуск

#### Из корневой папки:
```bash
start.bat
```
Запускает Backend и Frontend одновременно в отдельных окнах.

#### Раздельно:
```bash
# Backend
cd store_backend
npm start

# Frontend
cd store_for_angular
npm start
```

## Настройка MongoDB Atlas

1. Откройте `store_backend\.env`
2. Найдите строку:
   ```
   MONGO_URI=mongodb+srv://artem2006pax_db_user:<db_password>@cluster0.8ftkocu.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority
   ```
3. Замените `<db_password>` на ваш пароль
4. Сохраните файл

## Проверка подключения

После запуска сервера:
```
GET http://localhost:3000/health
```

Ответ:
```json
{
  "status": "OK",
  "timestamp": "2024-02-14T10:30:00.000Z",
  "database": "connected"
}
```

## Важные файлы

- **store_backend\.env** - переменные окружения (НЕ публикуйте в Git!)
- **store_backend\server.js** - новая точка входа приложения
- **store_backend\src\db\mongoose.js** - управление подключением к БД
- **store_backend\src\middleware\index.js** - настройка middleware
- **start.bat** (корневая папка) - запуск Backend + Frontend

## Миграция данных

Если у вас были данные в локальной БД, вам нужно:
1. Экспортировать данные из локального MongoDB
2. Импортировать в MongoDB Atlas

Или использовать миграции:
```bash
cd store_backend
npx migrate-mongo up
```

## Удаление старых файлов

После проверки работоспособности можно удалить:
- `store_backend/app.js` (заменён на `server.js`)
- `store_backend/src/utils/common/connection.js` (заменён на `src/db/mongoose.js`)

## Документация

- Подробная архитектура: `store_backend/ARCHITECTURE.md`
- Инструкция по запуску: `README.md`
