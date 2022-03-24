import express from 'express'
const router = express.Router()

// Controllers
import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser } from '../controllers/userController'

router.route('/')
    .get(getAllUsers)
    .post(createUser)
    .put(updateUser)
    .delete(deleteUser)

router.route('/:email')
    .get(getUserByEmail)

module.exports = router;