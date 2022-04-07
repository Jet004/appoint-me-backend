import { hashSync } from "bcrypt"

// This controller is not needed at the moment, it is still here 
// so the related imports don't throw errors
export const getAllUsers = (DbGetAllUsers) => async (req, res) => {
    try {
        const users = await DbGetAllUsers()
        
        if(users) {
            users.forEach(user => user.password = null)
            res.status(200).json({ status: "success", user: users })
        } else {
            res.status(500).json({ status: "error", message: "An unexpected error occurred" })
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: e.message });
    }
}

// This controller is not needed at the moment, it is still here 
// so the related imports don't throw errors
export const getUserByEmail = (DbGetUserByEmail) => async (req, res) => {
    try {
        const user = await DbGetUserByEmail(req.params.email)
        if(user) {
            user.password = null
            res.status(200).json({ status: "success", user: user })
        } else {
            res.status(404).json({ status: "not found", user: [] })
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const createUser = (DbCreateUser) => async (req, res) => {
    try {
        const user = req.body
        user.password = hashSync(user.password, 6)
        const result = await DbCreateUser(user)
        result ? res.status(201).json({ status: "success", user: result })
            : res.status(500).json({ status: "error", message: "An unexpected error occurred" })
    } catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const updateUser = (DbUpdateUser) => async (req, res) => {
    try {
        const result = await DbUpdateUser(req.params.id, req.body)
        result ? res.status(200).json({ status: "success", originalData: result })
            : res.status(404).json({ status: "not found", user: [] })
    } catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const deleteUser = (DbDeleteUser) => async (req, res) => {
    try {
        const result = await DbDeleteUser(req.params.id)
        result ? res.status(204).json()
            : res.status(404).json({ status: "not found" })
    } catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const createTempUser = (DbCreateUser, DbCreateCRM) => async (req, res) => {
    try {
        const user = req.body
        const result = await DbCreateUser(user)

        if(!result) {
            return res.status(500).json({ status: "error", message: "An unexpected error occurred" })
        }

        // Create a CRM for the user
        const crm = {
            userModel: "TempUser",
            user: result._id,
            business: req.params.businessId,
            tempFlag: true,
            appointments: [],
            allowAccess: true,
            notes: "This is a temporary user created for the business"
        }

        const crmResult = await DbCreateCRM(crm)

        // Check if the CRM was created successfully
        if(!crmResult) {
            return res.status(500).json({ status: "error", message: "An unexpected error occurred" })
        }
        
        // Return the created user
        res.status(201).json({ status: "success", user: result })

    } catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: e.message });
    }
}