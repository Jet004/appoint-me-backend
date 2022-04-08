const mongoose  = require('mongoose')

export const appointmentSchema = new mongoose.Schema({
    crm: {
        type: String,
        ref: "CRM",
        required: true,
    },
    service: {
        type: String,
        ref: "Service",
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
        enum: ["paid", "unpaid", "partially paid"],
        required: true,
        default: "unpaid"
    },
    // payments: [ // Not yet implemented
    //     new Schema({
    //         paymentDate: {
    //             type: Date,
    //             required: true,
    //         },
    //         paymentAmount: {
    //             type: Number,
    //             required: true,
    //         },
    //         paymentMethod: {
    //             type: String,
    //             enum: ["Cash", "Card", "Cheque"],
    //             required: true,
    //         },
    //         paymentNotes: {
    //             type: String,
    //             required: true,
    //         }
    //     })
            
    // ],
    details: {
        type: String,
    },
}, {
    timestamps: true,
})

const Appointment = mongoose.model("Appointment", appointmentSchema)

export const DbCreateAppointment = async (appointment) => Appointment.create(appointment)

export const DbGetAppointmentById = async (appointmentId) => Appointment.findById(appointmentId)

export const DbGetAppointmentsByCRMId = async (crmId) => Appointment.find({ crmId: crmId })

export const DbUpdateAppointment = async (appointmentId, appointment) => Appointment.findByIdAndUpdate(appointmentId, appointment)

export const DbDeleteAppointment = async (appointmentId) => Appointment.findByIdAndDelete(appointmentId)