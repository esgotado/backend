const MongoClient   = require('mongodb')
let db

async function initialize(collection, dbAdress = 'localhost:27017', usr = null, pwd = null) {

    let connection = await MongoClient.connect(`mongodb://${dbAdress}`, { useNewUrlParser: true })
    if (usr != null) await Db.authenticate(usr, pwd)
    db = await connection.db(collection)
    return connection

}

async function createData(data, collection) { // Funcionando

    return await db.collection(collection).insertOne(data)

}

async function createMultipleData(dataArray, collection) { // Funcionando

    return await db.collection(collection).insertMany(dataArray)

}

async function getData(data, collection) { // Funcionando

    return await db.collection(collection).find(data).toArray()
}

async function getDataById(data, collection) {

    return await db.collection(collection).find({_id: MongoClient.ObjectID(data.id)}).toArray()
}

async function getAll(collection) { //Funcionando

    return await db.collection(collection).find({}).toArray()

}

async function deleteAll(collection) {  // Funcionando

    return await db.collection(collection).deleteMany({})

}

async function deleteData(filter, collection) { // Funcionando

    return await db.collection(collection).deleteOne(filter)

}

async function deleteDataById(filter, collection) {

    return await db.collection(collection).deleteOne({_id: MongoClient.ObjectID(filter.id)})

}

async function deleteMultipleData(filter, collection) {

    return await db.collection(collection).deleteMany(filter)

}

async function updateData(filter, update, collection) {

    return await db.collection(collection).updateOne(filter, {$set: update}, {upsert: true})

}

async function updateId(filter, update, collection) {

    return updateData({_id: MongoClient.ObjectID(filter.id)}, update, collection)

}
async function updateMultipleData(filter, update, collection) {

    return await db.collection(collection).updateMany(filter, update)
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
    deleteDataById,
    updateData,
    updateMultipleData,
    updateId

}