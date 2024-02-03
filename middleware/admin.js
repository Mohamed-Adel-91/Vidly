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
