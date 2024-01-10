const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//get all
router.get("/", (req, res) => {
    res.send("Welcome To Vidly Demo Application");
});

module.exports = router;
