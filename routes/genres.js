const express = require("express");
const router = express.Router();
const Joi = require("joi");

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
//get all genres
router.get("/", (req, res) => {
    res.send({ data: genres });
});
//get genres with givin id
router.get("/:id", (req, res) => {
    //found genre id from givin params req
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    // handling error id req
    if (!genre)
        return res.status(404).send("The genre with givin ID is not found");
    // send data
    res.send({ data: genre });
});

//** Post Request for server */
router.post("/", (req, res) => {
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

//** Put Request for server */
router.put("/:id", (req, res) => {
    // find the genre by its id and update it
    const genre = genres.find((g) => g.id == req.params.id);
    if (!genre) {
        return res.status(404).send("The genre with given ID was not found.");
    }
    //checking errors with validating request
    const { error } = validateRequest(req.body, genre);
    if (error) return res.status(400).send(error.details[0].message);
    //update the fields of the found object
    genre.name = req.body.name || genre.name;
    res.send(genre);
});

//** Delete Request for server */
router.delete("/:id", (req, res) => {
    // find the genre by its id and delete it
    const genre = genres.find((g) => g.id == req.params.id);
    if (!genre) {
        return res.status(404).send("The genre with given ID was not found.");
    }
    // splice out the item that matches the id from array
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(`The genre ${genre.name} has been deleted.`);
});

module.exports = router;
