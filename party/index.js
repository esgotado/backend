// Loading dotenv
require('dotenv').load()
require('dotenvenc')(process.env.DOTENVENC_KEY)
require('dotenv').config()

// Imports
const es = require('elasticsearch')
const { es_config } = require('./config')
const db = new es.Client(es_config)
const express = require('express')

// Route
let route = express.Router()
route.use(express.json())

// Token is valid

// Get All
route.get('/', async (req, res) => {
    let {
        hits: { hits: results },
    } = await db.search()
    res.send(results)
})

// Post a party
route.post('/', async (req, res) => {})

// Debug server
const app = express()
app.use('/party', route)
app.listen(1000)
