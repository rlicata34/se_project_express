const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.send({ message: err.message });

    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
        message: statusCode === 500 ? "An error occurred on the server" : message,
    });
};

module.exports = errorHandler;