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

export default User

export const DbGetAllUsers = (cb) => mongoose.model('User').find({}, cb)

export const DbGetUserByEmail = (email, cb) => mongoose.model('User').findOne({email}, cb)

export const DbGetUserByID = (id, cb) => mongoose.model('User').findById(id, cb)

export const DbCreateUser = (user, cb) => mongoose.model('User').create(user, cb)

export const DbUpdateUser = (id, user, cb) => mongoose.model('User').findByIdAndUpdate(id, user, cb)

export const DbDeleteUser = (id, cb) => mongoose.model('User').findByIdAndDelete(id, cb)