import bcrypt from 'bcrypt'
import { registerUser, loginUser } from '../authController';

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

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

        test('returns 200 OK and registers a new user with valid inputs', async () => {
            let user = JSON.parse(JSON.stringify(mockUser))
            delete user.appointments
            const fakeDbRegisterUser = jest.fn().mockResolvedValue(user);
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

            const controller = registerUser(fakeDbRegisterUser, fakeDbRegisterBusinessRep)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterUser).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterUser).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", message: "User successfully registered" })
        })

        test('returns 400 Bad Input when DB returns null', async () => {
            let user = JSON.parse(JSON.stringify(mockUser))
            delete user.appointments
            const fakeDbRegisterUser = jest.fn().mockResolvedValue(null);
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

            const controller = registerUser(fakeDbRegisterUser, fakeDbRegisterBusinessRep)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterUser).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterUser).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Something went wrong..." })
        })

        test('returns 500 Internal Server Error when DB returns and error', async () => {
            let user = JSON.parse(JSON.stringify(mockUser))
            delete user.appointments
            const fakeDbRegisterUser = jest.fn().mockRejectedValue(new Error('Database error'));
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

            const controller = registerUser(fakeDbRegisterUser, fakeDbRegisterBusinessRep)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterUser).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterUser).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })


        test('returns 200 OK and registers a new business rep with valid inputs', async () => {
            let businessRep = JSON.parse(JSON.stringify(mockBusinessRep))
            const fakeDbRegisterBusinessRep = jest.fn().mockResolvedValue(mockBusinessRep);
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

            const controller = registerUser(fakeDbRegisterUser, fakeDbRegisterBusinessRep)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", message: "User successfully registered" })
        })

        test('returns 400 Bad Input when DB returns null', async () => {
            let businessRep = JSON.parse(JSON.stringify(mockBusinessRep))
            const fakeDbRegisterBusinessRep = jest.fn().mockResolvedValue(null)
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

            const controller = registerUser(fakeDbRegisterUser, fakeDbRegisterBusinessRep)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledTimes(1)
            expect(fakeDbRegisterBusinessRep).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Something went wrong..." })
        })

        test('returns 500 Internal Server Error when DB returns and error', async () => {
            let businessRep = JSON.parse(JSON.stringify(mockBusinessRep))
            const fakeDbRegisterBusinessRep = jest.fn().mockRejectedValue(new Error('Database error'))
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

            const controller = registerUser(fakeDbRegisterUser, fakeDbRegisterBusinessRep)
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
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Something went wrong..." })
        })
    })

    describe('Test controller: loginUser', () => {
        test.only('POST returns 200 OK, generated JWTs and logs in user', async () => {
            const user = JSON.parse(JSON.stringify(mockUser))
            const fakeDbUser = JSON.parse(JSON.stringify(user))
            fakeDbUser.password = bcrypt.hashSync(fakeDbUser.password, 6)
            const fakeDbGetUserByEmail = jest.fn().mockResolvedValue(fakeDbUser)
            const fakeDbGetRepByEmail = jest.fn()
            const fakeSignJWT = jest.fn().mockReturnValue('token')
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

            const controller = loginUser(fakeDbGetUserByEmail, fakeDbGetRepByEmail, fakeSignJWT)
            expect(typeof controller).toBe('function')

            const rest = await controller(req, res)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledTimes(1)
            expect(fakeDbGetUserByEmail).toHaveBeenCalledWith(req.body.email)
            expect(fakeDbGetRepByEmail).not.toHaveBeenCalled()
            console.log(rest)

            // const header = {
            //     "iss": 'http://localhost:8200',
            //     "sub": user.email,
            //     "aud": 'http://localhost:8200',
            // }
        
            // const token = jwt.sign({ header, payload: { email: user.email, userType: 'user' } }, process.env.JWT_SECRET, { expiresIn: '1h' })
            // console.log(jwt.verify(token, process.env.JWT_SECRET))
        })
    })
})

  