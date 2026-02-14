const mongoose = require('mongoose')
const config = require('../../config/config')

class MongoDBConnection {
	static isConnected = false
	static db

	static getConnection(result) {
		if (this.isConnected) {
			return result(null, this.db)
		} else {
			return this.connect(result)
		}
	}

	static connect(result) {
		console.log('Attempting to connect to MongoDB...')
		console.log('Connection URL:', config.db.dbUrl.replace(/:[^:@]+@/, ':****@'))
		console.log('Database:', config.db.dbName)
		
		mongoose
			.connect(config.db.dbUrl, {
				dbName: config.db.dbName,
				useNewUrlParser: true,
				useUnifiedTopology: true,
				serverSelectionTimeoutMS: 10000,
			})
			.catch(err => {
				console.error('Mongoose connection error:', err.message)
				return result(err, null)
			})
		const db = mongoose.connection

		db.once('open', () => {
			console.log('MongoDB connection opened!')
			this.db = mongoose
			this.isConnected = true
			return result(null, this.db)
		})
		db.on('connecting', () => {
			console.log('connecting to MongoDB...')
		})
		db.on('error', error => {
			console.log('Error in MongoDb connection: ' + error)
			mongoose.disconnect().then().catch()
		})
		db.on('connected', () => {
			console.log('MongoDB connected!')
		})
		db.on('reconnected', () => {
			console.log('MongoDB reconnected!')
		})
		db.on('disconnected', () => {
			console.log('MongoDB disconnected!')
			setTimeout(
				() =>
					MongoDBConnection.connect(() => {
						// after connect callback
					}),
				5000
			)
		})
	}
}

module.exports = MongoDBConnection
