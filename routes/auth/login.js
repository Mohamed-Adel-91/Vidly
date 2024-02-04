const express = require("express");
const router = express.Router();
const { User } = require("../../models/user.schema");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const asyncMiddleware = require("../../middleware/asyncMiddleware");

router.post(
    "/",
    asyncMiddleware(async (req, res) => {
        // check error with validation  function
        const { error } = validate(req.body);
        // If validation error, send a 400 Bad Request response with a custom error message
        if (error) {
            const errorMessage =
                "Validation error: " +
                error.details.map((e) => e.message).join(", ");
            return res.status(400).send(errorMessage);
        }
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Invalid Email or  Password.");

        // Checking password is correct using bcrypt compareSync method
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send("Invalid Email or Password.");
        // Create and assign a token for the user - Create token and set it to the cookie of client side
        const token = user.generateAuthToken();
        res.send(token);
    })
);

const schema = Joi.object({
    email: Joi.string().min(5).max(50).email().required(),
    password: Joi.string().min(8).max(1024).required(),
});

async function validate(req) {
    try {
        await schema.validate(req);
        return req;
    } catch (error) {
        throw new Error(error.details.map((e) => e.message).join(", "));
    }
}

module.exports = router;
