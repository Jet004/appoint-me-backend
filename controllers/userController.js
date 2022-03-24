import User from '../models/userModel'


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        users.length > 0 
            ? res.status(200).json({ status: "success", user: users })
            : res.status(404).json({ status: "not found", user: [] });
    } catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message });
    }
    // User.find({})
    //     .then(results => {
    //         if(results.length > 0) {
    //             res.status(200).json({ status: "success", user: results })
    //         } else {
    //             res.status(200).json({ status: "success", user: [] });
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.status(500).json({ status: "error", message: "Query Error" })
    //     })
}

export const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
        user ? res.status(200).json({ status: "success", user: user })
            : res.status(404).json({ status: "not found", user: [] })
    } catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message });
    }
//    User.find({email: req.params.email})
//         .then(results => {
//             if(results.length > 0) {
//                 res.status(200).json({ status: "success", user: results })
//             } else {
//                 res.status(200).json({ status: "success", user: [] })
//             } 
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(500).json({ status: "error", message: "Query Error" })
//         })
}

export const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body)
        const result = await newUser.save()
        result ? res.status(200).json({ status: "success", user: result })
            : res.status(500).json({ status: "error", message: "User not created" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message });
    }
    // const newUser = new User(req.body);
    // newUser.save()
    //     .then(results => {
    //         console.log(results._id)
    //         if(results instanceof User) {
    //             res.status(201).json({ status: "success", user: results })
    //         } else {
    //             res.status(500).json({ status: "error", message: "An unexpected error occurred" })
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.status(500).json({ status: "error", error: err })
    //     })
}

export const updateUser = (req, res) => {

}

export const deleteUser = (req, res) => {

}