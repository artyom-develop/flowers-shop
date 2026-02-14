const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.'
})

// Helmet with custom configuration to allow cross-origin images
const helmetConfig = helmet({
	crossOriginResourcePolicy: { policy: "cross-origin" },
	crossOriginEmbedderPolicy: false,
})

module.exports = {
	helmet: helmetConfig,
	limiter
}
