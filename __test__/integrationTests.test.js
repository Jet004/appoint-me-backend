const mongoose = require('mongoose')
const connect = require('./database')
const { pushMockUsers, pushMockTempUsers } = require('./pushMockData')

const fetch = require('node-fetch')
const bcrypt = require('bcrypt')

describe('Connects to database', () => {
    beforeAll(() => {
        return connect().then(() => {
            return pushMockUsers()
        })
        .then(() => {
            return pushMockTempUsers()
        })
    })

    afterAll(() => {
        return mongoose.connection.dropDatabase()
            .then(() => mongoose.disconnect())
    })

    it('Connects to MongoDB database', () => {
        expect(mongoose.connection.readyState).toBe(1)
    })

    describe('User Routes', () => {
        
        it('GET /api/user/', () => {
            return fetch('http://localhost:8200/api/user/')
                .then(res => {
                    expect(res.status).toBe(200)
                    return res.json()
                })
                .then(res => {
                    try {
                        expect(res.user.length).toBeGreaterThan(0)
                    } catch (e) {
                        console.log(res)
                        throw new Error(e)
                    }
                    
                })
            
        })

        it(`POST /api/user/ with valid user data`, () => {
            return fetch('http://localhost:8200/api/user/', {
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
            })
            .then(res => {
                if(res.status !== 201) console.log(res)
                expect(res.status).toBe(201)
                return res.json()
            })
            .then(data => {
                try {
                    expect(data.user.email).toBe('k.free@gmail.com')
                } catch (e) {
                    console.log(data)
                    throw new Error(e)
                }
            })

        })


        it('GET /api/user/:email with valid email', () => {
            return fetch('http://localhost:8200/api/user/e.rodder@gmail.com')
                .then(res => {
                    expect(res.status).toBe(200)
                    return res.json()   
                })
                .then(data => {
                    expect(data.user[0].email).toBe('e.rodder@gmail.com')
                    expect(data.user[0].fname).toBe('Emily')
                })
        })


    })
})

