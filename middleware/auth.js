const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).send("No Token Provided");
    } else {
        try {
            const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
            req.user = decoded;
            console.log("User is Authenticated");
            next();
        } catch (err) {
            console.error(`Error in Authentication ${err.message}`);
            res.status(400).send("Token is not valid");
        }
    }
}

module.exports = auth;
