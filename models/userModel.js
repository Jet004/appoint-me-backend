import mongoose from 'mongoose'
import addressSchema from './addressSchema.js'
import { appointmentSchema } from './appointmentModel.js'
import CRM from './crmModel.js'


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
userSchema.pre('deleteOne', async function () {
    // Delete CRMs
    const doc = await this.model.findOne(this.getFilter())
    if(doc) await CRM.deleteOne({ user: doc._id })
})

const User = mongoose.model('User', userSchema)

export default User

export const DbGetAllUsers = () => User.find({}).exclude("password")

export const DbGetUserByEmail = (email) => User.findOne({email})

export const DbGetUserByID = (id) => User.findById(id)

export const DbCreateUser = (user) => User.create(user)

export const DbUpdateUser = (id, user) => User.findByIdAndUpdate(id, user)

export const DbDeleteUser = (id) => User.deleteOne({ _id: id })

// Authentication operations
export const DbRegisterUser = (user) => User.create(user)