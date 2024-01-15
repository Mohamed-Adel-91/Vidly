const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
    },
    name: { type: String, required: true, minLength: 5, maxLength: 50 },
    phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
        match: /^0/,
    },
});

const Customer = mongoose.model("Costumer", customerSchema);

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found");
    res.send(customer);
});

router.post("/", async (req, res) => {
    try {
        const { error } = validationRequest(req.body);
        if (error)
            throw new Error(error.details.map((e) => e.message).join(", "));

        let customer = new Customer({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        });

        customer = await customer.save();
        res.send(customer);
    } catch (error) {
        res.status(400).send(`Validation Error: ${error.message}`);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { error } = validationRequest(req.body);
        if (error)
            throw new Error(error.details.map((e) => e.message).join(", "));

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold,
            },
            { new: true }
        );

        if (!customer) return res.status(404).send("Customer not found");
        res.send(customer);
    } catch (error) {
        res.status(400).send(`Validation Error: ${error.message}`);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res
                .status(404)
                .send("The customer with the given ID was not found.");
        }

        res.send(`The customer ${customer.name} has been deleted.`);
    } catch (error) {
        console.error(error);
        res.status(500).send(
            `Server error, the customer with the given ID is invalid. Please provide a valid ID.`
        );
    }
});

const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
});

async function validationRequest(customer) {
    try {
        await schema.validate(customer);
        return customer;
    } catch (error) {
        throw new Error(error.details.map((e) => e.message).join(", "));
    }
}

module.exports = router;
