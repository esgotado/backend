module.exports = {
  MONGO_DB_URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017',
  SECRET_JWT: process.env.SECRET_JWT || 'actually, this isn\'t a good secret'
}