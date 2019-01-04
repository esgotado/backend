module.exports = {
  MONGO_DB_URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017',
  SECRET_JWT: process.env.SECRET_JWT || 'actually, this isn\'t a good secret',
  FB_APPID: process.env.FB_APPID || 1234,
  FB_APPSECRET: process.env.FB_APPSECRET,
  FB_CALLBACK : 'https://esgotado.app/api/auth/facebook/callback'
}