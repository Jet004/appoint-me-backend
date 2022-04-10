import express from 'express'
const server = express()

// Access environment variables
import dotenv from 'dotenv'
dotenv.config()

// Run CORS middleware before anything else
import cors from 'cors'
server.use(cors({
    origin: process.env.CORS_ORIGIN,
}))

// Check if user has reached their daily rate limit
import rateLimit from 'express-rate-limit'
// Disable the rate limiter for testing
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'test') {
    server.use(rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 20, // limit each IP to 10 requests per windowMs
        standardHeaders: true,
        message: 'Too many requests, please try again later.'
    }))
}

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
// // // // // Load up test data
import pushMockData from './__test__/pushMockData.js'
const pushData = () => {return pushMockData(['all'])}
server.use(async (req, res, next) => {
    if(await mongoose.model("User").countDocuments() === 0) {
        console.log(pushData())
    }
    next()

})

// Handle user sessions
import { sessionHandler } from './middleware/sessionHandler.js'
server.use(sessionHandler())

// Handle HTTP request logging
import requestLogger from './middleware/requestLogger.js' 
import { createRequestLog } from './models/requestLogModel.js'  
server.use(requestLogger(createRequestLog))

// Enable request body parsing so that the request body is accessible
server.use(express.json())
server.use(express.urlencoded({ extended: true }))


// Import route handlers
import userRoutes from './routes/userRoutes'
server.use('/api/users', userRoutes)
import tempUserRoutes from './routes/tempUserRoutes'
server.use('/api/temp-users', tempUserRoutes)
import businessRepRoutes from './routes/businessRepRoutes'
server.use('/api/business-reps', businessRepRoutes)
import businessRoutes from './routes/businessRoutes'
server.use('/api/businesses', businessRoutes)
import authRoutes from './routes/authRoutes'
server.use('/api/auth', authRoutes)
import appointmentRoutes from './routes/appointmentRoutes'
server.use('/api/appointments', appointmentRoutes)

// Run server
server.listen(process.env.PORT, () => {
    console.log(`Server --> Server is running on port ${process.env.PORT}`)
})





