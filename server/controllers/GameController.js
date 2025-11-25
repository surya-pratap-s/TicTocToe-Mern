import { GameResult } from "../models/GameResult.js";


export const saveTournament = async (req, res) => {
  try {
    const { levels } = req.body;

    if (!Array.isArray(levels) || levels.length === 0) {
      return res.status(400).json({ message: "No levels data provided" });
    }

    let playerWins = 0;
    let aiWins = 0;
    let draws = 0;

    levels.forEach((lvl) => {
      if (lvl.winner === "player") playerWins++;
      else if (lvl.winner === "ai") aiWins++;
      else draws++;
    });

    let overallWinner = "draw";
    if (playerWins > aiWins) overallWinner = "player";
    else if (aiWins > playerWins) overallWinner = "ai";

    const game = await GameResult.create({
      user: req.userId,
      totalLevels: levels.length,
      playerWins,
      aiWins,
      draws,
      overallWinner,
      levels
    });

    return res.status(201).json(game);
  } catch (error) {
    console.error("Save tournament error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyGames = async (req, res) => {
  try {
    const games = await GameResult.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json(games);
  } catch (error) {
    console.error("Get games error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
