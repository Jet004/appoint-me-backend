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
export const DbAddTokenToBlacklist = (token) => mongoose.model("TokenBlacklist").create({ accessToken: token })

export const DbIsTokenBlacklisted = (token) => mongoose.model("TokenBlacklist").findOne({ accessToken: token })

export const DbDeleteExpiredTokens = () => mongoose.model("TokenBlacklist").deleteMany({ createdAt: { $lt: Date.now() - (2 * 60 * 60 * 1000) } })// 2 hours