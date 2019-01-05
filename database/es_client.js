const es = require('elasticsearch')
const db = new es.Client(require('../config').ES_HOST)
module.exports = db
