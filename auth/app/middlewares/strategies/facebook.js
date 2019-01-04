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
    const Strategy = new FacebookStrategy(opts, async (access_token, refresh_token, profile, done) => {
    //console.log(profile)
    //console.log(emails[0].value)
    const data = await PersonService.findByEmail(profile._json.email)

    console.log(data)
    
    if (data.error === true && profile._json.email)
        PersonService.createUser(profile._json.first_name + ' ' + profile._json.last_name, '', profile._json.email, 0, profile.id)
    
       

        return done(null, true)
    })

    return Strategy
}

module.exports = { factory }