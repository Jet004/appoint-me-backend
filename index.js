import express from 'express'
const server = express()

// Access environment variables
import dotenv from 'dotenv'
dotenv.config()

// Connect to MongoDB database
// Connection pool is established near the beginning of the express file
// so that it is accessible to all routes and middleware
import mongoose from 'mongoose'
// The connection pool is established in the models/database.js file
// this allows the database connection to be written once and used in
// both the express app and in integration and unit tests which are run
// from different scripts
import connect from './models/database.js'
connect(process.env.DB_URL)
// Logs the connection status to the console
mongoose.connection.on('open', () => console.log(`Database --> Connected to database "${mongoose.connection.name}"`))
mongoose.connection.on('error', (err) => console.log(`Database --> Error connecting to database "${mongoose.connection.name}"`, err))


// Log request information for every request for debugging
server.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
})

// Enable request body parsing so that the request body is accessible
server.use(express.json())
server.use(express.urlencoded({ extended: true }))


// Import Routes
import userRoutes from './routes/userRoutes'
server.use('/api/users', userRoutes)
import tempUserRoutes from './routes/tempUserRoutes'
server.use('/api/temp-users', tempUserRoutes)
import businessRepRoutes from './routes/businessRepRoutes'
server.use('/api/business-reps', businessRepRoutes)


// Run server
server.listen(process.env.PORT, () => {
    console.log(`Server --> Server is running on port ${process.env.PORT}`)
})





