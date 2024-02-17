const express = require("express");
const router = express.Router();
const { Rental } = require("../models/rental.schema");
const { Movie } = require("../models/movie.schema");
const auth = require("../middleware/auth");
const moment = require("moment");
const Joi = require("joi");
const validate = require("../middleware/validate");

router.post("/", [auth, validate(validationReturn)], async (req, res) => {
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

function validationReturn(req) {
    const schema = Joi.object({
        customerId: Joi.string().length(24).required(),
        movieId: Joi.string().length(24).required(),
    });

    const { error, value } = schema.validate(req);
    if (error) return { error };
    return value;
}

module.exports = router;
// this route is for testing returns .
