'use strict'

const { Strategy, ExtractJwt } = require('passport-jwt')
const config = require('../../config')

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: config.SECRET_JWT,
    audience: 'client'
}

module.exports = new Strategy(opts, (jwt_payload, done) => {
    return done(null, true)
})