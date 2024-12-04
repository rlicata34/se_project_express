const bcrypt = require("bcryptjs");
const User = require("../models/user");
const handleError = require('../utils/errorHandler');

const getUsers = (req, res) => {
    User.find({})
        .then((users) => res.send(users))
        .catch((err) => handleError(err, res));
};

const createUser = (req, res) => {
    const { name, avatar, email, password } = req.body;
    
    // Check if email already exists
    User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                // Throw an error if email exists
                const error = new Error("Email is already in use.");
                error.statusCode = 409; // HTTP 409 Conflict
                throw error;
            }
            // Hash the password
            return bcrypt.hash(password, 10);
        })
        .then((hash) =>
            // Create the user in the database
            User.create({ name, avatar, email, password: hash })
        )
        .then((user) =>
        // Send the created user as a response
        res.status(201).send({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        })
        )
        .catch((err) => {
            // Handle MongoDB duplicate key error
            if (err.code === 11000) {
                err.message = "Email already exists.";
                err.statusCode = 409;
            }
            // Use custom error handler
            handleError(err, res);
        });
};

const getUser = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .orFail()
        .then((user) => res.send(user))
        .catch((err) => handleError(err, res));
}
 
module.exports = { getUsers, createUser, getUser };