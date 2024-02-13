const validateObjectId = require("../middleware/validateObjectId");
const { Customer, validationCustomer } = require("../models/customer.schema");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/asyncMiddleware");

router.get(
    "/",
    asyncMiddleware(async (req, res) => {
        const customers = await Customer.find().sort("name");
        res.send(customers);
    })
);

router.get(
    "/:id",
    validateObjectId, //custom middleware to check if the given id is valid or not
    asyncMiddleware(async (req, res) => {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).send("Customer not found");
        res.send(customer);
    })
);

router.post(
    "/",
    asyncMiddleware(async (req, res) => {
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
    })
);

router.put(
    "/:id",
    auth,
    validateObjectId, //custom middleware to check if the given id is valid or not
    asyncMiddleware(async (req, res) => {
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
    })
);

router.delete(
    "/:id",
    [auth, admin],
    validateObjectId, //custom middleware to check if the given id is valid or not
    asyncMiddleware(async (req, res) => {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res
                .status(404)
                .send("The customer with the given ID was not found.");
        }
        res.send(`The customer ${customer.name} has been deleted.`);
    })
);

module.exports = router;
