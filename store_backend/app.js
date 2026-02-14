require('dotenv').config();
const mongoose = require('mongoose')

// Set Mongoose options
mongoose.set('strictQuery', false);
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const morgan = require('morgan')
const winston = require('winston')
const categoryRoutes = require('./src/routes/category.routes')
const typeRoutes = require('./src/routes/type.routes')
const productRoutes = require('./src/routes/product.routes')
const cartRoutes = require('./src/routes/cart.routes')
const authRoutes = require('./src/routes/auth.routes')
const favoriteRoutes = require('./src/routes/favorite.routes')
const orderRoutes = require('./src/routes/order.routes')
const userRoutes = require('./src/routes/user.routes')
const MongoDBConnection = require('./src/utils/common/connection')
const config = require('./src/config/config')
const session = require('express-session')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const passport = require('passport')
const UserModel = require('./src/models/user.model')
const JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt

// Logger setup
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' }),
	],
})

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.simple(),
	}))
}

MongoDBConnection.getConnection((error, connection) => {
	if (error || !connection) {
		console.log('Db connection error', error)
		return
	}
	const app = express()

	// Security middleware
	app.use(helmet())

	// Compression middleware
	app.use(compression())

	// Logging middleware
	app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }))

	// Rate limiting
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
		message: 'Too many requests from this IP, please try again later.'
	})
	app.use(limiter)

	// CORS for static files (images)
	app.use('/images', (req, res, next) => {
		const allowedOrigins = process.env.CORS_ORIGIN 
			? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
			: ['http://127.0.0.1:4200', 'http://localhost:4200']
		const origin = req.headers.origin ? req.headers.origin.replace(/\/$/, '') : undefined
		if (allowedOrigins.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin)
		}
		res.setHeader('Access-Control-Allow-Credentials', 'true')
		next()
	})

	app.use(express.static(path.join(__dirname, 'public')))
	app.use(express.json())
	
	// CORS configuration
	const allowedOrigins = process.env.CORS_ORIGIN 
		? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
		: ['http://127.0.0.1:4200', 'http://localhost:4200']
	
	app.use(
		cors({
			origin: function (origin, callback) {
				// Allow requests with no origin (mobile apps, curl, etc.)
				if (!origin) return callback(null, true)
				if (allowedOrigins.indexOf(origin) !== -1) {
					callback(null, true)
				} else {
					callback(new Error('Not allowed by CORS'))
				}
			},
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
		})
	)

	app.use(
		session({
			name: 'connect.sid',
			secret: process.env.SESSION_SECRET || '0SddfAS9fAdFASASSFwdVCXLZJKHfss',
			resave: true,
			saveUninitialized: true,
			rolling: true,
			cookie: {
				httpOnly: false,
				secure: process.env.NODE_ENV === 'production', // secure in production
				sameSite: process.env.NODE_ENV === 'production' ? 'strict' : false,
				maxAge: 24 * 60 * 60 * 1000,
			},
		})
	)

	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
				secretOrKey: config.secret,
				algorithms: ['HS256'],
			},
			async (payload, next) => {
				if (!payload.id) {
					return next(new Error('Не валидный токен'))
				}

				let user = null
				try {
					user = await UserModel.findOne({ _id: payload.id })
				} catch (e) {
					console.log(e)
				}

				if (user) {
					return next(null, payload)
				}

				next(new Error('Пользователь не найден'))
			}
		)
	)

	app.use(passport.initialize())

		// Middleware для логирования и инициализации session
	app.use((req, res, next) => {
		if (!req.session.initialized) {
			req.session.initialized = true
			req.session.save()
		}
		if (config.env !== 'production') {
			console.log('Session ID:', req.session.id)
			console.log('Cookie:', req.headers.cookie)
		}
		next()
	})

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
		res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
	})

	app.use(function (req, res, next) {
		const err = new Error('Not Found')
		err.status = 404
		next(err)
	})

	app.use(function (err, req, res, next) {
		res
			.status(err.statusCode || 500)
			.send({ error: true, message: err.message })
	})

	app.listen(config.port, () => console.log(`Server started on port ${config.port} in ${config.env} mode`))
})
