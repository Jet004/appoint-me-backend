import format from 'date-fns/format/index.js'
import addMinutes from 'date-fns/addMinutes/index.js'
import setHours from 'date-fns/setHours/index.js'
import setMinutes from 'date-fns/setMinutes/index.js'

//
// The following functions are needed in multiple controllers so they have been defined here
//

// Function for adding start and end times to a given date
const timeToDateTime = (time, date) => {
    time = Number(time)
    const hours = Math.floor(time / 100)
    const minutes = time % (hours * 100)
    const dateTime = setMinutes(setHours(new Date(date), hours), minutes)
    // console.log(hours, minutes)
    // console.log(getHours(dateTime), getMinutes(dateTime))
    return dateTime
}

// Function returns a list of all possible appointment times withing a businesses operating hours
// This list has NOT been filtered to remove times which can't be booked
const getPossibleAppointmentTimes = (startTime, endTime, timeSlot, date) => {
    const possibleTimes = []
    for(let i = timeToDateTime(startTime, date); i <= timeToDateTime(endTime, date); i = addMinutes(i, timeSlot)) {
        possibleTimes.push(i)
    }
    return possibleTimes
}

// Function returns a list of all available appointment times within a business's operating hours
// The returned list has been filtered to remove times which can't be booked
const filterInvalidTimeSlots = (possibleAppointmentTimes, existingAppointments, serviceDurationMinutes, operatingHours, date) => {
    let availableAppointmentTimes
    // This filter removes any time slots which are too close to the close of business for the given service
    // ie. time slot + total service duration > operating hours end time
    availableAppointmentTimes = possibleAppointmentTimes.filter(time => addMinutes(time, serviceDurationMinutes) <= timeToDateTime(operatingHours.endTime, date))

    // Only run the following filters if there are existing appointments
    if(existingAppointments.length > 0) {
        // This filter removes any time slots which would conflict with an existing appointment
        // ie. time slot, end time or any interim time slots conflict within another appointment
        availableAppointmentTimes = availableAppointmentTimes.filter(time => {
            return !existingAppointments.some(appointment => {
                const timeSlotEnd = addMinutes(time, serviceDurationMinutes)
                if(time >= appointment.appointmentTime && time < appointment.appointmentEnd){
                    // appt start <= time slot < appt end
                    return true
                } else if(timeSlotEnd > appointment.appointmentTime && timeSlotEnd <= appointment.appointmentEnd){
                    // appt start < end time <= appt end
                    return true
                } else if(time < appointment.appointmentTime && timeSlotEnd > appointment.appointmentEnd){
                    // interim time slot === appt start || interim time slot === appt end || appt start < interim time slot < appt end
                    return true
                }

                return false
            })
        })
    }

    return availableAppointmentTimes
}


//
// Controllers
//

export const getAvailableAppointmentTimes = (DbGetBusinessByID, DbGetAppointmentByBusinessDate) => async (req, res) => {
    try {
        // Get required values from URL parameters
        const businessId = req.params.businessId
        const serviceId = req.params.serviceId
        const date = req.params.date
        
        // Convert the requested day of the week to a string representation so it can be used to
        // retrieve the business's operating hours
        const dayOfWeek = format(new Date(date), "EEEE")

        // Get business data
        const business = await DbGetBusinessByID(businessId)
        // Check that there is a business with the given ID, respond with 404 if not
        if(!business) return res.status(404).json({status: "error", message: "Business not found"})
        // Business exists, initialise related variables
        const timeSlot = business.settings.appointmentTimeSlot
        const operatingHours = business.operatingHours.filter(day => day.day === dayOfWeek)[0]

        // Get service data
        const service = business.services.filter(service => service.id === serviceId)[0]
        const serviceDurationMinutes = service.duration + service.break

        // Get array of all possible appointment time slots for the given day
        // This is determined by business operating hours and the time slot from settings
        const possibleAppointmentTimes = getPossibleAppointmentTimes(operatingHours?.startTime, operatingHours.endTime, timeSlot, date)
    
        // Get existing appointments for the requested business, service and date
        const existingAppointments = await DbGetAppointmentByBusinessDate(businessId, date)

        // Get available appointment times by filtering existing appointments from the possible times 
        // and times too close to the close of business
        const availableAppointmentTimes = filterInvalidTimeSlots(possibleAppointmentTimes, existingAppointments, serviceDurationMinutes, operatingHours, date)

        return res.status(200).json({ times: availableAppointmentTimes })
    } catch(e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const getAllUserAppointments = (DbGetAppointmentsByUserId) => async (req, res) => {
    try {
        // Get CRMs and populate appointment data
        const crms = await DbGetAppointmentsByUserId(req.session.user._id)

        // Check that relationships and appointments have loaded
        if(!crms || crms.length === 0 || !crms[0].appointments || crms[0].appointments.length === 0) {
            // No CRMs found, therefore no appointment data
            return res.status(404).json({ status: "error", message: "No appointments found" })
        }

        // Return CRMs with appointments
        return res.status(200).json({ status: "success", data: crms })

    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ status: "error", message: e.message })
    }
}

export const getAllBusinessAppointments = (DbGetAppointmentsByBusinessId) => async (req, res) => {
    try {
        const crms = await DbGetAppointmentsByBusinessId(req.params.businessId)

        // Check that relationships and appointments have loaded
        if(!crms || crms.length === 0 || !crms[0].appointments || crms[0].appointments.length === 0) {
            // No CRMs found, therefore no appointment data
            return res.status(404).json({ status: "error", message: "No appointments found" })
        }

        // Return CRMs with appointments
        return res.status(200).json({ status: "success", data: crms })

    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ status: "error", message: e.message })
    }
}

export const userCreateAppointment = (DbGetCRMByMatch, DbCreateCRM, DbCreateAppointment, DbGetAppointmentById) => async (req, res, next) => {
    try {
        // This controller is only accessible by logged in users of userType 'user'
        // Get or create CRM
        let crm = await DbGetCRMByMatch(req.params.businessId, req.session.user._id)
        
        if(!crm) {
            // Create CRM
            const newCRM = {
                userModel: "User",
                user: req.session.user._id,
                business: req.params.businessId,
                tempFlag: false,
                allowAccess: true,
                notes: ""
            }

            crm = await DbCreateCRM(newCRM)
        }

        // Check if CRM exists
        if(!crm) {
            // CRM not found, respond with 404 Not Found
            return res.status(404).json({ status: "error", message: "CRM not found" })
        }

        // CRM exists, create new Appointment
        const newAppointment = {
            crm: crm._id,
            service: req.body.service,
            appointmentTime: req.body.appointmentTime,
            appointmentEnd: req.body.appointmentEnd,
            fee: req.body.fee,
            feeDue: req.body.feeDue,
            details: req.body.details
        }
        
        const appointment = await DbCreateAppointment(newAppointment)

        // Check if Appointment was created
        if(!appointment) {
            // Appointment not created, respond with 500 Internal Server Error
            return res.status(500).json({ status: "error", message: "Appointment not created" })
        }

        // Appointment created, respond with 201 Created
        return res.status(201).json({ status: "success", message: "Appointment created", data: appointment })

    } catch(e) {
        console.log(e.message)
        return res.status(500).json({ status: "error", message: e.message })
    }
}

export const businessRepCreateAppointment = (DbGetCRMByMatch, DbCreateAppointment) => async (req, res, next) => {
    // This controller is only accessible by logged in users of userType 'businessRep'
    try {
        // Get CRM
        let crm = await DbGetCRMByMatch(req.params.businessId, req.params.id)

        // Check that CRM does actually exist
        if(!crm) {
            // CRM not found, respond with 404 Not Found
            return res.status(404).json({ status: "error", message: "CRM not found" })
        }

        // CRM exists, create new Appointment
        const newAppointment = {
            crm: crm._id,
            service: req.body.service,
            appointmentTime: req.body.appointmentTime,
            appointmentEnd: req.body.appointmentEnd,
            fee: req.body.fee,
            feeDue: req.body.feeDue,
            details: req.body.details
        }

        const appointment = await DbCreateAppointment(newAppointment)

        // Check if Appointment was created
        if(!appointment) {
            // Appointment not created, respond with 500 Internal Server Error
            return res.status(500).json({ status: "error", message: "Appointment not created" })
        }

        // Appointment created, respond with 201 Created
        return res.status(201).json({ status: "success", message: "Appointment created", data: appointment })

    } catch(e) {
        console.log(e.message)
        return res.status(500).json({ status: "error", message: e.message })
    }
}

export const updateAppointment = (DbUpdateAppointment) => async (req, res, next) => {
    try {
        // This controller is only accessible by logged in users of userType 'user' or 'businessRep'
        // Update Appointment
        const appointment = await DbUpdateAppointment(req.params.appointmentId, req.body)

        // Check if Appointment was updated
        if(!appointment) {
            // Appointment not updated, respond with 500 Internal Server Error
            return res.status(500).json({ status: "error", message: "Appointment not updated" })
        }

        // Appointment updated, respond with 200 OK
        return res.status(200).json({ status: "success", message: "Appointment updated", data: appointment })

    } catch(e) {
        console.log(e.message)
        return res.status(500).json({ status: "error", message: e.message })
    }
}

export const getAppointmentById = (DbGetAppointmentById) => async (req, res, next) => {
    try {
        const appointment = await DbGetAppointmentById(req.params.appointmentId)

        // Check if Appointment was found
        if(!appointment) {
            // Appointment not found, respond with 404 Not Found
            return res.status(404).json({ status: "error", message: "Appointment not found" })
        }

        // Appointment found, respond with 200 OK
        return res.status(200).json({ status: "success", appointment: appointment })
    } catch(e) {
        console.log(e.message)
        return res.status(500).json({ status: "error", message: e.message })
    }
}

export const deleteAppointment = (DbDeleteAppointment) => async (req, res, next) => {
    try {
        // This controller is accessible by logged in users of userType 'user' or 'businessRep'
        // Delete Appointment
        const result = await DbDeleteAppointment(req.params.appointmentId)

        // Check if Appointment was deleted
        if(!result || result.deletedCount === 0) {
            // Appointment not deleted, respond with 404 Not Found
            return res.status(404).json({ status: "error", message: "Appointment not found" })
        }

        // Appointment deleted, respond with 204 No Content
        return res.status(204).json()

    } catch(e) {
        console.log(e.message)
        return res.status(500).json({ status: "error", message: e.message })
    }
}