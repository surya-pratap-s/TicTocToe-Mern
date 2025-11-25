export default function LevelSummary({ level, result, }) {
  const colorClass = result === "player" ? " bg-green-400/10 text-green-400 inset-ring-green-400/30"
    : result === "ai" ? "bg-red-400/10 text-red-400 inset-ring-red-400/30"
      : result === "draw" ? "bg-gray-400/10 text-gray-400 inset-ring-gray-400/30"
        : "bg-blue-400/10 text-blue-400 inset-ring-blue-400/30";

  return (
    <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium inset-ring ${colorClass}`}>
      L{level}
    </div>
  );
}
