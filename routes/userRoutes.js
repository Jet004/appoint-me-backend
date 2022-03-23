const router = require('express').Router();

// Controllers
const { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser } = require('../controllers/userController')

router.route('/')
    .get(getAllUsers)
    .post(createUser)
    .put(updateUser)
    .delete(deleteUser)

router.route('/:email')
    .get(getUserByEmail)

module.exports = router;