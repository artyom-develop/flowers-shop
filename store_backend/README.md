# Store Backend

Express.js backend for the online store with MongoDB.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```

3. Run migrations:
   ```
   npx migrate-mongo up
   ```

## Development

Run with nodemon:
```
npm run dev
```

## Production

1. Install PM2 globally:
   ```
   npm install -g pm2
   ```

2. Set environment variables in `.env` for production (use MongoDB Atlas or server MongoDB).

3. Run migrations:
   ```
   npx migrate-mongo up
   ```

4. Start with PM2:
   ```
   npm run prod
   ```

5. For server deployment (e.g., ISPmanager):
   - Upload files to server.
   - Install dependencies: `npm install`.
   - Configure Node.js app in ISPmanager with port 3000.
   - Set up proxy for `/api` routes.
   - Use health check endpoint: `GET /health`.

6. Other PM2 commands:
   - `npm run pm2:stop`
   - `npm run pm2:restart`
   - `npm run pm2:delete`

## Environment Variables

- `NODE_ENV`: Environment (production/development)
- `PORT`: Server port (default 3000)
- `JWT_SECRET`: Secret for JWT tokens
- `SESSION_SECRET`: Secret for sessions
- `MONGO_URI`: MongoDB connection string
- `CORS_ORIGIN`: Allowed CORS origins
- `DB_NAME`: Database name