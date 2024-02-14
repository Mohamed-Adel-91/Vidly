const winston = require("winston");
const { format } = winston;
const config = require("config");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
    // Add exception handler
    winston.exceptions.handle(
        new winston.transports.File({
            filename: "uncaughtException.log",
            format: format.combine(format.timestamp(), format.json()),
        }),
        new winston.transports.Console({
            format: winston.format.simple(),
            colorize: true,
            prettyPrint: true,
        })
    );

    // Add rejection handler
    process.on("unhandledRejection", (ex) => {
        throw ex; // Let unhandled promise rejections crash the process
    });

    winston.add(
        new winston.transports.File({
            filename: "logFile.log",
            format: format.combine(format.timestamp(), format.json()),
            handleExceptions: true,
            handleRejections: true,
        })
    );

    const db = config.get("db");

    winston.add(
        new winston.transports.MongoDB({
            db: db,
            level: "info",
            options: { useNewUrlParser: true, useUnifiedTopology: true },
        })
    );
    winston.add(
        new winston.transports.Console({
            format: winston.format.simple(),
            colorize: true,
            prettyPrint: true,
        })
    );
};
