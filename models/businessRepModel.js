import mongoose from 'mongoose'
import addressSchema from './addressSchema'


const businessRepSchema = new mongoose.Schema({
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
},{
    timestamps: true,
})

const BusinessRep = mongoose.model('BusinessRep', businessRepSchema)

export default BusinessRep

export const DbGetAllReps = (cb) => mongoose.model('BusinessRep').find({}, cb)

export const DbGetRepByEmail = (email, cb) => mongoose.model('BusinessRep').findOne({email}, cb)

export const DbGetRepByID = (id, cb) => mongoose.model('BusinessRep').findById(id, cb)

export const DbCreateRep = (businessRep, cb) => mongoose.model('BusinessRep').create(businessRep, cb)

export const DbUpdateRep = (id, businessRep, cb) => mongoose.model('BusinessRep').findByIdAndUpdate(id, businessRep, cb)

export const DbDeleteRep = (id, cb) => mongoose.model('BusinessRep').findByIdAndDelete(id, cb)

// Auth operations
export const DbRegisterBusinessRep = (businessRep, cb) => mongoose.model('BusinessRep').create(businessRep, cb)