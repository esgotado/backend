'use strict'

/* npm modules */
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const database = require('./database')
const PersonService = require('./services/person')
const jwtStrategy = require('./middlewares/jwt')

const factory = () => {
    const { repositories, storages } = database.factory()
  
    /* create app */
    const app = express()
    app.use(express.json())

    /* strategies */
    passport.use(jwtStrategy)

    /* homepage route */
    app.get('/', (req, res) => {
        res.send('You should hack more')
        //console.log(res)
    })

    /* auth route */
    app.post("/api/auth", (req, res) => {
        let { user, pass } = req.body

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
        let { name, user, pass, collegeId } = req.body

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

    /* secure route */
    app.get("/secure", passport.authenticate('jwt', { session: false }), (req, res) => {
        return res.status(200).send("Protected route :)")
    })

    return app
}
  
module.exports = { factory }

