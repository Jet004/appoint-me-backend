import express from 'express'
const router = express.Router()

// Controllers
import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser } from '../controllers/userController'
// ODM methods
import { DbGetAllReps, DbGetRepByEmail, DbCreateRep, DbUpdateRep, DbDeleteRep } from '../models/businessRepModel'
// Validators
import { userValidator, ubrValidator, emailValidator, passwordValidator, idValidator, checkKeys, isAuthorisedToCreateBusinessRep, isOwnAccount } from '../validation/userValidators'
// Validation checker - responds with 400 Bad Request if there are validation errors then prevents the request from continuing
import validationCheck from '../validation/checkValidators'
import { requireLogin, requireRoles } from '../middleware/sessionHandler'

// Validators and validation error checker run as route middleware
// Controllers use dependency injection to inject ODM methods. This approach allows 
// for easier unit testing of the controllers and their dependencies.
router.route('/')
    .get(getAllUsers(DbGetAllReps))
    .post(// This route won't be used yet - it will be used by business admin for adding employees etc.
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

export default router;