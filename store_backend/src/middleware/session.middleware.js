const session = require('express-session')
const config = require('../config/config')

const sessionOptions = {
	name: 'connect.sid',
	secret: process.env.SESSION_SECRET || '0SddfAS9fAdFASASSFwdVCXLZJKHfss',
	resave: true,
	saveUninitialized: true,
	rolling: true,
	cookie: {
		httpOnly: false,
		secure: config.env === 'production',
		sameSite: config.env === 'production' ? 'strict' : false,
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
	},
}

module.exports = session(sessionOptions)
