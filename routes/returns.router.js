const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    if (!req.body.customerId || !req.body.movieId)
        return res.status(400).send({ error: "Missing parameters" });
    res.status(401).send("Unauthorized");
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
