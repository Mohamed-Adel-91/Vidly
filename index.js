// import modules
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const home = require("./routes/home");
const genres = require("./routes/genres");
const costumers = require("./routes/customers");
const movies = require("./routes/movies");
const rental = require("./routes/rentals");

// connecting mongodb
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost/vidly")
    .then(() => console.log("Connecting to the Database ...!!"))
    .catch((err) => console.log(err));

//use modules
app.use(express.json());
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", costumers);
app.use("/api/movies", movies);
app.use("/api/rentals", rental);

//** App Listening Port */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app Loading on Port ${port} ...!`));
