module.exports = function (err, req, res, next) {
    // log the exception
    console.error(err.message);
    res.status(500).send(`Internal Server Error Something  went wrong!`);
};
