import express from 'express'
const router = express.Router()

// Controllers
import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser } from '../controllers/userController'
// ODM methods
import { DbGetAllReps, DbGetRepByEmail, DbCreateRep, DbUpdateRep, DbDeleteRep } from '../models/businessRepModel'
// Validators
import { userValidator, ubrValidator, emailValidator, passwordValidator, idValidator, checkKeys } from '../controllers/userValidators'
// Validation checker - responds with 400 Bad Request if there are validation errors then prevents the request from continuing
import validationCheck from '../controllers/checkValidators'

// Validators and validation error checker run as route middleware
// Controllers use dependency injection to inject ODM methods. This approach allows 
// for easier unit testing of the controllers and their dependencies.
router.route('/')
    .get(getAllUsers(DbGetAllReps))
    .post(userValidator, ubrValidator, passwordValidator, validationCheck, checkKeys, createUser(DbCreateRep))

router.route('/:email')
    .get(emailValidator, validationCheck, getUserByEmail(DbGetRepByEmail))

router.route('/:id')
    .put(userValidator, ubrValidator, idValidator, validationCheck, checkKeys, updateUser(DbUpdateRep))
    .delete(idValidator, validationCheck, deleteUser(DbDeleteRep))

export default router;