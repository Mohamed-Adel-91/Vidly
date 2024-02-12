const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
    const db = config.get("db");
    // connecting mongodb
    mongoose
        .connect(db)
        .then(() => winston.info(`Connecting to the Database: ${db} ....!!`));
};
