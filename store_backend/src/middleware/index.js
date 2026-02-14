const express = require('express')
const compression = require('compression')
const path = require('path')
const { helmet, limiter } = require('./security.middleware')
const { morganMiddleware } = require('./logger.middleware')
const corsMiddleware = require('./cors.middleware')
const sessionMiddleware = require('./session.middleware')
const passport = require('./auth.middleware')
const config = require('../config/config')

const setupMiddleware = (app) => {
	// Compression middleware
	app.use(compression())

	// Logging middleware
	app.use(morganMiddleware)

	// CORS configuration - MUST be before static files and helmet
	app.use(corsMiddleware)

	// Security middleware - AFTER CORS
	app.use(helmet)

	// Static files - serve from public directory (BEFORE rate limiter)
	app.use(express.static(path.join(__dirname, '../../public')))
	
	// Rate limiting - AFTER static files to not limit images
	app.use('/api', limiter)
	
	app.use(express.json())

	// Session configuration
	app.use(sessionMiddleware)

	// Passport initialization
	app.use(passport.initialize())

	// Session logging and initialization
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
}

module.exports = setupMiddleware
