import mongoose from 'mongoose'
import connect from '../models/database'
import pushMockData from './pushMockData'

import fetch from 'node-fetch'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'
dotenv.config()

import users from './mockUsers'
import User from '../models/userModel'
import TempUser from '../models/tempUserModel'


describe('Connects to database', () => {
    beforeAll(async () => {
        await connect(process.env.DB_URL)
        await mongoose.connection.dropDatabase()
        await pushMockData()
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase()
        await mongoose.disconnect()
    })

    it('Connects to MongoDB database', () => {
        expect(mongoose.connection.readyState).toBe(1)
    })

    describe('User Routes', () => {

        describe("Route: /api/users", () => {
            it('GET returns 200 OK + array of users when data in DB', async () => {
                const response = await fetch('http://localhost:8200/api/users/')
                const json = await response.json()
    
                if(response.status != 200) console.log(response, json)
    
                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.user.length).toBe(users.length)
            })

            it(`POST returns 200 OK with valid user data adds new user to the DB`, async () => {
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

                const response = await fetch('http://localhost:8200/api/users/', payload)
                const json = await response.json()

                if(response.status != 201) console.log(response, json)

                expect(response.status).toBe(201)
                expect(json.status).toBe('success')
                expect(json.user.email).toBe('k.free@gmail.com')
            })

            // Test validation
            it('POST returns 400 Bad Request with missing input data', async () => {
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

                const response = await fetch('http://localhost:8200/api/users/', payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(32)
            })

            it("POST returns 400 Bad Request when input contains duplicate key with invalid data", async () => {
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

                const response = await fetch('http://localhost:8200/api/users/', payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            it("POST returns 400 Bad Request when request body contains unexpected keys", async () => {
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
                            suburb: 'Fake Suburb',
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

                const response = await fetch('http://localhost:8200/api/users/', payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe('error')
                expect(json.message).toMatch(/bio, province/)
            })

        })

        describe('Route: /api/users/:email', () => {
            it('GET returns 200 OK + user with valid email', async () => {
                const email = "e.rodder@gmail.com"
                const response = await fetch(`http://localhost:8200/api/users/${email}`)
                const json = await response.json()
    
                if(response.status != 200) console.log(response, json)
    
                expect(response.status).toBe(200)
    
                expect(json.status).toBe('success')
                expect(json.user.email).toBe(email)
                expect(json.user.fname).toBe('Emily')
            })

            it('GET returns 404 Not Found with non registered email', async () => {
                const email = "mary.poppins@jacketfarmer.com.cn"
                const response = await fetch(`http://localhost:8200/api/users/${email}`)
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
                expect(json.user.length).toBe(0)
            })

            it('GET returns 400 Bad Request with invalid email', async () => {
                const email = "NotAnEmail"
                const response = await fetch(`http://localhost:8200/api/users/${email}`)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            // No test for missing email as it will default to route /api/users/
        })

        describe('Route: /api/users/:id', () => {
            
            it('PUT returns 200 OK + original user object', async () => {               
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
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                }
                // Send request
                const response = await fetch(`http://localhost:8200/api/users/${userData._id}`, payload)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.originalData.fname).toBe(userData.fname)
                const dbUser = await User.findOne({ email: 'e.rodder@gmail.com' })
                expect(dbUser.fname).toBe('Updated Name')
            })

            it('PUT returns 404 Not Found if id not in DB', async () => {
                const userID = mongoose.Types.ObjectId()
                const mockUser = users[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`http://localhost:8200/api/users/${userID}`, payload)
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
                expect(json.user.length).toBe(0)
            })

            it('PUT returns 400 Bad Request with invalid input', async () => {
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

                const response = await fetch(`http://localhost:8200/api/users/${userData._id}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(30)
            })

            it('PUT returns 400 Bad Request with invalid Mongoose user ID', async () => {
                const userID = 'NotAnID'
                const mockUser = users[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`http://localhost:8200/api/users/${userID}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            it('DELETE returns 204 No Content with valid input', async () => {
                const mockUser = await User.findOne({ email: 'e.rodder@gmail.com' })

                const response = await fetch(`http://localhost:8200/api/users/${mockUser._id}`, {
                    method: 'DELETE'
                })

                if(response.status != 204) console.log(response)

                expect(response.status).toBe(204)
                expect(response.size).toBe(0)
            })

            it('DELETE returns 404 Not Found when user ID not in DB', async () => {
                const userID = mongoose.Types.ObjectId()

                const response = await fetch(`http://localhost:8200/api/users/${userID}`, {
                    method: 'DELETE'
                })
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
            })

            it('DELETE returns 400 Bad Request with invalid Mongoose user ID', async () => {
                const userID = 'NotAnID'

                const response = await fetch(`http://localhost:8200/api/users/${userID}`, {
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





    describe('Temp User Routes', () => {

        describe("Route: /api/temp-users", () => {
            it('GET returns 200 OK + array of users when data in DB', async () => {
                const response = await fetch('http://localhost:8200/api/temp-users/')
                const json = await response.json()
    
                if(response.status != 200) console.log(response, json)
    
                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.user.length).toBe(users.length)
            })

            it(`POST returns 200 OK with valid user data adds new user to the DB without address or dob`, async () => {
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
                            streetNumber: "",
                            streetName: "",
                            city: "",
                            state: "",
                            postCode: "",
                            country: "",
                        },
                        dob: "",
                    })
                }

                const response = await fetch('http://localhost:8200/api/temp-users/', payload)
                const json = await response.json()

                if(response.status != 201) console.log(response, json)

                expect(response.status).toBe(201)
                expect(json.status).toBe('success')
                expect(json.user.email).toBe('k.free@gmail.com')
            })

            it(`POST returns 200 OK with valid user data adds new user to the DB with address or dob`, async () => {
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
                            streetName: "Fake Street",
                            city: "Fake City",
                            state: "Fake State",
                            postCode: 4000,
                            country: "Fake Country",
                        },
                        dob: "1990-11-18",
                    })
                }

                const response = await fetch('http://localhost:8200/api/temp-users/', payload)
                const json = await response.json()

                if(response.status != 201) console.log(response, json)

                expect(response.status).toBe(201)
                expect(json.status).toBe('success')
                expect(json.user.email).toBe('k.free@gmail.com')
            })

            // Test validation
            it('POST returns 400 Bad Request with missing input data', async () => {
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

                const response = await fetch('http://localhost:8200/api/temp-users/', payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(12)
            })

            it("POST returns 400 Bad Request when input contains duplicate key with invalid data", async () => {
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

                const response = await fetch('http://localhost:8200/api/temp-users/', payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            it("POST returns 400 Bad Request when request body contains unexpected keys", async () => {
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
                            suburb: 'Fake Suburb',
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

                const response = await fetch('http://localhost:8200/api/temp-users/', payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(json.status).toBe('error')
                expect(json.message).toMatch(/bio, province/)
            })

        })

        describe('Route: /api/users/:email', () => {
            it('GET returns 200 OK + user with valid email', async () => {
                const email = "temp.user@gmail.com"
                const response = await fetch(`http://localhost:8200/api/temp-users/${email}`)
                const json = await response.json()
    
                if(response.status != 200) console.log(response, json)
    
                expect(response.status).toBe(200)
    
                expect(json.status).toBe('success')
                expect(json.user.email).toBe(email)
                expect(json.user.fname).toBe('Temp')
            })

            it('GET returns 404 Not Found with non registered email', async () => {
                const email = "mary.poppins@jacketfarmer.com.cn"
                const response = await fetch(`http://localhost:8200/api/users/${email}`)
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
                expect(json.user.length).toBe(0)
            })

            it('GET returns 400 Bad Request with invalid email', async () => {
                const email = "NotAnEmail"
                const response = await fetch(`http://localhost:8200/api/users/${email}`)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            // No test for missing email as it will default to route /api/users/
        })

        describe('Route: /api/users/:id', () => {
            
            it('PUT returns 200 OK + original user object', async () => {               
                // Get user data from database
                const user = await TempUser.find({email: 'temp.user@gmail.com'})
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
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                }
                // Send request
                const response = await fetch(`http://localhost:8200/api/temp-users/${userData._id}`, payload)
                const json = await response.json()

                if(response.status != 200) console.log(response, json)

                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.originalData.fname).toBe(userData.fname)
                const dbUser = await TempUser.findOne({ email: 'temp.user@gmail.com' })
                expect(dbUser.fname).toBe('Updated Name')
            })

            it('PUT returns 404 Not Found if id not in DB', async () => {
                const userID = mongoose.Types.ObjectId()
                const mockUser = users[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`http://localhost:8200/api/temp-users/${userID}`, payload)
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
                expect(json.user.length).toBe(0)
            })

            it('PUT returns 400 Bad Request with invalid input', async () => {
                // Get user data from database
                const user = await TempUser.find({email: 'temp.user@gmail.com'})
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
                        dob: '',
                        appointments: []
                    })
                }

                const response = await fetch(`http://localhost:8200/api/temp-users/${userData._id}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(10)
            })

            it('PUT returns 400 Bad Request with invalid Mongoose user ID', async () => {
                const userID = 'NotAnID'
                const mockUser = users[0]

                const payload = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(mockUser)
                }

                const response = await fetch(`http://localhost:8200/api/temp-users/${userID}`, payload)
                const json = await response.json()

                if(response.status != 400) console.log(response, json)

                expect(response.status).toBe(400)
                expect(Array.isArray(json.errors)).toBe(true)
                expect(json.errors.length).toBe(1)
            })

            it('DELETE returns 204 No Content with valid input', async () => {
                const mockUser = await TempUser.findOne({ email: 'temp.user@gmail.com' })

                const response = await fetch(`http://localhost:8200/api/temp-users/${mockUser._id}`, {
                    method: 'DELETE'
                })

                if(response.status != 204) console.log(response)

                expect(response.status).toBe(204)
                expect(response.size).toBe(0)
            })

            it('DELETE returns 404 Not Found when user ID not in DB', async () => {
                const userID = mongoose.Types.ObjectId()

                const response = await fetch(`http://localhost:8200/api/temp-users/${userID}`, {
                    method: 'DELETE'
                })
                const json = await response.json()

                if(response.status != 404) console.log(response, json)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
            })

            it('DELETE returns 400 Bad Request with invalid Mongoose user ID', async () => {
                const userID = 'NotAnID'

                const response = await fetch(`http://localhost:8200/api/temp-users/${userID}`, {
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