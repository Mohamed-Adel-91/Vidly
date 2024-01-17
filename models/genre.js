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

// Asynchronous validation function using async/await
async function validateGenre(genre) {
    try {
        await schema.validate(genre); // Await validation result
        return genre; // Validation successful, return the validated genre object
    } catch (error) {
        throw new Error(error.details[0].message); // Handle validation error and throw a descriptive error
    }
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;
