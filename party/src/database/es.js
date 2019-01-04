// require('dotenv').load()
// require('dotenvenc')(process.env.DOTENVENC_KEY)
// require('dotenv').config()

const es = require('elasticsearch')
const _ = require('lodash')
const { es_config } = require('./config')

class Database {

    constructor(index){
        this.index = index
        this.db = new es.Client(es_config)        
        console.log('Checking for connection to elastic...\n', this.db.ping())
    }
    
    static async connect() {
        // this.db = new es.Client(es_config)
	    // Check for connection
    }

    async create(data) {
    	try {
    		return await this.db.create({
    			index: this.index,
    			type: '_doc',
    			id: `${_.snakeCase(data.name)}-${_.snakeCase(data.author)}`,
    			body: data,
    		})
    	} catch (e) {
    		return e
    	}
    }

    async get(data) {

    	try {
    		let response = await this.db.get({
    			index: this.index,
    			type: '_doc',
    			...data,
    		})
    		return response._source
    	} catch (e) {
    		return e
    	}
    }

    async get_all() {

        try {
    		let response = await this.db.search({
    			index: this.index,
    			type: '_doc',
    			body: {
                    query: {
                        match_all: {}
                    }
                },
    		})
    		return response.hits.hits
    	} catch (e) {
    		return e
        }

    }

    async delete(filter) {

        try {

            response = await this.db.deleteByQuery({
                index: this.index,
                body: {
                    query: {
                      ...filter
                    }
                }
            })
            return response

        } catch (e) {
            return e
        }
    }

    async update(filter, update) {

        try {

            const response = await this.db.updateByQuery({
                index: this.index,
                type: '_doc',
                body: {
                    query: {
                        ...filter
                    },
                    update: {
                        ...update
                    }
                }
            })

            return response

        } catch (e) {
            return e
        }

    }

    async update_id(filter, update) {

        try {
            const response = await this.db.update({
                index: this.index,
                type: '_doc',
                ...filter,
                body: {
                    doc: {
                        ...update
                    }
                }
            })

            return response

        } catch (e) {
            return e
        }

    }
}

module.exports = Database