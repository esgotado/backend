'use strict'

/* npm modules */
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const database = require('./database')
const PersonService = require('./services/person')
const jwtStrategy = require('./middlewares/jwt')
const bodyParser = require('body-parser')
const factory = () => {
    const { repositories, storages } = database.factory()

    const personService = new PersonService(repositories.person, storages.person)

    const services = {
        person: personService
    }
  
    /* create app */
    const app = express()

    /* bodyParser because express.json() wasn't working */
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    /* strategies */
    passport.use(jwtStrategy)

    /* homepage route */
    app.get('/', (req, res) => {
        res.send('You should hack more')
        //console.log(res)
    })

    /* auth route */
    app.post("/api/auth", (req, res) => {
        const { user, pass } = req.body

        /* hard coding just to test auth issue */

        if (user === "vrechson") {
            if (pass === "thisissafe") {
                const opts = {
                    expiresIn: 120
                }
                const secret = 'mustbeaenv' // change for a random string as enviroment var
                const token = jwt.sign({ user }, secret, opts)
                return res.status(200).json({
                    message: "Authentication Success",
                    token
                })
            }
        }
        return res.status(401).json({ message: "Authentication Failed" })
    })

    /* create user */
    app.post("/api/auth/new/user", (req, res) => {
        const { name, pass, email, college_id } = req.body
        console.log("pass: " + pass + "\nname: " + name + "\nemail " + email + "\nteam: " + college_id)
        personService.create(name, pass, email, college_id)
        return res.status(200).json({ message: "[App]: New user created." })
    })

    /* secure route */
    app.get("/secure", passport.authenticate('jwt', { session: false }), (req, res) => {
        return res.status(200).send("Protected route :)")
    })

    return app
}
  
module.exports = { factory }

