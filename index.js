// import modules
const express = require("express");
const app = express();
const Joi = require("joi");

//use modules
app.use(express.json());

// small array simulate database
const genres = [
    { id: 1, name: "Action" },
    { id: 2, name: "Comedy" },
    { id: 3, name: "Horror" },
];

// validation requests function
function validateRequest(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return Joi.validate(genre, schema);
}

//** Get Request for server */
//get all
app.get("/", (req, res) => {
    res.send(genres);
});
//get all genres
app.get("/api/genres", (req, res) => {
    res.send({ data: genres });
});
//get genres with givin id
app.get("/api/genres/:id", (req, res) => {
    //found genre id from givin params req
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    // handling error id req
    if (!genre)
        return res.status(404).send("The genre with givin ID is not found");
    // send data
    res.send({ data: genre });
});

//** Post Request for server */
app.post("/api/genres", (req, res) => {
    // check error with validation  function
    const { error } = validateRequest(req.body);
    // if catch error send bad req 404
    if (error) return res.status(400).send(error.details[0].message);
    // add data from req.body to array database after map on id's we have in database
    let mapGenresID = genres.map((g) => g.id);
    const genre = {
        id: Math.max(...mapGenresID, 0) + 1,
        name: req.body.name,
    };
    genres.push(genre);
    // send data back to client
    res.send(genres);
});

//** App Listening Port */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app Loading on Port ${port} ...!`));
