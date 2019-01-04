const es = require('elasticsearch')
const { es_config } = require('../../config')
const db = new es.Client(es_config)
const _ = require('lodash')

var repositories = {
	person: {
		async findByEmail(email) {
			try {
				let result = await db.search({
					index: 'person',
					type: '_doc',
					body: {
						query: {
							term: { email },
						},
					},
				})
				let found = _.take(result.hits.hits)[0] || null
				if (found) found = found._source
				return found || null
			} catch (e) {
				console.log('error find', e)
				return e
			}
		},
	},
}

var storages = {
	person: {
		create(name, pass, email, college_id) {
			try {
				return db.index({
					index: 'person',
					type: '_doc',
					body: {
						name,
						pass,
						email,
						college_id,
					},
				})
			} catch (e) {
				console.log('error create', e)
				return e
			}
		},
	},
}

module.exports = {
	factory() {
		return { repositories, storages }
	},
}
