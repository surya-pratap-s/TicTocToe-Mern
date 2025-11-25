import express from "express";
import { protect } from "../middleware/AuthMiddleware.js";
import { saveTournament, getMyGames } from "../controllers/GameController.js";

const router = express.Router();

router.post("/save", protect, saveTournament);
router.get("/my-games", protect, getMyGames);

export default router;
