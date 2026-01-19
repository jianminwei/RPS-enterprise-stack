import { Hono } from 'hono';
import { cors } from 'hono/cors'; // Import the CORS middleware
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './router.js';
import { serve } from '@hono/node-server';

const app = new Hono();

// 1. Enable CORS for your frontend
app.use(
  '*', 
  cors({
    origin: 'http://localhost:5173', // Your React app's URL
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

// 2. Your existing tRPC setup
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (opts) => ({}), 
  })
);

const port = 3000;
console.log(`✅ Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;