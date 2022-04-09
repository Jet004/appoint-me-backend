import mongoose from "mongoose"

const requestLogSchema = new mongoose.Schema({
    clientIP: {
        type: String,
        required: true,
    },
    requestMethod: {
        type: String,
        required: true,
    },
    requestPath: {
        type: String,
        required: true,
    },
    requestTime: {
        type: Date,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    sessionID: {
        type: String
    },
    userId: {
        type: String
    },
    userType: {
        type: String
    },
}, {
    timestamps: true,
})

const RequestLog = mongoose.model("RequestLog", requestLogSchema)

export default RequestLog

// Model ODM methods
export const createRequestLog = (logData) => RequestLog.create(logData)