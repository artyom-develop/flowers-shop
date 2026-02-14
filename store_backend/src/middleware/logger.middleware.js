const winston = require('winston')
const morgan = require('morgan')

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

// Morgan middleware
const morganMiddleware = morgan('combined', { 
	stream: { 
		write: message => logger.info(message.trim()) 
	} 
})

module.exports = {
	logger,
	morganMiddleware
}
