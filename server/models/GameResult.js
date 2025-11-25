import mongoose from "mongoose";

const levelResultSchema = new mongoose.Schema({
    level: Number,
    winner: { type: String, enum: ["player", "ai", "draw"] },
    playerSymbol: String,
    aiSymbol: String
});

const gameResultSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        totalLevels: { type: Number, default: 5 },
        playerWins: { type: Number, default: 0 },
        aiWins: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
        overallWinner: { type: String, enum: ["player", "ai", "draw"] },
        levels: [levelResultSchema]
    },
    { timestamps: true }
);

export const GameResult = mongoose.model("GameResult", gameResultSchema);