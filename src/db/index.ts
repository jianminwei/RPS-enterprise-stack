import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// 1. Initialize the connection 'client'
// The ! tells TypeScript "I promise this environment variable exists"
const connectionString = process.env.DATABASE_URL || "postgre://postgres:Elena%2301@localhost:5432/rps_db";
const client = postgres(connectionString);

// 2. Wrap it with Drizzle
export const db = drizzle(client);

// 3. Optional: Test the connection with a Top-Level Await
// Since we set "type": "module", this is now legal!
await client`SELECT 1`;
console.log("🐘 Postgres connection verified by Drizzle");