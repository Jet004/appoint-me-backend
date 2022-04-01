import bcrypt from 'bcrypt';

export const registerUser = (DbRegisterUser, DbRegisterBusinessRep) => async (req, res) => {
    // This controller can register both a normal user and a businessRep user via the userType parameter
    try {
        // Hash user password
        if(req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 6)

        // Check if userType is valid and call the appropriate model method
        let results
        if(req.params.userType === 'user') {
            results = await DbRegisterUser(req.body)
        } else if(req.params.userType === 'businessRep') {
            results = await DbRegisterBusinessRep(req.body)
        } else {
            return res.status(400).json({ status: "error", message: "Something went wrong..." })
        }

        if(results) {
            res.status(200).json({ status: "success", message: "User successfully registered" })
        } else {
            res.status(400).json({ status: "error", message: "Something went wrong..." })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const loginUser = (DbGetUserByEmail, DbGetRepByEmail, SignJWT) => async (req, res) => {
    // This controller can log in both a normal user and a businessRep user via the userType parameter
    try {
        // Check if userType is valid and check user credentials
        let results
        if(req.params.userType === 'user') {
            results = await DbGetUserByEmail(req.body.email)
        } else if(req.params.userType === 'businessRep') {
            results = await DbGetRepByEmail(req.body.email)
        } else {
            return res.status(400).json({ status: "error", message: "Something went wrong..." })
        }
        
        // Check if username and password are correct
        if(!results || !bcrypt.compareSync(req.body.password, results.password)) {
            // return res.status(400).json({ status: "error", message: "Invalid credentials" })
        }

        // Generate access and refresh tokens


        return results

    } catch(e) {
        console.log(e)
        // res.status(500).json({ status: "error", message: e.message })
    }

}