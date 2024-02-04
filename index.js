// import modules
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const { format } = require("winston");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const home = require("./routes/home.router");
const genres = require("./routes/genres.router");
const costumers = require("./routes/customers.router");
const movies = require("./routes/movies.router");
const rental = require("./routes/rentals.router");
const users = require("./routes/users.router");
const login = require("./routes/auth/login");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const errorHandler = require("./middleware/error");

winston.add(
    new winston.transports.File({
        filename: "logFile.log",
        format: format.combine(format.timestamp(), format.json()),
    })
);
winston.add(
    new winston.transports.MongoDB({
        db: "mongodb://localhost/vidly",
        level: "info",
        options: { useNewUrlParser: true, useUnifiedTopology: true },
    })
);

if (!config.get("jwtPrivetKey")) {
    console.error("FATAL ERROR : jwtPrivateKey is not defined.");
    process.exit(1);
}

// connecting mongodb
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost/vidly")
    .then(() => console.log("Connecting to the Database ...!!"))
    .catch((err) => console.log(err.message));

//use modules
app.use(express.json());
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", costumers);
app.use("/api/movies", movies);
app.use("/api/rentals", rental);
app.use("/api/users", users);
app.use("/api/users/login", login);
app.use(errorHandler);

//** App Listening Port */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app Loading on Port ${port} ...!`));
