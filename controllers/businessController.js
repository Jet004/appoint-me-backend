import { checkIP } from "../middleware/ipWhitelist.js"


export const getBusinessByID = (DbGetBusinessByID) => async (req, res) => {
    try {
        const businessId = req.params.businessId
        const business = await DbGetBusinessByID(businessId)

        if(business) {
            res.status(200).json({status: "success", business: business})
        } else {
            res.status(404).json({status: "not found", business: []})
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).json({status: "error", message: e.message})
    }
}

export const updateBusiness = (DbUpdateBusiness) => async (req, res) => {
    try {
        const businessId = req.params.businessId
        const updatedDetails = req.body
        
        const results = await DbUpdateBusiness(businessId, updatedDetails)

        if(results) {
            res.status(200).json({status: "success", originalDetails: results})
        } else {
            res.status(404).json({status: "not found", business: []})
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).json({status: "error", message: e.message})
    }
}

export const getBusinessServices = (DbGetBusinessByID) => async (req, res) => {
    try {
        const business = await DbGetBusinessByID(req.params.businessId)

        if(business) {
            res.status(200).json({ status: "success", services: business.services })
        } else {
            res.status(404).json({ status: "not found", message: "ABN not found" })
        }
    } catch(e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })

    }
}

export const getBusinessServiceById = (DbGetBusinessServiceById) => async (req, res) => {
    try {
        const service = await DbGetBusinessServiceById(req.params.businessId, req.params.serviceId)

        if(service) {
            res.status(200).json({ status: "success", service: service })
        } else {
            res.status(404).json({ status: "not found", message: "Service not found" })
        }
    } catch(e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const createBusinessService = (DbGetBusinessByID, DbCreateBusinessService) => async (req, res) => {
    try {
        const business = await DbGetBusinessByID(req.params.businessId)
        if(!business) return res.status(404).json({status: "not found", message: "Business not found"})

        const results = await DbCreateBusinessService(business, req.body)

        if(results) {
            res.status(201).json({ status: "success", message: "New service created", service: results })
        } else {
            res.status(400).json({ status: "error", message: "An unexpected error occurred"})
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const updateBusinessService = (DbUpdateBusinessService) => async (req, res) => {
    try {
        const results = await DbUpdateBusinessService(req.params.businessId, req.params.serviceId, req.body)

        if(results) {
            res.status(200).json({ status: "success", message: "Service details updated", updatedData: results })
        } else {
            res.status(400).json({ status: "error", message: "An unexpected error occurred"})
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const deleteBusinessService = (DbDeleteBusinessService) => async (req, res) => {
    try {
        const results = await DbDeleteBusinessService(req.params.businessId, req.params.serviceId)

        if(results) {
            res.status(204).json({ status: "success", message: "Service deleted" })
        } else {
            res.status(400).json({ status: "error", message: "An unexpected error occurred"})
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const getClientList = (DbGetClientList) => async (req, res) => {
    try {
        // Get clients
        const results = await DbGetClientList(req.params.businessId)

        // Check if client list has been returned
        if(results) {
            res.status(200).json({ status: "success", clients: results })
        } else {
            res.status(404).json({ status: "not found", message: "No clients found" })
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message })
    }
}

//
// Admin Panel Controllers
//

export const getIpList = (DbGetUserIPs) => async (req, res) => {
    try {
        let results = await DbGetUserIPs(req.session.user._id)

        if(!results) {
            return res.status(404).json({ status: "not found", message: "No IP addresses found" })
        }

        return res.status(200).json({ status: "success", ipList: results })
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ status: "error", message: e.message })
    }
}

export const addIP = (DbGetUserIPs, DbRegisterIP) => async (req, res) => {
    try {
        const newIP = req.body.ip
        const userID = req.session.user._id

        // Check that IP is not already registered for user
        const existingIPs = await DbGetUserIPs(userID)
        if(existingIPs.length > 0) {
            if(checkIP(newIP, existingIPs)) {
                // IP already registered, respond with 400
                return res.status(400).json({ status: "error", message: "IP already registered" })
            }
        }

        const results = await DbRegisterIP(newIP, userID)

        if(!results) {
            return res.status(400).json({ status: "error", message: "An unexpected error occurred" })
        }
        
        // Successful, respond with 201 Created
        return res.status(201).json({ status: "success", message: "IP address added" })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ status: "error", message: e.message })
    }
}

export const deleteIP = (DbDeleteIP) => async (req, res) => {
    try {
        const ip = req.body.ip
        const userID = req.session.user._id

        const results = await DbDeleteIP(ip, userID)

        if(!results) {
            return res.status(400).json({ status: "error", message: "An unexpected error occurred" })
        }

        // Successful, respond with 204 No Content
        return res.status(204).json({ status: "success", message: "IP address deleted" })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ status: "error", message: e.message })
    }
}