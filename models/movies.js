const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("../models/genre");

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: {
        type: genreSchema,
        required: true,
    },
});
