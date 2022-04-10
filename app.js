import express from 'express'
import dotenv from 'dotenv'
// Middleware Imports
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { sessionHandler } from './middleware/sessionHandler.js'
import requestLogger from './middleware/requestLogger.js' 
import { createRequestLog } from './models/requestLogModel.js' 
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
        origin: process.env.CORS_ORIGIN,
    }))

    // Check if user has reached their daily rate limit
    // Disable the rate limiter for testing
    if (process.env.NODE_ENV !== 'test') {
        server.use(rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 20, // limit each IP to 10 requests per windowMs
            standardHeaders: true,
            message: 'Too many requests, please try again later.'
        }))
    }

    // Handle user sessions
    server.use(sessionHandler())

    // Handle HTTP request logging
    server.use(requestLogger(createRequestLog))

    // Enable request body parsing so that the request body is accessible
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))

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

