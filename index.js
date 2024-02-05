const winston = require("winston");
const express = require("express");
const app = express();

require("./start/logging")();
require("./start/routes")(app);
require("./start/db")();
require("./start/config")();
require("./start/validation")();

//** App Listening Port */
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`app Loading on Port ${port} ...!`));
