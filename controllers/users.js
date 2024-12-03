const User = require("../models/user");
const handleError = require('../utils/errorHandler');

const getUsers = (req, res) => {
    User.find({})
        .then((users) => res.send(users))
        .catch((err) => handleError(err, res));
};

const createUser = (req, res) => {
    const { name, avatar } = req.body;
    
    User.create({ name, avatar })
        .then((user) => res.status(201).send(user))
        .catch((err) => handleError(err, res));
};

const getUser = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .orFail()
        .then((user) => res.send(user))
        .catch((err) => handleError(err, res));
}
 
module.exports = { getUsers, createUser, getUser };