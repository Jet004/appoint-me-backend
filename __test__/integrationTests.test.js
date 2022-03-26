import mongoose from 'mongoose'
import connect from '../models/database'
import pushMockData from './pushMockData'

import fetch from 'node-fetch'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'
dotenv.config()

import users from './mockUsers'
import User from '../models/userModel'


describe('Connects to database', () => {
    beforeAll(async () => {
        await connect(process.env.DB_URL)
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
    
                if(response.status != 200) console.log(response)
    
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
                        password: bcrypt.hashSync('12345678', 6),
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

                if(response.status != 201) console.log(response)

                expect(response.status).toBe(201)
                expect(json.status).toBe('success')
                expect(json.user.email).toBe('k.free@gmail.com')
            })

            it('POST returns 500 Internal Server Error with missing input data', async () => {
                const payload = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: '',
                        password: bcrypt.hashSync('12345678', 6),
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

                const result = await fetch('http://localhost:8200/api/users/', payload)
                const json = await result.json()

                if(result.status != 500) console.log(result)

                expect(result.status).toBe(500)
                expect(json.status).toBe('error')
                expect(json.message).toMatch(/User validation failed/)
            })

        })

        describe('Route: /api/users/:email', () => {
            it('GET returns 200 OK + user with valid email', async () => {
                const email = "e.rodder@gmail.com"
                const response = await fetch(`http://localhost:8200/api/users/${email}`)
                const json = await response.json()
    
                if(response.status != 200) console.log(response)
    
                expect(response.status).toBe(200)
    
                expect(json.status).toBe('success')
                expect(json.user.email).toBe(email)
                expect(json.user.fname).toBe('Emily')
            })

            it('GET returns 404 Not Found with non registered email', async () => {
                const email = "mary.poppins@jacketfarmer.com.cn"
                const response = await fetch(`http://localhost:8200/api/users/${email}`)
                const json = await response.json()

                if(response.status != 404) console.log(response)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
                expect(json.user.length).toBe(0)
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

                if(response.status != 200) console.log(response)

                expect(response.status).toBe(200)
                expect(json.status).toBe('success')
                expect(json.originalData.fname).toBe(userData.fname)
                const dbUser = await User.findOne({ email: 'e.rodder@gmail.com' })
                expect(dbUser.fname).toBe('Updated Name')
            })

            it('POST returns 404 Not Found if id not in DB', async () => {
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

                if(response.status != 404) console.log(response)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
                expect(json.user.length).toBe(0)
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

                if(response.status != 404) console.log(response)

                expect(response.status).toBe(404)
                expect(json.status).toBe('not found')
            })
        })

    })
})

