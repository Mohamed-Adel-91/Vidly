const express = require("express");
const router = express.Router();
const { Rental } = require("../models/rental.schema");
const auth = require("../middleware/auth");

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
    return res.status(200).send();
});

module.exports = router;
// this route is for testing returns .

/*>>>>>>>>>>>>>>>>
    try {
        let userData = await req.context.dataSources.userAPIs.createUser(
            req.body
        );
        if (!userData) throw new Error("Failed to create user.");
        return res.status(201).json({ data: userData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
*/
