require('dotenv').config()
const express = require('express')
const database = require('./src/db/mongoose')
const setupMiddleware = require('./src/middleware')
const { logger } = require('./src/middleware/logger.middleware')
const config = require('./src/config/config')

// Import routes
const authRoutes = require('./src/routes/auth.routes')
const categoryRoutes = require('./src/routes/category.routes')
const typeRoutes = require('./src/routes/type.routes')
const productRoutes = require('./src/routes/product.routes')
const cartRoutes = require('./src/routes/cart.routes')
const favoriteRoutes = require('./src/routes/favorite.routes')
const orderRoutes = require('./src/routes/order.routes')
const userRoutes = require('./src/routes/user.routes')

const app = express()

// Setup all middleware
setupMiddleware(app)

// API Routes
app.use('/api', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/types', typeRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/user', userRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ 
		status: 'OK', 
		timestamp: new Date().toISOString(),
		database: database.isConnected ? 'connected' : 'disconnected'
	})
})

// Test endpoint for static files
app.get('/test-image', (req, res) => {
	const fs = require('fs')
	const path = require('path')
	const imagePath = path.join(__dirname, 'public', 'images', 'products', '0-1.jpg')
	const imageExists = fs.existsSync(imagePath)
	res.json({
		message: 'Static files test',
		imagePath: imagePath,
		imageExists: imageExists,
		testUrl: `http://localhost:${config.port}/images/products/0-1.jpg`
	})
})

// 404 handler
app.use((req, res, next) => {
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

// Error handler
app.use((err, req, res, next) => {
	logger.error(err.message, { error: err, stack: err.stack })
	res.status(err.statusCode || 500).send({ 
		error: true, 
		message: err.message 
	})
})

// Start server
const startServer = async () => {
	try {
		// Connect to database
		await database.connect()
		
		// Start Express server
		app.listen(config.port, () => {
			console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   Server started successfully!                             ║
║   Port: ${config.port}                                              ║
║   Environment: ${config.env}                             ║
║   Database: MongoDB Atlas                                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
			`)
		})
	} catch (error) {
		logger.error('Failed to start server:', error)
		console.error('Failed to start server:', error)
		process.exit(1)
	}
}

startServer()

module.exports = app
