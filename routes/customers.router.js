const { Customer, validationCustomer } = require("../models/customer.schema");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

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
        const { error } = validationCustomer(req.body);
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

router.put("/:id", auth, async (req, res) => {
    try {
        const { error } = validationCustomer(req.body);
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

router.delete("/:id", auth, async (req, res) => {
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

module.exports = router;
