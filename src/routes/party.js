// const   elasticsearch   = require('elasticsearch') 
let     express             = require('express')
let     database            = require('../database/es')
let     router              = express.Router()

database.initialize()

router.use(express.json())

// Token is valid
function tokenIsValid() {
    return true
}

function validPartyEntry(entry) {
    let { name, author, description } = entry
    return name && author && description
}

function formatBody(body) {
    let entry = {
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
        pricing
    } = body

    return entry
}

router.get('/', async (req, res) => {
    
    // Only for dev use
    try {
        result = await database.getAll('party')
        res.send(result)
    } catch (e) {
        res.status(e.statusCode).send(e.response)
    }

})

router.get('/search', async (req, res) => {
    
    // Request to db
    try {
        result = await database.getData(req.query, 'party')
        var validResult = result.isArray ? await result.filter((elem) => {
            console.log(elem)
            return true // elem.active == true
        }) : []
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
        result = await database.getDataById({id: req.params.id}, 'party')
        var validResult = await result.filter((elem) => {
            return true // elem.active == true
        })
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
        let response = await database.createData(entry, 'party')
        res.send(response)
        // Res
    } else res.status(412).json({
        message: 'some field is missing' 
    })

})

router.put('/:id', async (req, res) => {
    
    // Verify data and user
    if (validPartyEntry(req.body) && tokenIsValid()) {
        // Retrieve data
        let entry = formatBody(req.body)
        // PUT on db
        response = await database.updateData({id: req.params.id}, entry, 'party')
        let response = await database.createData(entry, 'party')
        // Res
        res.send(response)
    } else res.status(412).json({
        message: 'some field is missing' 
    })
    
})

// Delete a party
router.delete('/:id', async (req, res) =>  {
    try {
        let response = await database.deleteDataById({id: req.params.id}, 'party')
        res.send(response)
    } catch (e) {
        res.status(400).send(e.response)
    }

})


module.exports = router