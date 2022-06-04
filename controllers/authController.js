import bcrypt from 'bcrypt'

// Import JWT depenecies
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

import { parseIP, checkIP } from '../middleware/ipWhitelist.js'

export const registerUser = (DbRegisterUser, DbGetUserByEmail, DbRegisterBusinessRep, DbGetRepByEmail, DbRegisterIP, DbDeleteRep) => async (req, res) => {
    // This controller can register both a normal user and a businessRep user via the userType parameter
    try {
        // Hash user password
        if(req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 6)

        // Check if userType is valid and call the appropriate model method
        let results
        if(req.params.userType === 'user') {
            // Check if user already exists with the given email address
            if(await DbGetUserByEmail(req.body.email) !== null) {
                return res.status(400).json({ status: "error", message: "A user already exists with this email address" })
            }
            results = await DbRegisterUser(req.body)
        } else if(req.params.userType === 'businessRep') {
            // Check if user already exists with the given email address
            if(await DbGetRepByEmail(req.body.email) !== null) {
                return res.status(400).json({ status: "error", message: "A user already exists with this email address" })
            }
            results = await DbRegisterBusinessRep(req.body)

            if(results) {
                // Register IP address for whitelisting
                try {
                    const userId = results._id
                    const requestIP = parseIP(req)
                    const registeredIp = await DbRegisterIP(requestIP, userId)
                    if(!registeredIp) throw new Error("Failed to register IP address")
                } catch (e) {
                    console.log(e)
                    console.log("The above error occurred while registering the user's IP address, user DB object will be deleted")
                    try {
                        const repDeleted = await DbDeleteRep(results._id)
                        if(!repDeleted) throw new Error("Failed to delete user")
                    } catch (e) {
                        console.log(e)
                        return res.status(500).json({ status: "error", message: "An error occurred while registering the user's IP address" })
                    }
                    return res.status(500).json({ status: "error", message: "An error occurred while registering the user's IP address" })
                }
            }
        } else {
            return res.status(400).json({ status: "error", message: "Invalid user type" })
        }

        if(results) {
            res.status(201).json({ status: "success", message: "Account created successfully" })
        } else {
            res.status(500).json({ status: "error", message: "Something went wrong..." })
        }
    } catch(e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const loginUser = (DbGetUserByEmail, DbGetRepByEmail, DbGetUserIPs, DbSaveRefreshToken) => async (req, res) => {
    // This controller can log in both a normal user and a businessRep user via the userType parameter
    try {
        // Get user from request object
        const userCredentials = req.body
        // Check if userType is valid and check user credentials
        let results
        if(req.params.userType === 'user') {
            results = await DbGetUserByEmail(userCredentials.email)
        } else if(req.params.userType === 'businessRep') {
            results = await DbGetRepByEmail(userCredentials.email)

            // Check that user IP is whitelisted
            if(results) {
                try {
                    const userId = results._id
                    const requestIP = parseIP(req)
                    const userIPs = await DbGetUserIPs(userId)
                    if(userIPs <= 0) throw new Error("Failed to get user IP")
                    if(!checkIP(requestIP, userIPs)) throw new Error(`Access denied: Unauthorized IP address - ${requestIP}`)
                    // User IP ok, continue with login
                } catch (e) {
                    console.log(e)
                    return res.status(401).json({ status: "error", message: e.message })
                }
            }
        } else {
            return res.status(400).json({ status: "error", message: "Something went wrong..." })
        }

        // Check if email and password are correct
        if(!results || !bcrypt.compareSync(userCredentials.password, results.password)) {
            return res.status(400).json({ status: "error", message: "Invalid credentials" })
        }
        
        // Generate access and refresh tokens
        const payload = {
            "iss": 'http://localhost:8200',
            "azp": results._id,
            "aud": 'http://localhost:8200',
            "roles": req.params.userType
        }
    
        // Generate access and refresh tokens
        const accessToken = jwt.sign(payload , process.env.JWT_SECRET, { expiresIn: '2h' })
        const refreshToken = jwt.sign(payload , process.env.JWT_SECRET, { expiresIn: '7d' })

        // Save refresh token to database
        const tokenResults = await DbSaveRefreshToken(refreshToken)

        if(!tokenResults) {
            return res.status(500).json({ status: "error", message: "Something went wrong..." })
        }

        // Remove password from response
        const { password, ...responseUser } = results._doc

        // Return access and refresh tokens
        res.status(200).json({ 
            status: "success", 
            message: "User successfully logged in",
            user: responseUser,
            accessToken: accessToken, 
            refreshToken: refreshToken 
        })

    } catch(e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }

}

export const logoutUser = (DbAddTokenToBlacklist, DbDeleteRefreshToken, DbDeleteExpiredTokens) => async (req, res) => {
    // This controller can log out both a normal user and a businessRep user via the userType parameter
    try {
        // Get tokens from request header and body
        const accessToken = req.headers.authorization

        // Add access token to blacklist
        let acResults
        if(accessToken) {
            acResults = await DbAddTokenToBlacklist(accessToken)
        } else {
            return res.status(400).json({ status: "Authentication error", message: "Please log in to access this resource" })
        }

        // Delete refresh token from database
        const refreshToken = req.body.refreshToken
        let results
        if(refreshToken) {
            results = await DbDeleteRefreshToken(refreshToken)
        } else {
            return res.status(400).json({ status: "Authentication error", message: "Please log in to access this resource" })
        }

        // Check that DB operations were successful
        if(acResults && results && results.deletedCount > 0) {
            res.status(200).json({ status: "success", message: "User successfully logged out" })
        } else {
            res.status(400).json({ status: "Authentication error", message: "Something went wrong..." })
        }
    } catch(e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }

    // Delete expired access tokens from the blacklist as they will fail to authenticate anyway
    // This will run after response is sent to client
    try {
        const deleteExpired = await DbDeleteExpiredTokens()
    } catch(e) {
        console.log(e.message)
    }
}

export const tokenRefresh = (DbSaveRefreshToken, DbDeleteRefreshToken) => async (req, res) => {
    // Get current refresh token from request object
    const refreshToken = req.body.refreshToken
    if(!refreshToken) {
        return res.status(400).json({ status: "Authentication error", message: "Please log in to access this resource" })
    }

    try {
        let tokenContent
        try{
            // Get token contents
            tokenContent = jwt.verify(refreshToken, process.env.JWT_SECRET)
        } catch(e) {
            console.log(e.message)
            return res.status(400).json({ status: "Validation error", message: "Refresh token can not be validated" })
        }
        // Delete unnecessary data from token
        delete tokenContent.iat
        delete tokenContent.exp

        // Generate new access and refresh tokens
        const newAccessToken = jwt.sign(tokenContent , process.env.JWT_SECRET, { expiresIn: '2h' })
        const newRefreshToken = jwt.sign(tokenContent , process.env.JWT_SECRET, { expiresIn: '7d' })
    
        // Save new refresh token to database
        const tokenResults = await DbSaveRefreshToken(newRefreshToken)
        if(!tokenResults) {
            return res.status(500).json({ status: "error", message: "Something went wrong..." })
        }

        // Delete old refresh token from database
        const deleteResults = await DbDeleteRefreshToken(refreshToken)
        if(!deleteResults || deleteResults.deletedCount === 0) {
            return res.status(500).json({ status: "error", message: "Something went wrong..." })
        }
    
        // Return access and refresh tokens
        res.status(200).json({ status: "success", accessToken: newAccessToken, refreshToken: newRefreshToken })

    } catch(e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }
}