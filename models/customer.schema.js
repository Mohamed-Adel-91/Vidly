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

const Customer = mongoose.model("Customer", customerSchema);

const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
});

function validationCustomer(customer) {
    schema.validate(customer);
    return customer;
}

exports.Customer = Customer;
exports.validationCustomer = validationCustomer;
