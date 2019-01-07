const db = require('../es_client')
const _ = require('lodash')
const Doc = require('./doc')

module.exports = class Party extends Doc {
	constructor() {
		super('party')
	}

	// Search doc by query 
	static async search(q) { super.search(q, 'party') }

    // Get doc by id
	static async get(params) { super.get(params, 'party') }

    // Add a new entry
	static async index(entry) { super.index(entry, 'party') }

    // Update an entry
	static async update(params) { super.update(params, 'party') }

    // Delete an entry
	static async delete(params) { super.delete(params, 'party') }

}
