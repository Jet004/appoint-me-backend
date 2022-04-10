// Import controllers
import { getBusinessByABN, getBusinessByID, updateBusiness, createBusinessService, getBusinessServices, getBusinessServiceById, updateBusinessService, deleteBusinessService, getClientList } from '../businessController'

// Import mock business
import mockBusiness from '../../__test__/mockBusiness.js'
import mockUsers from '../../__test__/mockUsers.js'
import mongoose from 'mongoose'

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
        test('GET returns 200 OK with valid Mongoose ID', async () => {
            const business = mockBusiness[0]
            const fakeDbGetBusinessByID = jest.fn().mockReturnValue(business)
            const req = {
                params: { 
                    id: business._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getBusinessByID(fakeDbGetBusinessByID)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetBusinessByID).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByID).toHaveBeenCalledWith(business._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", business: business })
        })

        test('GET returns 404 Not Found when valid Mongoose ID not in DB', async () => {
            const id = '5ee9f9f9f9f9f9f9f9f9f9f8'
            const fakeDbGetBusinessByID = jest.fn().mockReturnValue(null)
            const req = {
                params: { 
                    id: id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getBusinessByID(fakeDbGetBusinessByID)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetBusinessByID).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByID).toHaveBeenCalledWith(id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "not found", business: [] })
        })

        test('GET returns 500 Internal Server Error when DB returns an error', async () => {
            const id = '5ee9f9f9f9f9f9f9f9f9f9f9'
            const fakeDbGetBusinessByID = jest.fn().mockImplementation(() => {throw new Error('Database error')})
            const req = {
                params: {
                    id: id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await getBusinessByID(fakeDbGetBusinessByID)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetBusinessByID).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByID).toHaveBeenCalledWith(id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })
    })
    
    describe('Test controller: updateBusiness', () => {
        test('PUT returns 200 OK and returns original business object with valid inputs', async () => {
            const business = mockBusiness[0]
            const updatedBusiness = {...business}
            updatedBusiness.address.streetName = "Moggil Rd"
            updatedBusiness.address.city = "Indooroopilly"
            const fakeDbUpdateBusiness = jest.fn().mockReturnValue(business)
            const req = {
                params: {
                    abn: business.abn
                },
                body: JSON.stringify(updatedBusiness)
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = updateBusiness(fakeDbUpdateBusiness)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbUpdateBusiness).toHaveBeenCalledTimes(1)
            expect(fakeDbUpdateBusiness).toHaveBeenCalledWith(req.params.abn, req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", originalDetails: business })
        })

        test('PUT returns 404 Not Found when valid abn not in DB', async () => {
            const business = mockBusiness[0]
            const updatedBusiness = {...business}
            updatedBusiness.address.streetName = "Moggil Rd"
            updatedBusiness.address.city = "Indooroopilly"
            const fakeDbUpdateBusiness = jest.fn().mockReturnValue(null)
            const req = {
                params: {
                    abn: "12345678912"
                },
                body: JSON.stringify(updatedBusiness)
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = updateBusiness(fakeDbUpdateBusiness)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbUpdateBusiness).toHaveBeenCalledTimes(1)
            expect(fakeDbUpdateBusiness).toHaveBeenCalledWith(req.params.abn, req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "not found", business: [] })
        })

        test('PUT returns 500 Internal Server Error when DB returns an error', async () => {
            const business = mockBusiness[0]
            const updatedBusiness = {...business}
            updatedBusiness.address.streetName = "Moggil Rd"
            updatedBusiness.address.city = "Indooroopilly"
            const fakeDbUpdateBusiness = jest.fn().mockImplementation(() => {throw new Error('Database error')})
            const req = {
                params: {
                    abn: business.abn
                },
                body: JSON.stringify(updatedBusiness)
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = updateBusiness(fakeDbUpdateBusiness)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbUpdateBusiness).toHaveBeenCalledTimes(1)
            expect(fakeDbUpdateBusiness).toHaveBeenCalledWith(req.params.abn, req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })
    })

    describe('Test controller: createBuseinessService', () => {
        test('Returns 200 OK when called with valid service data', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            const fakeDbGetBusinessByABN = jest.fn().mockResolvedValue(business)
            const service = {
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            }
            business.services.push(service)
            const fakeDbCreateBusinessService = jest.fn().mockResolvedValue(business)
            const req = {
                params: {
                    abn: business.abn
                },
                body: service
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            
            const controller = await createBusinessService(fakeDbGetBusinessByABN, fakeDbCreateBusinessService)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(business.abn)
            expect(fakeDbCreateBusinessService).toHaveBeenCalledTimes(1)
            expect(fakeDbCreateBusinessService).toHaveBeenCalledWith(business, service)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({status: "success", updatedData: business})
        })

        test('Returns 404 Bad Request when called with abn not in DB', async () => {
            const abn = 78593029348
            const fakeDbGetBusinessByABN = jest.fn().mockResolvedValue(null)
            const service = {
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            }
            const fakeDbCreateBusinessService = jest.fn().mockRejectedValue(null)
            const req = {
                params: {
                    abn: abn
                },
                body: service
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            
            const controller = await createBusinessService(fakeDbGetBusinessByABN, fakeDbCreateBusinessService)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(abn)
            expect(fakeDbCreateBusinessService).toHaveBeenCalledTimes(0)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({status: "not found", message: "ABN not found"})
        })

        test('Returns 400 Bad Request when DbCreateService returns null', async () => {
            const business = mockBusiness[0]
            const fakeDbGetBusinessByABN = jest.fn().mockResolvedValue(business)
            const service = {
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            }

            const fakeDbCreateBusinessService = jest.fn().mockResolvedValue(null)
            const req = {
                params: {
                    abn: business.abn
                },
                body: service
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            
            const controller = await createBusinessService(fakeDbGetBusinessByABN, fakeDbCreateBusinessService)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(business.abn)
            expect(fakeDbCreateBusinessService).toHaveBeenCalledTimes(1)
            expect(fakeDbCreateBusinessService).toHaveBeenCalledWith(business, service)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({status: "error", message: "An unexpected error occurred"})
        })

        test('Returns 500 Internal Server Error when DbGetBusinessByABN returns and error', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            const fakeDbGetBusinessByABN = jest.fn().mockRejectedValue(new Error('Database error'))
            const service = {
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            }
            business.services.push(service)
            const fakeDbCreateBusinessService = jest.fn().mockResolvedValue(business)
            const req = {
                params: {
                    abn: business.abn
                },
                body: service
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            
            const controller = await createBusinessService(fakeDbGetBusinessByABN, fakeDbCreateBusinessService)
            expect(typeof controller).toBe('function')

            await controller(req, res)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(business.abn)
            expect(fakeDbCreateBusinessService).toHaveBeenCalledTimes(0)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })
         
        test('Returns 500 Internal Server Error when DbCreateBusinessService returns and error', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            const fakeDbGetBusinessByABN = jest.fn().mockResolvedValue(business)
            const service = {
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            }
            business.services.push(service)
            const fakeDbCreateBusinessService = jest.fn().mockRejectedValue(new Error('Database error'))
            const req = {
                params: {
                    abn: business.abn
                },
                body: service
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            
            const controller = await createBusinessService(fakeDbGetBusinessByABN, fakeDbCreateBusinessService)
            expect(typeof controller).toBe('function')
            
            await controller(req, res)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(business.abn)
            expect(fakeDbCreateBusinessService).toHaveBeenCalledTimes(1)
            expect(fakeDbCreateBusinessService).toHaveBeenCalledWith(business, service)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })
    })

    describe('Test controller: getBusinessServices', () => {
        test('returns a function after dependency injection', () => {
            const fakeDbGetBusinessByABN = jest.fn().mockResolvedValue(null)
            const fakeGetBusinessServices = jest.fn().mockResolvedValue(null)

            const controller = getBusinessServices(fakeDbGetBusinessByABN, fakeGetBusinessServices)
            expect(typeof controller).toBe('function')
        })

        test('returns 200 OK with valid abn', async () => {
            const business = mockBusiness[0]
            const fakeDbGetBusinessByABN = jest.fn().mockResolvedValue(business)
            const req = {
                params: {
                    abn: business.abn
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            
            const controller = await getBusinessServices(fakeDbGetBusinessByABN)
            await controller(req, res)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(business.abn)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", services: business.services })
        })

        test('returns 404 Not Found when abn not in DB', async () => {
            const business = mockBusiness[0]
            const fakeDbGetBusinessByABN = jest.fn().mockResolvedValue(null)
            const req = {
                params: {
                    abn: business.abn
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await getBusinessServices(fakeDbGetBusinessByABN)
            await controller(req, res)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(business.abn)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "not found", message: "ABN not found" })

        })

        test('returns 500 Internal Server Error when DB returns an error', async () => {
            const business = mockBusiness[0]
            const fakeDbGetBusinessByABN = jest.fn().mockRejectedValue(new Error("Database error"))
            const req = {
                params: {
                    abn: business.abn
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await getBusinessServices(fakeDbGetBusinessByABN)
            await controller(req, res)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledTimes(1)
            expect(fakeDbGetBusinessByABN).toHaveBeenCalledWith(business.abn)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })
    })

    describe('Test controller: getBusinessServiceById', () => {
            test('returns a function', async () => {
            const controller = await getBusinessServiceById(null)
            expect(typeof controller).toBe('function')
        })

        test('returns 200 OK with valid abn and service ID', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            business.services.push({
                _id: "5eg9f8f8f8f8f8f8f8f8f8f8",
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            })

            const DbGetBusinessServiceById = jest.fn().mockResolvedValue(business.services[0])
            const req = {
                params: {
                    abn: business.abn,
                    serviceId: business.services[0]._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await getBusinessServiceById(DbGetBusinessServiceById)
            await controller(req, res)

            expect(DbGetBusinessServiceById).toHaveBeenCalledTimes(1)
            expect(DbGetBusinessServiceById).toHaveBeenCalledWith(business.abn, business.services[0]._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", service: business.services[0] })
        })
        // need to do extra test for no serviceId

        test('returns 404 Not Found when ABN not in DB', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            business.services.push({
                _id: "5eg9f8f8f8f8f8f8f8f8f8f8",
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            })

            const DbGetBusinessServiceById = jest.fn().mockResolvedValue(null)
            const req = {
                params: {
                    abn: business.abn,
                    serviceId: business.services[0]._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await getBusinessServiceById(DbGetBusinessServiceById)
            const rest = await controller(req, res)

            expect(DbGetBusinessServiceById).toHaveBeenCalledTimes(1)
            expect(DbGetBusinessServiceById).toHaveBeenCalledWith(business.abn, business.services[0]._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "not found", message: "Service not found" })
        })

        test('returns 500 Internal Server Error when DB returns an error', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            business.services.push({
                _id: "5eg9f8f8f8f8f8f8f8f8f8f8",
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            })

            const DbGetBusinessServiceById = jest.fn().mockRejectedValue(new Error("Database error"))
            const req = {
                params: {
                    abn: business.abn,
                    serviceId: business.services[0]._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await getBusinessServiceById(DbGetBusinessServiceById)
            await controller(req, res)

            expect(DbGetBusinessServiceById).toHaveBeenCalledTimes(1)
            expect(DbGetBusinessServiceById).toHaveBeenCalledWith(business.abn, business.services[0]._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Database error" })
        })
    })

    describe('Test controller: updateBusinessServices', () => {
        test('returns 200 OK + creates a new business service with valid input', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            business.services.push({
                _id: "5eg9f8f8f8f8f8f8f8f8f8f8",
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            })

            const updatedService = JSON.parse(JSON.stringify(business.services[0]))
            delete updatedService._id
            updatedService.name = "Group Classes"

            const DbUpdateBusinessService = jest.fn().mockResolvedValue(updatedService)
            const req = {
                params: {
                    abn: business.abn,
                    serviceId: business.services[0]._id
                },
                body: updatedService
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await updateBusinessService(DbUpdateBusinessService)
            await controller(req, res)

            expect(DbUpdateBusinessService).toHaveBeenCalledTimes(1)
            expect(DbUpdateBusinessService).toHaveBeenCalledWith(business.abn, business.services[0]._id, req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", updatedData: updatedService })
        })

        test('returns 400 Bad Request when serviceId not found', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            business.services.push({
                _id: "5eg9f8f8f8f8f8f8f8f8f8f8",
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            })

            const updatedService = JSON.parse(JSON.stringify(business.services[0]))
            delete updatedService._id
            updatedService.name = "Group Classes"

            const DbUpdateBusinessService = jest.fn().mockResolvedValue(null)
            const req = {
                params: {
                    abn: business.abn,
                    serviceId: business.services[0]._id
                },
                body: updatedService
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await updateBusinessService(DbUpdateBusinessService)
            await controller(req, res)

            expect(DbUpdateBusinessService).toHaveBeenCalledTimes(1)
            expect(DbUpdateBusinessService).toHaveBeenCalledWith(business.abn, business.services[0]._id, req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "An unexpected error occurred" })
        })

        test('returns 500 Internal Server Error when DB returns an error', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            business.services.push({
                _id: "5eg9f8f8f8f8f8f8f8f8f8f8",
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            })

            const updatedService = JSON.parse(JSON.stringify(business.services[0]))
            delete updatedService._id
            updatedService.name = "Group Classes"

            const DbUpdateBusinessService = jest.fn().mockRejectedValue(new Error("Db error"))
            const req = {
                params: {
                    abn: business.abn,
                    serviceId: business.services[0]._id
                },
                body: updatedService
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await updateBusinessService(DbUpdateBusinessService)
            await controller(req, res)

            expect(DbUpdateBusinessService).toHaveBeenCalledTimes(1)
            expect(DbUpdateBusinessService).toHaveBeenCalledWith(business.abn, business.services[0]._id, req.body)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Db error" })
        })
    })

    describe('Test controller: deleteBusinessService', () => {
        test('returns 204 No Content + deletes a business service with valid input', async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            business.services.push({
                _id: "5eg9f8f8f8f8f8f8f8f8f8o9",
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            })
            expect(business.services.length).toBe(1)

            const fakeDbDeleteBusinessService = jest.fn().mockResolvedValue(true)
            const req = {
                params: {
                    abn: business.abn,
                    serviceId: business.services[0]._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await deleteBusinessService(fakeDbDeleteBusinessService)
            await controller(req, res)

            expect(fakeDbDeleteBusinessService).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteBusinessService).toHaveBeenCalledWith(business.abn, business.services[0]._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(204)
        })

        test("returns 400 Bad Request when valid abn or serviceId not in DB", async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            business.services.push({
                _id: "5eg9f8f8f8f8f8f8f8f8f8o9",
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            })
            expect(business.services.length).toBe(1)

            const fakeDbDeleteBusinessService = jest.fn().mockResolvedValue(null)
            const req = {
                params: {
                    abn: "1234533333",
                    serviceId: business.services[0]._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await deleteBusinessService(fakeDbDeleteBusinessService)
            await controller(req, res)

            expect(fakeDbDeleteBusinessService).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteBusinessService).toHaveBeenCalledWith("1234533333", business.services[0]._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "An unexpected error occurred" })
        })

        test("returns 500 Internal Server Error when DB returns and error", async () => {
            const business = JSON.parse(JSON.stringify(mockBusiness[0]))
            business.services.push({
                _id: "5eg9f8f8f8f8f8f8f8f8f8o9",
                name: "Individual Classes",
                description: "One-to-one class with an experienced teacher",
                duration: 55,
                bookingTimes: {},
                break: 5,
                fee: 50
            })
            expect(business.services.length).toBe(1)

            const fakeDbDeleteBusinessService = jest.fn().mockRejectedValue(new Error("Db error"))
            const req = {
                params: {
                    abn: business.abn,
                    serviceId: business.services[0]._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await deleteBusinessService(fakeDbDeleteBusinessService)
            await controller(req, res)

            expect(fakeDbDeleteBusinessService).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteBusinessService).toHaveBeenCalledWith(business.abn, business.services[0]._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Db error" })
        })
    })

    describe('Test controller: getClientList', () => {
        let business
        let mockClientList
        beforeEach(() => {
            jest.clearAllMocks()

            // Get business
            business = JSON.parse(JSON.stringify(mockBusiness[0]))

            // Create mock CRMs with clients
            mockClientList = [
                {
                    _id: mongoose.Types.ObjectId(),
                    userModel: "User",
                    user: {
                        _id: mongoose.Types.ObjectId(),
                        ...mockUsers[0]
                    },
                    business: business._id,
                    tempFlag: false,
                    allowAccess: true,
                    notes: "Some notes"
                },{
                    _id: mongoose.Types.ObjectId(),
                    userModel: "User",
                    user: {
                        _id: mongoose.Types.ObjectId(),
                        ...mockUsers[1]
                    },
                    business: business._id,
                    tempFlag: false,
                    allowAccess: true,
                    notes: "Some notes"
                }, {
                    _id: mongoose.Types.ObjectId(),
                    userModel: "User",
                    user: {
                        _id: mongoose.Types.ObjectId(),
                        ...mockUsers[2]
                    },
                    business: business._id,
                    tempFlag: false,
                    allowAccess: true,
                    notes: "Some notes"
                }
            ]

        })

        test('returns a function', () => {
            expect(getClientList()).toBeInstanceOf(Function)
        })

        test('returns 200 OK + client list with valid inputs', async () => {
            const fakeDbGetClientList = jest.fn().mockResolvedValue(mockClientList)
            const req = {
                params: {
                    businessId:  business._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = await getClientList(fakeDbGetClientList)
            await controller(req, res)

            expect(fakeDbGetClientList).toHaveBeenCalledTimes(1)
            expect(fakeDbGetClientList).toHaveBeenCalledWith(business._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", clients: mockClientList })
        })
                
    })

})