const winston = require("winston");

module.exports = function (err, req, res, next) {
    // log the exception
    winston.error(err.message, err);
    //error - warn - info - verbose - debug - silly
    console.log(err.message);
    res.status(500).send(`Internal Server Error Something  went wrong!`);
};

// this middleware  will catch any errors that are not caught by other middlewares and handle them accordingly.
