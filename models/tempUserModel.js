import mongoose from 'mongoose'
import addressSchema from './addressSchema'
import { hashSync } from 'bcrypt'

const tempUserSchema = new mongoose.Schema({
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
    address: {
        type: addressSchema,
    },
    dob: {
        type: Date,
    },
},{
    timestamps: true,
})

const TempUser = mongoose.model('TempUser', tempUserSchema)

export default TempUser

export const DbGetAllUsers = (cb) => mongoose.model('TempUser').find({}, cb)

export const DbGetUserByEmail = (email, cb) => mongoose.model('TempUser').findOne({email}, cb)

export const DbGetUserByID = (id, cb) => mongoose.model('TempUser').findById(id, cb)

export const DbCreateUser = (user, cb) => mongoose.model('TempUser').create(user, cb)

export const DbUpdateUser = (id, user, cb) => mongoose.model('TempUser').findByIdAndUpdate(id, user, cb)

export const DbDeleteUser = (id, cb) => mongoose.model('TempUser').findByIdAndDelete(id, cb)