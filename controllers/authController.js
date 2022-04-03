import bcrypt from 'bcrypt'

// Imprort JWT depenecies
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import mongoose from 'mongoose'
dotenv.config();

export const registerUser = (DbRegisterUser, DbRegisterBusinessRep) => async (req, res) => {
    // This controller can register both a normal user and a businessRep user via the userType parameter
    try {
        // Hash user password
        if(req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 6)

        // Check if userType is valid and call the appropriate model method
        let results
        if(req.params.userType === 'user') {
            results = await DbRegisterUser(req.body)
        } else if(req.params.userType === 'businessRep') {
            results = await DbRegisterBusinessRep(req.body)
        } else {
            return res.status(400).json({ status: "error", message: "Something went wrong..." })
        }

        if(results) {
            res.status(200).json({ status: "success", message: "User successfully registered" })
        } else {
            res.status(400).json({ status: "error", message: "Something went wrong..." })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const loginUser = (DbGetUserByEmail, DbGetRepByEmail, DbSaveRefreshToken) => async (req, res) => {
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

        // Return access and refresh tokens
        res.status(200).json({ 
            status: "success", 
            message: "User successfully logged in", 
            accessToken: accessToken, 
            refreshToken: refreshToken 
        })

    } catch(e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message })
    }

}

export const logoutUser = (DbDeleteRefreshToken) => async (req, res) => {
    // This controller can log out both a normal user and a businessRep user via the userType parameter
    try {
        const refreshToken = req.body.refreshToken
        let results
        if(refreshToken) {
            results = await DbDeleteRefreshToken(refreshToken)
        } else {
            return res.status(400).json({ status: "Authentication error", message: "Please log in to access this resource" })
        }
        console.log(results)
        if(results && results.deletedCount > 0) {
            res.status(200).json({ status: "success", message: "User successfully logged out" })
        } else {
            console.log(results)
            res.status(400).json({ status: "Authentication error", message: "Something went wrong..." })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message })
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
        console.log(e)
        res.status(500).json({ status: "error", message: e.message })
    }
}