const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    orderCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    receiverName: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "VNPAY"],
        default: "COD"
    },

    paymentStatus: {
        type: String,
        enum: ["UNPAID", "PAID"],
        default: "UNPAID"
    },

    orderStatus: {
        type: String,
        enum: [
            "PENDING",
            "CONFIRMED",
            "SHIPPING",
            "COMPLETED",
            "CANCELLED"
        ],
        default: "PENDING"
    }
},
{
    timestamps: true
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;