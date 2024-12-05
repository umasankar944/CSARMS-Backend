import Jwt from "jsonwebtoken";
const TOKEN = "CSARMS";
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader
        
    )
    // Check if authorization header exists
    if (!authHeader) {
        return res.status(403).send("A token is required for authentication");
    }

    const token = authHeader.split(" ")[1]; // Extract token from the header

    try {
        // Verify the token
        const decoded = Jwt.verify(token, TOKEN);
        req.user = decoded; // Attach decoded token to the request object
    } catch (err) {
        return res.status(401).send("Invalid token"); // Handle invalid token
    }

    return next(); // Call the next middleware
}