const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        trim: true,
        default: ""
    },

    image: {
        type: String,
        trim: true,
        default: ""
    },

    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
},
{
    timestamps: true
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;