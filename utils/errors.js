const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  BAD_REQUEST: 'Invalid data or invalid Id.',
  NOT_FOUND: 'Requested resource not found.',
  SERVER_ERROR: 'An error has occurred on the server.',
};

module.exports = { ERROR_CODES,ERROR_MESSAGES };