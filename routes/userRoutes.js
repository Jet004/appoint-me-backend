import express from 'express'
const router = express.Router()

// Controllers
import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser, saveProfilePicture, getProfilePicture } from '../controllers/userController.js'
// ODM methods
import { DbGetAllUsers, DbGetUserByEmail, DbCreateUser, DbUpdateUser, DbDeleteUser } from '../models/userModel.js'
// Validators
import { userValidator, ubrValidator, emailValidator, passwordValidator, idValidator, checkKeys, isOwnAccount } from '../validation/userValidators.js'
// Validation checker - responds with 400 Bad Request if there are validation errors then prevents the request from continuing
import validationCheck from '../validation/checkValidators.js'
import { requireLogin, requireRoles } from '../middleware/sessionHandler.js'

// Validators and validation error checker run as route middleware
// Controllers use dependency injection to inject ODM methods. This approach allows 
// for easier unit testing of the controllers and their dependencies.
router.route('/')
    // .get(getAllUsers(DbGetAllUsers))// Not needed at this point in time
    .post(// Anyone can create an account. No login requirement
        userValidator, 
        ubrValidator, 
        passwordValidator, 
        validationCheck, 
        checkKeys, 
        createUser(DbCreateUser)
    )

router.route('/:email')
    .get(
        emailValidator,
        validationCheck,
        requireLogin(),
        requireRoles('user'),
        isOwnAccount(),
        getUserByEmail(DbGetUserByEmail)
    )

router.route('/:id')
    .put(
        userValidator, 
        ubrValidator, 
        idValidator, 
        validationCheck, 
        checkKeys,
        requireLogin(),
        requireRoles(['user']),
        isOwnAccount(),
        updateUser(DbUpdateUser)
    )
    .delete(
        idValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['user']),
        isOwnAccount(),
        deleteUser(DbDeleteUser)
    )

router.route('/profile-picture/:userType/:id')
    .get(
        idValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['user', 'businessRep']),
        (req, res) => getProfilePicture(req, res)
    )
    .put(
        idValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['user', 'businessRep']),
        isOwnAccount(),
        (req, res) => saveProfilePicture(req, res)
    )

export default router;