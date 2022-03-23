const mongoose  = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    crmId: {
        type: String,
        required: true,
    },
    serviceId: {
        type: String,
        required: true,
    },
    appointmentTime: {
        type: Date,
        required: true,
    },
    appointmentEnd: {
        type: Date,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    feeDue: {
        type: Date,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    },
}, {
    timestamps: true,
})

module.exports = appointmentSchema