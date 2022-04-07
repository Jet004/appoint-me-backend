import mongoose from "mongoose"
import appointmentSchema from "./appointmentSchema"

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
    apopintments: {
            type: [appointmentSchema],
            ref: "Appointment",
    },
    allowAccess: {
        type: Boolean,
        required: true,
        default: false
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true
})

const CRM = mongoose.model("CRM", crmSchema)

export default CRM

// Define CRM CRUD operations

export const DbCreateCRM = async (crm) => CRM.create(crm)

export const DbGetCRMById = async (crmId) => CRM.findById(crmId)

export const DbGetCRMByMatch = async (businessId, userId) => CRM.findOne({business: businessId, user: userId})

export const DbGetCRMsByABN = async (abn) => CRM.find({ businessId: abn })

export const DbGetCRMsByUserId = async (userId) => CRM.find({ userId: userId })

export const DbUpdateCRM = async (crm) => CRM.findByIdAndUpdate(crm._id, crm)

export const DbDeleteCRM = async (crmId) => CRM.findByIdAndDelete(crmId)