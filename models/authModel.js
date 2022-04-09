import mongoose from "mongoose"

const authSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
})

const Auth = mongoose.model("Auth", authSchema)

export default Auth

export const DbSaveRefreshToken = (refreshToken) => mongoose.model('Auth').create({refreshToken})

export const DbDeleteRefreshToken = (refreshToken) => mongoose.model('Auth').deleteOne({refreshToken})