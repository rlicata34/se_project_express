const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

const handleError = (err, res) => {
  console.error(err); 

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid request: One or more fields contain invalid data." });
  } 
  if (err.name === 'DocumentNotFoundError') {
    return res
      .status(ERROR_CODES.NOT_FOUND)
      .send({ message: "The server cannot find the requested resource." });
  }
  if (err.message === "Incorrect email or password") {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: "Incorrect email or password" })
  }
  if (err.message === "A user with this email already exists") {
    return res
      .status(ERROR_CODES.CONFLICT)
      .send({ message: "Email is already in use" })
  }
  if (err.message === "You do not have permission to delete this item") {
    return res
      .status(ERROR_CODES.FORBIDDEN)
      .send({ message: "You do not have permission to delete this item" })
  }

  return res
    .status(ERROR_CODES.SERVER_ERROR)
    .send({ message: "An error has occurred on the server." });
};


module.exports = { ERROR_CODES, handleError };

