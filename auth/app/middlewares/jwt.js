const {Strategy, ExtractJwt} = require('passport-jwt')


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: 'mustbeaenv' // change for a random string as enviroment var
}

module.exports = new Strategy(opts, (jwt_payload, done) => {
    if (jwt_payload.user === "vrechson") {
        return done(null, true)
    }
    return done(null, false)
})