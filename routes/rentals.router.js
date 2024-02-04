const { Rental, validationRental } = require("../models/rental.schema");
const { Movie } = require("../models/movie.schema");
const { Customer } = require("../models/customer.schema");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");

// Get all rental
router.get(
    "/",
    auth,
    asyncMiddleware(async (req, res) => {
        const rentals = await Rental.find().sort("-dateOut");
        res.send(rentals);
    })
);

// Get rental by id
router.get(
    "/:id",
    asyncMiddleware(async (req, res) => {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).send("Rental not found.");
        // Send the request to the client
        res.send(rental);
    })
);

// Create a new rental
router.post(
    "/",
    asyncMiddleware(async (req, res) => {
        const { error, value } = validationRental(req.body);
        if (error) {
            return res.status(400).send(`Validation Error: ${error.message}`);
        }
        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send("Invalid movie");
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send("Invalid customer");
        if (movie.numberInStock === 0)
            return res.status(400).send("Movie not in stock");
        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
                isGold: customer.isGold,
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
        });
        // -->> Reduce the number of movies available by one
        rental = await rental.save();
        movie.numberInStock--;
        await movie.save();
        rental = await Rental.findById(rental._id).populate("customer");
        res.send(rental);
    })
);
module.exports = router;
