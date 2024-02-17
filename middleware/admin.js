function admin(req, res, next) {
    if (!req.user.isAdmin) {
        return res.status(403).send({
            success: false,
            message: "You are not authorized to view this page.",
        });
    } else {
        // Admin user is allowed to access any pages.
        return next();
    }
}

module.exports = admin;

// this middleware  checks whether the logged-in user is an administrator or not.
// If they aren't, it sends a 403 Forbidden response.
// Otherwise, it allows them to proceed to the  route that called this middleware.
