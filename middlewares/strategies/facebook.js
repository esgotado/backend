const { Person } = require('../../database')
const FacebookStrategy = require('passport-facebook').Strategy
const config = require('../../config')

const opts = {
	clientID: config.FB_APPID,
	clientSecret: config.FB_APPSECRET,
	callbackURL: config.FB_CALLBACK,
	profileFields: ['id', 'name', 'picture', 'email'],
	enableProof: true,
}

module.exports = () => {
	const Strategy = new FacebookStrategy(
		opts,
		async (access_token, refresh_token, profile, done) => {
			//console.log(profile)
			//console.log(emails[0].value)
			let { email, first_name, last_name } = profile._json
			const data = await Person.get({ email })
			console.log(data)

			if (data.error && email)
				await Person.index({
					name: `${first_name} ${last_name}`,
					pass: '',
					email,
					college_id: null,
				})
			return done(null, true)
		}
	)

	return Strategy
}
