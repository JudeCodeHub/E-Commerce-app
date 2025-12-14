import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Set up WebSocket for Node.js environments (required for Vercel build step)
neonConfig.webSocketConstructor = ws;

// Enable fetch for Edge environments
neonConfig.poolQueryViaFetch = true;

const connectionString = process.env.DATABASE_URL;

// 1. Create the Pool
const pool = new Pool({ connectionString });

// 2. Create the Adapter
const adapter = new PrismaNeon(pool);

// 3. Initialize Prisma
// We pass the adapter unconditionally to satisfy the schema requirement
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;