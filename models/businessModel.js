import mongoose from "mongoose";
import addressSchema from "./addressSchema";
import { appointmentSchema } from "./appointmentModel";
import serviceSchema from "./serviceSchema"

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
    operatingHours: [
        new mongoose.Schema({
            day: {
                type: String,
                required: true,
            },
            startTime: {
                type: String, // String of 4 numbers representing 24hr time
                required: true,
                default: "0900"
            },
            endTime: {
                type: String, // String of 4 numbers representing 24hr time
                required: true,
                default: "1700",
            },
        },{ _id: false })
    ],
    services: [serviceSchema],
    appointments: {
        type: [appointmentSchema],
    },
}, {
    timestamps: true,
})


const Business = mongoose.model("Business", BusinessSchema)

export default Business



// Define queries for interacting with this model

// Not implemented yet
// export const DbGetAllBusinesses = (cb) => mongoose.model('User').find({}, cb)

export const DbGetBusinessByABN = (abn, cb) => mongoose.model('Business').findOne({abn: abn}, cb)

export const DbGetBusinessByID = (id, cb) => mongoose.model('Business').findById(id, cb)

// Not implemented yet
// export const DbCreateBusiness = (business, cb) => mongoose.model('Business').create(business, cb)

export const DbUpdateBusiness = (abn, business, cb) => mongoose.model('Business').findOneAndUpdate({abn: abn}, business, cb)

// Not implemented yet
// export const DbDeleteBusiness = (id, cb) => mongoose.model('Business').findByIdAndDelete(id, cb)


// CRUD functions for services subdocument
export const DbGetBusinessServiceById = async (abn, serviceId, cb) => {
    const business = await mongoose.model("Business").findOne({abn: abn}, cb)
    // Return null if no business found with the given ABN
    if(!business) return null
    // Returns service OR null if no service found with the given ID
    return await business.services.id(serviceId)
}

export const DbCreateBusinessService = async (business, service, cb) => {

    await business.services.push(service)

    return await business.save()
}

export const DbUpdateBusinessService = async (abn, serviceId, service) => {
    const business = await mongoose.model("Business").findOne({abn: abn})
    // Return null if no business found with the given ABN
    if(!business) return null
    // Returns service OR null if no service found with the given ID
    const serviceToUpdate = await business.services.id(serviceId)
    // Return null if no service found with the given ID
    if(!serviceToUpdate) return null
    // Update service
    await serviceToUpdate.set(service)
    // Save business
    return await business.save()
}

export const DbDeleteBusinessService = async (abn, serviceId) => {
    const business = await mongoose.model("Business").findOne({abn: abn})
    // Return null if no business found with the given ABN
    if(!business) return null
    // Returns service OR null if no service found with the given ID
    const serviceToDelete = await business.services.id(serviceId)
    // Return null if no service found with the given ID
    if(!serviceToDelete) return null
    // Delete service
    await business.services.id(serviceId).remove()
    // Save business
    return await business.save()
}