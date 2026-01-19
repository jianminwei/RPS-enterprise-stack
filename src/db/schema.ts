import { pgTable, serial, text, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';

// This ensures the DB enforces the same rules as our React types
export const moveEnum = pgEnum('move', ['ROCK', 'PAPER', 'SCISSORS']);
export const resultEnum = pgEnum('result', ['WIN', 'LOSS', 'DRAW']);

export const gameResults = pgTable('game_results', {
  id: serial('id').primaryKey(),
  userMove: moveEnum('user_move').notNull(),
  computerMove: moveEnum('computer_move').notNull(),
  result: resultEnum('result').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// For Phase 3 (Auth), you'd eventually link these to a user_id