import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/game/my-games");
        setGames(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Recent Tournaments</h2>
        <Link to="/game" className="inline-flex items-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white px-4 py-2">
          + New Tournament
        </Link>
      </div>

      {games.length === 0 ? (
        <p className="text-xs text-slate-500">No games yet. Start your first 5-level tournament!</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2">Player Wins</th>
                <th className="px-3 py-2">AI Wins</th>
                <th className="px-3 py-2">Draws</th>
                <th className="px-3 py-2">Winner</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={g._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2">{new Date(g.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2 text-center">{g.playerWins}</td>
                  <td className="px-3 py-2 text-center">{g.aiWins}</td>
                  <td className="px-3 py-2 text-center">{g.draws}</td>
                  <td className="px-3 py-2 text-center uppercase">{g.overallWinner === "player" ? "You" : g.overallWinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
