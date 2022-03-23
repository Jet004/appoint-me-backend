const mongoose = require('mongoose')
const addressSchema = require('./addressSchema')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: addressSchema,
    dob: {
        type: Date,
    },
    appointments: [{}]
},{
    timestamps: true,
})

const User = mongoose.model('User', userSchema)

export default User