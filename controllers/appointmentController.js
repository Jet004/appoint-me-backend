
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
        console.log(e)
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
        console.log(e)
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
        console.log(e)
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
        console.log(e)
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
        console.log(e)
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
        console.log(e)
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
        console.log(e)
        return res.status(500).json({ status: "error", message: e.message })
    }
}