// const   elasticsearch   = require('elasticsearch') 
let     express             = require('express')
let     mongo               = require('../db/mongo')
let     router              = express.Router()

let user        = 'iago'
let passwrd     = 'iago_super_secure_pwd_shh'
let mongoaddr   = 'localhost'
let credentials = `${user}:${passwrd}`
let db          = mongo.initialize('party')

router.use(express.json())

router.get('/', async (req, res) => {
    
    // Retrieve data
    let query = req.query
    // Verify user

    // Request to db
    result = await mongo.getData(query, 'party')
    var validResult = await result.filter((elem) => {
        console.log(elem)
        return elem.active == true
    })
    // Res
    
    res.send(validResult)
    
})

router.get('/all', async (req, res) => {
    
    // Only for dev use
    result = await mongo.getAll('party')
    res.send(result)

})

router.post('/', async (req, res) => {
    
    // Retrieve data
    let entry = {
        name            : req.body.name,
        date            : req.body.date,
        description     : req.body.description,       
        drinks          : req.body.drinks,
        admin           : req.body.admin,
        active          : false
    }
    // Verify data
    if (entry.name == null) res.status(412).send('name missing')
    else {    
        // Verify user
    
        // POST on db
        ok = await mongo.createData(entry, 'party').ok
    
        // Res
        if (ok == 1) res.status(500)
        else res.status(200).send(`party created`)
    }
})

router.delete('/', async (req, res) =>  {
    
    query = req.body
    await mongo.deleteData(query, 'party')
    res.status(200).send('deleted')

})

router.delete('/all', async (req, res) => {

    await mongo.deleteAll('party')
    res.status(200).send('deleted')

})

router.put('/', async (req, res) => {
    
    // Retrieve data
    let entry = Object.keys(req.body).reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
    }, {})
    
    // Verify data
    if (entry.name == null) res.status(412).send('name missing')
    else {    
        // Verify host
    
        // POST on db
        ok = await mongo.updateData({name: entry.name}, entry, 'party').ok
    
        // Res
        if (ok == 1) res.status(500)
        else res.status(200).send(`party updated`)
    }
    
})

module.exports = router

/* ES stuff
let user        = process.env.ES_USR
let passwrd     = process.env.ES_PSS
let credentials = `${user}:${passwrd}`
let elasticaddr = 'esgotado.app/elastic'

console.log(`${credentials}@${elasticaddr}`)
let client  = new elasticsearch.Client({
    host: `${credentials}@${elasticaddr}`,
    log: 'trace',
})

client.ping({
    requestTimeout: 30000,
}, async (error) => {
    if (error) {
        console.error('elasticsearch not working')
    } else {
        console.log('elasticsearch working')
    }
})
*/