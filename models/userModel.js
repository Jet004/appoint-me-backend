import mongoose from 'mongoose'
import addressSchema from './addressSchema'
import { appointmentSchema } from './appointmentModel'
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

export const DbGetAllUsers = () => mongoose.model('User').find({})

export const DbGetUserByEmail = (email) => mongoose.model('User').findOne({email})

export const DbGetUserByID = (id) => mongoose.model('User').findById(id)

export const DbCreateUser = (user) => mongoose.model('User').create(user)

export const DbUpdateUser = (id, user) => mongoose.model('User').findByIdAndUpdate(id, user)

export const DbDeleteUser = (id) => mongoose.model('User').findByIdAndDelete(id)

// Authentication operations
export const DbRegisterUser = (user) => mongoose.model('User').create(user)