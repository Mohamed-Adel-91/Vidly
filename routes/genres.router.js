const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genre.schema");
const auth = require("../middleware/auth");

//** Get Request for server */
//get all genres from database
router.get("/", async (req, res) => {
    const genre = await Genre.find().sort("name");
    res.send(genre);
});
//get genres with givin id
router.get("/:id", async (req, res) => {
    //found genre id from givin params req
    const genre = await genre.findById(req.params.id);
    // handling error id req
    if (!genre)
        return res.status(404).send("The genre with givin ID is not found");
    // send data
    res.send(genre);
});

//** Post Request for server */
router.post("/", auth, async (req, res) => {
    // check error with validation  function
    const { error } = validateGenre(req.body);
    // if catch error send bad req 404
    if (error) return res.status(400).send(error.details[0].message);
    // add data from req.body to array database after map on id's we have in database
    let genre = new Genre({
        name: req.body.name,
    });
    genre = await genre.save();
    // send data back to client
    res.send(genre);
});

//** Put Request for server */
router.put("/:id", auth, async (req, res) => {
    //checking errors with validating request
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // find the genre by its id and update it
    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );
    // handling error id req
    if (!genre) {
        return res.status(404).send("The genre with given ID was not found.");
    }
    res.send(genre);
});

//** Delete Request for server */
router.delete("/:id", auth, async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);

        if (!genre) {
            return res
                .status(404)
                .send("The genre with given ID was not found.");
        }

        res.send(`The genre ${genre.name} has been deleted.`);
    } catch (error) {
        console.error(error); // Log any unexpected errors
        res.status(500).send(
            `Server error , The genre with given ID was wrong you cant type id as : " ${req.params.id} " please complete your id you want to remove`
        ); // Handle unexpected errors gracefully
    }
});

module.exports = router;
