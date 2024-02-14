const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
    const db = config.get("db");
    // connecting mongodb
    mongoose.connect(db);
    // .then(() => winston.info(`Connecting to the Database: ${db} ....!!`));
    const connection = mongoose.connection;

    connection.on("connected", () => {
        winston.info(`Connected to MongoDB: ${db}`);
    });

    connection.on("error", (err) => {
        winston.error(`MongoDB Connection Error: ${err.message}`);
    });

    connection.on("disconnected", () => {
        winston.warn("MongoDB Disconnected");
    });

    process.on("SIGINT", () => {
        connection.close(() => {
            winston.info(
                "MongoDB Connection Closed due to process termination"
            );
            process.exit(0);
        });
    });
};
