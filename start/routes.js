const errorHandler = require("../middleware/error");
const home = require("../routes/home.router");
const genres = require("../routes/genres.router");
const costumers = require("../routes/customers.router");
const movies = require("../routes/movies.router");
const rental = require("../routes/rentals.router");
const users = require("../routes/users.router");
const login = require("../routes/auth/login");
const express = require("express");

module.exports = function (app) {
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
};
