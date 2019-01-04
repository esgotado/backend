'use strict'

const { Strategy, ExtractJwt } = require('passport-jwt')
const config = require('../config')

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: config.SECRET_JWT
}

module.exports = new Strategy(opts, (jwt_payload, done) => {
    if (jwt_payload.user === "vrechson") {
        return done(null, true)
    }
    return done(null, false)
})