/* npm modules */
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { Person } = require('../../database')
const {
	FacebookStrategy,
	LocalStrategy,
	JWTAuthentication,
} = require('../../middlewares/')
const bodyParser = require('body-parser')
const config = require('../../config')
const logger = require('morgan')

/* create app */
const route = express.Router()

/* bodyParser because express.json() wasn't working */
route.use(bodyParser.urlencoded({ extended: false }))
route.use(bodyParser.json())
route.use(logger('dev'))
route.use((req, res, next) => {
	console.log('HEADERS')
	console.log(req.headers)
	next()
})

/* strategies */
passport.use(LocalStrategy)
passport.use(FacebookStrategy())

/* homepage route */
route.get('/', (req, res) => {
	res.send('Hack me')
	//console.log(res)
})

/* auth route */
route.post('/', async (req, res) => {
	const { email, pass } = req.body

	/* hard coding just to test auth issue */
	const { data, info } = await Person.check_password(email, pass)

	if (!data)
		return res.status(401).json({
			error: true,
			info,
			message: 'Authentication failed',
		})

	if (!data.error) {
		const { name, college_id, claims, aud } = data
		// const opts = {
		// 	expiresIn: 120,
		// }
		const secret = config.SECRET_JWT
		const token = jwt.sign(
			{
				email,
				name,
				college_id,
				claims: claims.split(' '),
				aud,
			},
			secret
			// opts
		)

		return res.status(200).json({
			message: 'Authentication Success',
			token,
		})
	}
	return res.status(401).json(data)
})

/* create user */
route.post('/new/user', async (req, res) => {
	const { name, pass, email, claims, college_id } = req.body
	console.log(req.body)
	let status = await Person.index({
		name,
		pass,
		email,
		college_id,
		claims,
	})
	if (status.error) res.status(401).json(status)
	else res.status(200).json(status)
})

/* facebook social login */
route.get(
	'/facebook',
	passport.authenticate('facebook', {
		scope: ['email', 'public_profile'],
	})
)

/* facebook callback */
route.get(
	'/facebook/callback',
	passport.authenticate('facebook', { session: false }),
	async email => {
		const { data } = await Person.get({ email })

		if (!data)
			return res
				.status(401)
				.json({ error: true, message: 'Authentication failed' })

		if (!data.error) {
			const { name, college_id, claims, aud } = data
			// const opts = {
			// 	expiresIn: 259200,
			// }
			const secret = config.SECRET_JWT
			const token = jwt.sign(
				{
					email,
					name,
					college_id,
					claims,
					aud,
				},
				secret
				// opts
			)

			return res.json({
				message: 'Authentication Success',
				token,
			})
		}
	}
)

/* checking jwt validation */
route.get('/check', JWTAuthentication, (req, res) => {
	return res.json({ error: false, message: 'Token verified', user: req.user })
})

module.exports = route
