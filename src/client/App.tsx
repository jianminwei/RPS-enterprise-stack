import React, { useState } from "react";
import { trpc } from "./trpc";
import './style.css'; // Don't forget this import!

export function App() {
  const [lastResult, setLastResult] = useState<any>(null);

  // 1. Hook to get game history
  const history = trpc.getHistory.useQuery();

  // 1. Fetch the scoreboard data
  const scoreboard = trpc.getScoreboard.useQuery();

  // 2. Hook to play the game
  const playMutation = trpc.play.useMutation({
    onSuccess: (data) => {
      setLastResult(data);
      history.refetch(); // Refresh the list after playing
      scoreboard.refetch(); // Keep the score updated in real-time!
    },
  });

  // The Reset Mutation
  const resetMutation = trpc.resetHistory.useMutation({
    onSuccess: () => {
      // Refresh EVERYTHING
      history.refetch();
      scoreboard.refetch();
      setLastResult(null);
    },
  });

  const makeMove = (move: "ROCK" | "PAPER" | "SCISSORS") => {
    playMutation.mutate(move);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Rock-Paper-Scissors using Enterprise Stack</h1>

      {/* Scoreboard Section */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          background: "#464775",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        {scoreboard.data?.map((stat) => (
          <div key={stat.result}>
            <strong>{stat.result}:</strong> {stat.count}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {["ROCK", "PAPER", "SCISSORS"].map((move) => (
          <button
            key={move}
            onClick={() => makeMove(move as any)}
            disabled={playMutation.isPending}
          >
            {move}
          </button>
        ))}
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <button
        onClick={() => {
          if (confirm("Are you sure? This will wipe all stats!")) {
            resetMutation.mutate();
          }
        }}
        style={{
          backgroundColor: "#ff4444",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {resetMutation.isPending ? "Wiping Database..." : "Reset All History"}
      </button>

      {lastResult && (
        <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Result: {lastResult.result}</h3>
          <p>
            You: {lastResult.userMove} vs Computer: {lastResult.computerMove}
          </p>
        </div>
      )}

      <h2>Recent 10 Games</h2>
      <ul>
        {history.data?.map((game) => (
          <li key={game.id}>
            {game.result} ({game.userMove} vs {game.computerMove})
          </li>
        ))}
      </ul>
    </div>
  );
}
