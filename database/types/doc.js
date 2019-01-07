const db = require('../es_client')
const _ = require('lodash')

module.exports = class Doc {
    
    constructor(index) {
        this.idx = index    
    }

    // Search doc by query 
	static async search(q, idx) {
		try {
			let results = await db.search({
				index: idx,
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

    // Get doc by id
	static async get(params, idx) {
		if (params.id) {
			try {
				let result = await db.get({
					index: idx,
					type: '_doc',
					id: params.id,
				})
				return result._source
					? {
							data: result._source,
					  }
					: {
							error: true,
							info: `${this.idx} not found`,
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

    // Add a new entry
	static async index(entry, idx) {
		try {
			return await db.index({
				index: idx,
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

    // Update an entry
	static async update(params, idx) {
		try {
			let { id, doc } = params
			return await db.update({
				index: idx,
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

    // Delete an entry
	static async delete(params, idx) {
		try {
			let { id } = params
			return await db.delete({
				index: idx,
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
