import express from 'express'
const router = express.Router()

// Controllers
import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser, getAssociatedBusiness } from '../controllers/userController.js'
// ODM methods
import { DbGetAllReps, DbGetRepByEmail, DbCreateRep, DbUpdateRep, DbDeleteRep } from '../models/businessRepModel.js'
import { DbGetAssociatedBusiness } from '../models/businessModel.js'
// Validators
import { userValidator, ubrValidator, emailValidator, passwordValidator, idValidator, checkKeys, isAuthorisedToCreateBusinessRep, isOwnAccount } from '../validation/userValidators.js'
// Validation checker - responds with 400 Bad Request if there are validation errors then prevents the request from continuing
import validationCheck from '../validation/checkValidators.js'
import { requireLogin, requireRoles } from '../middleware/sessionHandler.js'

// Validators and validation error checker run as route middleware
// Controllers use dependency injection to inject ODM methods. This approach allows 
// for easier unit testing of the controllers and their dependencies.
router.route('/')
    .get(getAllUsers(DbGetAllReps))
    .post(
        userValidator, 
        ubrValidator, 
        passwordValidator, 
        validationCheck, 
        checkKeys,
        requireLogin(),
        requireRoles('businessRep'),
        isAuthorisedToCreateBusinessRep(),
        createUser(DbCreateRep)
    )

router.route('/:email')
    .get(emailValidator, validationCheck, getUserByEmail(DbGetRepByEmail))

router.route('/:id')
    .put(// Business Rep can update their own profile
        userValidator, 
        ubrValidator, 
        idValidator, 
        validationCheck,
        checkKeys,
        requireLogin(),
        requireRoles('businessRep'),
        isOwnAccount(),
        updateUser(DbUpdateRep)
    )
    .delete(
        idValidator,
        validationCheck,
        requireLogin(),
        requireRoles('businessRep'),
        isOwnAccount(),
        deleteUser(DbDeleteRep)
    )

router.route('/business/:id')
    .get(
        idValidator,
        validationCheck,
        requireLogin(),
        requireRoles('businessRep'),
        getAssociatedBusiness(DbGetAssociatedBusiness)
    )

export default router;