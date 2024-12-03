const { ERROR_CODES } = require('./errors');

const handleError = (err, res) => {
  console.error(err); 

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(ERROR_CODES.BAD_REQUEST).json({ message: "Invalid request: One or more fields contain invalid data. Please check your input and try again." });
    } 
  if (err.name === 'DocumentNotFoundError') {
      return res.status(ERROR_CODES.NOT_FOUND).json({ message: "The server cannot find the requested resource." });
    }

  return res.status(ERROR_CODES.SERVER_ERROR).json({ message: "An error has occurred on the server." });
};

module.exports = handleError;