import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
    unit: {
        type: Number,
    },
    streetNumber: {
        type: Number,
        required: function() {this.parent() === "TempUser" ? false : true},
    },
    streetName: {
        type: String,
        required: function() {this.parent() === "TempUser" ? false : true},
    },
    city: {
        type: String,
        required: function() {this.parent() === "TempUser" ? false : true},
    },
    state: {
        type: String,
        required: function() {this.parent() === "TempUser" ? false : true},
    },
    postCode: {
        type: Number,
        required: function() {this.parent() === "TempUser" ? false : true},
    },
    country: {
        type: String,
        required: function() {this.parent() === "TempUser" ? false : true},
    }
}, {
    timestamps: true,
    _id: false
    }
)

module.exports = addressSchema