import Business from "../models/businessModel"

// Get business by ABN
export const getBusinessByABN = (DbGetBusinessByABN) => async (req, res) => {
    try {
        const abn = req.params.abn
        const business = await DbGetBusinessByABN(abn)

        if(business) {
            res.status(200).json({ status: "success", business: business })
        } else {
            res.status(404).json({ status: "not found", business: [] })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const getBusinessByID = (DbGetBusinessByID) => async (req, res) => {
    try {
        const id = req.params.id
        const business = await DbGetBusinessByID(id)

        if(business) {
            res.status(200).json({status: "success", business: business})
        } else {
            res.status(404).json({status: "not found", business: []})
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({status: "error", message: e.message})
    }
}

export const updateBusiness = (DbUpdateBusiness) => async (req, res) => {
    try {
        const abn = req.params.abn
        const updatedDetails = req.body
        
        const results = await DbUpdateBusiness(abn, updatedDetails)

        if(results) {
            res.status(200).json({status: "success", originalDetails: results})
        } else {
            res.status(404).json({status: "not found", business: []})
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({status: "error", message: e.message})
    }
}

export const getBusinessServices = (DbGetBusinessByABN) => async (req, res) => {
    try {
        const business = await DbGetBusinessByABN(req.params.abn)
        console.log("business: ", business)
        if(business) {
            res.status(200).json({ status: "success", services: business.services })
        } else {
            res.status(404).json({ status: "not found", message: "ABN not found" })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message })

    }
}

export const getBusinessServiceById = (DbGetBusinessServiceById) => async (req, res) => {
    try {
        const service = await DbGetBusinessServiceById(req.params.abn, req.params.serviceId)

        if(service) {
            res.status(200).json({ status: "success", service: service })
        } else {
            res.status(404).json({ status: "not found", message: "Service not found" })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const createBusinessService = (DbGetBusinessByABN, DbCreateBusinessService) => async (req, res) => {
    try {
        const business = await DbGetBusinessByABN(req.params.abn)
        if(!business) return res.status(404).json({status: "not found", message: "ABN not found"})

        const results = await DbCreateBusinessService(business, req.body)

        if(results) {
            res.status(200).json({ status: "success", updatedData: results })
        } else {
            res.status(400).json({ status: "error", message: "An unexpected error occurred"})
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message })
    }
}

