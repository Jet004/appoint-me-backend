

export const getAllUsers = (DbGetAllUsers) => async (req, res) => {
    try {
        const users = await DbGetAllUsers()
        users ? res.status(200).json({ status: "success", user: users })
            : res.status(500).json({ status: "error", message: "An unexpected error occurred" })
    } catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const getUserByEmail = (DbGetUserByEmail) => async (req, res) => {
    try {
        const user = await DbGetUserByEmail(req.params.email)
        user ? res.status(200).json({ status: "success", user: user })
            : res.status(404).json({ status: "not found", user: [] })
    } catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const createUser = (DbCreateUser) => async (req, res) => {
    try {
        const result = await DbCreateUser(req.body)
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
        console.log(result)
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