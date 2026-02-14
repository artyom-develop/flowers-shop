# Настройка статических файлов (изображений)

## Проблема
Изображения товаров не загружаются на фронтенде при запросе вида:
```
http://localhost:3003/images/products/0-1.jpg
```

## Решение

### 1. Backend настройки

Исправлен порядок middleware в [store_backend/src/middleware/index.js](store_backend/src/middleware/index.js):

**Было:**
- CORS настройка для `/images` применялась через custom middleware
- Статические файлы обслуживались без CORS заголовков
- CORS middleware применялся после статических файлов

**Стало:**
- CORS middleware применяется ПЕРЕД статическими файлами
- Статические файлы настроены с опцией `setHeaders` для добавления CORS заголовков
- Правильный порядок middleware

### 2. Структура файлов

Изображения должны находиться в:
```
store_backend/
└── public/
    └── images/
        └── products/
            ├── 0-1.jpg
            ├── 0-2.jpg
            ├── 1-1.jpg
            └── ...
```

### 3. Проверка работоспособности

#### Тест 1: HTML страница
Откройте в браузере:
```
http://localhost:3003/test-images.html
```

Эта страница покажет:
- ✅ Статус подключения к backend
- ✅ Тестовые изображения
- ✅ Конфигурацию CORS

#### Тест 2: API endpoints

**Health check:**
```
GET http://localhost:3003/health
```

**Test image config:**
```
GET http://localhost:3003/test-image
```

**Прямой доступ к изображению:**
```
GET http://localhost:3003/images/products/0-1.jpg
```

### 4. Frontend настройки

В Angular используется правильный путь:

**environment.ts:**
```typescript
export const environment = {
  production: false,
  api: "http://localhost:3003/api",
  serverStaticPath: "http://localhost:3003"
};
```

**В компонентах:**
```html
<img [src]="environment.serverStaticPath + '/images/products/' + product.image">
```

Это формирует URL:
```
http://localhost:3003/images/products/0-1.jpg
```

### 5. CORS настройки

Backend разрешает запросы с:
- `http://localhost:4200`
- `http://127.0.0.1:4200`
- И других источников из `.env` файла

Настройка в `.env`:
```env
CORS_ORIGIN=http://localhost:4200,http://127.0.0.1:4200
```

### 6. Порядок middleware (важно!)

```javascript
1. Helmet (безопасность)
2. Compression (сжатие)
3. Morgan (логирование)
4. Rate Limiter (ограничение запросов)
5. CORS middleware ← ПЕРЕД статическими файлами!
6. Static files (с CORS headers)
7. express.json()
8. Session
9. Passport
```

## Диагностика проблем

### Изображения не загружаются?

1. **Проверьте, запущен ли backend:**
   ```bash
   curl http://localhost:3003/health
   ```

2. **Проверьте прямой доступ к изображению:**
   ```bash
   curl -I http://localhost:3003/images/products/0-1.jpg
   ```

3. **Проверьте CORS заголовки в браузере:**
   - Откройте DevTools (F12)
   - Network tab
   - Найдите запрос к изображению
   - Проверьте Response Headers:
     - `Access-Control-Allow-Origin: http://localhost:4200`
     - `Access-Control-Allow-Credentials: true`

4. **Проверьте существование файлов:**
   ```bash
   cd store_backend
   ls public/images/products/
   ```

5. **Проверьте console на ошибки CORS:**
   Если видите ошибку типа:
   ```
   Access to image at 'http://localhost:3003/images/products/0-1.jpg' 
   from origin 'http://localhost:4200' has been blocked by CORS policy
   ```
   Значит CORS настройки неправильные.

### После изменений

Всегда перезапускайте backend сервер:
```bash
cd store_backend
npm start
```

## Полезные команды

```bash
# Запуск backend
cd store_backend
npm start

# Запуск backend в dev режиме (auto-reload)
cd store_backend
npm run dev

# Тест доступности изображений
curl http://localhost:3003/images/products/0-1.jpg --output test.jpg
```

## Примечания

- Порт backend: **3003** (настраивается в `.env`)
- Порт frontend: **4200** (стандартный для Angular)
- Все изображения должны быть в формате `.jpg`
- Путь к изображениям относителен к папке `public/`
