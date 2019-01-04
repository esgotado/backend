const 	express 	= require('express')
const 	Database 	= require('./database/es')
const 	Strategies 	= require('./middlewares/strategies/local')
const	passport	= require('passport')
const	logger		= require('morgan')
let 	router 		= express.Router()

// Database.connect()
var Elastic = new Database('party')

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
	// Only for dev use
	try {
		result = await Elastic.get_all()
		res.send(result)
	} catch (e) {
		res.status(e.statusCode).send(e.response)
	}
})

router.get('/search', async (req, res) => {
	// Request to db
	try {
		result = await Elastic.get(req.query)
		var validResult = result.isArray
			? await result.filter(elem => {
					console.log(elem)
					return true // elem.active == true
			  })
			: result
	} catch (e) {
		console.log(e)
		res.status(400).send(e.response)
	}
	// Res
	res.send(validResult)
})

router.get('/:id', async (req, res) => {
	// Request to db
	try {
		result = await Elastic.get({ id: req.params.id })
		var validResult = result.isArray ? await result.filter(elem => {
			return true // elem.active == true
        }) 
        : result
	} catch (e) {
		console.log(e)
		res.status(400).send(e.response)
	}
	// Res
	res.send(validResult)
})

// Post a party
router.post('/', async (req, res) => {
	// Verify data and user
	if (validPartyEntry(req.body) && tokenIsValid()) {
		// Retrieve data
		let entry = formatBody(req.body)
		// POST on db
		let response = await Elastic.create(entry)
		res.send(response)
		// Res
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
		let response = await Elastic.update_id(
			{ id: req.params.id },
			entry,
		)
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
		let response = await Elastic.delete(
			{ id: req.params.id },
		)
		res.send(response)
	} catch (e) {
		res.status(400).send(e.response)
	}
})

module.exports = router