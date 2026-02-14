const cors = require('cors')

const allowedOrigins = process.env.CORS_ORIGIN 
	? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
	: ['http://127.0.0.1:4200', 'http://localhost:4200']

const corsOptions = {
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
}

module.exports = cors(corsOptions)
