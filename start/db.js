// const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = async function () {
    const db = config.get("db");
    // connecting mongodb
    await mongoose
        .connect(db)
        .then(console.log(`connecting to the database : ${db}`));
};
