const { Movie, validationMovie } = require("../models/movie.schema");
const { Genre } = require("../models/genre.schema");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("title");
    res.send(movies);
});

router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found");
    res.send(movie);
});

router.post("/", auth, async (req, res) => {
    try {
        const { error } = validationMovie(req.body);
        if (error)
            throw new Error(error.details.map((e) => e.message).join(", "));

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send("Invalid genre.");
        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        });

        await movie.save();
        res.send(movie);
    } catch (error) {
        res.status(400).send(`Validation Error: ${error.message}`);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const { error } = validationMovie(req.body);
        if (error)
            throw new Error(error.details.map((e) => e.message).join(", "));
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send("Invalid genre.");
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name,
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate,
            },
            { new: true }
        );

        if (!movie) return res.status(404).send("Movie not found");
        res.send(movie);
    } catch (error) {
        res.status(400).send(`Validation Error: ${error.message}`);
    }
});

router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res
                .status(404)
                .send("The Movie with the given ID was not found.");
        }

        res.send(`The Movie ${movie.title} has been deleted.`);
    } catch (error) {
        console.error(error);
        res.status(500).send(
            `Server error, the Movie with the given ID is invalid. Please provide a valid ID.`
        );
    }
});

module.exports = router;
