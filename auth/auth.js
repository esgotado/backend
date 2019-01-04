'use strict'

/* npm modules */
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const database = require('./database')
const PersonService = require('./services/person')
const jwtStrategy = require('./middlewares/jwt')
const bodyParser = require('body-parser')
const config = require('./config')
const { repositories, storages } = database.factory()

const personService = new PersonService(repositories.person, storages.person)

const services = {
    person: personService
}

/* create app */
const router = express.Router()

/* bodyParser because express.json() wasn't working */
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

/* strategies */
passport.use(jwtStrategy)

/* homepage route */
router.get('/', (req, res) => {
    res.send('You should hack more')
    //console.log(res)
})

/* auth route */
router.post("/api/auth", (req, res) => {
    const { email, pass } = req.body

    /* hard coding just to test auth issue */
    const data = personService.identify(email, pass)
    const { name, id_college } = data

    if (data !== false) {
        const opts = {
            expiresIn: 120
        }
        const secret = config.SECRET_JWT
        const token = jwt.sign({ email, name, id_college }, secret, opts)
        return res.status(200).json({
            message: "Authentication Success",
            token
        })
    }
    return res.status(401).json({ message: "Authentication Failed" })
})

/* create user */
router.post("/api/auth/new/user", (req, res) => {
    const { name, pass, email, college_id } = req.body
    
    personService.create(name, pass, email, college_id)
    return res.status(200).json({ message: "[app]: New user created." })
})

/* secure route */
router.get("/secure", passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).send("Protected route :)")
})

module.exports = router

