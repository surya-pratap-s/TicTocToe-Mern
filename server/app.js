import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// Parse JSON
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("Ok");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
