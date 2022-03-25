import express from 'express'
const router = express.Router()

// Controllers
import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser } from '../controllers/userController'
import { DbGetAllUsers, DbGetUserByEmail, DbCreateUser, DbUpdateUser, DbDeleteUser } from '../models/userModel'

router.route('/')
    .get(getAllUsers(DbGetAllUsers))
    .post(createUser(DbCreateUser))

router.route('/:email')
    .get(getUserByEmail(DbGetUserByEmail))

router.route('/:id')
    .put(updateUser(DbUpdateUser))
    .delete(deleteUser(DbDeleteUser))

module.exports = router;