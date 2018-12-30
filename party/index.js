// Loading dotenv
require('dotenv').load()
require('dotenvenc')(process.env.DOTENVENC_KEY)
require('dotenv').config()
const { DEBUG } = process.env

// Imports
const es = require('elasticsearch')
const { es_config } = require('./config')
const db = new es.Client(es_config)
const _ = require('lodash')
const express = require('express')

// Const
const index_type = { index: 'main', type: 'parties' }

// Route
let route = express.Router()
route.use(express.json())

// Token is valid
function tokenIsValid() {
    return true
}

// Get All
route.get('/', async (req, res) => {
    let {
        hits: { hits: results },
    } = await db.search({
        ...index_type,
        body: {
            query: {
                match_all: {},
            },
        },
    })
    if (tokenIsValid) res.send(results)
    else res.status(401)
})

function validPartyEntry(entry) {
    let { name, author, description } = entry
    return name && author && description
}

// Post a party
route.post('/', async (req, res) => {
    if (validPartyEntry(req.body)) {
        let { name, author } = req.body
        let response = await db.create({
            ...index_type,
            id: `${_.snakeCase(name)}-${_.snakeCase(author)}`,
            body: req.body,
        })
        res.send(response)
    } else
        res.status(412).json({
            error: 'some field is missing',
        })
})

// Update a party
route.put('/:id', async (req, res) => {
    if (validPartyEntry(req.body)) {
        let response = await db.update({
            ...index_type,
            id: req.params.id,
            body: { doc: req.body },
        })
        res.send(response)
    } else {
        res.status(412).json({
            error: 'some field is missing',
        })
    }
})

// Return a party
route.get('/:id', async (req, res) => {
    try {
        let response = await db.get({
            ...index_type,
            id: req.params.id,
        })
        res.send(response._source)
    } catch (e) {
        res.status(e.statusCode).send(e.response)
    }
})

// Delete a party
route.delete('/:id', async (req, res) => {
    try {
        let response = await db.delete({
            ...index_type,
            id: req.params.id,
        })
        res.send(response)
    } catch (e) {
        res.status(e.statusCode).send(e.response)
    }
})

// Search
route.get('/search/:query', async (req, res) => {
    let {
        hits: { hits: results },
    } = await db.search({
        ...index_type,
        q: req.params.query,
    })
    if (tokenIsValid) res.send(results)
    else res.status(401)
})

// Debug server
if (DEBUG) {
    const app = express()
    app.use('/party', route)
    app.listen(1000)
}
