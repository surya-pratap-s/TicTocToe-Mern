import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";

export const protect = async (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth?.startsWith("Bearer "))
        return res.status(401).json({ message: "No token" });

    const token = auth.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
