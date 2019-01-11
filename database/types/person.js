const db = require('../es_client')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const Doc = require('./doc')

module.exports = class Person extends Doc {
	constructor() {
		super('person')
	}
	/**
	 * Returns person data
	 * @param {{id, email}} params email or id to search for person
	 * @return {{data:{pass, name}}|{error,info}}
	 */
	static async get(params) {
		// if id is given, search on id
		if (params.id) {
			try {
				let result = await db.get({
					index: 'person',
					type: '_doc',
					id: params.id,
				})
				return result._source
					? {
							data: result._source,
					  }
					: {
							error: true,
							info: 'person not found',
					  }
			} catch (e) {
				return {
					error: true,
					info: e,
				}
			}
		}
		// else if email is given, search by it
		else if (params.email) {
			try {
				let results = await db.search({
					index: 'person',
					type: '_doc',
					body: { query: { term: { email: params.email } } },
				})
				let found = _.take(results.hits.hits)[0] || null
				return found._source
					? {
							data: found._source,
					  }
					: {
							error: true,
							info: 'person not found',
					  }
			} catch (e) {
				return {
					error: true,
					info: e,
				}
			}
		}
		return {
			error: true,
			info: 'params missing',
		}
	}

	static async check_password(email, password) {
		let { data: person = null } = await Person.get({ email })
		console.log('person', person)
		if (person) {
			if (person.pass && password) {
				return bcrypt.compareSync(password, person.pass)
					? {
							data: person,
					  }
					: {
							error: true,
							info: "passwords don't match",
					  }
			}
			return {
				error: true,
				info: 'password missing',
			}
		}
		return {
			error: true,
			info: 'user not found',
		}
	}

	/**
	 * Indexes
	 * @param {{name, pass, email, college_id}} data email or id to search for person
	 * @return {any|{error,info}}
	 */
	static async index(data) {
		let { data: person = null } = await Person.get({ email: data.email })
		if (!person)
			try {
				let { name, pass, email, college_id, claims } = data
				if (name && pass && email)
					return db.index({
						index: 'person',
						type: '_doc',
						body: {
							name,
							pass: bcrypt.hashSync(pass, 10),
							email,
							college_id,
							claims,
						},
					})
				return {
					error: true,
					info: 'missing params',
				}
			} catch (e) {
				console.log('error create', e)
				return {
					error: true,
					info: e,
				}
			}
		return {
			error: true,
			info: 'user already indexed',
		}
	}
}
