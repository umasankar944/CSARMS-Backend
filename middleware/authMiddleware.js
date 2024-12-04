export const authenticate = (req, res, next) => {
    // Example logic: check if token or session exists
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Validate token (if implemented)
    next();
};
