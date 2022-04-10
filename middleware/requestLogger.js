import dotenv from 'dotenv'
dotenv.config()

const requestLogger = (createRequestLog) => async (req, res, next) => {
    // Log each request to the console for debugging (disable when testing)
    if (process.env.NODE_ENV !== 'test') {
        console.log(`${req.method} ${req.path}`)
    }

    // Get request data
    let logData = {
        clientIP: req.ip,
        requestMethod: req.method,
        requestPath: req.path,
        requestTime: new Date(),
        userAgent: req.get('User-Agent')
    }

    // If the user is logged in, add the session id to the log data
    if(req.session.loggedIn) {
        logData.sessionID = req.headers.authorization.split(' ')[1]
        logData.userId = req.session.user._id
        logData.userType = req.session.userType
    }

    // Create a new request log
    try {
        const results = await createRequestLog(logData)
        // If the request log was created successfully, continue to the next middleware
        if(results) {
            next()
        }
    } catch(e) {
        // Log was not created in DB, log data to console and continue to next middleware
        console.log(e, logData)
        next()
    }
}

export default requestLogger