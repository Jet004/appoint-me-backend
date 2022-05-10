import mongoose from "mongoose"

const ipWhitelistSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    businessRep: {
        type: mongoose.Types.ObjectId,
        ref: "BusinessRep",
        required: true
    }
}, {timestamps: true})

const IpWhitelist = mongoose.model("IpWhitelist", ipWhitelistSchema)

export const DbRegisterIP = (ip, userId) => IpWhitelist.create({ip: ip, businessRep: userId})

export const DbGetUserIP = (userId) => IpWhitelist.findOne({businessRep: userId}, "ip")