// Import DB connector
import mongoose from 'mongoose'
import connect from '../../models/database.js'

import dotenv from 'dotenv'
dotenv.config()

// Import controllers
import { getBusinessByABN, getBusinessByID, updateBusiness } from '../businessController'

import pushMockData from '../../__test__/pushMockData.js'
// Import mock business
import mockBusiness from '../../__test__/mockBusiness.js'
// Import mock businessReps
import mockBusinessReps from '../../__test__/mockBusinessReps.js'

describe('Business controller unit tests:', () => {
    describe('Test controller: getBusinessByABN', () => {
        test('GET returns 200 OK with business data with valid abn', async () => {
            const business = mockBusiness[0]
            const fakeDbGetBusinessByABN = jest.fn().mockReturnValue(business)
            const req = {
                params: {
                    abn: business.abn
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
    
            const controller = getBusinessByABN(fakeDbGetBusinessByABN)
            expect(typeof controller).toBe('function')
    
            await controller(req, res)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(business.abn)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", business: business })
            
        })

        test('GET returns 404 Not Found when valid abn not in DB', async () => {
            const abn = '98989898988'
            const fakeDbGetBusinessByABN = jest.fn().mockReturnValue(null)
            const req = {
                params: {
                    abn: abn
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getBusinessByABN(fakeDbGetBusinessByABN)
            expect(typeof controller).toBe('function')

            await(controller(req, res))
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(abn)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "not found", business: [] })
        })

        test('GET returns 500 Internal Server Error when database returns an error', async () => {
            const abn = '98989898988'
            const fakeDbGetBusinessByABN = jest.fn().mockImplementation(() => {throw new Error('Database error')})
            const req = {
                params: {
                    abn: abn
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getBusinessByABN(fakeDbGetBusinessByABN)
            expect(typeof controller).toBe('function')

            await(controller(req, res))
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(abn)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })
    })

    describe('Test controller: getBusinessByID', () => {
        
    })

})