const db = require('../es_client')
const _ = require('lodash')

module.exports = class Party {
	constructor() {}

	static async search(q) {
		try {
			let results = await db.search({
				index: 'party',
				type: '_doc',
				body: { q },
			})
			return results.hits.hits
		} catch (e) {
			return {
				error: true,
				info: e,
			}
		}
	}

	static async get(params) {
		if (params.id) {
			try {
				let result = await db.get({
					index: 'party',
					type: '_doc',
					id: params.id,
				})
				return result._source
					? {
							data: result._source,
					  }
					: {
							error: true,
							info: 'party not found',
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
			info: 'no params given',
		}
	}

	static async index(entry) {
		try {
			return await db.index({
				index: 'party',
				type: '_doc',
				body: entry,
			})
		} catch (e) {
			return {
				error: true,
				info: e,
			}
		}
	}

	static async index(params) {
		try {
			let { id, doc } = params
			return await db.update({
				index: 'party',
				type: '_doc',
				id,
				body: { doc },
			})
		} catch (e) {
			return {
				error: true,
				info: e,
			}
		}
	}

	static async index(params) {
		try {
			let { id } = params
			return await db.delete({
				index: 'party',
				type: '_doc',
				id,
			})
		} catch (e) {
			return {
				error: true,
				info: e,
			}
		}
	}
}
