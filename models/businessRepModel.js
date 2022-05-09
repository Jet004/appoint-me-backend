import mongoose from 'mongoose'
import addressSchema from './addressSchema.js'


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

export const DbGetAllReps = () => mongoose.model('BusinessRep').find({})

export const DbGetRepByEmail = (email) => mongoose.model('BusinessRep').findOne({email})

export const DbGetRepByID = (id) => mongoose.model('BusinessRep').findById(id)

export const DbCreateRep = (businessRep) => mongoose.model('BusinessRep').create(businessRep)

export const DbUpdateRep = (id, businessRep) => mongoose.model('BusinessRep').findByIdAndUpdate(id, businessRep)

export const DbDeleteRep = (id) => mongoose.model('BusinessRep').findByIdAndDelete(id)

// Auth operations
export const DbRegisterBusinessRep = (businessRep) => mongoose.model('BusinessRep').create(businessRep)