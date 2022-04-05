import express from 'express'
const router = express.Router()

// Import controllers
import { loginUser, logoutUser, registerUser, tokenRefresh } from '../controllers/authController'
// Import model ODM methods from User model
import { DbRegisterUser, DbGetUserByEmail } from '../models/userModel'
// Import model ODM methods from BusinessRep model
import { DbRegisterBusinessRep, DbGetRepByEmail } from '../models/businessRepModel'
//Import model ODM methods from RefreshToken model
import { DbDeleteRefreshToken, DbSaveRefreshToken } from '../models/authModel'
// Import model ODM methods from TokenBlacklist model
import { DbAddTokenToBlacklist, DbDeleteExpiredTokens } from '../models/authBlacklistModel'

// Import validators
import { userValidator, ubrValidator, passwordValidator } from '../validation/userValidators'
import validationCheck from '../validation/checkValidators'
import { emailValidator, checkAuthKeys, tokenValidator } from '../validation/authValidator'
import { requireLogin } from '../middleware/sessionHandler'

router.route('/register/:userType')
    .post(
        userValidator, 
        ubrValidator, 
        passwordValidator, 
        validationCheck, 
        registerUser(DbRegisterUser, DbRegisterBusinessRep)
    )

router.route('/login/:userType')
    .post(
        emailValidator, 
        passwordValidator, 
        validationCheck, 
        checkAuthKeys, 
        loginUser(DbGetUserByEmail, DbGetRepByEmail, DbSaveRefreshToken)
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