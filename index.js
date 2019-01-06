const express = require('express')
let party = require('./routes/party')
let auth = require('./routes/auth')

let port = process.env.PORT || 3000
let app = express()
app.use('/party', party)
app.use('/auth', auth)

app.listen(port, () => {
	console.log(`Server running on https://localhost:${port}`)
	console.log('to exit: ctrl + c')
})
