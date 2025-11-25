export default function Board({ board, onCellClick }) {
  return (
    <div className="grid grid-cols-3 gap-2 mx-auto mt-4 w-64">
      {board.map((cell, idx) => {
        const bgClass =
          cell === "O"
            ? "bg-rose-200 dark:bg-rose-800"
            : cell === "X"
            ? "bg-emerald-200 dark:bg-emerald-800"
            : "bg-slate-50 dark:bg-slate-900";

        return (
          <button
            key={idx}
            onClick={() => onCellClick(idx)}
            disabled={!!cell}
            className={`h-20 w-20 rounded-xl border border-slate-300 dark:border-slate-700 text-3xl font-bold flex items-center justify-center disabled:opacity-80 transition-colors ${bgClass}`}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}
