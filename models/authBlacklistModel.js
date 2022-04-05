import mongoose from "mongoose"

const tokenBlacklistSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema)

export default TokenBlacklist

// Model methods
export const DbAddTokenToBlacklist = (token, cb) => mongoose.model("TokenBlacklist").create({ accessToken: token }, cb)

export const DbIsTokenBlacklisted = (token, cb) => mongoose.model("TokenBlacklist").findOne({ accessToken: token }, cb)

export const DbDeleteExpiredTokens = (cb) => mongoose.model("TokenBlacklist").deleteMany({ createdAt: { $lt: Date.now() - (2 * 60 * 60 * 1000) } }, cb)// 2 hours