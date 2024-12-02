const { ERROR_CODES } = require('./errors');

const handleError = (err, res) => {
  console.error(err); 

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(ERROR_CODES.BAD_REQUEST).json({ message: err.message });
    } 
  if (err.name === 'DocumentNotFoundError') {
      return res.status(ERROR_CODES.NOT_FOUND).json({ message: err.message });
    }

  return res.status(ERROR_CODES.SERVER_ERROR).json({ message: err.message });
};

module.exports = handleError;