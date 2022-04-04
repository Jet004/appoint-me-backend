import jwt from 'jsonwebtoken'
import User from '../models/userModel'
import BusinessRep from '../models/businessRepModel'
import dotenv from 'dotenv'
dotenv.config()

export const sessionHandler = () => async (req, res, next) => {
    // Check for JWT in request header and body and initialise session variables checks pass
    // This could be implemented as application level middleware - checks logged in status, sets session variables
    // and passes to next middleware

    // Initialise variables
    let accessToken
    req.session = {}


    // Check for JWT in request header and body
    if (req.headers.authorization) {
        accessToken = req.headers.authorization.split(' ')[1]
    }
    console.log("Access Token: ", accessToken)

    // Check that accessToken is present
    if (!accessToken) {
        console.log("No access token")
        // No access token in request header, user is not logged in, so set session variables to false
        req.session.loggedIn = false
        req.session.user = null
        // Pass control to next middleware
        return next()
        console.log("Should not see this message")
    }

    let decodedToken
    try {
        // check that accessToken is valid
        decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET)
        console.log(decodedToken)
        if(!decodedToken && !decodedToken.azp) {
            // Access token is invalid, user is not logged in, so set session variables to false
            req.session.loggedIn = false
            req.session.user = null
            // Pass control to next middleware
            return next()
        }
    } catch(e) {
        // Error decoding JWT, user is not logged in, so set session variables to false
        req.session.loggedIn = false
        req.session.user = null
        // Pass control to next middleware
        return next()
    }
console.log(decodedToken)
    // check tokens not expired
    const currentTime = new Date().getTime()
    if(currentTime > decodedToken.exp) {
        // Access token is expired, user is not logged in, so set session variables to false
        req.session.loggedIn = false
        req.session.user = null
        // Pass control to next middleware
        return next()
    }

    // Checking the refresh token is not required as it is only used to generate a new access token
    // Generating when to refresh the access token is handled by the front end

    // Check that accessToken refers to a valid user
    try {
        let user
        // Check user type so we access the correct MongoDB collection
        if(decodedToken.roles === 'user') {
            user = await User.findById(decodedToken.azp)
        } else if(decodedToken.roles === 'businessRep') {
            user = await BusinessRep.findById(decodedToken.azp)
        } else {
            // User type is invalid, user is not logged in, set user to false
            user = false
        }
        // Check that user is valid
        if(!user) {
            // Access token is invalid, user is not logged in, so set session variables to false
            req.session.loggedIn = false
            req.session.user = null
            // Pass control to next middleware
            return next()
        }
    } catch(e) {
        console.log(e)
        // An error occurred getting the user details, respond with 500 Internal Server Error
        return res.status(500).json({ status: "error", message: e.message })
    }

    // User is logged in, set session variables and pass control to next middleware
    req.session.loggedIn = true
    req.session.user = user
    return next()
}

export const requireLogin = () => (req, res, next) => {
    // Check if logged in... session.isLoggedIn = true - include this middleware in all routes that require authentication
}


export const requireRoles = (allowedRoles) => (req, res, next) => {
    // Check role type and determine if user can access the requested resource - session.role = 'admin' - include this middleware in all routes that require admin access
    // Include in routes, provide an array of allowed roles for each route which requires admin access

}