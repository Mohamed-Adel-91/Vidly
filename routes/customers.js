const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const boolean = require("joi/lib/types/boolean");
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
    const { error } = validationRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });
    customer = await customer.save();
    res.send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validationRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
        { new: true }
    );
    if (!customer) return res.status(404).send("Customer not found");
    res.send(customer);
});

router.delete("/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res
                .status(404)
                .send("The costumer with given ID was not found.");
        }

        res.send(`The customer ${customer.name} has been deleted.`);
    } catch (error) {
        console.error(error); // Log any unexpected errors
        res.status(500).send(
            `Server error , The customer with given ID was wrong you cant type id as : " ${req.params.id} " please complete your id you want to remove`
        ); // Handle unexpected errors gracefully
    }
});

const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
});
async function validationRequest(costumer) {
    try {
        await schema.validate(costumer);
        return costumer;
    } catch (error) {
        throw new Error(error.details[0].message);
    }
}

module.exports = router;
