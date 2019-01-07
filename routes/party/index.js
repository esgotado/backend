const express = require('express')
const logger = require('morgan')
const { Party } = require('../../database')
const router = express.Router()
const { JWTAuthentication } = require('../../middlewares')
router.use(express.json())
router.use(logger('dev'))

router.get('/', async (req, res) => {
	try {
		res.send(await Party.search())
	} catch (e) {
		res.status(e.statusCode).send(e.response)
	}
})

router.get('/search/:query', async (req, res) => {
	// Request to db
	try {
		res.send(await Party.search(req.params.query))
	} catch (e) {
		console.log(e)
		res.status(400).send(e.response)
	}
})

router.get('/:id', async (req, res) => {
	// Request to db
	try {
		let result = await Party.get({ id: req.params.id })
		if (result.error) res.status(400).json(error)
		else res.send(result.data)
	} catch (e) {
		console.log(e)
		res.status(400).send(e.response)
	}
})

// Post a party
router.post('/', JWTAuthentication, async (req, res) => {
	// Verify data and user
	if (isAdmin(req)) {
		if (validPartyEntry(req.body)) {
			// Retrieve data
			let entry = formatBody(req.body)
			let response = await Party.index(entry)
			// POST on db
			res.send(response)
		} else
			res.status(412).json({
				message: 'some field is missing',
			})
	} else
		res.status(401).json({
			error: true,
			message: "you can't do that",
		})
})

router.put('/:id', JWTAuthentication, async (req, res) => {
	// Verify data and user
	if (isAdmin(req)) {
		// Retrieve data
		let entry = req.body
		// PUT on db
		let response = await Party.update({ id: req.params.id, doc: entry })
		// Res
		res.send(response)
	} else
		res.status(401).json({
			error: true,
			message: "you can't do that",
		})
})

// Delete a party
router.delete('/:id', JWTAuthentication, async (req, res) => {
	if (isAdmin(req)) {
		try {
			let response = await Party.delete({ id: req.params.id })
			res.send(response)
		} catch (e) {
			res.status(400).send(e.response)
		}
	} else
		res.status(401).json({
			error: true,
			message: "you can't do that",
		})
})

// Token is valid
function isAdmin(req) {
	return req.claims.indexOf('esgotado_admin') >= 0
}

function validPartyEntry(entry) {
	let { name, author, description } = entry
	return name && author && description
}

function formatBody(body) {
	let entry = ({
		name,
		date,
		place,
		place_visibility,
		going,
		author,
		author_messages,
		drinks,
		description,
		features,
		pool,
		pricing,
	} = body)

	return entry
}

module.exports = router
