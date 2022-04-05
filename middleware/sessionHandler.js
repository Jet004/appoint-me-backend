import jwt from 'jsonwebtoken'
import User from '../models/userModel'
import BusinessRep from '../models/businessRepModel'
import dotenv from 'dotenv'
import TokenBlacklist from '../models/authBlacklistModel'
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
    
    // Check that accessToken is present
    if (!accessToken) {
        // No access token in request header, user is not logged in, so set session variables to false
        req.session.loggedIn = false
        req.session.user = null
        // Pass control to next middleware
        return next()
    }

    let decodedToken
    try {
        // check that accessToken is valid
        decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET)
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
    
    // check tokens not expired
    const currentTime = Math.floor(new Date().getTime()/1000)
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
    let user
    try {
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

    // Check that token is not on logout blacklist
    try {
        const blacklistedToken = await TokenBlacklist.findOne({ accessToken })
        if(blacklistedToken) {
            // User logged out and needs to reauthenticate. Set session variables to false
            req.session.loggedIn = false
            req.session.user = null
            // Pass control to next middleware
            return next()
        }
    } catch (e) {
        console.log(e)
        // Error checking logout blacklist, respond with 500 Internal Server Error
        return res.status(500).json({ status: "error", message: e.message })
    }
    
    // User is logged in, set session variables and pass control to next middleware
    req.session.loggedIn = true
    req.session.user = user
    req.session.userType = decodedToken.roles
    return next()
}

export const requireLogin = () => (req, res, next) => {
    // Check if user is logged in

    if(!req.session.loggedIn) {
        // User is not logged in, respond with 401 Unauthorized
        return res.status(401).json({ status: "error", message: "Unauthorized" })
    }
    console.log(req.session.loggedIn)

    // User is logged in, pass control to next middleware
    return next()
}


export const requireRoles = (allowedRoles) => (req, res, next) => {
    // Check role type and determine if user can access the requested resource - session.role = 'admin' - include this middleware in all routes that require admin access
    // Include in routes, provide an array of allowed roles for each route which requires admin access

    if(!req.session.userType || !allowedRoles.includes(req.session.userType)) {
        // User is not logged in, or does not have the required role, respond with 401 Unauthorized
        return res.status(401).json({ status: "error", message: "Unauthorized" })
    }

    // User is logged in and has the required role, pass control to next middleware
    return next()
}