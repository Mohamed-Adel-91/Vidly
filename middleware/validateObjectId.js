const mongoose = require("mongoose");

module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send("No valid object ID provided");
    next();
};

// this middleware check if id is valid or not in the database
