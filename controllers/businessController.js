
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
    return
}

export const updateBusiness = (DbUpdateBusiness) => async (req, res) => {
    return
}