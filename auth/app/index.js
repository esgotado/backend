require('dotenv').load()
require('dotenvenc')(process.env.DOTENVENC_KEY)
require('dotenv').config()

/* npm modules */
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const database = require('./database_es')
const PersonService = require('./services/person')
const Strategies = require('./middlewares/strategies/local')
const FacebookStrategy = require('./middlewares/strategies/facebook')
const bodyParser = require('body-parser')
const config = require('../config')

const factory = () => {
	const { repositories, storages } = database.factory()

	const personService = new PersonService(
		repositories.person,
		storages.person
	)

	/* create app */
	const app = express()

	/* bodyParser because express.json() wasn't working */
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())

	/* strategies */
	passport.use(Strategies)
	passport.use(FacebookStrategy.factory(personService))

	/* homepage route */
	app.get('/', (req, res) => {
		res.send('Hack me')
		//console.log(res)
	})

	/* auth route */
	app.post('/api/auth', async (req, res) => {
		const { email, pass } = req.body

		/* hard coding just to test auth issue */
		const data = await personService.identify(email, pass)

		if (data === undefined)
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
					email: email,
					name: name,
					id_college: college_id,
					scopes: claims,
					aud: aud,
				},
				secret,
				opts
			)

			return res.status(200).json({
				message: 'Authentication Success',
				token,
			})
		}
		return res.status(401).json(data)
	})

	/* create user */
	app.post('/api/auth/new/user', async (req, res) => {
		const { name, pass, email, college_id } = req.body
		console.log(req.body)
		let { code, ...status } = await personService.create(
			name,
			pass,
			email,
			college_id
		)
		res.status(code).json(status)
	})

	/* secure route */
	app.get(
		'/secure',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			return res.status(200).send('Protected route :)')
		}
	)

	app.get(
		'/api/auth/facebook',
		passport.authenticate('facebook', {
			scope: ['email', 'public_profile'],
		})
	)

	app.get(
		'/api/auth/facebook/callback',
		passport.authenticate('facebook', { session: false }),
		async email => {
			const data = await personService.findByEmail(email)

			if (data === undefined)
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
						email: email,
						name: name,
						id_college: college_id,
						scopes: claims,
						aud: aud,
					},
					secret,
					opts
				)

				return res.status(200).json({
					message: 'Authentication Success',
					token,
				})
			}
		}
	)

	/* check user jwt */
	app.get(
		'/api/auth/check',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			return res
				.status(200)
				.json({ error: false, message: 'Token verified' })
		}
	)

	return app
}

module.exports = { factory }
