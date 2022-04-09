import mongoose from 'mongoose'
import addressSchema from './addressSchema'
import CRM from './crmModel'

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
tempUserSchema.post('remove', async function (doc) {
    // Delete CRMs
    await CRM.deleteMany({ user: doc._id })
})

const TempUser = mongoose.model('TempUser', tempUserSchema)

export default TempUser

export const DbGetAllUsers = () => mongoose.model('TempUser').find({})

export const DbGetUserByEmail = (email) => mongoose.model('TempUser').findOne({email})

export const DbGetUserByID = (id) => mongoose.model('TempUser').findById(id)

export const DbCreateUser = (user) => mongoose.model('TempUser').create(user)

export const DbUpdateUser = (id, user) => mongoose.model('TempUser').findByIdAndUpdate(id, user)

export const DbDeleteUser = (id) => mongoose.model('TempUser').findByIdAndDelete(id)