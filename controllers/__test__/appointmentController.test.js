import { userCreateAppointment, businessRepCreateAppointment, updateAppointment, getAppointmentById } from "../appointmentController"

import business from "../../__test__/mockBusiness"
import users from "../../__test__/mockUsers"
import businessReps from "../../__test__/mockBusinessReps"
import mongoose from "mongoose"


describe('Appointment Controller Unit Tests', () => {
    let mockBusiness
    let mockUser
    let mockCRM
    let mockAppointment
    beforeEach(() => {
        // Reset all mocks
        jest.resetAllMocks()

        // Set up common variables
        mockBusiness = JSON.parse(JSON.stringify(business))
        mockUser = JSON.parse(JSON.stringify(users[3]))
        mockCRM = {
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

    describe('Test controller: userCreateAppointment', () => {
        describe('When CRM exists:', () => {
            test('returns 201 Created when user creates a new appointment', async () => {
                const fakeDbGetCRMByMatch = jest.fn().mockResolvedValue(mockCRM)
                const fakeDbCreateCRM = jest.fn()
                const fakeDbCreateAppointment = jest.fn().mockResolvedValue(mockAppointment)
                const req = {
                    params: {
                        abn: mockBusiness.abn
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
                expect(fakeDbGetCRMByMatch).toHaveBeenCalledWith(mockBusiness.abn, mockUser._id)
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
                        abn: mockBusiness.abn
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
                expect(fakeDbGetCRMByMatch).toHaveBeenCalledWith(mockBusiness.abn, mockUser._id)
                expect(fakeDbCreateCRM).toHaveBeenCalledTimes(1)
                expect(fakeDbCreateCRM).toHaveBeenCalledWith(mockCRM)
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
                    abn: mockBusiness.abn,
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
            expect(fakeDbGetCRMByMatch).toHaveBeenCalledWith(mockBusiness.abn, mockUser._id)
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
})



                    