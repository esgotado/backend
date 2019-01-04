const   express             = require('express')
let     party               = require('./src/party') 

let port        = 3000
let app         = express()
app.use('/party', party)

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`)
    console.log('to exit: ctrl + c')
})
