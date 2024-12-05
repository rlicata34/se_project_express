const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const handleError = require("../utils/errorHandler");
const { JWT_SECRET } = require("../utils/config");


const createUser = (req, res) => {
    const { name, avatar, email, password } = req.body;
    
    User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                throw Promise.reject(new Error("An existing user with that email already exists."));
            }
            return bcrypt.hash(password, 10);
        })
        .then((hash) =>
            User.create({ name, avatar, email, password: hash })
        )
        .then((user) =>
          res.status(201).send({
              id: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
        })
        )
        .catch((err) => handleError(err, res));
};


// Add new error code and message to utils
const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password);
    })
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
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

// Add new error code and message to utils
const getCurrentUser = (req, res) => {
    const { userId } = req.user._id;

    User.findById(userId)
        .orFail()
        .then((user) => res.send(user))
        .catch((err) => handleError(err, res));
};


// Add new error code and message to utils
const updateProfile = (req, res) => {
    const { userId } = req.user._id;
    const { name, avatar } = req.body;

    User.findByIdAndUpdate(
        { userId }, 
        { name, avatar },
        {
            new: true,
            runValidators: true
        }
    )
        .orFail()
        .then((user) => res.send(user))
        .catch((err) => handleError(err, res));
}
 
module.exports = { 
    createUser, 
    getCurrentUser, 
    login, 
    updateProfile 
};