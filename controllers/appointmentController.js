

export const userCreateAppointment = (DbGetCRMByMatch, DbCreateCRM, DbCreateAppointment) => async (req, res, next) => {
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
        // 
    return await DbUpdateAppointment(req.params.appointmentId, req.body)
    } catch(e) {
        console.log(e)
        return res.status(500).json({ status: "error", message: e.message })
    }
}