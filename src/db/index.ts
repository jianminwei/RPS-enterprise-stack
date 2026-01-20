import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';


// Use environment variables with fallbacks
const connectionString = process.env.DATABASE_URL!;
const maxConnections = Number(process.env.DB_MAX_CONNECTIONS) || 5;
const connectTimeout = Number(process.env.DB_CONNECT_TIMEOUT) || 5;
const idleTimeout = Number(process.env.DB_IDLE_TIMEOUT) || 20;

// 1. Initialize the connection 'client'
// The ! tells TypeScript "I promise this environment variable exists"
//const connectionString = process.env.DATABASE_URL || "postgre://postgres:Elena%2301@localhost:5432/rps_db";
const client = postgres(connectionString, {
  max: maxConnections,         // Maximum number of connections in the pool
  connect_timeout: connectTimeout, // Wait only 5 seconds to connect
  idle_timeout: idleTimeout,    // Close idle connections after 20 seconds
});

// 2. Wrap it with Drizzle
export const db = drizzle(client);

// 3. Optional: Test the connection with a Top-Level Await
// Since we set "type": "module", this is now legal!
await client`SELECT 1`;
console.log("🐘 Postgres connection verified by Drizzle");