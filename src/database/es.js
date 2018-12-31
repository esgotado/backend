require('dotenv').load()
require('dotenvenc')(process.env.DOTENVENC_KEY)
require('dotenv').config()

const es = require('elasticsearch')
const _ = require('lodash')
const { es_config } = require('./config')

let db

async function initialize() {
	db = new es.Client(es_config)
	// Check for connection
	console.log('Checking for connection to elastic...\n', await db.ping())
}

async function createData(data, index) {
	try {
		return await db.create({
			index: index,
			type: '_doc',
			id: `${_.snakeCase(data.name)}-${_.snakeCase(data.author)}`,
			body: data,
		})
	} catch (e) {
		return e
	}
}

async function getData(data, index) {

	try {
		let response = await db.get({
			index: index,
			type: '_doc',
			...data,
		})
		return response._source
	} catch (e) {
		return e
	}
}

async function getDataById(data, index) {

    return getData(data, index)
    
}

async function getAll(index) {

    try {
		let response = await db.search({
			index: index,
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

async function deleteAll(index) {

	return [] 
}

async function deleteData(filter, index) {

    try {

        response = await db.deleteByQuery({
            index: index,
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

async function deleteDataById(filter, index) {

    return deleteData(filter, index)

}

async function updateData(filter, update, index) {

    try {

        const response = await db.updateByQuery({
            index: index,
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

async function updateById(filter, update, index) {
    
    try {
        const response = await db.update({
            index: index,
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

module.exports = {
	initialize,
	createData,
	getData,
	getDataById,
	getAll,
	deleteAll,
    deleteData,
    deleteDataById,
    updateData,
    updateById
}
