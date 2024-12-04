const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: "Authorization Required" });
  }

  req.user = payload; // assigning the payload to the request object

  next(); // sending the request to the next middleware
};

module.exports = { auth };