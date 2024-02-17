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

function validationCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
    });
    const { error, value } = schema.validate(customer);
    if (error) return { error };
    return value;
}

exports.Customer = Customer;
exports.validationCustomer = validationCustomer;
