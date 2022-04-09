import mongoose from "mongoose"
import { appointmentSchema } from "./appointmentModel"

const crmSchema = new mongoose.Schema({
    userModel: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: doc => doc.userModel,
        required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    tempFlag: {
        type: Boolean,
        required: true
    },
    allowAccess: {
        type: Boolean,
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

crmSchema.virtual("appointments", {
    ref: "Appointment",
    localField: "_id",
    foreignField: "crm"
})

crmSchema.post('remove', async function (doc) {
    // Delete Appointments
    await appointmentSchema.deleteMany({ crm: doc._id })
})

const CRM = mongoose.model("CRM", crmSchema)

export default CRM

// Define CRM operations

export const DbCreateCRM = (crm) => CRM.create(crm)

export const DbGetCRMById = (crmId) => CRM.findById(crmId)

export const DbGetCRMByMatch = (businessId, userId) => CRM.findOne({business: businessId, user: userId})

export const DbGetCRMsByABN = (abn) => CRM.find({ businessId: abn })

export const DbGetCRMsByUserId = (userId) => CRM.find({ user: userId })

export const DbUpdateCRM = (crm) => CRM.findByIdAndUpdate(crm._id, crm)

export const DbDeleteCRM = (crmId) => CRM.findByIdAndDelete(crmId)

// Although the primary purpose of the following queries are to return all appointments,
// they are included here as they are reliant on the CRM model
export const DbGetAppointmentsByUserId = (userId) => CRM.find({ user: userId }).populate("appointments")

export const DbGetAppointmentsByBusinessId = (businessId) => CRM.find({ business: businessId }).populate("appointments")