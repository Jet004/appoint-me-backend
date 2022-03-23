// Access .env file
const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')

const connect = () => {

    // Connect to database with mongoose
    return mongoose.connect(process.env.TEST_DB_URL, 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        })
}

module.exports = connect