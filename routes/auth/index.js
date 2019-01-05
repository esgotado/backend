/* npm modules */
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { Person } = require('../../database')
const { FacebookStrategy, LocalStrategy } = require('../../middlewares/')
const bodyParser = require('body-parser')
const config = require('../../config')

/* create app */
const route = express.Router()

/* bodyParser because express.json() wasn't working */
route.use(bodyParser.urlencoded({ extended: false }))
route.use(bodyParser.json())

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
		return res.json(401, {
			error: true,
			info,
			message: 'Authentication failed',
		})

	if (!data.error) {
		const { name, college_id, claims, aud } = data
		const opts = {
			expiresIn: 120,
		}
		const secret = config.SECRET_JWT
		const token = jwt.sign(
			{
				email,
				name,
				college_id,
				claims,
				aud,
			},
			secret,
			opts
		)

		return res.json(200, {
			message: 'Authentication Success',
			token,
		})
	}
	return res.json(401, data)
})

/* create user */
route.post('/new/user', async (req, res) => {
	const { name, pass, email, college_id } = req.body
	console.log(req.body)
	let status = await Person.index({
		name,
		pass,
		email,
		college_id,
	})
	if (status.error) json(400, status)
	else res.json(200, status)
})

/* secure route */
route.get(
	'/secure',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		return res.status(200).send('Protected route :)')
	}
)

route.get(
	'/api/auth/facebook',
	passport.authenticate('facebook', {
		scope: ['email', 'public_profile'],
	})
)

route.get(
	'/api/auth/facebook/callback',
	passport.authenticate('facebook', { session: false }),
	async email => {
		const { data } = await Person.get({ email })

		if (!data)
			return res
				.status(401)
				.json({ error: true, message: 'Authentication failed' })

		if (!data.error) {
			const { name, college_id, claims, aud } = data
			const opts = {
				expiresIn: 120,
			}
			const secret = config.SECRET_JWT
			const token = jwt.sign(
				{
					email,
					name,
					college_id,
					claims,
					aud,
				},
				secret,
				opts
			)

			return res.json(200, {
				message: 'Authentication Success',
				token,
			})
		}
	}
)

/* check user jwt */
route.get(
	'/api/auth/check',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		return res.json(200, { error: false, message: 'Token verified' })
	}
)

module.exports = route
