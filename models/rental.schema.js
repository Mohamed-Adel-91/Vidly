const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
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
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255,
            },
            dailyRentalRate: {
                type: Number,
                require: true,
                min: 0,
                max: 255,
            },
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    },
});

const Rental = mongoose.model("Rental", rentalSchema);

const schema = Joi.object({
    customerId: Joi.string().length(24).required(),
    movieId: Joi.string().length(24).required(),
});

function validationRental(rental) {
    const { error, value } = schema.validate(rental);
    if (error) return { error };
    return value;
}

exports.Rental = Rental;
exports.validationRental = validationRental;
