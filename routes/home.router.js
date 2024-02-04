const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/asyncMiddleware");

//get all
router.get(
    "/",
    asyncMiddleware((req, res) => {
        res.send("Welcome To Vidly Demo Application");
    })
);

module.exports = router;
