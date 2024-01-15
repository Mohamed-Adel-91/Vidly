const mongoose = require("mongoose");
const Joi = require("joi");

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

const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
});

async function validationCustomer(customer) {
    try {
        await schema.validate(customer);
        return customer;
    } catch (error) {
        throw new Error(error.details.map((e) => e.message).join(", "));
    }
}

exports.Customer = Customer;
exports.validationCustomer = validationCustomer;
