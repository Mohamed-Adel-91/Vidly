const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

// connecting mongodb
module.exports = async function () {
    const db = config.get("db");

    mongoose.connect(db);
    // .then(() => winston.info(`Connecting to the Database: ${db} ....!!`));

    const connection = mongoose.connection;

    connection.on("connected", () => {
        winston.info(`Connected to the Database: ${db}`);
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
