import express from "express";
import { registerUser, loginUser, profile } from "../controllers/AuthController.js";
import { protect } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, profile);

export default router;
