'use strict'

// npm modules
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const jwtStrategy = require('./middlewares/jwt')


// create app
const app = express()

// passport issues
passport.use(jwtStrategy)

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// define a homepage
app.get('/', (req, res) => {
    res.send('You should hack more')
    //console.log(res)
})

app.post("/login", (req, res) => {
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

app.get("/secure", passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).send("Protected route :)")
})

// define a port to listen
app.listen(3443, () => {
    console.log('Server running on port 3443')
})