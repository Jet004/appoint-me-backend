import express from 'express'
import dotenv from 'dotenv'
// Middleware Imports
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import { sessionHandler } from './middleware/sessionHandler.js'
import requestLogger from './middleware/requestLogger.js' 
import { createRequestLog } from './models/requestLogModel.js'
import fileUpload from 'express-fileupload' 
// Import route handlers 
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import tempUserRoutes from './routes/tempUserRoutes'
import businessRoutes from './routes/businessRoutes'
import businessRepRoutes from './routes/businessRepRoutes'
import appointmentRoutes from './routes/appointmentRoutes'

const app = () => {

    const server = express()

    // Access environment variables
    dotenv.config()

    // Run CORS middleware before anything else
    server.use(cors({
        origin: [...process.env.CORS_ORIGIN.split(", ")],
    }))

    // Rate limiting middleware
    // Disable the rate limiter for testing
    if (process.env.NODE_ENV !== 'test') {
        // Check if user has reached their daily rate limit
        server.use(rateLimit({
            windowMs: 24 * 60 * 60 * 1000, // 24 hours: 1000 milliseconds * 60 seconds * 60 minutes * 24 hours
            max: 1000, // limit each IP to 1000 requests per windowMs
            standardHeaders: true,
            message: 'Too many requests, please try again later.'
        }))
    

        // Slow user requests to one per second
        server.use(slowDown({
            windowMs: 1000, // 1 second
            delayAfter: 1, // limit each IP to 1 requests per windowMs
            delayMs: 1000, // Delays the response by 1 second
            maxDelayMs: 1000, // Max delay is 1 second
        }))
    }

    // Handle user sessions
    server.use(sessionHandler())

    // Handle HTTP request logging
    server.use(requestLogger(createRequestLog))

    // Enable request body parsing so that the request body is accessible
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))
    server.use(fileUpload({
        createParentPath: true,
        limits: {
            fileSize: 2 * 1024 * 1024 // 2MB
        }
    }))

    server.get('/', (req, res) => res.status(418).json({ status: "Refused to brew coffee", message: 'I\'m a teapot' }))

    // Import route handlers
    server.use('/api/users', userRoutes)
    server.use('/api/temp-users', tempUserRoutes)
    server.use('/api/business-reps', businessRepRoutes)
    server.use('/api/businesses', businessRoutes)
    server.use('/api/auth', authRoutes)
    server.use('/api/appointments', appointmentRoutes)

    return server
}

export default app

