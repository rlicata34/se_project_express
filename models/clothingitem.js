const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Name is required"], 
        minlength: 2, 
        maxlength: 30
    }, 
    weather: {
        type: String,
        required: [true, "Weather type is required"],
        enum: {
            values: ["hot", "warm", "cold"],
            message: "Weather must be one of the following: hot, warm, or cold",
        },
    },
    imageUrl: {
        type: String,
        required: [true, "The image URL field is required."],
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "You must enter a valid URL",
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Owner is required"],
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("item", clothingItemSchema);