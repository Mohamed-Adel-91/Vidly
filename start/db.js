const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
    // connecting mongodb
    mongoose
        .connect(process.env.MONGODB_URI || "mongodb://localhost/vidly")
        .then(() => winston.info("Connecting to the Database ....!!"));
};
