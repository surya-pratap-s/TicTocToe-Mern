import { useEffect, useMemo, useState } from "react";
import Board from "../components/Board";
import LevelSummary from "../components/LevelSummary";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EMPTY_BOARD = Array(9).fill(null);

const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const checkWinner = (board) => {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // "X" or "O"
        }
    }
    if (board.every((c) => c !== null)) return "draw";
    return null;
};

const availableMoves = (board) => board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);

// Level 1: random
const aiRandom = (board) => {
    const moves = availableMoves(board);
    if (!moves.length) return null;
    return moves[Math.floor(Math.random() * moves.length)];
};

// Level 2: win > block > random
const aiLevel2 = (board, aiSym, playerSym) => {
    const moves = availableMoves(board);
    // check posibility of ai win then fill
    for (const m of moves) {
        const b = [...board];
        b[m] = aiSym;
        if (checkWinner(b) === aiSym) return m;
    }
    // check player win posibility then block
    for (const m of moves) {
        const b = [...board];
        b[m] = playerSym;
        if (checkWinner(b) === playerSym) return m;
    }
    return aiRandom(board);
};

// Minimax implementation
const minimax = (board, depth, isMaximizing, aiSym, playerSym, maxDepth = null) => {
    const winner = checkWinner(board);
    if (winner === aiSym) return 10 - depth;
    if (winner === playerSym) return depth - 10;
    if (winner === "draw") return 0;
    if (maxDepth !== null && depth >= maxDepth) {
        return 0;
    }

    const moves = availableMoves(board);
    if (isMaximizing) {
        let best = -Infinity;
        for (const m of moves) {
            const b = [...board];
            b[m] = aiSym;
            const score = minimax(b, depth + 1, false, aiSym, playerSym, maxDepth);
            best = Math.max(best, score);
        }
        return best;
    } else {
        let best = Infinity;
        for (const m of moves) {
            const b = [...board];
            b[m] = playerSym;
            const score = minimax(b, depth + 1, true, aiSym, playerSym, maxDepth);
            best = Math.min(best, score);
        }
        return best;
    }
};

const aiMinimax = (board, aiSym, playerSym, maxDepth = null) => {
    const moves = availableMoves(board);
    if (!moves.length) return null;

    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const m of moves) {
        const b = [...board];
        b[m] = aiSym;
        const score = minimax(b, 0, false, aiSym, playerSym, maxDepth);
        if (score > bestScore) {
            bestScore = score;
            bestMove = m;
        }
    }

    return bestMove;
};

export default function Game() {
    const { user } = useAuth();
    const navigate = useNavigate();
    // symbols
    const [playerSymbol] = useState("X");
    const [aiSymbol] = useState("O");

    // game state
    const [level, setLevel] = useState(1);
    const [status, setStatus] = useState("Your");
    const [board, setBoard] = useState(EMPTY_BOARD);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [levelResults, setLevelResults] = useState([]);
    const [tournamentOver, setTournamentOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Derived values
    const playerWins = useMemo(() => levelResults.filter((l) => l.winner === "player").length, [levelResults]);
    const aiWins = useMemo(() => levelResults.filter((l) => l.winner === "ai").length, [levelResults]);

    const finalWinner = useMemo(() => {
        if (playerWins > aiWins) return "player";
        if (aiWins > playerWins) return "ai";
        return "draw";
    }, [playerWins, aiWins]);

    // AI move decision depending on level
    const decideAIMove = (currentLevel, currentBoard) => {
        if (currentLevel === 1) {
            return aiRandom(currentBoard);
        }

        if (currentLevel === 2) {
            return aiLevel2(currentBoard, aiSymbol, playerSymbol);
        }

        if (currentLevel === 3) {
            // limited depth minimax for "intermediate"
            return aiMinimax(currentBoard, aiSymbol, playerSymbol, 3);
        }

        if (currentLevel === 4) {
            // full minimax
            return aiMinimax(currentBoard, aiSymbol, playerSymbol, null);
        }

        // level 5: hardest — AI prefers center and starts first
        if (currentLevel === 5) {
            const mv = availableMoves(currentBoard);
            if (mv.includes(4)) return 4; // center priority
            return aiMinimax(currentBoard, aiSymbol, playerSymbol, null);
        }

        return aiRandom(currentBoard);
    };

    const playAIMove = (currentLevel, currentBoard) => {
        setIsProcessing(true);
        setTimeout(() => {
            const move = decideAIMove(currentLevel, currentBoard);
            if (move === null || move === undefined) {
                setIsProcessing(false);
                const winner = checkWinner(currentBoard);
                if (winner) handleLevelEnd(winner);
                return;
            }

            const nb = [...currentBoard];
            nb[move] = aiSymbol;
            setBoard(nb);

            const winner = checkWinner(nb);
            if (winner) {
                handleLevelEnd(winner);
            } else {
                setIsPlayerTurn(true);
                setStatus("Your");
            }
            setIsProcessing(false);
        }, 400);
    };

    // When clicking a cell
    const onCellClick = (idx) => {
        if (!isPlayerTurn || board[idx] || tournamentOver || isProcessing) return;
        const nb = [...board];
        nb[idx] = playerSymbol;
        setBoard(nb);

        const winner = checkWinner(nb);
        if (winner) {
            handleLevelEnd(winner);
            return;
        }

        // player's move done -> AI turn
        setIsPlayerTurn(false);
        setStatus("Computer");
        setTimeout(() => playAIMove(level, nb), 300);
    };

    const handleLevelEnd = (winnerSymbol) => {
        let winnerLabel;
        if (winnerSymbol === "draw") winnerLabel = "draw";
        else if (winnerSymbol === playerSymbol) winnerLabel = "player";
        else winnerLabel = "ai";

        // push result
        const result = { level, winner: winnerLabel, playerSymbol, aiSymbol, };
        setLevelResults((prev) => [...prev, result]);

        // if last level -> tournament over
        if (level >= 5) {
            setTournamentOver(true);
            setStatus(`tournament finished`);
            return;
        }

        // else prepare next level
        const nextLevel = level + 1;

        setTimeout(() => {
            setLevel(nextLevel);
            setBoard(EMPTY_BOARD);
            setIsPlayerTurn(true);
            setStatus(`Your`);
        }, 800);
    };

    // If level 5 requires AI to start, do that when level switches to 5
    useEffect(() => {
        if (tournamentOver) return;
        if (level === 5) {
            setBoard(EMPTY_BOARD);
            setIsPlayerTurn(false);
            setStatus("AI starts...");
            setTimeout(() => {
                playAIMove(5, EMPTY_BOARD);
            }, 500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level]);

    // Save tournament result to backend
    const saveTournament = async () => {
        if (!user) {
            alert("You must be logged in to save a tournament.");
            return;
        }
        if (!tournamentOver) {
            alert("Tournament not finished yet.");
            return;
        }

        try {
            const { data } = await api.post("/game/save", { levels: levelResults });
            alert(`Saved. Overall winner: ${data.overallWinner.toUpperCase()}`);
            navigate("/");
        } catch (err) {
            console.error("Save tournament error:", err);
        }
    };

    // Restart entire tournament
    const restartTournament = () => {
        setLevel(1);
        setBoard(EMPTY_BOARD);
        setIsPlayerTurn(true);
        setStatus("Your");
        setLevelResults([]);
        setTournamentOver(false);
        setIsProcessing(false);
    };

    // if level 1 and board empty, ensure player starts
    useEffect(() => {
        if (level === 1 && board.every((c) => c === null)) {
            setIsPlayerTurn(true);
            setStatus("Your");
        }
    }, [level, board]);

    return (
        <section className="">
            <div className="rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-4">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">5-Level Tic-Tac-Toe Tournament</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                            Play 5 increasing-difficulty levels against the AI. Win the most
                            levels to become the tournament winner.
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">
                                Current Level:&nbsp;&nbsp;<span className="dark:text-gray-100 text-black">{level}</span>
                            </span>
                            <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">
                                Turn:&nbsp;&nbsp;<span className="font-medium text-slate-700 dark:text-slate-200">{status}</span>
                            </span>
                        </div>
                    </div>


                    <div className="flex text-right gap-2 justify-between w-full">
                        <div className="flex flex-wrap justify-center gap-2">
                            {Array.from({ length: 5 }).map((_, idx) => {
                                const lv = idx + 1;
                                const lr = levelResults.find((r) => r.level === lv);
                                return (
                                    <div key={lv} className="flex items-center">
                                        {lr ? (
                                            <LevelSummary level={lr.level} result={lr.winner} />
                                        ) : (
                                            <div className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">
                                                L{lv}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <span onClick={restartTournament} className="inline-flex cursor-pointer items-center rounded-md bg-blue-400/10 p-2 text-xs font-medium text-gray-900 dark:text-white inset-ring inset-ring-blue-400/30">
                            <RotateCcw size={16} />
                        </span>
                    </div>
                </div>

                <Board board={board} onCellClick={onCellClick} />

                {tournamentOver && (
                    <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-900 p-4 text-sm">
                        <h3 className="font-semibold mb-2">Tournament Summary</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center justify-between">
                                <span>You wins</span>
                                <strong>{playerWins}</strong>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Computer wins</span>
                                <strong>{aiWins}</strong>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>Draws</span>
                                <strong>{5 - playerWins - aiWins}</strong>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Overall winner</span>
                                <strong className="uppercase">
                                    {finalWinner === "draw" ? "Draw" : finalWinner === "player" ? "You" : "AI"}
                                </strong>
                            </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                            <button onClick={saveTournament} className="inline-flex items-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2" >
                                Save Tournament
                            </button>

                            <button onClick={restartTournament} className="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 text-xs px-4 py-2">
                                Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
