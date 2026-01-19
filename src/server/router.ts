import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { GameService } from "../services/gameService.js";

const t = initTRPC.create();

export const appRouter = t.router({
  // This is the "Play" procedure
  play: t.procedure
    .input(z.enum(["ROCK", "PAPER", "SCISSORS"])) // Validation!
    .mutation(async ({ input }) => {
      // Calls the GameService logic we just wrote
      return await GameService.playAndRecord(input);
    }),

  // This is the "Get History" procedure
  getHistory: t.procedure.query(async () => {
    return await GameService.getHistory();
  }),

  // This is the "Get Score card"
  getScoreboard: t.procedure.query(async () => {
    return await GameService.getScoreboard();
  }),

  // This is to delete all the history game records
  resetHistory: t.procedure.mutation(async () => {
    return await GameService.resetHistory();
  }),
});

export type AppRouter = typeof appRouter;
