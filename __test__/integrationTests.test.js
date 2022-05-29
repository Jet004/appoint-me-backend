import mongoose from 'mongoose'
import connect from '../models/database.js'
import DbConnection from '../models/database.js'
import pushMockData from './pushMockData.js'

import fetch from 'node-fetch'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'

import users from './mockUsers.js'
import businessReps from './mockBusinessReps.js'
import businesses from './mockBusiness.js'
import User from '../models/userModel.js'
import TempUser from '../models/tempUserModel.js'
import BusinessRep from '../models/businessRepModel.js'
import Business from '../models/businessModel.js'
import Auth from '../models/authModel.js'
import CRM from '../models/crmModel.js'
import Appointment from '../models/appointmentModel.js'

import app from '../app.js'

const PORT = 3200
const domain = `http:localhost:${PORT}`
const conn = new DbConnection('mongodb://127.0.0.1:27017/appointMe?directConnection=true&serverSelectionTimeoutMS=2000')

describe('Integration Tests:', () => {
    let runningServer
    beforeAll(async () => {
        // Set up database
        conn.connect()
        conn.dropDb()
        // await connect('mongodb://127.0.0.1:27017/appointMe?directConnection=true&serverSelectionTimeoutMS=2000')
        // await mongoose.connection.dropDatabase()
        await pushMockData(["all"])

        // Instantiate express server and start listening
        const server = app()
        runningServer = server.listen(PORT)
    })

    afterAll(async () => {
        // Destroy database and close connection
        await conn.dropDb()
        await conn.close()
        // await mongoose.connection.dropDatabase()
        // await mongoose.disconnect()

        // Stop express server
        runningServer.close()
    })

    test('Connects to MongoDB database', () => {
        expect(mongoose.connection.readyState).toBe(1)
    })

    describe('User Routes', () => {
        
        describe("Route: /api/users/", () => {
            // This route is not needed at the moment
            // test('GET returns 200 OK + array of users when data in DB', async () => {
            //     const response = await fetch(`${domain}/api/users/`)
            //     const json = await response.json()
    
            //     if(response.status != 200) console.log(response, json)
    
            //     expect(response.status).toBe(200)
            //     expect(json.status).toBe('success')
            //     expect(json.user.length).toBe(users.length)
            // })

            test(`POST returns 200 OK with valid user data adds new user to the DB`, async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'k.free@gmail.com',
                        password: "Asdf_1234",
                        fname: 'Katherine',
                        lname: 'Free',
                        phone: '0423456789',
                        address: {
                            streetNumber: 123,
                            streetName: 'Fake Street',
                            city: 'Fake City',
                            state: 'QLD',
                            postCode: '4000',
                            country: 'Australia'
                        },
                        dob: '1990-01-01',
                        appointments: []
                    })
                }

                const response = await fetch(`${domain}/api/users/`, payload)
                const json = await response.json()

                if(response.status != 201) console.log(response, json)

                expect(response.status).toBe(201)
                expect(json.status).toBe('success')
                expect(json.user.email).toBe('k.free@gmail.com')
            })

            // Test validation
            test('POST returns 400 Bad Request with missing input data', async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: '',
                        password: '',
                        fname: '',
                        lname: '',
                        phone: '',
                        address: {
                            streetNumber: '',
                            streetName: '',
                            suburb: '',
                            city: '',
                            state: '',
                            postCode: '',
                            country: ''
                        },
                        dob: '',
                        appointments: []
                    })
                }

                const response = await fetch(`${domain}/api/users/`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(32)
            })

            test("POST returns 400 Bad Request when input contains duplicate key with invalid data", async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'k.free@gmail.com',
                        email: "Not a valid email",
                        password: "Asdf_1234",
                        fname: 'Katherine',
                        lname: 'Free',
                        phone: '0423456789',
                        address: {
                            streetNumber: 123,
                            streetName: 'Fake Street',
                            suburb: 'Fake Suburb',
                            city: 'Fake City',
                            state: 'QLD',
                            postCode: '4000',
                            country: 'Australia'
                        },
                        dob: '1990-01-01',
                        appointments: []
                    })
                }

                const response = await fetch(`${domain}/api/users/`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            test("POST returns 400 Bad Request when request body contains unexpected keys", async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'b.manning@gmail.com',
                        bio: "This key is unexpected",
                        password: "Asdf_1234",
                        fname: 'Bruce',
                        lname: 'Manning',
                        phone: '0423456789',
                        address: {
                            streetNumber: 123,
                            streetName: 'Fake Street',
                            city: 'Fake City',
                            state: 'QLD',
                            postCode: '4000',
                            country: 'Australia',
                            province: "Jiangsu"
                        },
                        dob: '1990-01-01',
                        appointments: []
                    })
                }

                const response = await fetch(`${domain}/api/users/`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe('error')
                expect(json.message).toMatch(/bio, address.province/)
            })

        })

        describe('Route: /api/users/:email', () => {
            let email = "e.rodder@gmail.com"
            let token
            beforeEach( async () => {
                const result = await User.findOne({ email: email })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": result._id,
                    "aud": 'http://localhost:8200',
                    "roles": "user"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
            })

            test('GET returns 200 OK + user with valid email', async () => {
                const payload = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                const response = await fetch(`${domain}/api/users/${email}`, payload)
                const json = await response.json()
    
                if(response.status != 200) console.log(response, json)
    
                expect(response.status).toBe(200)
    
                expect(json.status).toBe('success')
                expect(json.user.email).toBe(email)
                expect(json.user.fname).toBe('Emily')
            })

            test('GET returns 403 Forbidden with non registered email', async () => {
                const email = "mary.poppins@jacketfarmer.com.cn"
                const payload = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                const response = await fetch(`${domain}/api/users/${email}`, payload)
                const json = await response.json()

                if(response.status != 403) console.log(response, json)

                expect(response.status).toBe(403)
                expect(json.status).toBe('Forbidden')
            })

            test('GET returns 400 Bad Request with invalid email', async () => {
                const email = "NotAnEmail"
                const payload = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                const response = await fetch(`${domain}/api/users/${email}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            // No test for missing email as it will default to route /api/users/
        })

        describe('Route: /api/users/:id', () => {
            let token
            beforeEach( async () => {
                const result = await User.findOne({ email: 'e.rodder@gmail.com' })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": result._id,
                    "aud": 'http://localhost:8200',
                    "roles": "user"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
            })

            test('PUT returns 200 OK + original user object', async () => {               
                // Get user data from database
                const user = await User.find({email: 'e.rodder@gmail.com'})
                const userData = user[0].toJSON()
                // Get user ID and set to user object
                const userID = userData._id.valueOf()
                delete userData._id
                userData._id = userID

                // Copy mock user object and change name
                const updatedData = {...userData}
                updatedData.fname = 'Updated Name'
                
                // Create payload
                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                }
                // Send request
                const response = await fetch(`${domain}/api/users/${userData._id}`, payload)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.originalData.fname).toBe(userData.fname)
                const dbUser = await User.findOne({ email: 'e.rodder@gmail.com' })
                expect(dbUser.fname).toBe('Updated Name')
            })

            test('PUT returns 403 Forbidden if id not the same as logged in user', async () => {
                const userID = mongoose.Types.ObjectId()
                const mockUser = users[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`${domain}/api/users/${userID}`, payload)
                const json = await response.json()

                if(response.status != 403) console.log(response, json)

                expect(response.status).toBe(403)
                expect(json.status).toBe('Forbidden')
                expect(json.message).toBe("You are not authorised to edit this account")
            })

            test('PUT returns 400 Bad Request with invalid input', async () => {
                // Get user data from database
                const user = await User.find({email: 'e.rodder@gmail.com'})
                const userData = user[0].toJSON()
                // Get user ID and set to user object
                const userID = userData._id.valueOf()
                delete userData._id
                userData._id = userID

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: '',
                        password: '',
                        fname: '',
                        lname: '',
                        phone: '',
                        address: {
                            streetNumber: '',
                            streetName: '',
                            suburb: '',
                            city: '',
                            state: '',
                            postCode: '',
                            country: ''
                        },
                        dob: '',
                        appointments: []
                    })
                }

                const response = await fetch(`${domain}/api/users/${userData._id}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(30)
            })

            test('PUT returns 400 Bad Request with invalid Mongoose user ID', async () => {
                const userID = 'NotAnID'
                const mockUser = users[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`${domain}/api/users/${userID}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            describe('DELETE', () => {
                let userToDelete
                beforeEach( async () => {
                    // Create user to delete
                    userToDelete = await User.create({
                        email: "jbloggs@gmail.com",
                        password: bcrypt.hashSync("Abc-1234", 6),
                        fname: "Joe",
                        lname: "Bloggs",
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
                        appointments: []
                    })

                    // Log in as Joe Bloggs
                    const payload = {
                        "iss": 'http://localhost:8200',
                        "azp": userToDelete._id,
                        "aud": 'http://localhost:8200',
                        "roles": "user"
                    }
                
                    // Generate access and refresh tokens
                    token = jwt.sign(payload , process.env.JWT_SECRET)
                })

                afterEach( async () => {
                    const results = await User.deleteMany({ email: "jbloggs@gmail.com" })
                })
            
                test('DELETE returns 204 No Content with valid input', async () => {
                    const mockUser = userToDelete

                    const response = await fetch(`${domain}/api/users/${mockUser._id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    if(response.status != 204) console.log(response, await response.json())

                    expect(response.status).toBe(204)
                    expect(response.size).toBe(0)
                })

                test('DELETE returns 403 Forbidden when user ID not the same as the logged in user', async () => {
                    const userID = mongoose.Types.ObjectId()

                    const response = await fetch(`${domain}/api/users/${userID}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    const json = await response.json()

                    if(response.status != 403) console.log(response, json)

                    expect(response.status).toBe(403)
                    expect(json.status).toBe('Forbidden')
                })

                test('DELETE returns 400 Bad Request with invalid Mongoose user ID', async () => {
                    const userID = 'NotAnID'

                    const response = await fetch(`${domain}/api/users/${userID}`, {
                        method: 'DELETE'
                    })
                    const json = await response.json()

                    if(response.status != 400) console.log(response, json)

                    expect(response.status).toBe(400)
                    expect(Array.isArray(json.errors)).toBe(true)
                    expect(json.errors.length).toBe(1)
                })
            })
        })

    })

    describe('Temp User Routes', () => {
        describe("Route: /api/temp-users/create/:businessId", () => {
            let token
            let tempUser
            const businessId = "5ee9f9f8f9f9f9f9f9f9f9f9"
            beforeEach( async () => {
                tempUser = {
                    email: 'k.free@gmail.com',
                    fname: 'Katherine',
                    lname: 'Free',
                    phone: '0423456789',
                    address: {
                        streetNumber: "",
                        streetName: "",
                        city: "",
                        state: "",
                        postCode: "",
                        country: "",
                    },
                    dob: "",
                }

                // Log in as business rep
                const user = await BusinessRep.findOne({ email: "j.chen@chencorp.com" })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": user._id,
                    "aud": 'http://localhost:8200',
                    "roles": "businessRep"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
            })

            afterEach( async () => {
                const results = await TempUser.deleteMany({ email: 'k.free@gmail.com' })
                // Delete CRM
                await CRM.deleteMany({ userModel: 'TempUser' })
            })

            // Not needed at the moment
            // test('GET returns 200 OK + array of users when data in DB', async () => {
            //     const response = await fetch(`${domain}/api/temp-users/`)
            //     const json = await response.json()
    
            //     if(response.status != 200) console.log(response, json)
    
            //     expect(response.status).toBe(200)
            //     expect(json.status).toBe('success')
            //     expect(json.user.length).toBe(tempUsers.length)
            // })

            test(`POST returns 200 OK with valid user data adds new user to the DB without address or dob`, async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(tempUser)
                }

                const response = await fetch(`${domain}/api/temp-users/create/${businessId}`, payload)
                const json = await response.json()

                if(response.status != 201) console.log(response, json)

                expect(response.status).toBe(201)
                expect(json.status).toBe('success')
                expect(json.user.email).toBe(tempUser.email)
            })

            test(`POST returns 200 OK with valid user data adds new user to the DB with address or dob`, async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: 'k.free@gmail.com',
                        password: "Asdf_1234",
                        fname: 'Katherine',
                        lname: 'Free',
                        phone: '0423456789',
                        address: {
                            streetNumber: 123,
                            streetName: "Fake Street",
                            city: "Fake City",
                            state: "Fake State",
                            postCode: 4000,
                            country: "Fake Country",
                        },
                        dob: "1990-11-18",
                    })
                }

                const response = await fetch(`${domain}/api/temp-users/create/5ee9f9f8f9f9f9f9f9f9f9f9`, payload)
                const json = await response.json()

                if(response.status != 201) console.log(response, json)

                expect(response.status).toBe(201)
                expect(json.status).toBe('success')
                expect(json.user.email).toBe('k.free@gmail.com')
            })

            // Test validation
            test('POST returns 400 Bad Request with missing input data', async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: '',
                        password: '',
                        fname: '',
                        lname: '',
                        phone: '',
                        address: {
                            streetNumber: '',
                            streetName: '',
                            suburb: '',
                            city: '',
                            state: '',
                            postCode: '',
                            country: ''
                        },
                        dob: '',
                        appointments: []
                    })
                }

                const response = await fetch(`${domain}/api/temp-users/create/${businessId}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(0)
            })

            test("POST returns 400 Bad Request when input contains duplicate key with invalid data", async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'k.free@gmail.com',
                        email: "Not a valid email",
                        password: "Asdf_1234",
                        fname: 'Katherine',
                        lname: 'Free',
                        phone: '0423456789',
                        address: {
                            streetNumber: 123,
                            streetName: 'Fake Street',
                            suburb: 'Fake Suburb',
                            city: 'Fake City',
                            state: 'QLD',
                            postCode: '4000',
                            country: 'Australia'
                        },
                        dob: '1990-01-01',
                        appointments: []
                    })
                }

                const response = await fetch(`${domain}/api/temp-users/create/${businessId}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            test("POST returns 400 Bad Request when request body contains unexpected keys", async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'b.manning@gmail.com',
                        bio: "This key is unexpected",
                        password: "Asdf_1234",
                        fname: 'Bruce',
                        lname: 'Manning',
                        phone: '0423456789',
                        address: {
                            streetNumber: 123,
                            streetName: 'Fake Street',
                            city: 'Fake City',
                            state: 'QLD',
                            postCode: '4000',
                            country: 'Australia',
                            province: "Jiangsu"
                        },
                        dob: '1990-01-01',
                        appointments: []
                    })
                }

                const response = await fetch(`${domain}/api/temp-users/create/${businessId}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe('error')
                expect(json.message).toMatch(/bio, address.province/)
            })

        })

        // This route is not needed at the moment
        // describe('Route: /api/users/:email', () => {
        //     test('GET returns 200 OK + user with valid email', async () => {
        //         const email = "temp.user@gmail.com"
        //         const response = await fetch(`${domain}/api/temp-users/${email}`)
        //         const json = await response.json()
    
        //         if(response.status != 200) console.log(response, json)
    
        //         expect(response.status).toBe(200)
    
        //         expect(json.status).toBe('success')
        //         expect(json.user.email).toBe(email)
        //         expect(json.user.fname).toBe('Temp')
        //     })

        //     test('GET returns 404 Not Found with non registered email', async () => {
        //         const email = "mary.poppins@jacketfarmer.com.cn"
        //         const response = await fetch(`${domain}/api/temp-users/${email}`)
        //         const json = await response.json()

        //         if(response.status != 404) console.log(response, json)

        //         expect(response.status).toBe(404)
        //         expect(json.status).toBe('not found')
        //         expect(json.user.length).toBe(0)
        //     })

        //     test('GET returns 400 Bad Request with invalid email', async () => {
        //         const email = "NotAnEmail"
        //         const response = await fetch(`${domain}/api/temp-users/${email}`)
        //         const json = await response.json()

        //         if(response.status != 400) console.log(response, json)

        //         expect(response.status).toBe(400)
        //         expect(Array.isArray(json.errors)).toBe(true)
        //         expect(json.errors.length).toBe(1)
        //     })

        //     // No test for missing email as it will default to route /api/users/
        // })

        describe('Route: /api/temp-users/:businessId/:id', () => {
            let token
            let tempUser
            const businessId = "5ee9f9f8f9f9f9f9f9f9f9f9"
            beforeEach( async () => {
                // Create user to update / delete
                const userObject = {
                    email: 'k.free@gmail.com',
                    fname: 'Katherine',
                    lname: 'Free',
                    phone: '0423456789',
                    address: {
                        streetNumber: "",
                        streetName: "",
                        city: "",
                        state: "",
                        postCode: "",
                        country: "",
                    },
                    dob: "",
                }
                
                // Insert temp user into DB
                tempUser = await TempUser.create(userObject)

                // Create a CRM entry for the user
                const crm = {
                    userModel: 'TempUser',
                    user: tempUser._id,
                    business: businessId,
                    tempFlag: true,
                    appointments: [],
                    allowAccess: true,
                    notes: ""
                }

                const crmResult = await CRM.create(crm)

                // Log in as business rep
                const user = await BusinessRep.findOne({ email: "j.chen@chencorp.com" })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": user._id,
                    "aud": 'http://localhost:8200',
                    "roles": "businessRep"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
            })

            afterEach( async () => {
                const crmResults = await CRM.deleteMany({ user: tempUser._id })
                const results = await TempUser.deleteMany({ email: 'k.free@gmail.com' })
            })
            
            test('PUT returns 200 OK + original user object', async () => {               
                // Copy mock user object and change name
                const updatedData = {...tempUser._doc}
                updatedData.fname = 'Updated Name'
                delete updatedData._id
                delete updatedData.__v
                delete updatedData.createdAt
                delete updatedData.updatedAt
                
                // Create payload
                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                }
                // Send request
                const response = await fetch(`${domain}/api/temp-users/${businessId}/${tempUser._id}`, payload)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.originalData.fname).toBe(tempUser.fname)
                const dbUser = await TempUser.findOne({ email: 'k.free@gmail.com' })
                expect(dbUser.fname).toBe('Updated Name')
            })

            test('PUT returns 400 Bad Request if id not in DB', async () => {
                const userID = mongoose.Types.ObjectId()
                const mockUser = users[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`${domain}/api/temp-users/${businessId}/${userID}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe('error')
            })

            test('PUT returns 400 Bad Request with invalid input', async () => {
                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: '',
                        password: '',
                        fname: '',
                        lname: '',
                        phone: '',
                        address: {
                            streetNumber: '',
                            streetName: '',
                            suburb: '',
                            city: '',
                            state: '',
                            postCode: '',
                            country: ''
                        },
                        dob: '',
                        appointments: []
                    })
                }

                const response = await fetch(`${domain}/api/temp-users/${businessId}/${tempUser._id}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(10)
            })

            test('PUT returns 400 Bad Request with invalid Mongoose user ID', async () => {
                const userID = 'NotAnID'
                const mockUser = users[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`${domain}/api/temp-users/${businessId}/${userID}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            test('DELETE returns 204 No Content with valid input', async () => {
                const response = await fetch(`${domain}/api/temp-users/${businessId}/${tempUser._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if(response.status != 204) console.log(response)

                expect(response.status).toBe(204)
                expect(response.size).toBe(0)
            })

            test('DELETE returns 404 Not Found when user ID not in DB', async () => {
                const userID = mongoose.Types.ObjectId()

                const response = await fetch(`${domain}/api/temp-users/${businessId}/${userID}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe('error')
            })

            test('DELETE returns 400 Bad Request with invalid Mongoose user ID', async () => {
                const userID = 'NotAnID'

                const response = await fetch(`${domain}/api/temp-users/${businessId}/${userID}`, {
                    method: 'DELETE'
                })
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })
        })

    })

    describe('Business Rep Routes', () => {
        describe("Route: /api/business-reps", () => {
            test('GET returns 200 OK + array of business reps when data in DB', async () => {
                const response = await fetch(`${domain}/api/business-reps/`)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.user.length).toBe(businessReps.length)
            })
// The following routes will be implemented in the future
            // test(`POST returns 200 OK with valid business rep data - adds new business rep to the DB`, async () => {
            //     const payload = {
            //         method: 'POST',
            //         headers: {
            //             'content-type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             email: 'b.simpson@gmail.com',
            //             password: "Asdf_1234",
            //             fname: 'Bart',
            //             lname: 'Simpson',
            //             phone: '0423456789',
            //             address: {
            //                 streetNumber: 123,
            //                 streetName: 'Fake Street',
            //                 city: 'Fake City',
            //                 state: 'QLD',
            //                 postCode: '4000',
            //                 country: 'Australia'
            //             },
            //             dob: '1990-01-01'
            //         })
            //     }

            //     const response = await fetch(`${domain}/api/business-reps/`, payload)
            //     const json = await response.json()

            //     if(response.status != 201) console.log(response, json)

            //     expect(response.status).toBe(201)
            //     expect(json.status).toBe('success')
            //     expect(json.user.email).toBe('b.simpson@gmail.com')
            // })

            // // Test validation
            // test('POST returns 400 Bad Request with missing input data', async () => {
            //     const payload = {
            //         method: 'POST',
            //         headers: {
            //             'content-type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             email: '',
            //             password: '',
            //             fname: '',
            //             lname: '',
            //             phone: '',
            //             address: {
            //                 streetNumber: '',
            //                 streetName: '',
            //                 suburb: '',
            //                 city: '',
            //                 state: '',
            //                 postCode: '',
            //                 country: ''
            //             },
            //             dob: ''
            //         })
            //     }

            //     const response = await fetch(`${domain}/api/business-reps/`, payload)
            //     const json = await response.json()

            //     if(response.status != 400) console.log(response, json)

            //     expect(response.status).toBe(400)
            //     expect(Array.isArray(json.errors)).toBe(true)
            //     expect(json.errors.length).toBe(32)
            // })

            // test("POST returns 400 Bad Request when input contains duplicate key with invalid data", async () => {
            //     const payload = {
            //         method: 'POST',
            //         headers: {
            //             'content-type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             email: 'b.simpson@gmail.com',
            //             email: "Not a valid email",
            //             password: "Asdf_1234",
            //             fname: 'Bart',
            //             lname: 'Simpson',
            //             phone: '0423456789',
            //             address: {
            //                 streetNumber: 123,
            //                 streetName: 'Fake Street',
            //                 suburb: 'Fake Suburb',
            //                 city: 'Fake City',
            //                 state: 'QLD',
            //                 postCode: '4000',
            //                 country: 'Australia'
            //             },
            //             dob: '1990-01-01'
            //         })
            //     }

            //     const response = await fetch(`${domain}/api/business-reps/`, payload)
            //     const json = await response.json()

            //     if(response.status != 400) console.log(response, json)

            //     expect(response.status).toBe(400)
            //     expect(Array.isArray(json.errors)).toBe(true)
            //     expect(json.errors.length).toBe(1)
            // })

            // test("POST returns 400 Bad Request when request body contains unexpected keys", async () => {
            //     const payload = {
            //         method: 'POST',
            //         headers: {
            //             'content-type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             email: 'b.simpson@gmail.com',
            //             bio: "This key is unexpected",
            //             password: "Asdf_1234",
            //             fname: 'Bart',
            //             lname: 'Simpson',
            //             phone: '0423456789',
            //             address: {
            //                 streetNumber: 123,
            //                 streetName: 'Fake Street',
            //                 city: 'Fake City',
            //                 state: 'QLD',
            //                 postCode: '4000',
            //                 country: 'Australia',
            //                 province: "Jiangsu"
            //             },
            //             dob: '1990-01-01'
            //         })
            //     }

            //     const response = await fetch(`${domain}/api/business-reps/`, payload)
            //     const json = await response.json()

            //     if(response.status != 400) console.log(response, json)

            //     expect(response.status).toBe(400)
            //     expect(json.status).toBe('error')
            //     expect(json.message).toMatch(/bio, address.province/)
            // })

        })

        describe('Route: /api/business-reps/:email', () => {
            test('GET returns 200 OK + business rep with valid email', async () => {
                const email = "j.chen@chencorp.com"
                const response = await fetch(`${domain}/api/business-reps/${email}`)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)

                expect(json.status).toBe('success')
                expect(json.user.email).toBe(email)
                expect(json.user.fname).toBe('John')
            })

            test('GET returns 404 Not Found with non registered email', async () => {
                const email = "mary.poppins@jacketfarmer.com.cn"
                const response = await fetch(`${domain}/api/business-reps/${email}`)
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
                expect(json.user.length).toBe(0)
            })

            test('GET returns 400 Bad Request with invalid email', async () => {
                const email = "NotAnEmail"
                const response = await fetch(`${domain}/api/business-reps/${email}`)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            // No test for missing email as it will default to route /api/business-reps/
        })

        describe('Route: /api/business-reps/:id', () => {
            let token
            beforeEach(async () => {
                const newRep = {
                    email: 'b.simpson@gmail.com',
                    password: "Asdf_1234",
                    fname: 'Bart',
                    lname: 'Simpson',
                    phone: '0423456789',
                    address: {
                        streetNumber: 123,
                        streetName: 'Fake Street',
                        city: 'Fake City',
                        state: 'QLD',
                        postCode: '4000',
                        country: 'Australia'
                    },
                    dob: '1990-01-01'
                }
                const result = await BusinessRep.create(newRep)

                // Log in as new account
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": result._id,
                    "aud": 'http://localhost:8200',
                    "roles": "businessRep"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
            })

            afterEach(async () => {
                await BusinessRep.deleteOne({ email: 'b.simpson@gmail.com' })
            })

            test('PUT returns 200 OK + original business rep object', async () => {               
                // Get business rep data from database
                const user = await BusinessRep.find({email: 'b.simpson@gmail.com'})
                const userData = user[0].toJSON()
                // Get user ID and set to user object
                const userID = userData._id.valueOf()
                delete userData._id
                userData._id = userID

                // Copy mock user object and change name
                const updatedData = {...userData}
                updatedData.fname = 'Updated Name'
                
                // Create payload
                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                }
                // Send request
                const response = await fetch(`${domain}/api/business-reps/${userData._id}`, payload)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.originalData.fname).toBe(userData.fname)
                const dbUser = await BusinessRep.findOne({ email: 'b.simpson@gmail.com' })
                expect(dbUser.fname).toBe('Updated Name')
            })

            test('PUT returns 403 Forbidden if id not for target account', async () => {
                const userID = mongoose.Types.ObjectId()
                const mockUser = businessReps[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`${domain}/api/business-reps/${userID}`, payload)
                const json = await response.json()

                if(response.status != 403) console.log(response, json)

                expect(response.status).toBe(403)
                expect(json.status).toBe('Forbidden')
                expect(json.message).toBe('You are not authorised to edit this account')
            })

            test('PUT returns 400 Bad Request with invalid input', async () => {
                // Get business rep data from database
                const user = await BusinessRep.find({email: 'b.simpson@gmail.com'})
                const userData = user[0].toJSON()
                // Get user ID and set to user object
                const userID = userData._id.valueOf()
                delete userData._id
                userData._id = userID

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: '',
                        password: '',
                        fname: '',
                        lname: '',
                        phone: '',
                        address: {
                            streetNumber: '',
                            streetName: '',
                            suburb: '',
                            city: '',
                            state: '',
                            postCode: '',
                            country: ''
                        },
                        dob: ''
                    })
                }

                const response = await fetch(`${domain}/api/business-reps/${userData._id}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(30)
            })

            test('PUT returns 400 Bad Request with invalid Mongoose user ID', async () => {
                const userID = 'NotAnID'
                const mockUser = businessReps[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`${domain}/api/business-reps/${userID}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            test('DELETE returns 204 No Content with valid input', async () => {
                const mockUser = await BusinessRep.findOne({ email: 'b.simpson@gmail.com' })

                const response = await fetch(`${domain}/api/business-reps/${mockUser._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if(response.status != 204) console.log(response)

                expect(response.status).toBe(204)
                expect(response.size).toBe(0)
            })

            test('DELETE returns 403 Forbidden when user ID not for logged in account', async () => {
                const userID = mongoose.Types.ObjectId()

                const response = await fetch(`${domain}/api/business-reps/${userID}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const json = await response.json()

                if(response.status != 403) console.log(response, json)

                expect(response.status).toBe(403)
                expect(json.status).toBe('Forbidden')
            })

            test('DELETE returns 400 Bad Request with invalid Mongoose user ID', async () => {
                const userID = 'NotAnID'

                const response = await fetch(`${domain}/api/business-reps/${userID}`, {
                    method: 'DELETE'
                })
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })
        })
    })

    describe('Business Routes', () => {
        describe('Route: /api/businesses/:businessId', () => {
            let token
            beforeAll(async () => {
                const rep = await BusinessRep.findOne({ email: "j.chen@chencorp.com" })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": rep._id,
                    "aud": 'http://localhost:8200',
                    "roles": "businessRep"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
            })

            afterAll( async () => {
                // Reset business in to original values
                await Business.findOneAndUpdate({ abn: businesses[0].abn }, businesses[0] )
            })

            test('GET returns 200 OK + business with valid ID', async () => {
                const businessId = businesses[0]._id

                const response = await fetch(`${domain}/api/businesses/${businessId}`)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.business._id).toBe("5ee9f9f8f9f9f9f9f9f9f9f9")
                expect(json.business.name).toBe("Jet Mandarin")
            })

            test('GET returns 404 Not Found with non registered ID', async () => {
                const businessId = mongoose.Types.ObjectId()
                const response = await fetch(`${domain}/api/businesses/${businessId}`)
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
                expect(json.business.length).toBe(0)
            })

            test('GET returns 400 Bad Request with invalid IDs', async () => {
                const IDInputs = [
                    1,
                    "NotAnABN",
                    {object: "object"},
                    1232
                ]

                IDInputs.forEach(async (id) => {
                    const response = await fetch(`${domain}/api/businesses/${id}`)
                    const json = await response.json()

                    if(response.status != 400) console.log(response, json)

                    expect(response.status).toBe(400)
                    expect(Array.isArray(json.errors)).toBe(true)
                    expect(json.errors.length).toBeGreaterThan(0)
                })
            })

            test('GET responds with 404 Not Found when ID missing', async () => {
                const response = await fetch(`${domain}/api/businesses/`)
                    const text = await response.text()

                    if(response.status != 404) console.log(response, json)

                    expect(response.status).toBe(404)
                    expect(text).toMatch(/Cannot GET \/api\/businesses/)
            })
                    
            test('PUT returns 200 OK + original business object', async () => {               
                // Get business data from database
                const user = await Business.findOne({abn: 12345678912})
                
                // Copy mock user object and change name
                const updatedData = JSON.parse(JSON.stringify(user))
                updatedData.name = 'Updated Name'

                // Create payload
                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                }
                // Send request
                const response = await fetch(`${domain}/api/businesses/${user._id}`, payload)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.originalDetails.name).toBe(user.name)
                const dbUser = await Business.findOne({ abn: 12345678912 })
                expect(dbUser.name).toBe('Updated Name')
            })

            test('PUT returns 404 Not Found if ID not in DB', async () => {
                const businessId = mongoose.Types.ObjectId()
                const business = businesses[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(business)
                }

                const response = await fetch(`${domain}/api/businesses/${businessId}`, payload)
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe('error')
                expect(json.message).toBe('Business not found')
            })

            test('PUT returns 400 Bad Request with invalid IDs', async () => {
                const invalidIDs = [
                    'NotAnABN',
                    {object: "OBJECT"},
                    1,
                    27384
                ]
                const mockbusiness = businesses[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(mockbusiness)
                }

                invalidIDs.forEach(async (id) => {
                    const response = await fetch(`${domain}/api/businesses/${id}`, payload)
                    const json = await response.json()
    
                    if(response.status != 400) console.log(response, json)
    
                    expect(response.status).toBe(400)
                    expect(Array.isArray(json.errors)).toBe(true)
                    expect(json.errors.length).toBeGreaterThan(0)
                })
            })

            test('PUT returns 404 Not Found when ID param missing', async() => {
                const payload = {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }

                const response = await fetch(`${domain}/api/businesses/`, payload)
                const text = await response.text()

                expect(response.status).toBe(404)
                expect(text).toMatch(/Cannot PUT \/api\/businesses\//)
            })

            test('PUT returns 400 Bad Request with invalid body', async () => {
                // Get business rep data from database
                const businessId = businesses[0]._id

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        abn: "",
                        name: "",
                        address: {
                            streetNumber: "",
                            streetName: "",
                            city: "",
                            state: "",
                            postCode: "",
                        },
                        phone: "",
                        email: "",
                        businessRep: "",
                        appointments: [],
                    })
                }

                const response = await fetch(`${domain}/api/businesses/${businessId}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(1)
            })

            test('PUT returns 400 Bad Request when unexpected keys present in request body', async () => {
                // Get business rep data from database
                const businessId = businesses[0]._id

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        abn: 12345678912,
                        name: "Jet Mandarin",
                        address: {
                            streetNumber: 123,
                            streetName: "Main St",
                            suburb: "Milton",
                            city: "Brisbane",
                            state: "NSW",
                            postCode: 2000,
                            country: "Australia"
                        },
                        phone: "0412345678",
                        email: "jet@jetmandarin.com",
                        businessRep: "623d340fd6dd133325228406",
                        operatingHours: [],
                        industry: "Education",
                        appointments: [],
                    })
                }

                const response = await fetch(`${domain}/api/businesses/${businessId}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe("error")
                expect(json.message).toMatch(/address.suburb, industry/)
            })
        })

        describe('Route: api/businesses/services/:businessId', () => {
            let token
            beforeAll(async () => {
                const user = await BusinessRep.findOne({ email: "j.chen@chencorp.com" })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": user._id,
                    "aud": 'http://localhost:8200',
                    "roles": "businessRep"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
            })

            const mockService = {
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            }

            test('POST returns 200 OK with valid abn and service data', async () => {
                const business = businesses[0]
                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(mockService)
                }
                business.services.push(mockService)

                const response = await fetch(`${domain}/api/businesses/services/${business._id}`, payload)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.updatedData.email).toBe("jet@jetmandarin.com")
                expect(json.updatedData.services.length).toBeGreaterThan(0)
            })

            test('POST returns 404 Not Found when ID not in DB', async () => {
                const businessId = mongoose.Types.ObjectId()
                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(mockService)
                }

                const response = await fetch(`${domain}/api/businesses/services/${businessId}`, payload)
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe("error")
                expect(json.message).toBe("Business not found")
            })

            // Validation tests
            test('POST returns 400 Bad Request with missing service inputs', async () => {
                const business = businesses[0]
                const payload = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(
                        {
                            name: "",
                            description: "",
                            duration: "",
                            bookingTimes: {},
                            break: "",
                            fee: ""
                        }
                    )
                }

                const response = await fetch(`${domain}/api/businesses/services/${business.abn}`, payload)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(0)
            })

            test('GET returns 200 OK with valid ID', async () => {
                const business = businesses[0]
                const response = await fetch(`${domain}/api/businesses/services/${business._id}`)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.services[0].name).toBe(business.services[0].name)
                expect(json.services[0].duration).toBe(55)
            })

            test('GET returns 404 Not Found when ID not in DB', async () => {
                const businessId = mongoose.Types.ObjectId()
                const response = await fetch(`${domain}/api/businesses/services/${businessId}`)
                const json = await response.json()

                if(response.status !== 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe("not found")
                expect(json.message).toBe("ABN not found")
            })
        })

        describe('Route: api/businesses/services/:abn/:serviceId', () => {
            const mockService = {
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            }

            let token
            let serviceId
            beforeAll(async () => {
                const user = await BusinessRep.findOne({ email: "j.chen@chencorp.com" })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": user._id,
                    "aud": 'http://localhost:8200',
                    "roles": "businessRep"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)

                // Get serviceId
                const business = businesses[0]
                const payload2 = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(mockService)
                }
                const response = await fetch(`${domain}/api/businesses/services/${business._id}`, payload2)
                const json = await response.json()
                serviceId = json.updatedData.services[0]._id
            })

            test('GET returns 200 OK with valid ID and serviceId', async () => {
                
                const response = await fetch(`${domain}/api/businesses/services/${businesses[0]._id}/${serviceId}`)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)
                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.service.name).toBe(mockService.name)
                expect(json.service.duration).toBe(55)
            })

            test('GET returns 404 Not Found when valid ID not in DB', async () => {
                const businessId = mongoose.Types.ObjectId()
                const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`)
                const json = await response.json()

                if(response.status !== 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe("not found")
                expect(json.message).toBe("Service not found")
            })

            test('GET returns 404 Not Found when valid serviceId not in DB', async () => {
                const businessId = businesses[0]._id
                const serviceId = mongoose.Types.ObjectId()
                const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`)
                const json = await response.json()

                if(response.status !== 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe("not found")
                expect(json.message).toBe("Service not found")
            })

            test('GET returns 400 Bad Request with invalid serviceId', async () => {
                const businessId = businesses[0]._id
                const serviceId = "invalid mongoose id"
                const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(0)
            })

            test('GET returns 400 Bad Request with invalid ID', async () => {
                const businessId = "invalid ID"
                const serviceId = mongoose.Types.ObjectId()
                const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(0)
            })

            test("PUT returns 200 OK with valid abn, serviceId and service content", async () => {
                const businessId = businesses[0]._id
                let updatedService = JSON.parse(JSON.stringify(mockService))
                updatedService.name = "Updated Service"
                const payload = {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedService)
                }

                const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`, payload)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.updatedData.services[0].name).toBe("Updated Service")
            })

            test("PUT returns 404 Not Found with valid ID not in DB", async () => {
                const businessId = mongoose.Types.ObjectId()
                let updatedService = JSON.parse(JSON.stringify(mockService))
                updatedService.name = "Updated Service"
                const payload = {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedService)
                }

                const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`, payload)
                const json = await response.json()

                if(response.status !== 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe("error")
                expect(json.message).toBe("Business not found")
            })

            test("PUT returns 400 Bad Request with valid serviceId not in DB", async () => {
                const businessId = businesses[0]._id
                let updatedService = JSON.parse(JSON.stringify(mockService))
                updatedService.name = "Updated Service"
                const payload = {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedService)
                }

                const response = await fetch(`${domain}/api/businesses/services/${businessId}/${mongoose.Types.ObjectId()}`, payload)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe("error")
                expect(json.message).toBe("An unexpected error occurred")
            })

            // Validation tests
            test("PUT returns 400 Bad Request with invalid businessId", async () => {
                const abn = "invalid abn"
                let updatedService = JSON.parse(JSON.stringify(mockService))
                updatedService.name = "Updated Service"
                const payload = {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedService)
                }

                const response = await fetch(`${domain}/api/businesses/services/${abn}/${serviceId}`, payload)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(0)
            })

            test("PUT returns 400 Bad Request with invalid serviceId", async () => {
                const businessId = businesses[0]._id
                let updatedService = JSON.parse(JSON.stringify(mockService))
                updatedService.name = "Updated Service"
                const payload = {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedService)
                }

                const response = await fetch(`${domain}/api/businesses/services/${businessId}/invalid`, payload)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(0)
            })

            test("PUT returns 400 Bad Request with missing service values", async () => {
                const businessId = businesses[0]._id
                let updatedService = {
                    name: "",
                    description: "",
                    duration: "",
                    bookingTimes: "",
                    break: "",
                    fee: ""
                }
                updatedService.name = "Updated Service"
                const payload = {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedService)
                }

                const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`, payload)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(0)
            })

            test("PUT returns 400 Bad Request with unexpected keys in request body", async () => {
                const businessId = businesses[0]._id
                let updatedService = JSON.parse(JSON.stringify(mockService))
                updatedService.name = "Updated Service"
                updatedService.unexpectedKey = "unexpected key"
                const payload = {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedService)
                }

                const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`, payload)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe("error")
                expect(json.message).toMatch(/unexpectedKey/)
            })
            describe('DELETE', () => {
                let business
                let service
                beforeEach(async () => {
                    // Clear Businesses from DB
                    await Business.deleteMany({})
                    // Create new business in DB
                    business = new Business(businesses[0])

                    // Add service to business
                    await business.services.push(mockService)
                    service = business.services[business.services.length -1]
                    await business.save()
                })

                test('DELETE returns 200 OK with valid ID and serviceId', async () => {                   
                    const businessId = business._id
                    const payload = {
                        method: "DELETE",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                    
                    const response = await fetch(`${domain}/api/businesses/services/${businessId}/${service._id}`, payload)
    
                    if(response.status !== 204) console.log(response)
    
                    expect(response.status).toBe(204)
                    expect(response.size).toBe(0)
                    const result2 = await Business.findOne({ abn: business.abn })
                    expect(result2.services.length).toBe(1)
                    expect(business.services[0]._id.toString()).toBe(result2.services[0]._id.toString())
                })
    
                test('DELETE returns 400 Bad Request with valid ID not in DB', async () => {                    
                    const businessId = mongoose.Types.ObjectId()
                    const payload = {
                        method: "DELETE",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                    
                    const response = await fetch(`${domain}/api/businesses/services/${businessId}/${service._id}`, payload)
                    const json = await response.json()
    
                    if(response.status !== 404) console.log(response)
    
                    expect(response.status).toBe(404)
                    expect(json.status).toBe("error")
                    expect(json.message).toBe("Business not found")
                    const result2 = await Business.findOne({ abn: business.abn })
                    expect(result2.services.length).toBe(2)
                })
    
                test('DELETE returns 400 Bad Request with valid serviceId not in DB', async () => {
                    const businessId = business._id
                    const serviceId = mongoose.Types.ObjectId()
                    const payload = {
                        method: "DELETE",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                    
                    const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`, payload)
                    const json = await response.json()
    
                    if(response.status !== 400) console.log(response)
    
                    expect(response.status).toBe(400)
                    expect(json.status).toBe("error")
                    expect(json.message).toBe("An unexpected error occurred")
                    const result2 = await Business.findOne({ abn: business.abn })
                    expect(result2.services.length).toBe(2)
                })

                // Validation Tests
                test('DELETE returns 400 Bad Request with invalid ID', async () => {
                    const abn = "Not a valid ABN"
                    const payload = {
                        method: "DELETE",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                    
                    const response = await fetch(`${domain}/api/businesses/services/${abn}/${service._id}`, payload)
                    const json = await response.json()

                    if(response.status !== 400) console.log(response)
    
                    expect(response.status).toBe(400)
                    expect(Array.isArray(json.errors)).toBe(true)
                    expect(json.errors.length).toBeGreaterThan(0)
                })

                test("DELETE returns 400 Bad Request with invalid serviceId", async () => {
                    const businessId = business._id
                    const serviceId = "Not a valid serviceId"
                    const payload = {
                        method: "DELETE",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                    
                    const response = await fetch(`${domain}/api/businesses/services/${businessId}/${serviceId}`, payload)
                    const json = await response.json()

                    if(response.status !== 400) console.log(response)
    
                    expect(response.status).toBe(400)
                    expect(Array.isArray(json.errors)).toBe(true)
                    expect(json.errors.length).toBeGreaterThan(0)
                })
            })
        })

        describe('Route: /api/businesses/client-list/:businessId', () => {            
            let business
            let clients
            let token
            beforeEach(async () => {
                // Log in business rep
                const rep = await BusinessRep.findOne({ email: "j.chen@chencorp.com" })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": rep._id,
                    "aud": 'http://localhost:8200',
                    "roles": "businessRep"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)

                // Get business from DB
                business = await Business.findOne({ abn: businesses[0].abn })

                // Get users from DB
                const users = await User.find({})
                const tempUsers = await TempUser.find({})

                // Create CRMs
                clients = await CRM.create([
                    {
                        userModel: "User",
                        user: users[0]._id,
                        business: business._id,
                        tempFlag: false,
                        allowAccess: true,
                        notes: "Some notes"
                    },{
                        userModel: "TempUser",
                        user: tempUsers[0]._id,
                        business: business._id,
                        tempFlag: true,
                        notes: "Some notes"
                    }, {
                        userModel: "User",
                        user: users[1]._id,
                        business: business._id,
                        tempFlag: false,
                        allowAccess: true,
                        notes: "Some notes"
                    }
                ])
            })

            afterEach(async () => {
                // Delete all CRMs
                await CRM.deleteMany({})
            })

            test('GET returns 200 OK with valid businessId', async () => {
                const payload = {
                    method: "GET",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
                
                const response = await fetch(`${domain}/api/businesses/client-list/${business._id}`, payload)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(Array.isArray(json.clients)).toBe(true)
                expect(json.clients.length).toBe(3)
            })
        })
    })

    describe('Auth Routes:', () => {
        let token
        beforeAll(async () => {
            const user = await User.findOne({email: "j.hampton@gmail.com"})
            const payload = {
                "iss": 'http://localhost:8200',
                "azp": user._id,
                "aud": 'http://localhost:8200',
                "roles": "user"
            }
        
            // Generate access and refresh tokens
            token = jwt.sign(payload , process.env.JWT_SECRET)
        })

        describe('Route: /api/auth/register', () => {
            // Set up mock users for registration tests
            const mockUser = {
                email: "p.wong@gmail.com",
                password: "Abc-1234",
                fname: "Penny",
                lname: "Wong",
                phone: "0746372891",
                address: {
                    streetNumber: 333,
                    streetName: "Margaret Street",
                    city: "Brisbane",
                    state: "QLD",
                    postCode: 4000,
                    country: "Australia",
                },
                dob: new Date(1970, 7, 12),
            }

            // User Registration Tests
            test('POST returns 201 Created and registers a "user" in the DB with valid inputs', async () => {
                const user = JSON.parse(JSON.stringify(mockUser))
                const userType = 'user'
                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(user)
                }

                const response = await fetch(`${domain}/api/auth/register/${userType}`, payload)
                const json = await response.json()
                
                if(response.status !== 201) console.log(response, json)

                expect(response.status).toBe(201)
                expect(json.status).toBe("success")
                expect(json.message).toBe("Account created successfully")
            })

            // Validation tests
            test('POST returns 400 Bad Request when user values missing', async () => {
                const user = {}
                const userType = 'user'
                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(user)
                }

                const response = await fetch(`${domain}/api/auth/register/${userType}`, payload)
                const json = await response.json()
                
                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(0)
            })



            const mockBusinessRep = {
                email: "b.gates@outlook.com",
                password: "Abc-1234",
                fname: "Bill",
                lname: "Gates",
                phone: "0473982982",
                address: {
                    streetNumber: 32,
                    streetName: "High Street",
                    city: "Berkshire",
                    state: "QLD",
                    postCode: 4557,
                    country: "Australia",
                },
                dob: new Date(1972, 1, 12),
            }

           
            // Business Rep Registration Tests
            test('POST returns 201 Created and registers a "businessRep" in the DB with valid inputs', async () => {
                const businessRep = JSON.parse(JSON.stringify(mockBusinessRep))
                const userType = 'businessRep'
                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(businessRep)
                }

                const response = await fetch(`${domain}/api/auth/register/${userType}`, payload)
                const json = await response.json()
                
                if(response.status !== 201) console.log(response, json)

                expect(response.status).toBe(201)
                expect(json.status).toBe("success")
                expect(json.message).toBe("Account created successfully")
            })

            // Validation tests
            test('POST returns 400 Bad Request when businessRep values missing', async () => {
                const businessRep = {}
                const userType = 'businessRep'
                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(businessRep)
                }

                const response = await fetch(`${domain}/api/auth/register/${userType}`, payload)
                const json = await response.json()
                
                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBeGreaterThan(0)
            })

            test('POST returns 400 Bad Request when userType not "user" or "businessRep"', async () => {
                const user = JSON.parse(JSON.stringify(mockBusinessRep))
                const userType = 'invalid'
                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(user)
                }

                const response = await fetch(`${domain}/api/auth/register/${userType}`, payload)
                const json = await response.json()
                
                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe("error")
                expect(json.message).toBe("Invalid user type")
            })

        })

        describe('Route: /api/auth/login', () => {
            test('POST returns 200 OK with JWT tokens and logs user in with valid inputs', async () => {
                const user = users[1]
                const userType = "user"
                const userCredentials = {
                    email: user.email,
                    password: "Abc-1234",
                }

                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(userCredentials)
                }

                const response = await fetch(`${domain}/api/auth/login/${userType}`, payload)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.message).toBe("User successfully logged in")
                expect(json.accessToken).toBeTruthy()
                expect(json.refreshToken).toBeTruthy()

                // Check that a refresh token has been added to the database
                const tokenList = await Auth.find({})
                expect(tokenList.length > 0).toBe(true)
                expect(json.refreshToken).toBe(tokenList[0].refreshToken)
            })

            test('POST returns 400 Bad Request when user email or password incorrect', async () => {
                const user = users[0]
                const userType = "user"
                const credentialsList = [
                    {email: user.email, password: "Invalid_555"},
                    {email: "invalid@invalid.com", password: "Abc-1234"},
                ]

                credentialsList.forEach(async item => {
                    const userCredentials = {
                        email: item.email,
                        password: item.password,
                    }
    
                    const payload = {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify(userCredentials)
                    }
    
                    const response = await fetch(`${domain}/api/auth/login/${userType}`, payload)
                    const json = await response.json()
    
                    if(response.status !== 400) console.log(response, json)
    
                    expect(response.status).toBe(400)
                    expect(json.status).toBe("error")
                    expect(json.message).toBe("Invalid credentials")
                    expect(json.accessToken).toBeFalsy()
                    expect(json.refreshToken).toBeFalsy()
                })
            })

           
            // Business rep login tests
            test('POST returns 200 OK with JWT tokens and logs user in with valid inputs', async () => {
                const user = businessReps[0]
                const userType = "businessRep"
                const userCredentials = {
                    email: user.email,
                    password: "Abc-1234",
                }

                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(userCredentials)
                }

                const response = await fetch(`${domain}/api/auth/login/${userType}`, payload)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.message).toBe("User successfully logged in")
                expect(json.accessToken).toBeTruthy()
                expect(json.refreshToken).toBeTruthy()

                // Check that a refresh token has been added to the database
                const tokenList = await Auth.find({})
                expect(tokenList.length > 1).toBe(true)
                expect(json.refreshToken).toBe(tokenList[1].refreshToken)
            })

            test('POST returns 400 Bad Request when businessRep email or password incorrect', async () => {
                const user = businessReps[1]
                const userType = "businessRep"
                const credentialsList = [
                    {email: user.email, password: "Invalid_555"},
                    {email: "invalid@invalid.com", password: "Abc-1234"},
                ]

                credentialsList.forEach(async item => {
                    const userCredentials = {
                        email: item.email,
                        password: item.password,
                    }
    
                    const payload = {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify(userCredentials)
                    }
    
                    const response = await fetch(`${domain}/api/auth/login/${userType}`, payload)
                    const json = await response.json()
    
                    if(response.status !== 400) console.log(response, json)
    
                    expect(response.status).toBe(400)
                    expect(json.status).toBe("error")
                    expect(json.message).toBe("Invalid credentials")
                    expect(json.accessToken).toBeFalsy()
                    expect(json.refreshToken).toBeFalsy()
                })
            })

            test('POST returns 400 Bad Request when userType not "user" or "businessRep"', async () => {
                const user = users[0]
                const userType = "Not a user type"
                const userCredentials = {
                    email: user.email,
                    password: "Abc-1234",
                }

                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(userCredentials)
                }

                const response = await fetch(`${domain}/api/auth/login/${userType}`, payload)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe("error")
                expect(json.message).toBe("Something went wrong...")
                expect(json.accessToken).toBeFalsy()
                expect(json.refreshToken).toBeFalsy()
            })

             // Validation tests for this route are the same for all user types
             test('POST returns 400 Bad Request when user inputs invalid', async () => {
                const userInputs = [
                    {},
                    {email: "invalid", password: "invalid"},
                ]
                const userType = "user"

                userInputs.forEach(async user => {
                    const payload = {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify(user)
                    }
    
                    const response = await fetch(`${domain}/api/auth/login/${userType}`, payload)
                    const json = await response.json()
                    
                    if(response.status !== 400) console.log(response, json)
    
                    expect(response.status).toBe(400)
                    expect(Array.isArray(json.errors)).toBe(true)
                    expect(json.errors.length).toBeGreaterThan(0)
                })
            })

            test('POST returns 400 Bad Request when inputs contain unexpected keys', async () => {
                const userType = "user"
                const userCredentials = {
                    email: "email@address.com",
                    password: "Abc-1234",
                    extraKey: "extraValue"
                }

                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(userCredentials)
                }

                const response = await fetch(`${domain}/api/auth/login/${userType}`, payload)
                const json = await response.json()

                if(response.status !== 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe("error")
                expect(json.message).toMatch(/extraKey/)
            })
        })

        describe('Route: /api/auth/logout', () => {
            test('POST returns 200 OK + log out when user is logged in', async () => {
                const user = users[2]
                const userType = "user"
                const userCredentials = {
                    email: user.email,
                    password: "Abc-1234",
                }

                const payload = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(userCredentials)
                }

                const response = await fetch(`${domain}/api/auth/login/${userType}`, payload)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.message).toBe("User successfully logged in")
                expect(json.accessToken).toBeTruthy()
                expect(json.refreshToken).toBeTruthy()

                // Check that a refresh token has been added to the database
                const tokenRes = await Auth.find({ refreshToken: json.refreshToken })
                expect(tokenRes.length === 1).toBeTruthy()
                expect(tokenRes[0].refreshToken).toBe(json.refreshToken)
                
                const payload2 = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${json.accessToken}`
                    },
                    body: JSON.stringify({
                        refreshToken: json.refreshToken
                    })
                }

                // Log the user out
                const logoutResponse = await fetch(`${domain}/api/auth/logout`, payload2)
                const logoutJson = await logoutResponse.json()

                if(logoutResponse.status !== 200) console.log(logoutResponse, logoutJson)

                expect(logoutResponse.status).toBe(200)
                expect(logoutJson.status).toBe("success")
                expect(logoutJson.message).toBe("User successfully logged out")

                // Check that the refresh token has been removed from the database
                const checkdeleted = await Auth.find({ refreshToken: json.refreshToken })
                expect(checkdeleted.length === 0).toBeTruthy()
            })

            test('POST returns 401 Unauthorised when refresh token not in Db', async () => {
                const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgyMDAiLCJhenAiOiI2MjRiYmI2NWY4Y2ZhNGYxMzE5MjM1OGIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgyMDAiLCJyb2xlcyI6InVzZXIiLCJpYXQiOjE2NDkxMzAzNDJ9.R4HRbL2yhhrVWOOxtHRwIBuUYOK94iVPrgXNyb_sptw"
                const payload = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        refreshToken: token
                    })
                }

                // Log the user out
                const logoutResponse = await fetch(`${domain}/api/auth/logout`, payload)
                const logoutJson = await logoutResponse.json()

                if(logoutResponse.status !== 401) console.log(logoutResponse, logoutJson)

                expect(logoutResponse.status).toBe(401)
                expect(logoutJson.status).toBe("error")
                expect(logoutJson.message).toBe("Unauthorized")
            })

            // Validation tests for this route are the same for all user types
            test('POST returns 400 Bad Request when no token provided', async () => {
                const token = ""

                const payload = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        refreshToken: token
                    })
                }

                // Log the user out
                const logoutResponse = await fetch(`${domain}/api/auth/logout`, payload)
                const logoutJson = await logoutResponse.json()

                if(logoutResponse.status !== 400) console.log(logoutResponse, logoutJson)

                expect(logoutResponse.status).toBe(400)
                expect(Array.isArray(logoutJson.errors)).toBeTruthy()
                expect(logoutJson.errors.length).toBeGreaterThan(0)
            })

            // Validation tests for this route are the same for all user types
            test('POST returns 400 Bad Request when invalid tokens provided', async () => {
                const token = "Not a token"

                const payload = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        refreshToken: token
                    })
                }

                // Log the user out
                const logoutResponse = await fetch(`${domain}/api/auth/logout`, payload)
                const logoutJson = await logoutResponse.json()

                if(logoutResponse.status !== 400) console.log(logoutResponse, logoutJson)

                expect(logoutResponse.status).toBe(400)
                expect(Array.isArray(logoutJson.errors)).toBeTruthy()
                expect(logoutJson.errors.length).toBeGreaterThan(0)
            })

            test('POST returns 400 Bad Request when unexpected keys present in request body', async () => {
                const payload = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        refreshToken: token,
                        extraKey: "extraValue"
                    })
                }

                // Log the user out
                const logoutResponse = await fetch(`${domain}/api/auth/logout`, payload)
                const logoutJson = await logoutResponse.json()

                if(logoutResponse.status !== 400) console.log(logoutResponse, logoutJson)

                expect(logoutResponse.status).toBe(400)
                expect(logoutJson.status).toBe("error")
                expect(logoutJson.message).toMatch(/extraKey/)
            })
        })

        describe('Route: /api/auth/token-refresh', () => {
            beforeAll(async () => {
                // Remove refresh token from the Database
                try {
                    const result = await mongoose.model('Auth').deleteMany({})    
                } catch(e) {
                    console.log(e)
                }
            })

            beforeEach(async () => {
                // Insert refresh token into the Database
                try {
                    const result = await mongoose.model('Auth').create({ refreshToken: token })
                } catch(e) {
                    console.log(e)
                }
            })

            afterEach(async () => {
                // Remove refresh token from the Database
                try {
                    const result = await mongoose.model('Auth').deleteMany({})
                } catch(e) {
                    console.log(e)
                }
            })

            test('POST returns 200 Ok and replaces the access and refresh tokens', async () => {
                const payload = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        refreshToken: token
                    })
                }
                
                const response = await fetch(`${domain}/api/auth/token-refresh`, payload)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.accessToken).toBeTruthy()
                expect(json.refreshToken).toBeTruthy()
                expect(json.accessToken).not.toBe(token)
                expect(json.refreshToken).not.toBe(token)
            })

            // Validation tests for this route are the same for all user types
            test('POST returns 400 Bad Request when no token provided', async () => {
                const token = ""

                const payload = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        refreshToken: token
                    })
                }

                // Log the user out
                const logoutResponse = await fetch(`${domain}/api/auth/token-refresh`, payload)
                const logoutJson = await logoutResponse.json()

                if(logoutResponse.status !== 400) console.log(logoutResponse, logoutJson)

                expect(logoutResponse.status).toBe(400)
                expect(Array.isArray(logoutJson.errors)).toBeTruthy()
                expect(logoutJson.errors.length).toBeGreaterThan(0)
            })   
            
            test('POST returns 400 Bad Request when invalid tokens provided', async () => {
                const token = "Not a token"

                const payload = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        refreshToken: token
                    })
                }

                // Log the user out
                const logoutResponse = await fetch(`${domain}/api/auth/token-refresh`, payload)
                const logoutJson = await logoutResponse.json()

                if(logoutResponse.status !== 400) console.log(logoutResponse, logoutJson)

                expect(logoutResponse.status).toBe(400)
                expect(Array.isArray(logoutJson.errors)).toBeTruthy()
                expect(logoutJson.errors.length).toBeGreaterThan(0)
            })

            test('POST returns 400 Bad Request when unexpected keys present in request body', async () => {
                const payload = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        refreshToken: token,
                        extraKey: "extraValue"
                    })
                }

                // Log the user out
                const logoutResponse = await fetch(`${domain}/api/auth/token-refresh`, payload)
                const logoutJson = await logoutResponse.json()

                if(logoutResponse.status !== 400) console.log(logoutResponse, logoutJson)

                expect(logoutResponse.status).toBe(400)
                expect(logoutJson.status).toBe("error")
                expect(logoutJson.message).toMatch(/extraKey/)
            })
        })
    })

    describe('Appointment Routes', () => {
        describe('Route: /api/appointments/user-appointments', () => {
            beforeAll(async () => {
                // Remove all appointments from the Database
                const result = await mongoose.model('Appointment').deleteMany({})
            })
    
            let user
            let token
            let business
            let crm
            let appointment
            let appointments
            beforeEach(async () => {
                // Get and log the user in
                user = await User.findOne({ email: 'e.rodder@gmail.com' })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": user._id,
                    "aud": 'http://localhost:8200',
                    "roles": "user"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
    
                // Get the business
                business = await Business.findOne({ abn: 12345678912 })
                business.services.push({
                    _id: mongoose.Types.ObjectId(),
                    name: "Test Service",
                    description: "This is a test service",
                    duration: 55,
                    break: 5,
                    fee: 50
                })

                // Define the appointment
                appointment = {
                    service: business.services[0]._id,
                    appointmentTime: "2020-01-01T00:00:00.000Z",
                    appointmentEnd: "2020-01-01T00:00:00.000Z",
                    fee: 50,
                    feeDue: "2020-01-01T00:00:00.000Z",
                    paymentStatus: "unpaid",
                    details: "Test Details"
                }

                // Create CRM
                crm = await CRM.create({
                    userModel: 'User',
                    user: user._id,
                    business: business._id,
                    tempFlag: false,
                    allowAccess: true,
                    notes: ""
                })
                
                // Create appointment
                appointments = await Appointment.create([
                    {
                        crm: crm._id,
                        ...appointment
                    }, {
                        crm: crm._id,
                        ...appointment
                    }, {
                        crm: crm._id,
                        ...appointment
                    },
                ])
            })
    
            afterEach(async () => {
                // Delete appointments
                const result = await mongoose.model('Appointment').deleteMany({})
                // Remove CRM
                const crmResult = await CRM.deleteMany({})
            })

            test('GET returns 200 Ok and returns the user\'s appointments', async () => {
                const payload = {
                    method: "get",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }

                const response = await fetch(`${domain}/api/appointments/user-appointments`, payload)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.data[0].appointments.length).toBe(3)
            })
        })

        describe('Route: /api/appointments/user/:businessId', () => {
            beforeAll(async () => {
                // Remove all appointments from the Database
                const result = await mongoose.model('Appointment').deleteMany({})
                // Remove all CRMs
                const crmResult = await CRM.deleteMany({})
            })
    
            let user
            let token
            let business
            let appointment
            let crm
            beforeEach(async () => {
                // Get and log the user in
                user = await User.findOne({ email: 'e.rodder@gmail.com' })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": user._id,
                    "aud": 'http://localhost:8200',
                    "roles": "user"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
    
                // Get the business
                business = await Business.findOne({ abn: 12345678912 })
                business.services.push({
                    _id: mongoose.Types.ObjectId(),
                    name: "Test Service",
                    description: "This is a test service",
                    duration: 55,
                    break: 5,
                    fee: 50
                })

                // Define the appointment
                appointment = {
                    service: business.services[0]._id,
                    appointmentTime: "2020-01-01T00:00:00.000Z",
                    appointmentEnd: "2020-01-01T00:00:00.000Z",
                    fee: 50,
                    feeDue: "2020-01-01T00:00:00.000Z",
                    paymentStatus: "unpaid",
                    details: "Test Details"
                }
            })
    
            afterEach(async () => {
                // Delete appointments
                const result = await mongoose.model('Appointment').deleteMany({})
                // Remove CRM
                const crmResult = await CRM.deleteMany({ business: business._id, user: user._id })
            })
    
            describe('CRM exists', () => {
                let crm
                beforeEach(async () => {
                    // Create CRM
                    crm = await CRM.create({
                        userModel: 'User',
                        user: user._id,
                        business: business._id,
                        tempFlag: false,
                        allowAccess: true,
                        notes: ""
                    })
                })
    
                afterEach(async () => {
                    // Remove CRM
                    const crmResult = await CRM.deleteMany({ business: business._id, user: user._id })
                })
    
                test('Post returns 201 Created and creates an appointment in the DB with valid inputs', async () => {
                    const payload = {
                        method: "post",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(appointment)
                    }

                    const response = await fetch(`${domain}/api/appointments/user/${business._id}`, payload)
                    const json = await response.json()
    
                    if(response.status !== 201) console.log(response, json)

                    expect(response.status).toBe(201)
                    expect(json.status).toBe("success")
                    expect(json.message).toBe("Appointment created")
                    expect(json.data.crm.toString()).toBe(crm._id.toString())
                })
    
            })

            describe('CRM does not exist', () => {    
                test('Post returns 201 Created and creates an appointment in the DB with valid inputs', async () => {
                    const payload = {
                        method: "post",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(appointment)
                    }

                    const response = await fetch(`${domain}/api/appointments/user/${business._id}`, payload)
                    const json = await response.json()
    
                    if(response.status !== 201) console.log(response, json)

                    expect(response.status).toBe(201)
                    expect(json.status).toBe("success")
                    expect(json.message).toBe("Appointment created")
                })
            })
        })

        describe('Route: /api/appointments/business-rep-appointments/:businessId', () => {
            beforeAll(async () => {
                // Remove all appointments from the Database
                const result = await mongoose.model('Appointment').deleteMany({})
            })
    
            let user
            let rep
            let token
            let business
            let crm
            let appointment
            let appointments
            beforeEach(async () => {
                // Get and log the user in
                user = await User.findOne({ email: 'e.rodder@gmail.com' })
                // Log in business rep
                rep = await BusinessRep.findOne({ email: 'j.chen@chencorp.com' })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": rep._id,
                    "aud": 'http://localhost:8200',
                    "roles": "businessRep"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
    
                // Get the business
                business = await Business.findOne({ abn: 12345678912 })
                business.services.push({
                    _id: mongoose.Types.ObjectId(),
                    name: "Test Service",
                    description: "This is a test service",
                    duration: 55,
                    break: 5,
                    fee: 50
                })

                // Define the appointment
                appointment = {
                    service: business.services[0]._id,
                    appointmentTime: "2020-01-01T00:00:00.000Z",
                    appointmentEnd: "2020-01-01T00:00:00.000Z",
                    fee: 50,
                    feeDue: "2020-01-01T00:00:00.000Z",
                    paymentStatus: "unpaid",
                    details: "Test Details"
                }

                // Create CRM
                crm = await CRM.create({
                    userModel: 'User',
                    user: user._id,
                    business: business._id,
                    tempFlag: false,
                    allowAccess: true,
                    notes: ""
                })

                // Create appointment
                appointments = await Appointment.create([
                    {
                        crm: crm._id,
                        ...appointment
                    }, {
                        crm: crm._id,
                        ...appointment
                    }, {
                        crm: crm._id,
                        ...appointment
                    },

                ])
            })
    
            afterEach(async () => {
                // Delete appointments
                const result = await mongoose.model('Appointment').deleteMany({})
                // Remove CRM
                const crmResult = await CRM.deleteMany({})
            })

            test('GET returns 200 Ok and returns the businesses appointments', async () => {
                const payload = {
                    method: "get",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }

                const response = await fetch(`${domain}/api/appointments/business-rep-appointments/${business._id}`, payload)
                const json = await response.json()

                if(response.status !== 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe("success")
                expect(json.data[0].appointments.length).toBe(3)
            })
        })

        describe('Route: /api/appointments/business-rep/:businessId/:id', () => {
            beforeAll(async () => {
                // Remove all appointments from the Database
                const result = await mongoose.model('Appointment').deleteMany({})
            })
    
            let user
            let loggedInUser
            let token
            let business
            let appointment
            beforeEach(async () => {
                // Get the user to create an appointment for
                user = await User.findOne({ email: 'j.squire@gmail.com' })
                
                // Log in a business rep
                loggedInUser = await BusinessRep.findOne({ email: 'j.chen@chencorp.com' })
                const payload = {
                    "iss": 'http://localhost:8200',
                    "azp": loggedInUser._id,
                    "aud": 'http://localhost:8200',
                    "roles": "businessRep"
                }
            
                // Generate access and refresh tokens
                token = jwt.sign(payload , process.env.JWT_SECRET)
    
                // Get the business
                business = await Business.findOne({ abn: 12345678912 })
                business.services.push({
                    _id: mongoose.Types.ObjectId(),
                    name: "Test Service",
                    description: "This is a test service",
                    duration: 55,
                    break: 5,
                    fee: 50
                })

                // Define the appointment
                appointment = {
                    service: business.services[0]._id,
                    appointmentTime: "2020-01-01T00:00:00.000Z",
                    appointmentEnd: "2020-01-01T00:00:00.000Z",
                    fee: 50,
                    feeDue: "2020-01-01T00:00:00.000Z",
                    paymentStatus: "unpaid",
                    details: "Test Details"
                }
            })
    
            afterEach(async () => {
                // Delete appointments
                const result = await mongoose.model('Appointment').deleteMany({})
            })
    
            describe('CRM exists', () => {
                let crm
                beforeEach(async () => {
                    // Create CRM
                    crm = await CRM.create({
                        userModel: 'User',
                        user: user._id,
                        business: business._id,
                        tempFlag: false,
                        allowAccess: true,
                        notes: ""
                    })
                })
    
                afterEach(async () => {
                    // Remove CRM
                    const crmResult = await CRM.deleteMany({ business: business._id })
                })
    
                test('Post returns 201 Created and creates an appointment in the DB with valid inputs', async () => {
                    const payload = {
                        method: "post",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(appointment)
                    }

                    const response = await fetch(`${domain}/api/appointments/business-rep/${business._id}/${user._id}`, payload)
                    const json = await response.json()
    
                    if(response.status !== 201) console.log(response, json)

                    expect(response.status).toBe(201)
                    expect(json.status).toBe("success")
                    expect(json.message).toBe("Appointment created")
                    expect(json.data.crm.toString()).toBe(crm._id.toString())
                })
    
            })
            
            // No need to test for when a CRM does not exist as the user will be prompted
            // to select / create a client (and CRM) before the appointment can be created
    
        })

        describe('Route: /ai/appointments/user/crud/:appointmentId', () => {
            describe('Operations performed by user', () => {
                beforeAll(async () => {
                    // Remove all appointments from the Database
                    const result = await mongoose.model('Appointment').deleteMany({})
                })
        
                let user
                let token
                let business
                let crm
                let appointment
                beforeEach(async () => {
                    // Get and log the user in
                    user = await User.findOne({ email: 'e.rodder@gmail.com' })
                    const payload = {
                        "iss": 'http://localhost:8200',
                        "azp": user._id,
                        "aud": 'http://localhost:8200',
                        "roles": "user"
                    }
                
                    // Generate access and refresh tokens
                    token = jwt.sign(payload , process.env.JWT_SECRET)
        
                    // Get the business
                    business = await Business.findOne({ abn: 12345678912 })
                    business.services.push({
                        _id: mongoose.Types.ObjectId(),
                        name: "Test Service",
                        description: "This is a test service",
                        duration: 55,
                        break: 5,
                        fee: 50
                    })
    
                    // Define the appointment
                    appointment = {
                        service: business.services[0]._id,
                        appointmentTime: "2020-01-01T00:00:00.000Z",
                        appointmentEnd: "2020-01-01T00:00:00.000Z",
                        fee: 50,
                        feeDue: "2020-01-01T00:00:00.000Z",
                        paymentStatus: "unpaid",
                        details: "Test Details"
                    }
    
                    // Create CRM
                    crm = await CRM.create({
                        userModel: 'User',
                        user: user._id,
                        business: business._id,
                        tempFlag: false,
                        allowAccess: true,
                        notes: ""
                    })

                    // Create appointment
                    appointment = await Appointment.create({
                        crm: crm._id,
                        ...appointment
                    })
                })
        
                afterEach(async () => {
                    // Delete appointments
                    const result = await mongoose.model('Appointment').deleteMany({})
                    // Remove CRM
                    const crmResult = await CRM.deleteMany({ business: business._id, user: user._id })
                })

                test('GET returns 200 OK and returns the appointment with valid inputs', async () => {
                    const payload = {
                        method: "get",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }

                    const response = await fetch(`${domain}/api/appointments/user/crud/${appointment._id}`, payload)
                    const json = await response.json()

                    if(response.status !== 200) console.log(response, json)

                    expect(response.status).toBe(200)
                    expect(json.status).toBe("success")
                    expect(json.appointment._id.toString()).toBe(appointment._id.toString())
                    expect(json.appointment.crm.toString()).toBe(crm._id.toString())
                })
    
                test('PUT returns 200 OK and updates appointment with valid inputs', async () => {
                    const updatedAppointment = JSON.parse(JSON.stringify(appointment))
                    updatedAppointment.details = "Updated Details"
                    const payload = {
                        method: "put",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedAppointment)
                    }

                    const response = await fetch(`${domain}/api/appointments/user/crud/${appointment._id}`, payload)
                    const json = await response.json()
        
                    if(response.status !== 200) console.log(response, json)

                    expect(response.status).toBe(200)
                    expect(json.status).toBe("success")
                    expect(json.message).toBe("Appointment updated")
                    expect(json.data.crm.toString()).toBe(crm._id.toString())
                    expect(json.data.details).toBe(appointment.details)
                    const checkAppt = await Appointment.findById(appointment._id)
                    expect(checkAppt.details).toBe(updatedAppointment.details)
                })

                test('DELETE returns 204 No Content and deletes appointment with valid inputs', async () => {
                    const payload = {
                        method: "delete",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }

                    const response = await fetch(`${domain}/api/appointments/user/crud/${appointment._id}`, payload)
        
                    if(response.status !== 204) console.log(response)

                    expect(response.status).toBe(204)
                    expect(response.size).toBe(0)
                    const checkAppt = await Appointment.findById(appointment._id)
                    expect(checkAppt).toBe(null)
                })
            })

        })

        describe('Route: /api/appointments/business-rep/crud/:appointmentId', () => {
            describe('Operations performed by businessRep', () => {
                beforeAll(async () => {
                    // Remove all appointments from the Database
                    const result = await mongoose.model('Appointment').deleteMany({})
                })
        
                let user
                let token
                let business
                let crm
                let appointment
                beforeEach(async () => {
                    // Get the user
                    user = await User.findOne({ email: 'e.rodder@gmail.com' })

                    // Log the businessRep in
                    const rep = await BusinessRep.findOne({ email: 'j.chen@chencorp.com' })
                    const payload = {
                        "iss": 'http://localhost:8200',
                        "azp": rep._id,
                        "aud": 'http://localhost:8200',
                        "roles": "businessRep"
                    }
                
                    // Generate access and refresh tokens
                    token = jwt.sign(payload , process.env.JWT_SECRET)
        
                    // Get the business
                    business = await Business.findOne({ abn: 12345678912 })
                    business.services.push({
                        _id: mongoose.Types.ObjectId(),
                        name: "Test Service",
                        description: "This is a test service",
                        duration: 55,
                        break: 5,
                        fee: 50
                    })

                    // Define the appointment
                    appointment = {
                        service: business.services[0]._id,
                        appointmentTime: "2020-01-01T00:00:00.000Z",
                        appointmentEnd: "2020-01-01T00:00:00.000Z",
                        fee: 50,
                        feeDue: "2020-01-01T00:00:00.000Z",
                        paymentStatus: "unpaid",
                        details: "Test Details"
                    }

                    // Create CRM
                    crm = await CRM.create({
                        userModel: 'User',
                        user: user._id,
                        business: business._id,
                        tempFlag: false,
                        allowAccess: true,
                        notes: ""
                    })

                    // Create appointment
                    appointment = await Appointment.create({
                        crm: crm._id,
                        ...appointment
                    })
                })
        
                afterEach(async () => {
                    // Delete appointments
                    const result = await mongoose.model('Appointment').deleteMany({})
                    // Remove CRM
                    const crmResult = await CRM.deleteMany({ business: business._id, user: user._id })
                })

                test('GET returns 200 OK and returns the appointment with valid inputs', async () => {
                    const payload = {
                        method: "get",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }

                    const response = await fetch(`${domain}/api/appointments/business-rep/crud/${appointment._id}`, payload)
                    const json = await response.json()

                    if(response.status !== 200) console.log(response, json)

                    expect(response.status).toBe(200)
                    expect(json.status).toBe("success")
                    expect(json.appointment._id.toString()).toBe(appointment._id.toString())
                    expect(json.appointment.crm.toString()).toBe(crm._id.toString())
                })

                test('PUT returns 200 OK and updates appointment with valid inputs', async () => {
                    const updatedAppointment = JSON.parse(JSON.stringify(appointment))
                    updatedAppointment.details = "Updated Details"
                    const payload = {
                        method: "put",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedAppointment)
                    }

                    const response = await fetch(`${domain}/api/appointments/business-rep/crud/${appointment._id}`, payload)
                    const json = await response.json()
        
                    if(response.status !== 200) console.log(response, json)

                    expect(response.status).toBe(200)
                    expect(json.status).toBe("success")
                    expect(json.message).toBe("Appointment updated")
                    expect(json.data.crm.toString()).toBe(crm._id.toString())
                    expect(json.data.details).toBe(appointment.details)
                    const checkAppt = await Appointment.findById(appointment._id)
                    expect(checkAppt.details).toBe(updatedAppointment.details)
                })

                test('DELETE returns 204 No Content and deletes appointment with valid inputs', async () => {
                    const payload = {
                        method: "delete",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }

                    const response = await fetch(`${domain}/api/appointments/business-rep/crud/${appointment._id}`, payload)
        
                    if(response.status !== 204) console.log(response)

                    expect(response.status).toBe(204)
                    expect(response.size).toBe(0)
                    const checkAppt = await Appointment.findById(appointment._id)
                    expect(checkAppt).toBe(null)
                })
            })
        })
    })
})