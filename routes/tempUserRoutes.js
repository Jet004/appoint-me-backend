import express from 'express'
const router = express.Router()

// Controllers
import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser } from '../controllers/userController'
// ODM methods
import { DbGetAllUsers, DbGetUserByEmail, DbCreateUser, DbUpdateUser, DbDeleteUser } from '../models/tempUserModel'
// Validators
import { userValidator, tempUserValidator, emailValidator, passwordValidator, idValidator, checkKeys } from '../controllers/userValidators'
// Validation checker - responds with 400 Bad Request if there are validation errors then prevents the request from continuing
import validationCheck from '../controllers/checkValidators'

// Validators and validation error checker run as route middleware
// Controllers use dependency injection to inject ODM methods. This approach allows 
// for easier unit testing of the controllers and their dependencies.
router.route('/')
    .get(getAllUsers(DbGetAllUsers))
    .post(userValidator, tempUserValidator, passwordValidator, validationCheck, checkKeys, createUser(DbCreateUser))

router.route('/:email')
    .get(emailValidator, validationCheck, getUserByEmail(DbGetUserByEmail))

router.route('/:id')
    .put(userValidator, tempUserValidator, idValidator, validationCheck,checkKeys, updateUser(DbUpdateUser))
    .delete(idValidator, validationCheck, deleteUser(DbDeleteUser))

export default router;