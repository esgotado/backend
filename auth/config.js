module.exports = {
	MONGO_DB_URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017',
	SECRET_JWT: process.env.SECRET_JWT || "actually, this isn't a good secret",
	FB_APPID: process.env.FB_APPID || 399187804234708,
	FB_APPSECRET:
		process.env.FB_APPSECRET || '63c89c98669001b16f598ecae721a86a',
	FB_CALLBACK: 'https://826c8f58.ngrok.io/api/auth/facebook/callback',
	es_config: {
		host: process.env.ES_HOST,
		trace: 'trace',
	},
}
