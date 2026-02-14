# Архитектура Backend

Улучшенная структура проекта с использованием современных практик Node.js/Express.

## Структура папок

```
store_backend/
├── src/
│   ├── config/           # Конфигурация приложения
│   ├── controllers/      # Бизнес-логика контроллеров
│   ├── db/              # Подключение к базе данных
│   │   └── mongoose.js  # MongoDB/Mongoose конфигурация
│   ├── middleware/      # Middleware функции
│   │   ├── index.js            # Главный middleware setup
│   │   ├── auth.middleware.js  # Passport JWT аутентификация
│   │   ├── cors.middleware.js  # CORS конфигурация
│   │   ├── session.middleware.js  # Session конфигурация
│   │   ├── logger.middleware.js   # Winston логирование
│   │   └── security.middleware.js # Helmet и Rate limiting
│   ├── models/          # Mongoose модели
│   ├── normalizers/     # Нормализаторы данных
│   ├── routes/          # Express маршруты
│   ├── services/        # Бизнес-логика сервисов
│   └── utils/           # Утилиты
├── public/              # Статические файлы
├── migrations/          # Миграции базы данных
├── server.js            # Точка входа приложения
├── .env                 # Переменные окружения
└── package.json         # Зависимости проекта
```

## Основные компоненты

### 1. Database (src/db/mongoose.js)
- Класс для управления подключением к MongoDB Atlas
- Автоматическое переподключение
- Обработка событий подключения/отключения
- Graceful shutdown

### 2. Middleware (src/middleware/)
- **auth.middleware.js**: JWT аутентификация через Passport
- **cors.middleware.js**: Настройка CORS политики
- **session.middleware.js**: Управление сессиями
- **logger.middleware.js**: Winston логирование
- **security.middleware.js**: Helmet и Rate limiting
- **index.js**: Централизованная настройка всех middleware

### 3. Server (server.js)
- Асинхронный запуск сервера
- Подключение к базе данных перед запуском
- Настройка маршрутов
- Обработка ошибок
- Health check endpoint

## Основные улучшения

✓ Модульная архитектура с разделением ответственности
✓ Async/await вместо callbacks
✓ Централизованная обработка ошибок
✓ Улучшенное логирование
✓ MongoDB Atlas подключение
✓ Безопасность (Helmet, Rate limiting)
✓ Health check endpoint
✓ Graceful shutdown
✓ Переменные окружения (.env)

## Запуск проекта

### Разработка
```bash
npm run dev
```

### Продакшн
```bash
npm start
```

### PM2
```bash
npm run pm2:start
```

## Настройка MongoDB Atlas

1. Откройте файл `.env`
2. Замените `<db_password>` на реальный пароль:
```
MONGO_URI=mongodb+srv://artem2006pax_db_user:YOUR_PASSWORD@cluster0.8ftkocu.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority
```

## Health Check

Проверка состояния сервера:
```
GET /health
```

Ответ:
```json
{
  "status": "OK",
  "timestamp": "2024-02-14T10:30:00.000Z",
  "database": "connected"
}
```
