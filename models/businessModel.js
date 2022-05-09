import mongoose from "mongoose"
import addressSchema from "./addressSchema.js"
import { appointmentSchema } from "./appointmentModel.js"
import serviceSchema from "./serviceSchema.js"
import BusinessSettingsSchema from "./businessSettingsSchema.js"

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
    settings: {
        type: BusinessSettingsSchema,
    },
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
// export const DbGetAllBusinesses = () => mongoose.model('User').find({})

export const DbGetBusinessByID = (id) => mongoose.model('Business').findById(id)

// This query returns a single business using the businessRep's id
export const DbGetAssociatedBusiness = (repId) => Business.findOne({ businessRep: repId })

// Not implemented yet
// export const DbCreateBusiness = (business) => mongoose.model('Business').create(business)

export const DbUpdateBusiness = (businessId, business) => mongoose.model('Business').findOneAndUpdate({_id: businessId}, business)

// Not implemented yet
// export const DbDeleteBusiness = (id) => mongoose.model('Business').findByIdAndDelete(id)


// CRUD functions for services subdocument
export const DbGetBusinessServiceById = async (businessId, serviceId) => {
    const business = await mongoose.model("Business").findOne({_id: businessId})
    // Return null if no business found with the given ABN
    if(!business) return null
    // Returns service OR null if no service found with the given ID
    return await business.services.id(serviceId)
}

export const DbCreateBusinessService = async (business, service) => {

    await business.services.push(service)

    return await business.save()
}

export const DbUpdateBusinessService = async (businessId, serviceId, service) => {
    const business = await mongoose.model("Business").findOne({_id: businessId})
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

export const DbDeleteBusinessService = async (businessId, serviceId) => {
    const business = await mongoose.model("Business").findOne({_Id: businessId})
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