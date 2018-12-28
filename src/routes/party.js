const   express         = require('express')
const   elasticsearch   = require('elasticsearch') 
let     router          = express.Router()

let user        = process.env.ES_USR
let passwrd     = process.env.ES_PSS
let credentials = `${user}:${passwrd}`
let elasticaddr = '35.196.210.23/elastic'

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
});

router.get('/', async (req, res) => {

    // Verify user

    // Request to db

    // Res

    res.send('GET')

})

router.post('/', async (req, res) => {

    // Verify user

    // POST on db

    // Res

})

router.delete('/', async (req, res) =>  {

})

router.put('/', async (req, res) => {

})

module.exports = router