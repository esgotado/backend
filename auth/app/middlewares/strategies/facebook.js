'use strict'

const FacebookStrategy = require('passport-facebook').Strategy
const config = require('../../../config')

const opts = {
    clientID: config.FB_APPID, 
    clientSecret: config.FB_APPSECRET,
    callbackURL: config.FB_CALLBACK,
    profileFields: ['id', 'name', 'picture', 'email'],
    enableProof: true
}


const factory = (PersonService) => {
    const Strategy =  new FacebookStrategy(opts, (access_token, refresh_token, profile, done) => {
        console.log("nois")
   
        return done(null, true)
    })

    return Strategy
}

module.exports = { factory }