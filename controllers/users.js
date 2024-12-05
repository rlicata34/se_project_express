const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERROR_CODES, handleError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");


const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "The email and password fields are required" })
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("A user with this email already exists");
        error.statusCode = ERROR_CODES.CONFLICT;
        throw error;
      }
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => {
      return User.create({
        name,
        avatar,
        email,
        password: hash
      })
    })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => handleError(err, res));
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
    })
    .then((user) => bcrypt.compare({password}, user.password))
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return res.send({ message: "Everything good!" });
    })
    .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.send({ token });
    })
    .catch((err) => handleError(err, res));
};

const getCurrentUser = (req, res) => {
    const userId = req.user._id;

    User.findById(userId)
        .orFail()
        .then((user) => {
          const { _id, email, avatar, name } = user;
          res.send({
            _id,
            email,
            avatar,
            name
          });
        })
        .catch((err) => handleError(err, res));
};


// Add new error code and message to utils
const updateProfile = (req, res) => {
    const userId = req.user._id;
    const { name, avatar } = req.body;

    User.findByIdAndUpdate(
        userId, 
        { name, avatar },
        {
            new: true,
            runValidators: true
        }
    )
        .orFail()
        .then((user) => res.send({ name: user.name, avatar: user.avatar }))
        .catch((err) => handleError(err, res));
}
 
module.exports = { 
    createUser, 
    getCurrentUser, 
    login, 
    updateProfile 
};