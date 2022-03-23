const mongoose = require('mongoose')
const addressSchema = require('./addressSchema')
const appointmentSchema = require('./appointmentSchema')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
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
    address: {
        type: addressSchema,
        required: true,
    },
    dob: {
        type: Date,
    },
    appointments: {
        type: [appointmentSchema],
    },
},{
    timestamps: true,
})

const User = mongoose.model('User', userSchema)

module.exports = User