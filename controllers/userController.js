const User = require('../models/userModel')


module.exports.getAllUsers = (req, res) => {
    User.find({})
        .then(results => {
            if(results.length > 0) {
                res.status(200).json({ status: "success", user: results })
            } else {
                res.status(200).json({ status: "success", user: [] });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: "error", message: "Query Error" })
        })
}

module.exports.getUserByEmail = (req, res) => {
   User.find({email: req.params.email})
        .then(results => {
            if(results.length > 0) {
                res.status(200).json({ status: "success", user: results })
            } else {
                res.status(200).json({ status: "success", user: [] })
            } 
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: "error", message: "Query Error" })
        })
}

module.exports.createUser = (req, res) => {
    const newUser = new User(req.body);
    newUser.save()
        .then(results => {
            console.log(results._id)
            if(results instanceof User) {
                res.status(201).json({ status: "success", user: results })
            } else {
                res.status(500).json({ status: "error", message: "An unexpected error occurred" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: "error", error: err })
        })
}

module.exports.updateUser = (req, res) => {

}

module.exports.deleteUser = (req, res) => {

}