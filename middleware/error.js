const winston = require("winston");

function error(err, req, res, next) {
    // log the exception
    winston.error(err.details[0].message, err);
    //error - warn - info - verbose - debug - silly
    winston.info(err.details[0].message);
    res.status(500).send(`Internal Server Error Something  went wrong!`);
    next();
}

module.exports = error;
// this middleware  will catch any errors that are not caught by other middlewares and handle them accordingly.
