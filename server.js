const express = require('express')
const server = express()

// Access environment variables
const dotenv = require('dotenv')
dotenv.config()

// Connect to database with mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => console.log('Database --> Connected to database'))
    .catch(err => {
        console.log(err)
    })

// Enable response parsing
server.use(express.json())
server.use(express.urlencoded({ extended: true }))


// Import Routes
const userRoutes = require('./routes/user')
server.use('/api/user', userRoutes)





// Run server
server.listen(process.env.PORT, () => {
    console.log(`Server --> Server is running on port ${process.env.PORT}`)
})





