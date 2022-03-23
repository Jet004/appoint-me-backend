const express = require('express')
const server = express()

// Access environment variables
const dotenv = require('dotenv')
dotenv.config()

// Connect to database with mongoose
const mongoose = require('mongoose')
process.env.NODE_ENV === 'test' ? dbURL = process.env.TEST_DB_URL : dbURL = process.env.DB_URL
mongoose.connect(dbURL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => console.log(`Database --> Connected to database "${mongoose.connection.name}"`))
    .catch(err => {
        console.log(err)
    })

// Log request information for every request
server.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
})

// Enable response parsing
server.use(express.json())
server.use(express.urlencoded({ extended: true }))


// Import Routes
const userRoutes = require('./routes/userRoutes')
server.use('/api/user', userRoutes)





// Run server
server.listen(process.env.PORT, () => {
    console.log(`Server --> Server is running on port ${process.env.PORT}`)
})





