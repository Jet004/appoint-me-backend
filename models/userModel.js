import mongoose from 'mongoose'
import addressSchema from './addressSchema'
import appointmentSchema from './appointmentSchema'
import CRM from './crmModel'


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
        required: true,
    },
    appointments: {
        type: [appointmentSchema],
    },
},{
    timestamps: true,
})

// Cascade delete CRMs when user is deleted
userSchema.post('remove', async function (doc) {
    // Delete CRMs
    await CRM.deleteMany({ user: doc._id })
})

const User = mongoose.model('User', userSchema)

export default User

export const DbGetAllUsers = (cb) => mongoose.model('User').find({}, cb)

export const DbGetUserByEmail = (email, cb) => mongoose.model('User').findOne({email}, cb)

export const DbGetUserByID = (id, cb) => mongoose.model('User').findById(id, cb)

export const DbCreateUser = (user, cb) => mongoose.model('User').create(user, cb)

export const DbUpdateUser = (id, user, cb) => mongoose.model('User').findByIdAndUpdate(id, user, cb)

export const DbDeleteUser = (id, cb) => mongoose.model('User').findByIdAndDelete(id, cb)

// Authentication operations
export const DbRegisterUser = (user, cb) => mongoose.model('User').create(user, cb)