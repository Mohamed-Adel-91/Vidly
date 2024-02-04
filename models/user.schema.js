const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 5,
        maxlength: 255,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // Use a regular expression for email validation
    },
    password: { type: String, required: true, minlength: 8, maxlength: 1024 },
    isAdmin: Boolean,
    role: [String],
    operations: [String],
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get("jwtPrivetKey")
    );
    return token;
};
const User = mongoose.model("User", userSchema);

//Joi validation for the User model

const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).email().required(),
    password: Joi.string().min(8).max(1024).required(),
});

async function validateUser(user) {
    try {
        await schema.validate(user);
        return user;
    } catch (error) {
        throw new Error(error.map((e) => e.details[0].message).join(", "));
    }
}

exports.User = User;
exports.validateUser = validateUser;
