import express from 'express'
const server = express()

// Access environment variables
import dotenv from 'dotenv'
dotenv.config()

// Connect to MongoDB database
import mongoose from 'mongoose'
import connect from './models/database.js'
connect(process.env.DB_URL)
mongoose.connection.on('open', () => console.log(`Database --> Connected to database "${mongoose.connection.name}"`))
mongoose.connection.on('error', (err) => console.log(`Database --> Error connecting to database "${mongoose.connection.name}"`, err))


// Log request information for every request
server.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
})

// Enable response parsing
server.use(express.json())
server.use(express.urlencoded({ extended: true }))


// Import Routes
import userRoutes from './routes/userRoutes'
server.use('/api/users', userRoutes)


// Run server
server.listen(process.env.PORT, () => {
    console.log(`Server --> Server is running on port ${process.env.PORT}`)
})





