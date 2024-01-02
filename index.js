const express = require("express");
const app = express();

app.use(express.json());

const genres = [
    { id: 1, name: "Action" },
    { id: 2, name: "Comedy" },
    { id: 3, name: "Horror" },
];

//** Get Request for server */
app.get("/", (req, res) => {
    res.send(genres);
});

app.get("/api/genres", (req, res) => {
    res.send({ data: genres });
});

//** App Listening Port */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app Loading on Port ${port} ...!`));
