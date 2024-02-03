const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user.schema");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
    let user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(400).send("Invalid user");
    res.send(user);
    // res.send(_.omit(user.toJSON(), "password"));
});

router.post("/", async (req, res) => {
    try {
        // check error with validation  function
        const { error } = validateUser(req.body);
        // If validation error, send a 400 Bad Request response with a custom error message
        if (error) {
            const errorMessage =
                "Validation error: " +
                error.details.map((e) => e.message).join(", ");
            return res.status(400).send(errorMessage);
        }
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("Email already registered.");
        // add data from req.body to array database after map on email we have in database using lodash
        user = new User(_.pick(req.body, ["name", "email", "password"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();
        // Send the created user document back as the response of this POST request
        const token = user.generateAuthToken();
        res.header("x-auth-token", token).send(
            _.pick(user, ["_id", "name", "email"])
        );
    } catch (error) {
        // Handle other errors (e.g., database errors)
        res.status(500).send(`Internal Server Error : ${error.message}`);
    }
});

module.exports = router;
