import mongoose from 'mongoose'
import addressSchema from './addressSchema.js'
import CRM from './crmModel.js'

const tempUserSchema = new mongoose.Schema({
    email: {
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

// Manually override "required" status for address schema fields
tempUserSchema.path('address').schema.eachPath((path, schema) => {
    schema.required(false)
})

// Cascade delete CRMs when temp user is deleted
tempUserSchema.pre('deleteOne', async function () {
    // Delete CRMs
    const doc = await this.model.findOne(this.getFilter())
    if(doc) await CRM.deleteOne({ user: doc._id })
})

const TempUser = mongoose.model('TempUser', tempUserSchema)

export default TempUser

export const DbGetAllUsers = () => TempUser.find({})

export const DbGetUserByEmail = (email) => TempUser.findOne({email})

export const DbGetUserByID = (id) => TempUser.findById(id)

export const DbCreateUser = (user) => TempUser.create(user)

export const DbUpdateUser = (id, user) => TempUser.findByIdAndUpdate(id, user)

export const DbDeleteUser = (id) => TempUser.deleteOne({ _id: id })