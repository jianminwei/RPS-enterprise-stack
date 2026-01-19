CREATE TYPE "public"."move" AS ENUM('ROCK', 'PAPER', 'SCISSORS');--> statement-breakpoint
CREATE TYPE "public"."result" AS ENUM('WIN', 'LOSS', 'DRAW');--> statement-breakpoint
CREATE TABLE "game_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_move" "move" NOT NULL,
	"computer_move" "move" NOT NULL,
	"result" "result" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
