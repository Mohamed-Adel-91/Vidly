const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre.schema");
Joi.objectId = require("joi-objectid")(Joi);

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        require: true,
        default: 0,
        min: 0,
        max: 255,
    },
    dailyRentalRate: {
        type: Number,
        require: true,
        default: 0,
        min: 0,
        max: 255,
    },
});

const Movie = mongoose.model("Movie", movieSchema);

const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
});

function validationMovie(movie) {
    schema.validate(movie);
    return movie;
}

exports.Movie = Movie;
exports.validationMovie = validationMovie;
