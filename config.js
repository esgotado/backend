require('dotenv').load()
require('dotenvenc')(process.env.DOTENVENC_KEY)
require('dotenv').config()

module.exports = {
	ES_HOST: {
		host: process.env.ES_HOST,
		// log: 'trace',
	},
	MONGO_DB_URI: process.env.MONGO_DB_URI,
	SECRET_JWT: process.env.SECRET_JWT,
	FB_APPID: process.env.FB_APPID,
	FB_APPSECRET: process.env.FB_APPSECRET,
	FB_CALLBACK: 'https://826c8f58.ngrok.io/api/auth/facebook/callback',
}
