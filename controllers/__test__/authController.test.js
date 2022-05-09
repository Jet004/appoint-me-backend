import bcrypt from 'bcrypt'
import { registerUser, loginUser, logoutUser, tokenRefresh } from '../authController.js';
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { jest } from '@jest/globals'

// Set up mock users for registration tests
const mockUser = {
    email: "p.wong@gmail.com",
    password: "Abc_1234",
    fname: "Penny",
    lname: "Wong",
    phone: "0746372891",
    address: {
        streetNumber: "333",
        streetName: "Margaret Street",
        city: "Brisbane",
        state: "QLD",
        postCode: "4000",
        country: "Australia",
    },
    dob: new Date(1970, 7, 12),
}

// Set up mock businessReps for registration tests
const mockBusinessRep = {
    email: "b.gates@outlook.com",
    password: "Abc_1234",
    fname: "Bill",
    lname: "Gates",
    phone: "0473982982",
    address: {
        streetNumber: "32",
        streetName: "High Street",
        city: "Berkshire",
        state: "QLD",
        postCode: "4557",
        country: "Australia",
    },
    dob: new Date(1972, 1, 12),
}

describe('Auth Controller Unit Tests: ', () => {
    describe('Test controller: registerUser', () => {

        beforeEach(() => {
            jest.resetAllMocks();
        })

        test('returns 201 Created and registers a new user with valid inputs', async () => {
            let user = JSON.parse(JSON.stringify(mockUser))
            delete user.appointments
            const fakeDbGetUserByEmail = jest.fn().mockResolvedValue(null)
            const fakeDbRegisterUser = jest.fn().mockResolvedValue(user)
            const fakeDbGetRepByEmail = jest.fn()
            const fakeDbRegisterBusinessRep = jest.fn()
            const req = {
                params: {
                    userType: 'user'
                },
                body: user
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = registerUser(fakeDbRegisterUser, fakeDbGetUserByEmail, fakeDbRegisterBusinessRep, fakeDbGetRepByEmail)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterUser).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterUser).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Account created successfully" })
        })

        test('returns 400 Bad Input when DB returns null', async () => {
            let user = JSON.parse(JSON.stringify(mockUser))
            delete user.appointments
            const fakeDbGetUserByEmail = jest.fn().mockResolvedValue(null)
            const fakeDbRegisterUser = jest.fn().mockResolvedValue(null)
            const fakeDbGetRepByEmail = jest.fn()
            const fakeDbRegisterBusinessRep = jest.fn()
            const req = {
                params: {
                    userType: 'user'
                }, 
                body: user
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = registerUser(fakeDbRegisterUser, fakeDbGetUserByEmail, fakeDbRegisterBusinessRep, fakeDbGetRepByEmail)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterUser).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterUser).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Something went wrong..." })
        })

        test('returns 500 Internal Server Error when DB returns and error', async () => {
            let user = JSON.parse(JSON.stringify(mockUser))
            delete user.appointments
            const fakeDbGetUserByEmail = jest.fn().mockResolvedValue(null)
            const fakeDbRegisterUser = jest.fn().mockRejectedValue(new Error('Database error'))
            const fakeDbGetRepByEmail = jest.fn()
            const fakeDbRegisterBusinessRep = jest.fn()
            const req = {
                params: {
                    userType: 'user'
                },
                body: user
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = registerUser(fakeDbRegisterUser, fakeDbGetUserByEmail, fakeDbRegisterBusinessRep, fakeDbGetRepByEmail)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterUser).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterUser).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })


        test('returns 201 Created and registers a new business rep with valid inputs', async () => {
            let businessRep = JSON.parse(JSON.stringify(mockBusinessRep))
            const fakeDbGetRepByEmail = jest.fn().mockResolvedValue(null)
            const fakeDbRegisterBusinessRep = jest.fn().mockResolvedValue(mockBusinessRep)
            const fakeDbGetUserByEmail = jest.fn()
            const fakeDbRegisterUser = jest.fn()
            const req = {
                params: {
                    userType: 'businessRep'
                },
                body: businessRep
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = registerUser(fakeDbRegisterUser, fakeDbGetUserByEmail, fakeDbRegisterBusinessRep, fakeDbGetRepByEmail)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Account created successfully" })
        })

        test('returns 400 Bad Input when DB returns null', async () => {
            let businessRep = JSON.parse(JSON.stringify(mockBusinessRep))
            const fakeDbGetRepByEmail = jest.fn().mockResolvedValue(null)
            const fakeDbRegisterBusinessRep = jest.fn().mockResolvedValue(null)
            const fakeDbGetUserByEmail = jest.fn()
            const fakeDbRegisterUser = jest.fn();
            const req = {
                params: {
                    userType: 'businessRep'
                },
                body: businessRep
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = registerUser(fakeDbRegisterUser, fakeDbGetUserByEmail, fakeDbRegisterBusinessRep, fakeDbGetRepByEmail)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Something went wrong..." })
        })

        test('returns 500 Internal Server Error when DB returns and error', async () => {
            let businessRep = JSON.parse(JSON.stringify(mockBusinessRep))
            const fakeDbGetRepByEmail = jest.fn().mockResolvedValue(null)
            const fakeDbRegisterBusinessRep = jest.fn().mockRejectedValue(new Error('Database error'))
            const fakeDbGetUserByEmail = jest.fn()
            const fakeDbRegisterUser = jest.fn()
            const req = {
                params: {
                    userType: 'businessRep'
                },
                body: businessRep
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = registerUser(fakeDbRegisterUser, fakeDbGetUserByEmail, fakeDbRegisterBusinessRep, fakeDbGetRepByEmail)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })

        test('returns 400 Bad Input when userType is not "user" or "businessRep"', async () => {
            let businessRep = JSON.parse(JSON.stringify(mockBusinessRep))
            const fakeDbRegisterBusinessRep = jest.fn().mockResolvedValue(null)
            const fakeDbRegisterUser = jest.fn()
            const req = {
                params: {
                    userType: 'Not a user type'
                },
                body: businessRep
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = registerUser(fakeDbRegisterUser, fakeDbRegisterBusinessRep)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterBusinessRep).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Invalid user type" })
        })
    })

    describe('Test controller: loginUser', () => {
        test('returns 200 OK, generates JWTs and logs in user', async () => {
            const user = JSON.parse(JSON.stringify(mockUser))
            const userCredentials = {
                email: user.email,
                password: user.password
            }

            const fakeDbUser = JSON.parse(JSON.stringify(user))
            fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
            fakeDbUser._id = '5eq9f8f8f8f8f8f8f8f8f8f8'
            fakeDbUser._doc = fakeDbUser // Represents needed mongoose return value

            const fakeDbGetUserByEmail = jest.fn().mockResolvedValue(fakeDbUser)
            const fakeDbGetRepByEmail = jest.fn()
            const fakeDbSaveRefreshToken = jest.fn().mockReturnValue({ refreshToken: 'refreshToken' })

            const req = {
                params: {
                    userType: 'user'
                },
                body: userCredentials
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeDbSaveRefreshToken)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledWith(req.body.email)
            expect(fakeDbGetRepByEmail).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)        
        })

        test('returns 400 Bad Request when user email or password incorrect', async () => {
            const credentialsList = [
                {email: mockUser.email, password: "987_sigciG"},
                {email: "rsfi@oshf.com", password: mockUser.password}
            ]
            credentialsList.forEach(async (item) => {
                const userCredentials = {
                    email: item.email,
                    password: item.password
                }
    
                const fakeDbUser = JSON.parse(JSON.stringify(mockUser))
                fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
                fakeDbUser._id = '5eq9f8f8f8f8f8f8f8f8f8f8'

                const returnValue = userCredentials.email === mockUser.email ? fakeDbUser : null
                const fakeDbGetUserByEmail = jest.fn().mockResolvedValue(returnValue)
                const fakeDbGetRepByEmail = jest.fn()
                const fakeDbSaveRefreshToken = jest.fn().mockReturnValue({ refreshToken: 'refreshToken' })
    
                const req = {
                    params: {
                        userType: 'user'
                    },
                    body: userCredentials
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn().mockReturnThis()
                }
    
                const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeDbSaveRefreshToken)
                expect(typeof controller).toBe('function')
    
                await controller(req, res)
                expect(fakeDbGetUserByEmail).toHaveBeenCalledTimes(1)
                expect(fakeDbGetUserByEmail).toHaveBeenCalledWith(req.body.email)
                expect(fakeDbGetRepByEmail).not.toHaveBeenCalled()
                expect(fakeDbSaveRefreshToken).not.toHaveBeenCalled()
                expect(res.status).toHaveBeenCalledTimes(1)
                expect(res.status).toHaveBeenCalledWith(400)
                expect(res.json).toHaveBeenCalledTimes(1)
                expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Invalid credentials" })
            })    
        })

        test('returns 500 Internal Server Error when DbGetUserByEmail return an error', async () => {
            const user = JSON.parse(JSON.stringify(mockUser))
            const userCredentials = {
                email: user.email,
                password: user.password
            }

            const fakeDbUser = JSON.parse(JSON.stringify(user))
            fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
            fakeDbUser._id = '5eq9f8f8f8f8f8f8f8f8f8f8'

            const req = {
                params: {
                    userType: 'user'
                },
                body: userCredentials
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const fakeDbGetUserByEmail = jest.fn().mockRejectedValueOnce(new Error("DB error"))
            const fakeDbGetRepByEmail = jest.fn()
            const fakeDbSaveRefreshToken = jest.fn().mockResolvedValueOnce({ refreshToken: 'refreshToken' })

            const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeDbSaveRefreshToken)
            expect(typeof controller).toBe('function')

            await controller(req, res)

            expect(fakeDbGetUserByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledWith(req.body.email)
            expect(fakeDbGetRepByEmail).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "DB error" })     
        })

        test('returns 500 Internal Server Error when DbSaveRefreshToken returns an error', async () => {
            const user = JSON.parse(JSON.stringify(mockUser))
            const userCredentials = {
                email: user.email,
                password: user.password
            }

            const fakeDbUser = JSON.parse(JSON.stringify(user))
            fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
            fakeDbUser._id = '5eq9f8f8f8f8f8f8f8f8f8f8'

            const req = {
                params: {
                    userType: 'user'
                },
                body: userCredentials
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const fakeDbGetUserByEmail = jest.fn().mockResolvedValueOnce(fakeDbUser)
            const fakeDbGetRepByEmail = jest.fn()
            const fakeDbSaveRefreshToken = jest.fn().mockRejectedValueOnce(new Error("DB error"))

            const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeDbSaveRefreshToken)
            expect(typeof controller).toBe('function')

            await controller(req, res)

            expect(fakeDbGetUserByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledWith(req.body.email)
            expect(fakeDbGetRepByEmail).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).toHaveBeenCalledTimes(1)
            expect(fakeDbSaveRefreshToken.mock.calls[0][0]).toBeTruthy()
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "DB error" })     
        })


        // Business rep login tests
        test('returns 200 OK, generates JWTs and logs in user', async () => {
            const user = JSON.parse(JSON.stringify(mockBusinessRep))
            const userCredentials = {
                email: user.email,
                password: user.password
            }

            const fakeDbUser = JSON.parse(JSON.stringify(user))
            fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
            fakeDbUser._id = '5eq9f8f8f8f8f8f8f8f8f8f8'
            fakeDbUser._doc = fakeDbUser

            const fakeDbGetUserByEmail = jest.fn()
            const fakeDbGetRepByEmail = jest.fn().mockResolvedValue(fakeDbUser)
            const fakeDbSaveRefreshToken = jest.fn().mockReturnValue({ refreshToken: 'refreshToken' })

            const req = {
                params: {
                    userType: 'businessRep'
                },
                body: userCredentials
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeDbSaveRefreshToken)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetRepByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetRepByEmail).toHaveBeenCalledWith(req.body.email)
            expect(fakeDbGetUserByEmail).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)        
        })

        test('returns 400 Bad Request when businessRep email or password incorrect', async () => {
            const credentialsList = [
                {email: mockBusinessRep.email, password: "987_sigciG"},
                {email: "ifbosb@ofbobf.com", password: mockBusinessRep.password}
            ]
            credentialsList.forEach(async (item) => {
                const userCredentials = {
                    email: item.email,
                    password: item.password
                }
                
    
                const fakeDbUser = JSON.parse(JSON.stringify(mockBusinessRep))
                fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
                fakeDbUser._id = '5eq9f8f8f8f8f8f8f8f8f8f8'
    
                const returnValue = userCredentials.email === mockBusinessRep.email ? fakeDbUser : null
                const fakeDbGetUserByEmail = jest.fn()
                const fakeDbGetRepByEmail = jest.fn().mockResolvedValue(returnValue)
                const fakeDbSaveRefreshToken = jest.fn().mockReturnValue({ refreshToken: 'refreshToken' })
    
                const req = {
                    params: {
                        userType: 'businessRep'
                    },
                    body: userCredentials
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn().mockReturnThis()
                }
    
                const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeDbSaveRefreshToken)
                expect(typeof controller).toBe('function')
    
                await controller(req, res)
                expect(fakeDbGetUserByEmail).not.toHaveBeenCalled()
                expect(fakeDbGetRepByEmail).toHaveBeenCalledTimes(1)
                expect(fakeDbGetRepByEmail).toHaveBeenCalledWith(req.body.email)
                expect(fakeDbSaveRefreshToken).toHaveBeenCalledTimes(0)
                expect(res.status).toHaveBeenCalledTimes(1)
                expect(res.status).toHaveBeenCalledWith(400)
                expect(res.json).toHaveBeenCalledTimes(1)
                expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Invalid credentials" })
            })
        })

        test('returns 500 Internal Server Error when DbGetRepByEmail returns an error', async () => {
            const user = JSON.parse(JSON.stringify(mockBusinessRep))
            const userCredentials = {
                email: user.email,
                password: user.password
            }

            const fakeDbUser = JSON.parse(JSON.stringify(user))
            fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
            fakeDbUser._id = '5eq9f8f8f8f8f8f8f8f8f8f8'

            const req = {
                params: {
                    userType: 'businessRep'
                },
                body: userCredentials
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const fakeDbGetUserByEmail = jest.fn()
            const fakeDbGetRepByEmail = jest.fn().mockRejectedValueOnce(new Error("DB error"))
            const fakeDbSaveRefreshToken = jest.fn().mockResolvedValueOnce({ refreshToken: 'refreshToken' })

            const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeDbSaveRefreshToken)
            expect(typeof controller).toBe('function')

            await controller(req, res)

            expect(fakeDbGetRepByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetRepByEmail).toHaveBeenCalledWith(req.body.email)
            expect(fakeDbGetUserByEmail).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "DB error" })     
        })

        test('returns 500 Internal Server Error when DbSaveRefreshToken returns an error', async () => {
            const user = JSON.parse(JSON.stringify(mockBusinessRep))
            const userCredentials = {
                email: user.email,
                password: user.password
            }

            const fakeDbUser = JSON.parse(JSON.stringify(user))
            fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
            fakeDbUser._id = '5eq9f8f8f8f8f8f8f8f8f8f8'

            const req = {
                params: {
                    userType: 'businessRep'
                },
                body: userCredentials
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const fakeDbGetUserByEmail = jest.fn()
            const fakeDbGetRepByEmail = jest.fn().mockResolvedValueOnce(fakeDbUser)
            const fakeDbSaveRefreshToken = jest.fn().mockRejectedValueOnce(new Error("DB error"))

            const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeDbSaveRefreshToken)
            expect(typeof controller).toBe('function')

            await controller(req, res)

            expect(fakeDbGetRepByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetRepByEmail).toHaveBeenCalledWith(req.body.email)
            expect(fakeDbGetUserByEmail).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).toHaveBeenCalledTimes(1)
            expect(fakeDbSaveRefreshToken.mock.calls[0][0]).toBeTruthy()
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "DB error" })     
        })

        test('returns 400 Bad Request when userType is not "user" or "businessRep"', async () => {
            const user = JSON.parse(JSON.stringify(mockUser))
            const userCredentials = {
                email: user.email,
                password: user.password
            }

            const fakeDbUser = JSON.parse(JSON.stringify(user))
            fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
            fakeDbUser._id = '5eq9f8f8f8f8f8f8f8f8f8f8'

            const fakeDbGetUserByEmail = jest.fn().mockResolvedValue(fakeDbUser)
            const fakeDbGetRepByEmail = jest.fn()
            const fakeDbSaveRefreshToken = jest.fn().mockReturnValue({ refreshToken: 'refreshToken' })

            const req = {
                params: {
                    userType: 'Not a valid user type'
                },
                body: userCredentials
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeDbSaveRefreshToken)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetUserByEmail).not.toHaveBeenCalled()
            expect(fakeDbGetRepByEmail).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Something went wrong..." })
        })
    })

    describe('Test controller: logoutUser', () => {
        test('returns 200 OK when user is logged out', async () => {
            const req = {
                headers: {
                    authorization: 'accessToken'
                },
                body: {
                    refreshToken: 'refreshToken'
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            const fakeDbAddTokenToBlacklist = jest.fn().mockResolvedValue({ accessToken: 'accessToken' })
            const fakeDbDeleteRefreshToken = jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 })
            const fakeDbDeleteExpiredTokens = jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 })
            const controller = logoutUser(fakeDbAddTokenToBlacklist, fakeDbDeleteRefreshToken, fakeDbDeleteExpiredTokens)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbDeleteRefreshToken).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteRefreshToken).toHaveBeenCalledWith(req.body.refreshToken)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", message: "User successfully logged out" })
        })

        test('returns 400 Bad Request when refresh token missing from request body', async () => {
            const req = {
                headers: {
                    authorization: 'accessToken'
                },
                body: {
                    refreshToken: ''
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            const fakeDbAddTokenToBlacklist = jest.fn().mockResolvedValue({ accessToken: 'accessToken' })
            const fakeDbDeleteRefreshToken = jest.fn().mockResolvedValue(req.body.refreshToken)
            const fakeDbDeleteExpiredTokens = jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 })
            const controller = logoutUser(fakeDbAddTokenToBlacklist, fakeDbDeleteRefreshToken, fakeDbDeleteExpiredTokens)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbDeleteRefreshToken).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "Authentication error", message: "Please log in to access this resource" })
        })

        test('returns 400 Bad Request when refresh token not in DB', async () => {
            const req = {
                headers: {
                    authorization: 'accessToken'
                },
                body: {
                    refreshToken: 'refreshToken'
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            const fakeDbAddTokenToBlacklist = jest.fn().mockResolvedValue({ accessToken: 'accessToken' })
            const fakeDbDeleteRefreshToken = jest.fn().mockResolvedValue(null)
            const fakeDbDeleteExpiredTokens = jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 })
            const controller = logoutUser(fakeDbAddTokenToBlacklist, fakeDbDeleteRefreshToken, fakeDbDeleteExpiredTokens)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbDeleteRefreshToken).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteRefreshToken).toHaveBeenCalledWith(req.body.refreshToken)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "Authentication error", message: "Something went wrong..." })
        })

        test('returns 500 Internal Server Error when DbDeleteRefreshToken returns an error', async () => {
            const req = {
                headers: {
                    authorization: 'accessToken'
                },
                body: {
                    refreshToken: 'refreshToken'
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            const fakeDbAddTokenToBlacklist = jest.fn().mockResolvedValue({ accessToken: 'accessToken' })
            const fakeDbDeleteRefreshToken = jest.fn().mockRejectedValue(new Error("Db error"))
            const fakeDbDeleteExpiredTokens = jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 })
            const controller = logoutUser(fakeDbAddTokenToBlacklist, fakeDbDeleteRefreshToken, fakeDbDeleteExpiredTokens)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbDeleteRefreshToken).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteRefreshToken).toHaveBeenCalledWith(req.body.refreshToken)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Db error" })
        })
    })

    describe('Test controller: tokenRefresh', () => {
        let token
        beforeAll(() => {
            // Generate a refresh token to avoid expired token errors
            const payload = {
                "iss": 'http://localhost:8200',
                "azp": mongoose.Types.ObjectId(),
                "aud": 'http://localhost:8200',
                "roles": "businessRep"
            }

            token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
        })

        test('returns 200 OK with new access and refresh tokens with valid inputs', async () => {
            const fakeDbDeleteRefreshToken = jest.fn().mockResolvedValue('refreshToken')
            const fakeDbSaveRefreshToken = jest.fn().mockResolvedValue({ refreshToken: 'refreshToken' })
            const req = {
                body: {
                    refreshToken: token
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = tokenRefresh(fakeDbSaveRefreshToken, fakeDbDeleteRefreshToken)
            expect(typeof controller).toBe('function')
            
            await controller(req, res)
            expect(fakeDbDeleteRefreshToken).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteRefreshToken).toHaveBeenCalledWith(req.body.refreshToken)
            expect(fakeDbSaveRefreshToken).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json.mock.calls[0][0].status).toBe('success')
            expect(res.json.mock.calls[0][0].accessToken).toBeTruthy()
            expect(res.json.mock.calls[0][0].refreshToken).toBeTruthy()
        })

        test('returns 400 Bad Request when no refresh token in request body', async () => {
            const fakeDbDeleteRefreshToken = jest.fn().mockResolvedValue('refreshToken')
            const fakeDbSaveRefreshToken = jest.fn().mockResolvedValue({ refreshToken: 'refreshToken' })

            
            const req = {
                body: {
                    refreshToken: ""
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = tokenRefresh(fakeDbSaveRefreshToken, fakeDbDeleteRefreshToken)
            expect(typeof controller).toBe('function')
            
            await controller(req, res)
            expect(fakeDbDeleteRefreshToken).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "Authentication error", message: "Please log in to access this resource" })
        })

        test('returns 400 Bad Request with refresh token validation error', async () => {
            const fakeDbDeleteRefreshToken = jest.fn().mockResolvedValue('refreshToken')
            const fakeDbSaveRefreshToken = jest.fn().mockResolvedValue({ refreshToken: 'refreshToken' })

            const req = {
                body: {
                    refreshToken: "Not a valid refresh token"
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = tokenRefresh(fakeDbSaveRefreshToken, fakeDbDeleteRefreshToken)
            expect(typeof controller).toBe('function')
            
            await controller(req, res)
            expect(fakeDbDeleteRefreshToken).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "Validation error", message: "Refresh token can not be validated" })
        })

        test('returns 500 Internal Server Error when DbSaveRefreshToken returns an error', async () => {
            const fakeDbDeleteRefreshToken = jest.fn().mockResolvedValue('refreshToken')
            const fakeDbSaveRefreshToken = jest.fn().mockRejectedValue(new Error("Db error"))

            const req = {
                body: {
                    refreshToken: token
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = tokenRefresh(fakeDbSaveRefreshToken, fakeDbDeleteRefreshToken)
            expect(typeof controller).toBe('function')
            
            await controller(req, res)
            expect(fakeDbDeleteRefreshToken).not.toHaveBeenCalled()
            expect(fakeDbSaveRefreshToken).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Db error" })
        })

        test('returns 500 Internal Server Error when DbSeleteRefreshToken returns an error', async () => {
            const fakeDbDeleteRefreshToken = jest.fn().mockRejectedValue(new Error("Db error"))
            const fakeDbSaveRefreshToken = jest.fn().mockResolvedValue({ refreshToken: "refreshToken" })

            const req = {
                body: {
                    refreshToken: token
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = tokenRefresh(fakeDbSaveRefreshToken, fakeDbDeleteRefreshToken)
            expect(typeof controller).toBe('function')
            
            await controller(req, res)
            expect(fakeDbDeleteRefreshToken).toHaveBeenCalledTimes(1)
            expect(fakeDbSaveRefreshToken).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Db error" })
        })
    })
})

  