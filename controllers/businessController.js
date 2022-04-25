

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
            res.status(200).json({ status: "success", updatedData: results })
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
            res.status(200).json({ status: "success", updatedData: results })
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