// import modules
const express = require("express");
const app = express();
const home = require("./routes/home");
const genres = require("./routes/genres");

//use modules
app.use(express.json());
app.use("/", home);
app.use("/api/genres", genres);

//** App Listening Port */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app Loading on Port ${port} ...!`));
