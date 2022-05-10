import express from 'express'
const router = express.Router()

// Import controllers
import { loginUser, logoutUser, registerUser, tokenRefresh } from '../controllers/authController.js'

// Import models
import { DbRegisterUser, DbGetUserByEmail } from '../models/userModel.js'
import { DbRegisterBusinessRep, DbGetRepByEmail, DbDeleteRep } from '../models/businessRepModel.js'
import { DbDeleteRefreshToken, DbSaveRefreshToken } from '../models/authModel.js'
import { DbAddTokenToBlacklist, DbDeleteExpiredTokens } from '../models/authBlacklistModel.js'
import { DbRegisterIP, DbGetUserIPs } from '../models/ipWhitelistModel.js'


// Import validators
import { userValidator, ubrValidator, passwordValidator } from '../validation/userValidators.js'
import validationCheck from '../validation/checkValidators.js'
import { emailValidator, checkAuthKeys, tokenValidator } from '../validation/authValidator.js'
import { requireLogin } from '../middleware/sessionHandler.js'

router.route('/register/:userType')
    .post(
        userValidator, 
        ubrValidator, 
        passwordValidator, 
        validationCheck, 
        registerUser(DbRegisterUser, DbGetUserByEmail, DbRegisterBusinessRep, DbGetRepByEmail, DbRegisterIP, DbDeleteRep)
    )

router.route('/login/:userType')
    .post(
        emailValidator,
        passwordValidator,
        validationCheck,
        checkAuthKeys,
        (req, res, next) => { // Check if user is already logged in
            if(req.session.loggedIn) {
                return res.status(400).json({ status: "error", message: "User already logged in" })
             }
             return next()},
        loginUser(DbGetUserByEmail, DbGetRepByEmail, DbGetUserIPs, DbSaveRefreshToken)
    )

router.route('/logout')
    .post(
        tokenValidator,
        validationCheck,
        checkAuthKeys,
        requireLogin(),
        logoutUser(DbAddTokenToBlacklist, DbDeleteRefreshToken, DbDeleteExpiredTokens)
    )

router.route('/token-refresh')
    .post(
        tokenValidator,
        validationCheck,
        checkAuthKeys,
        requireLogin(),
        tokenRefresh(DbSaveRefreshToken, DbDeleteRefreshToken)
    )

export default router