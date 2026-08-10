const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
     username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },

    fullName: {
        type: String,
        required: false,
        trim: true
    },

    phone: {
        type: String,
        trim: true,
        default: ""
    },

    address: {
        type: String,
        trim: true,
        default: ""
    },

    avatar: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED"],
        default: "ACTIVE"
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationCodeHash:{
        type: String,
        default: ""
    },

    verificationCodeExpire: {
        type: Date,
        default: null
    },
    resetPasswordCodeHash: {
        type: String,
        default: ""
    },
    resetPasswordCodeExpire: {
        type: Date,
        default: null
    }

},

{
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

module.exports = User;