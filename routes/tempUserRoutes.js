import express from 'express'
const router = express.Router()

// Controllers
import { getAllUsers, getUserByEmail, createTempUser, updateUser, deleteUser } from '../controllers/userController.js'
// ODM methods
import { DbGetAllUsers, DbGetUserByEmail, DbCreateUser, DbUpdateUser, DbDeleteUser } from '../models/tempUserModel.js'
import { DbCreateCRM, DbGetCRMByMatch } from '../models/crmModel.js'
// Validators
import { userValidator, tempUserValidator, emailValidator, passwordValidator, idValidator, checkKeys, businessIdValidator } from '../validation/userValidators.js'
import { isAuthorisedRep, verifyRepByBusinessId } from '../validation/authValidator.js'
// Validation checker - responds with 400 Bad Request if there are validation errors then prevents the request from continuing
import validationCheck from '../validation/checkValidators.js'
import { requireLogin, requireRoles } from '../middleware/sessionHandler.js'
import { DbGetBusinessByID } from '../models/businessModel.js'

// Validators and validation error checker run as route middleware
// Controllers use dependency injection to inject ODM methods. This approach allows 
// for easier unit testing of the controllers and their dependencies.
router.route('/create/:businessId')
    //.get(getAllUsers(DbGetAllUsers))// This route is not needed at the moment
    .post(
        userValidator,
        tempUserValidator,
        businessIdValidator,
        validationCheck,
        checkKeys,
        requireLogin(),
        requireRoles(['businessRep']),
        verifyRepByBusinessId(DbGetBusinessByID),
        createTempUser(DbCreateUser, DbCreateCRM)
    )

// This route is not needed at the moment
// router.route('/:email')
//     .get(
//         emailValidator, 
//         validationCheck, 
//         getUserByEmail(DbGetUserByEmail)
//     )

router.route('/:businessId/:id')
    .put(
        userValidator, 
        tempUserValidator,
        businessIdValidator,
        idValidator, 
        validationCheck,
        checkKeys,
        requireLogin(),
        requireRoles(['businessRep']),
        isAuthorisedRep(DbGetCRMByMatch),
        updateUser(DbUpdateUser)
    )
    .delete(
        businessIdValidator,
        idValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['businessRep']),
        isAuthorisedRep(DbGetCRMByMatch),
        deleteUser(DbDeleteUser)
    )

export default router;