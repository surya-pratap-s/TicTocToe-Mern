# Tic Toc Toe - MERN Stack

A Tic-Tac-Toe game built using the MERN stack (MongoDB, Express, React, Node.js).  
This project demonstrates a simple game application with a frontend (React) and backend (Node/Express + MongoDB).

---

## 🎮 Game Rules

### 1. Tournament Structure
- The game is played as a **5-level tournament**.
- Each level increases in difficulty due to a stronger AI algorithm.
- The player and the AI compete in each level; the one who wins the **most levels** becomes the overall tournament winner.

### 2. Turn System
- The player always uses **"X"**.
- The AI always uses **"O"**.
- In Levels **1–4**, the **player starts first**.
- In Level **5**, the **AI starts first**.

### 3. Winning Conditions
A level ends when:
- A player gets **three symbols in a row**:
  - Horizontally  
  - Vertically  
  - Diagonally  
- Or if the **board is full** with no winner → it's a **Draw**.

### 4. Level Difficulties
Each level uses a different AI strategy:

| Level | AI Difficulty | Description |
|-------|---------------|-------------|
| **1** | Easy | Makes totally random moves. |
| **2** | Medium | AI tries to win → if not, blocks player → else random. |
| **3** | Hard | Uses **minimax algorithm** with limited search depth. |
| **4** | Very Hard | Full **minimax** calculation (optimal play). |
| **5** | Extreme | AI prioritizes center and starts first + full minimax. |

### 5. Tournament End
After all **5 levels**:
- The game shows **Player Wins**, **AI Wins**, **Draws**, and the **Overall Winner**.
- You can:
  - **Save tournament results** to your account.
  - **Restart** the entire tournament.

### 6. Saving the Tournament
- You must be **logged in** to save results.
- Clicking **Save Tournament** sends the level data to the backend API.

### 7. Restarting
- Clicking **Restart** resets:
  - Level → 1  
  - Board  
  - Scores  
  - AI/Player turns  
  - Processing state  

The tournament then begins again from Level 1.


---

## 🚀 Features
- 3×3 Tic-Tac-Toe board implemented in React.
- Game logic: turn handling, win/draw detection.
- Backend API with MongoDB support (for saving games or user history).
- Optionally extendable to multiplayer or real-time updates.

---

## 🧰 Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT / bcrypt

---

## 📁 Project Structure (example)

    TicTocToe-MERN/
    ├─ client/ # React frontend
    │ ├─ public/
    │ └─ src/
    │ └─ context/
    │ ├─ components/
    │ ├─ pages/
    │ └─ App.jsx
    ├─ server/ # Node + Express backend
    │ ├─ controllers/
    │ ├─ models/
    │ ├─ middilware/
    │ ├─ routes/
    │ └─ server.js
    ├─ .gitignore
    └─ README.md


---

## 🛠️ Setup & Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/surya-pratap-s/TicTocToe-Mern.git
   cd TicTocToe-Mern