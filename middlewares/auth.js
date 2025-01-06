import userModel from '../db/models/user.model.js';
import jwt from 'jsonwebtoken';

export const auth = (role = []) => {
    return async (req, res, next) => {
        try {
            // Log the incoming request headers
            console.log("Request Headers:", req.headers);

            // Check for the Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                console.log("Authorization Header Missing or Invalid Format");
                return res.status(400).json({ message: "Token not found or invalid format!" });
            }

            // Extract the token
            const token = authHeader.split(" ")[1];
            console.log("Extracted Token:", token);

            // Verify the token
            const decoded = jwt.verify(token, process.env.confirmationKey);
            console.log("Decoded Token:", decoded);

            if (!decoded?.id) {
                console.log("Decoded Token Missing 'id'");
                return res.status(400).json({ message: "Invalid payload!" });
            }

            // Find the user by ID
            const user = await userModel.findById(decoded.id);
            console.log("Found User:", user);

            if (!user) {
                console.log("User Not Found in Database");
                return res.status(400).json({ message: "User not found!" });
            }

            // Check if the token is outdated due to password change
            const passwordChangedAt = parseInt(user?.passwordChangedAt?.getTime() / 1000);
            console.log("Password Changed At:", passwordChangedAt, "Token Issued At:", decoded.iat);

            if (passwordChangedAt > decoded.iat) {
                console.log("Token Expired Due to Password Change");
                return res.status(403).json({ message: "Token expired, please login again!" });
            }

            // Check the user's role
            console.log("User Role:", user.role, "Allowed Roles:", role);
            if (!role.includes(user.role)) {
                console.log("User Role Not Authorized");
                return res.status(401).json({ message: "Sorry! You're not authorized." });
            }

            // Attach user to the request object
            req.user = user;
            console.log("User Authorized Successfully");
            next(); 
        } catch (error) {
            console.log("Error in Auth Middleware:", error.message);
            return res.status(400).json({ message: "Catch error", error: error.message });
        }
    };
};
