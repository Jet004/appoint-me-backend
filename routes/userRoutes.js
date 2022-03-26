import express from 'express'
const router = express.Router()

// Controllers
import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser } from '../controllers/userController'
// ODM methods
import { DbGetAllUsers, DbGetUserByEmail, DbCreateUser, DbUpdateUser, DbDeleteUser } from '../models/userModel'
// Validators
import { userValidator, emailValidator, passwordValidator, idValidator } from '../controllers/userValidators'
// Validation checker - responds with 400 Bad Request if there are validation errors then prevents the request from continuing
import validationCheck from '../controllers/checkValidators'

router.route('/')
    .get(getAllUsers(DbGetAllUsers))
    .post(userValidator, passwordValidator, validationCheck, createUser(DbCreateUser))

router.route('/:email')
    .get(emailValidator, validationCheck, getUserByEmail(DbGetUserByEmail))

router.route('/:id')
    .put(userValidator, idValidator, validationCheck, updateUser(DbUpdateUser))
    .delete(idValidator, validationCheck, deleteUser(DbDeleteUser))

export default router;