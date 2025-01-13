const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { 
  BadRequestError,
  ConflictError
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");


const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("The email and password fields are required");
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("A user with this email already exists");
      }
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(() => {
      res.status(201).send({email, name, avatar});
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError("Invalid request: One or more fields contain invalid data."))
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("The email and password fields are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: "7d" }
      )
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError("Invalid request: One or more fields contain invalid data."))
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
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
      .catch(next);
};

const updateProfile = (req, res, next) => {
    const userId = req?.user?._id;
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
        .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError("Invalid request: One or more fields contain invalid data."))
      } else {
        next(err);
      }
    });
}
 
module.exports = { 
    createUser, 
    getCurrentUser, 
    login, 
    updateProfile 
};