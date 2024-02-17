const express = require("express");
const router = express.Router();
const { Rental } = require("../models/rental.schema");
const { Movie } = require("../models/movie.schema");
const auth = require("../middleware/auth");
const moment = require("moment");

router.post("/", auth, async (req, res) => {
    if (!req.body.customerId || !req.body.movieId)
        return res.status(400).send({ error: "Missing parameters" });
    const rental = await Rental.findOne({
        "customer._id": req.body.customerId,
        "movie._id": req.body.movieId,
    });
    if (!rental) return res.status(404).send({ error: "Rental not found" });
    if (rental.dateReturned)
        return res.status(400).send({ error: "Already returned" });
    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, "days");
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate; // price  per day multiplied by the number of days
    await rental.save();

    await Movie.updateOne(
        { _id: rental.movie._id },
        { $inc: { numberInStock: 1 } }
    );

    return res.status(200).send(rental);
});

module.exports = router;
// this route is for testing returns .
