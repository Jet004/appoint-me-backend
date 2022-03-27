import mongoose from "mongoose";
import addressSchema from "./addressSchema";
import appointmentSchema from "./appointmentSchema";

const Business = new mongoose.Schema({
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