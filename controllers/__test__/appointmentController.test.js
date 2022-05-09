import { userCreateAppointment, businessRepCreateAppointment, updateAppointment, getAppointmentById, deleteAppointment, getAllUserAppointments, getAllBusinessAppointments } from "../appointmentController.js"

import business from "../../__test__/mockBusiness.js"
import users from "../../__test__/mockUsers.js"
import businessReps from "../../__test__/mockBusinessReps.js"
import mongoose from "mongoose"
import { jest } from "@jest/globals"


describe('Appointment Controller Unit Tests', () => {
    let mockBusiness
    let mockUser
    let mockCRM
    let mockAppointment
    beforeEach(() => {
        // Reset all mocks
        jest.resetAllMocks()

        // Set up common variables
        mockBusiness = JSON.parse(JSON.stringify(business[0]))
        mockUser = JSON.parse(JSON.stringify(users[3]))
        mockCRM = {
            _id: mongoose.Types.ObjectId(),
            userModel: "User",
            user: mockUser._id,
            business: mockBusiness._id,
            tempFlag: false,
            allowAccess: true,
            notes: ""
        }

        mockAppointment = {
            crm: mockCRM._id,
            service: mongoose.Types.ObjectId(),
            appointmentTime: "2020-01-01T00:00:00.000Z",
            appointmentEnd: "2020-01-01T00:00:00.000Z",
            fee: "50.00",
            feeDue: "2020-01-01T00:00:00.000Z",
            details: "Test Details"
        }
        
    })

    describe('Test controller: getAllUserAppointments', () => {
        test('returns 200 OK + all user appointments with valid inputs', async () => {
            const mockPopulateCRMAppointments = JSON.parse(JSON.stringify(mockCRM))
            mockPopulateCRMAppointments.appointments = [mockAppointment, mockAppointment, mockAppointment]
            const fakeDbGetAppointmentsByUserId = jest.fn().mockResolvedValue([mockPopulateCRMAppointments])
            const req = {
                session: {
                    loggedIn: true,
                    user: mockUser,
                    userType: 'user'
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getAllUserAppointments(fakeDbGetAppointmentsByUserId)
            expect(typeof controller).toBe('function')

            const rest = await controller(req, res)
            expect(fakeDbGetAppointmentsByUserId).toHaveBeenCalledTimes(1)
            expect(fakeDbGetAppointmentsByUserId).toHaveBeenCalledWith(req.session.user._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [mockPopulateCRMAppointments] })
        })
    })

    describe('Test controller: getAllBusinessAppointments', () => {
        const rep = JSON.parse(JSON.stringify(businessReps[1]))
        test('returns 200 OK + all business appointments with valid inputs', async () => {
            const mockPopulateCRMAppointments = JSON.parse(JSON.stringify(mockCRM))
            mockPopulateCRMAppointments.appointments = [mockAppointment, mockAppointment, mockAppointment]
            const fakeDbGetAppointmentsByBusinessId = jest.fn().mockResolvedValue([mockPopulateCRMAppointments])
            const req = {
                session: {
                    loggedIn: true,
                    user: rep,
                    userType: 'businessRep'
                },
                params: {
                    businessId: mockBusiness._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getAllBusinessAppointments(fakeDbGetAppointmentsByBusinessId)
            expect(typeof controller).toBe('function')

            const rest = await controller(req, res)
            expect(fakeDbGetAppointmentsByBusinessId).toHaveBeenCalledTimes(1)
            expect(fakeDbGetAppointmentsByBusinessId).toHaveBeenCalledWith(req.params.businessId)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [mockPopulateCRMAppointments] })
        })
    })

    describe('Test controller: userCreateAppointment', () => {
        describe('When CRM exists:', () => {
            test('returns 201 Created when user creates a new appointment', async () => {
                const fakeDbGetCRMByMatch = jest.fn().mockResolvedValue(mockCRM)
                const fakeDbCreateCRM = jest.fn()
                const fakeDbCreateAppointment = jest.fn().mockResolvedValue(mockAppointment)
                const req = {
                    params: {
                        businessId: mockBusiness._id
                    },
                    session: {
                        user: mockUser,
                        userType: 'user'
                    },
                    body: mockAppointment
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn().mockReturnThis()
                }

                const controller = userCreateAppointment(fakeDbGetCRMByMatch, fakeDbCreateCRM, fakeDbCreateAppointment)
                expect(typeof controller).toBe("function")
                
                await controller(req, res)
                expect(fakeDbGetCRMByMatch).toHaveBeenCalledTimes(1)
                expect(fakeDbGetCRMByMatch).toHaveBeenCalledWith(mockBusiness._id, mockUser._id)
                expect(fakeDbCreateCRM).not.toHaveBeenCalled()
                expect(fakeDbCreateAppointment).toHaveBeenCalledTimes(1)
                expect(fakeDbCreateAppointment).toHaveBeenCalledWith(mockAppointment)
                expect(res.status).toHaveBeenCalledTimes(1)
                expect(res.status).toHaveBeenCalledWith(201)
                expect(res.json).toHaveBeenCalledTimes(1)
                expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Appointment created", data: mockAppointment })
            })
        })

        describe('When CRM does not exist:', () => {
            test('returns 201 Created when user creates a new appointment', async () => {
                const fakeDbGetCRMByMatch = jest.fn().mockResolvedValue(null)
                const fakeDbCreateCRM = jest.fn().mockResolvedValue(mockCRM)
                const fakeDbCreateAppointment = jest.fn().mockResolvedValue(mockAppointment)
                const req = {
                    params: {
                        businessId: mockBusiness._id
                    },
                    session: {
                        user: mockUser,
                        userType: 'user'
                    },
                    body: mockAppointment
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn().mockReturnThis()
                }

                const controller = userCreateAppointment(fakeDbGetCRMByMatch, fakeDbCreateCRM, fakeDbCreateAppointment)
                expect(typeof controller).toBe("function")

                await controller(req, res)
                const expectedCRM = JSON.parse(JSON.stringify(mockCRM))
                delete expectedCRM._id
                expect(fakeDbGetCRMByMatch).toHaveBeenCalledTimes(1)
                expect(fakeDbGetCRMByMatch).toHaveBeenCalledWith(mockBusiness._id, mockUser._id)
                expect(fakeDbCreateCRM).toHaveBeenCalledTimes(1)
                expect(fakeDbCreateCRM).toHaveBeenCalledWith(expectedCRM)
                expect(fakeDbCreateAppointment).toHaveBeenCalledTimes(1)
                expect(fakeDbCreateAppointment).toHaveBeenCalledWith(mockAppointment)
                expect(res.status).toHaveBeenCalledTimes(1)
                expect(res.status).toHaveBeenCalledWith(201)
                expect(res.json).toHaveBeenCalledTimes(1)
                expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Appointment created", data: mockAppointment })
            })
        })
    })

    describe('Test controller: businessRepCreateAppointment', () => {
        test('returns 201 Created and creates a new appointment with valid inputs', async () => {
            const fakeDbGetCRMByMatch = jest.fn().mockResolvedValue(mockCRM)
            const fakeDbCreateAppointment = jest.fn().mockResolvedValue(mockAppointment)
            const req = {
                params: {
                    businessId: mockBusiness._id,
                    id: mockUser._id
                },
                body: mockAppointment
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = businessRepCreateAppointment(fakeDbGetCRMByMatch, fakeDbCreateAppointment)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbGetCRMByMatch).toHaveBeenCalledTimes(1)
            expect(fakeDbGetCRMByMatch).toHaveBeenCalledWith(mockBusiness._id, mockUser._id)
            expect(fakeDbCreateAppointment).toHaveBeenCalledTimes(1)
            expect(fakeDbCreateAppointment).toHaveBeenCalledWith(mockAppointment)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Appointment created", data: mockAppointment })
        })
    })

    // Unit tests for this controller are the same for both user and business rep
    describe('Test controller: updateAppointment', () => {
        test('returns 200 OK and updates appointment with valid inputs', async () => {
            mockAppointment._id = mongoose.Types.ObjectId(),
            mockAppointment.details = "Updated Details"
            const fakeDbUpdateAppointment = jest.fn().mockResolvedValue(mockAppointment)
            const req = {
                params: {
                    appointmentId: mockAppointment._id
                },
                body: mockAppointment
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = updateAppointment(fakeDbUpdateAppointment)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbUpdateAppointment).toHaveBeenCalledTimes(1)
            expect(fakeDbUpdateAppointment).toHaveBeenCalledWith(mockAppointment._id, mockAppointment)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Appointment updated", data: mockAppointment })
        })
    })

    describe('Test controller: getAppointmentById', () => {
        test('returns 200 OK and returns appointment with valid inputs', async () => {
            mockAppointment._id = mongoose.Types.ObjectId()
            const fakeDbGetAppointmentById = jest.fn().mockResolvedValue(mockAppointment)
            const req = {
                params: {
                    appointmentId: mockAppointment._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = getAppointmentById(fakeDbGetAppointmentById)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbGetAppointmentById).toHaveBeenCalledTimes(1)
            expect(fakeDbGetAppointmentById).toHaveBeenCalledWith(mockAppointment._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json).toHaveBeenCalledWith({ status: "success", appointment: mockAppointment })
        })
    })

    describe('Test controller: deleteAppointment', () => {
        test('returns 200 OK and deletes appointment with valid inputs', async () => {
            mockAppointment._id = mongoose.Types.ObjectId()
            const fakeDbDeleteAppointment = jest.fn().mockResolvedValue(mockAppointment)
            const req = {
                params: {
                    appointmentId: mockAppointment._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const controller = deleteAppointment(fakeDbDeleteAppointment)
            expect(typeof controller).toBe("function")

            await controller(req, res)
            expect(fakeDbDeleteAppointment).toHaveBeenCalledTimes(1)
            expect(fakeDbDeleteAppointment).toHaveBeenCalledWith(mockAppointment._id)
            expect(res.status).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(204)
            expect(res.json).toHaveBeenCalledTimes(1)
        })
    })
})



                    