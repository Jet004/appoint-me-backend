import express from 'express'
const router = express.Router()

// Import controllers
import { registerUser } from '../controllers/authController'
// Import model ODM methods from User model
import { DbRegisterUser } from '../models/userModel'
// Import model ODM methods from BusinessRep model
import { DbRegisterBusinessRep } from '../models/businessRepModel'

// Import validators
import { userValidator, ubrValidator, passwordValidator } from '../validation/userValidators'
import validationCheck from '../validation/checkValidators'

// // Set up check for userType parameter
// const checkUserType = (req, res, next) => {
//     if(req.body.userType !== 'user') {
//         next('route')
//     }
// }

router.route('/register/:userType')
    .post(userValidator, ubrValidator, passwordValidator, validationCheck, registerUser(DbRegisterUser, DbRegisterBusinessRep))






export default router