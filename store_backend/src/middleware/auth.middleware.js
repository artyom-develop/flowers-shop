const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const UserModel = require('../models/user.model')
const config = require('../config/config')

// Configure JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
	secretOrKey: config.secret,
	algorithms: ['HS256'],
}

const jwtVerify = async (payload, next) => {
	if (!payload.id) {
		return next(new Error('Не валидный токен'))
	}

	try {
		const user = await UserModel.findOne({ _id: payload.id })
		if (user) {
			return next(null, payload)
		}
		next(new Error('Пользователь не найден'))
	} catch (error) {
		console.error('JWT verification error:', error)
		next(error)
	}
}

passport.use(new JwtStrategy(jwtOptions, jwtVerify))

module.exports = passport
