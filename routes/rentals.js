const express = require("express");
const { Rental, validationRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const router = express.Router();

// Get all rental
router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

// Get rental by id
router.get("/:id", async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).send("Rental not found.");
        // Send the request to the client
        res.send(rental);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error.");
    }
});

// Create a new rental
router.post("/", async (req, res) => {
    try {
        const { error } = validationRental(req.body);
        if (error)
            throw new Error(error.details.map((e) => e.message).join(", "));
        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send("Invalid movie");
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send("Invalid customer");
        if (movie.numberInStack === 0)
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
        rental = await rental.save();
        rental = await Rental.findById(rental._id).populate("customer");
        movie.numberInStock--;
        await movie.save();
        res.send(rental);
    } catch (error) {
        res.status(400).send(`Validation Error: ${error.message}`);
    }
});
module.exports = router;
