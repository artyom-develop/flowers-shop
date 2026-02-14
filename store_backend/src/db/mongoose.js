const mongoose = require('mongoose')
const config = require('../config/config')

// Set Mongoose options
mongoose.set('strictQuery', false)

class Database {
	constructor() {
		this.isConnected = false
	}

	async connect() {
		if (this.isConnected) {
			console.log('Using existing database connection')
			return mongoose
		}

		try {
			console.log('Attempting to connect to MongoDB Atlas...')
			console.log('Database:', config.db.dbName)
			
			await mongoose.connect(config.db.dbUrl, {
				dbName: config.db.dbName,
				useNewUrlParser: true,
				useUnifiedTopology: true,
				serverSelectionTimeoutMS: 10000,
				maxPoolSize: 10,
			})

			this.isConnected = true
			console.log('✓ MongoDB Atlas connected successfully!')
			
			this.setupEventListeners()
			
			return mongoose
		} catch (error) {
			console.error('✗ MongoDB connection error:', error.message)
			throw error
		}
	}

	setupEventListeners() {
		mongoose.connection.on('connected', () => {
			console.log('Mongoose connected to MongoDB')
		})

		mongoose.connection.on('error', (error) => {
			console.error('Mongoose connection error:', error)
		})

		mongoose.connection.on('disconnected', () => {
			console.log('Mongoose disconnected from MongoDB')
			this.isConnected = false
		})

		// Handle application termination
		process.on('SIGINT', async () => {
			await this.disconnect()
			process.exit(0)
		})
	}

	async disconnect() {
		if (!this.isConnected) {
			return
		}

		try {
			await mongoose.connection.close()
			this.isConnected = false
			console.log('MongoDB connection closed')
		} catch (error) {
			console.error('Error closing MongoDB connection:', error)
		}
	}

	getConnection() {
		return mongoose
	}
}

module.exports = new Database()
