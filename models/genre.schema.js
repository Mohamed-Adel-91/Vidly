const Joi = require("joi");
const mongoose = require("mongoose");

// create schema for the database
const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 5, maxLength: 50 },
});

// model of the data base with the schema
const Genre = mongoose.model("Genre", genreSchema);

// validation requests function
// Define the validation schema
const schema = Joi.object({
    name: Joi.string().min(3).required(),
});

//  validation function
function validateGenre(genre) {
    schema.validate(genre);
    return genre; // Validation successful, return the validated genre object
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;
