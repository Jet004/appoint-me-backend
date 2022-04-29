import mongoose from "mongoose"

const BusinessSettingsSchema = new mongoose.Schema({
    appointmentTimeSlot: {
        type: Number,
        required: true,
        default: 30,
    }
}, { timestamps: true, _id: false })

export default BusinessSettingsSchema