// require('dotenv').load()
// require('dotenvenc')(process.env.DOTENVENC_KEY)
// require('dotenv').config()

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

async function createMultipleData(dataArray, collection) {
	// Funcionando

	return [] //await db.collection(collection).insertMany(dataArray);
}

async function getData(data, index) {
	// Funcionando

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
	//Funcionando

	// let results = await db.search({
	//     index: index,
	//     body: {
	//         query: {
	//             match_all: {},
	//         },
	//     },
	// })

	return [] //results
}

async function deleteAll(collection) {
	// Funcionando

	return [] //await db.collection(collection).deleteMany({});
}

async function deleteData(filter, collection) {
	// Funcionando

	return [] //await db.collection(collection).deleteOne(filter);
}

async function deleteMultipleData(filter, collection) {
	return [] //await db.collection(collection).deleteMany(filter);
}

async function updateData(filter, update, collection) {
	return [] //await db.collection(collection).updateOne(filter, {$set: update}, {upsert: true});
}

async function updateMultipleData(filter, update, collection) {
	return [] //await db.collection(collection).updateMany(filter, update);
}

module.exports = {
	initialize,
	createData,
	createMultipleData,
	getData,
	getDataById,
	getAll,
	deleteAll,
	deleteData,
	deleteMultipleData,
	updateData,
	updateMultipleData,
}
