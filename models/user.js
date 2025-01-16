const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        minlength: 2, 
        maxlength: 30
    }, 
    avatar: {
        type: String,
        required: [true, "The avatar field is required."], 
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "You must enter a valid URL",
        },
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    }
});

userSchema.statics.findUserByCredentials = function findUserByCredentials (email, password) {
    return this.findOne({ email })
        .select("+password")
        .then((user) => {
            if (!user) {
                throw new UnauthorizedError("Incorrect email or password");
            }

            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        throw new UnauthorizedError("Incorrect email or password");
                    }

                    return user;
                });
        });
};

module.exports = mongoose.model("user", userSchema);