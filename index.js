const winston = require("winston");
const express = require("express");
const app = express();

require("./start/logging")();
require("./start/routes")(app);
require("./start/db")();
require("./start/config")();
require("./start/validation")();
require("./start/production")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
    winston.info(`app Loading on Port ${port} ...!`)
);

module.exports = server;
