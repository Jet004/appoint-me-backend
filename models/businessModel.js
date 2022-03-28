import mongoose from "mongoose";
import addressSchema from "./addressSchema";
import appointmentSchema from "./appointmentSchema";

const BusinessSchema = new mongoose.Schema({
    abn: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: addressSchema,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    businessRep: { // Business Rep ID
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessRep",
        required: true,
    },
    appointments: {
        type: [appointmentSchema],
    },
}, {
    timestamps: true,
})

const Business = mongoose.model("Business", BusinessSchema)

export default Business

// Not implemented yet
// export const DbGetAllBusinesses = (cb) => mongoose.model('User').find({}, cb)

export const DbGetBusinessByABN = (abn, cb) => mongoose.model('Business').findOne({abn: abn}, cb)

export const DbGetBusinessByID = (id, cb) => mongoose.model('Business').findById(id, cb)

// Not implemented yet
// export const DbCreateBusiness = (business, cb) => mongoose.model('Business').create(business, cb)

export const DbUpdateBusiness = (abn, business, cb) => mongoose.model('Business').findByIdAndUpdate(abn, business, cb)

// Not implemented yet
// export const DbDeleteBusiness = (id, cb) => mongoose.model('Business').findByIdAndDelete(id, cb)