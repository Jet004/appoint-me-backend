import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
    unit: {
        type: Number,
    },
    streetNumber: {
        type: Number,
        required: true,
    },
    streetName: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postCode: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    _id: false
    }
)

export default addressSchema