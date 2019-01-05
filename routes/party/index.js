const express = require('express')
const logger = require('morgan')
const { Party } = require('../../database')
const router = express.Router()

router.use(express.json())
router.use(logger('dev'))

// Token is valid
function tokenIsValid() {
	return true
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
router.post('/', async (req, res) => {
	// Verify data and user
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
})

router.put('/:id', async (req, res) => {
	// Verify data and user
	if (tokenIsValid()) {
		// Retrieve data
		let entry = req.body
		// PUT on db
		let response = await Party.update({ id: req.params.id, doc: entry })
		// Res
		res.send(response)
	} else
		res.status(412).json({
			message: 'some field is missing',
		})
})

// Delete a party
router.delete('/:id', async (req, res) => {
	try {
		let response = await Party.delete({ id: req.params.id })
		res.send(response)
	} catch (e) {
		res.status(400).send(e.response)
	}
})

module.exports = router
