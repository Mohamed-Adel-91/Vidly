const { Movie, validationMovie } = require("../models/movie.schema");
const { Genre } = require("../models/genre.schema");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

router.get(
    "/",
    asyncMiddleware(async (req, res) => {
        const movies = await Movie.find().sort("title");
        res.send(movies);
    })
);

router.get(
    "/:id",
    validateObjectId, //custom middleware to check if the given id is valid or not
    asyncMiddleware(async (req, res) => {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send("Movie not found");
        res.send(movie);
    })
);

router.post(
    "/",
    auth,
    asyncMiddleware(async (req, res) => {
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
    })
);

router.put(
    "/:id",
    [auth, validateObjectId], //custom middleware to check if the given id is valid or not
    asyncMiddleware(async (req, res) => {
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
    })
);

router.delete(
    "/:id",
    [auth, admin, validateObjectId], //custom middleware to check if the given id is valid or not
    asyncMiddleware(async (req, res) => {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res
                .status(404)
                .send("The Movie with the given ID was not found.");
        }
        res.send(`The Movie ${movie.title} has been deleted.`);
    })
);

module.exports = router;
