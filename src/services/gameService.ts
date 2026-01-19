import { db } from "../db/index.js";
import { gameResults } from "../db/schema.js";
import { desc } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { count } from "drizzle-orm";

export type Move = "ROCK" | "PAPER" | "SCISSORS";
export type GameResult = "WIN" | "LOSS" | "DRAW";

export const GameService = {
  // 1. The Core Logic: Who wins?
  determineWinner(userMove: Move, computerMove: Move): GameResult {
    if (userMove === computerMove) return "DRAW";

    if (
      (userMove === "ROCK" && computerMove === "SCISSORS") ||
      (userMove === "PAPER" && computerMove === "ROCK") ||
      (userMove === "SCISSORS" && computerMove === "PAPER")
    ) {
      return "WIN";
    }

    return "LOSS";
  },

  // 2. The Database Logic: Save the game
  async playAndRecord(userMove: Move) {
    const moves: Move[] = ["ROCK", "PAPER", "SCISSORS"];
    const computerMove = moves[Math.floor(Math.random() * moves.length)];

    const result = this.determineWinner(userMove, computerMove);

    // Use Drizzle to insert into Postgres
    const [savedGame] = await db
      .insert(gameResults)
      .values({
        userMove,
        computerMove,
        result,
      })
      .returning();

    return savedGame;
  },

  // 3. The History Logic: Get past games
  async getHistory(limit = 10) {
    return await db
      .select()
      .from(gameResults)
      .orderBy(desc(gameResults.createdAt))
      .limit(limit);
  },

  //4. Get the aggregated score
  async getScoreboard() {
    const stats = await db
      .select({
        result: gameResults.result,
        count: count(),
      })
      .from(gameResults)
      .groupBy(gameResults.result);

    // This returns an array like: [{ result: 'WIN', count: 5 }, { result: 'LOSS', count: 3 }]
    return stats;
  },

  // This reset the game history. It deletes all the records from the database.
  async resetHistory() {
    // This removes every single row from the gameResults table
    return await db.delete(gameResults);
  },
};
