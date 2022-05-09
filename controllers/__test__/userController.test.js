import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser } from '../userController.js'
import users from '../../__test__/mockUsers.js'
import mongoose from 'mongoose'
import { jest } from '@jest/globals'

describe("User controller unit tests:", () => {
    describe("Test controller: getAllUsers", () => {
        it("returns all users", async () => {
            const fakeDbGetAllUsers = jest.fn().mockReturnValue(users)
            const req = {}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            

            const controller = getAllUsers(fakeDbGetAllUsers)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbGetAllUsers).toHaveBeenCalledTimes(1)
            expect(fakeDbGetAllUsers).toHaveBeenCalledWith()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ status: "success", user: users })
        })

        it('returns 500 Internal Server Error if no data returned from DB', async () => {
            const fakeDbGetAllUsers = jest.fn().mockReturnValue(null)
            const req = {}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getAllUsers(fakeDbGetAllUsers)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbGetAllUsers).toHaveBeenCalledTimes(1)
            expect(fakeDbGetAllUsers).toHaveBeenCalledWith()
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "An unexpected error occurred" })
        })

        it('returns 500 Internal Server Error on DB error', async () => {
            const fakeDbGetAllUsers = jest.fn().mockImplementation(() => { throw new Error('DB error') })
            const req = {}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getAllUsers(fakeDbGetAllUsers)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbGetAllUsers).toHaveBeenCalledTimes(1)
            expect(fakeDbGetAllUsers).toHaveBeenCalledWith()
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "DB error" })
        })
    })

    describe('Test controller: getUserByEmail', () => {
        it('GET returns user by email with valid input', async () => {
            const mockUser = users[0]
            mockUser._doc = mockUser
            const fakeDbGetUserByEmail = jest.fn().mockReturnValue(mockUser)
            const req = { params: { email: users[0].email } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getUserByEmail(fakeDbGetUserByEmail)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledWith(users[0].email)
            expect(res.status).toHaveBeenCalledWith(200)
        })
     
        it('GET returns 404 Not Found when email not in DB', async () => {
            const fakeDbGetUserByEmail = jest.fn().mockReturnValue(null)
            const req = { params: { email: '32987@gmail.com' } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getUserByEmail(fakeDbGetUserByEmail)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledWith('32987@gmail.com')
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ status: "not found", user: [] })
        })

        it('GET returns 500 Internal Server Error on DB error', async () => {
            const fakeDbGetUserByEmail = jest.fn().mockImplementation(() => { throw new Error('DB error') })
            const req = { params: { email: users[0].email } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getUserByEmail(fakeDbGetUserByEmail)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledWith(users[0].email)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "DB error" })
        })
    })

    describe('Test controller: createUser', () => {
        // Has the password for our mock user
        const userToCreate = {...users[0]}
        userToCreate.password = "12345678"

        it('returns 201 Created on success with valid input', async () => {
            const fakeDbCreateUser = jest.fn().mockReturnValue(userToCreate)
            const req = { body: userToCreate }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = createUser(fakeDbCreateUser)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbCreateUser).toHaveBeenCalledTimes(1)
            expect(fakeDbCreateUser.mock.calls[0][0]).toBe(userToCreate)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({ status: "success", user: userToCreate })
        })

        it('returns 500 Internal Server Error if no data returned from DB', async () => {
            const fakeDbCreateUser = jest.fn().mockReturnValue(null)
            const req = { body: userToCreate }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = createUser(fakeDbCreateUser)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbCreateUser).toHaveBeenCalledTimes(1)
            expect(fakeDbCreateUser.mock.calls[0][0]).toBe(userToCreate)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "An unexpected error occurred" })
        })

        it('returns 500 Internal Server Error on DB Error', async () => {
            const fakeDbCreateUser = jest.fn().mockImplementation( () => { throw new Error('DB error') })
            const req = { body: userToCreate }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = createUser(fakeDbCreateUser)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbCreateUser).toHaveBeenCalledTimes(1)
            expect(fakeDbCreateUser.mock.calls[0][0]).toBe(userToCreate)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "DB error" })   
        })
    })

    describe('Test controller: updateUser', () => {
        it('returns 200 OK + original user data with valid inputs', async () => {
            // Create a mongoose id for query and attach it to the mock user object
            const userID = new mongoose.Types.ObjectId()
            users[0]._id = userID
            // Copy mock user object and change name
            const updatedData = {...users[0]}
            updatedData.name = 'Updated Name'

            const fakeDbUpdateUser = jest.fn().mockReturnValue(users[0])
            const req = { params: { id: users[0]._id }, body: updatedData }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = updateUser(fakeDbUpdateUser)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbUpdateUser).toHaveBeenCalledTimes(1)
            expect(fakeDbUpdateUser).toHaveBeenCalledWith(users[0]._id, updatedData)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Data updated successfully", originalData: users[0] })
        })

        it('returns 404 Not Found when _id not in DB', async () => {
            // Create a mongoose id for query and attach it to the mock user object
            const userID = new mongoose.Types.ObjectId()
            users[0]._id = userID
            // Copy mock user object and change name
            const updatedData = {...users[0]}
            updatedData.name = 'Updated Name'

            const fakeDbUpdateUser = jest.fn().mockReturnValue(null)
            const req = { params: { id: userID }, body: updatedData }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = updateUser(fakeDbUpdateUser)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbUpdateUser).toHaveBeenCalledTimes(1)
            expect(fakeDbUpdateUser).toHaveBeenCalledWith(userID, updatedData)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ status: "not found", user: [] })
        })

        it('returns 500 Internal Server Error on DB Error', async () => {
            // Create a mongoose id for query and attach it to the mock user object
            const userID = new mongoose.Types.ObjectId()
            users[0]._id = userID
            // Copy mock user object and change name
            const updatedData = {...users[0]}
            updatedData.name = 'Updated Name'

            const fakeDbUpdateUser = jest.fn().mockImplementation( () => { throw new Error('DB error') })
            const req = { params: { id: userID }, body: updatedData }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = updateUser(fakeDbUpdateUser)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbUpdateUser).toHaveBeenCalledTimes(1)
            expect(fakeDbUpdateUser).toHaveBeenCalledWith(userID, updatedData)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "DB error" })
        })
    })

    describe('Test controller: deleteUser', () => {
        it('returns 204 No Content on success', async () => {
            // Create a mongoose id for query and attach it to the mock user object
            const userID = new mongoose.Types.ObjectId()
            users[0]._id = userID
            const fakeDbDeleteUser = jest.fn().mockReturnValue(users[0])
            const req = { params: { id: users[0]._id } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = deleteUser(fakeDbDeleteUser)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbDeleteUser).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteUser).toHaveBeenCalledWith(users[0]._id)
            expect(res.status).toHaveBeenCalledWith(204)
            expect(res.json).toHaveBeenCalledWith()
        })

        it('returns 404 Not Found when _id not in DB', async () => {
            // Create a mongoose id for query and attach it to the mock user object
            const userID = new mongoose.Types.ObjectId()

            const fakeDbDeleteUser = jest.fn().mockReturnValue(null)
            const req = { params: { id: userID } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = deleteUser(fakeDbDeleteUser)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbDeleteUser).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteUser).toHaveBeenCalledWith(userID)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ status: "not found" })
        })

        it('returns 500 Internal Server Error on DB Error', async () => {
            // Create a mongoose id for query and attach it to the mock user object
            const userID = new mongoose.Types.ObjectId()

            const fakeDbDeleteUser = jest.fn().mockImplementation( () => { throw new Error('DB error') })
            const req = { params: { id: userID } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = deleteUser(fakeDbDeleteUser)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbDeleteUser).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteUser).toHaveBeenCalledWith(userID)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "DB error" })
        })
    })
})