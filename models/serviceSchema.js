import mongoose from "mongoose"

const serviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    bookingTimes: {},
    break: { // Minutes between bookings
        type: Number, 
        required: true,
        default: 0
    },
    fee: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

export default serviceSchema