const FacebookStrategy = require('./strategies/facebook')
const LocalStrategy = require('./strategies/local')
const JWTAuthentication = require('./JWTAuth')

module.exports = {
	FacebookStrategy,
	LocalStrategy,
	JWTAuthentication,
}
