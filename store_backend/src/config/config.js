require('dotenv').config()

const config = {
	secret: process.env.JWT_SECRET || 'd1UCyUDKC0TiWhDbs6U5QWiez6',
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	db: {
		dbUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/im',
		dbName: process.env.DB_NAME || 'im',
		dbHost: process.env.DB_HOST || 'localhost',
		dbPort: process.env.DB_PORT || 27017,
	},
	deliveryCost: 10,
	deliveryTypes: { delivery: 'delivery', self: 'self' },
	paymentTypes: {
		cashToCourier: 'cashToCourier',
		cardOnline: 'cardOnline',
		cardToCourier: 'cardToCourier',
	},
	statuses: {
		new: 'new',
		pending: 'pending',
		delivery: 'delivery',
		cancelled: 'cancelled',
		success: 'success',
	},
}

module.exports = config
