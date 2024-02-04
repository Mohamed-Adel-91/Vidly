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
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
});

async function validationRental(rental) {
    try {
        const validationResult = await schema.validate(rental);
        return { error: null, value: validationResult };
    } catch (error) {
        throw new Error(error.map((e) => e.details[0].message).join(", "));
    }
}

exports.Rental = Rental;
exports.validationRental = validationRental;
