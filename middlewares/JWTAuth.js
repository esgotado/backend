const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = (req, res, next) => {
	// Get JWT from header
	let { authorization } = req.headers
	let token = authorization.split(' ')[1]
	try {
		let user = jwt.verify(token, config.SECRET_JWT)
		let { claims } = user
		Object.assign(req, { user, claims })
		next()
	} catch (e) {
		res.status(401).json({
			error: true,
			info: e,
		})
	}
}
