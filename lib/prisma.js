import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// 1. Setup WebSockets (Works everywhere)
neonConfig.webSocketConstructor = ws;

// 2. The "Dual Mode" Logic
// On Vercel (Production), we use HTTP Fetch for speed.
// On Local (Windows), we stick to WebSockets to avoid crashes.
if (process.env.NODE_ENV === 'production') {
  neonConfig.poolQueryViaFetch = true;
}

// 3. Connection Setup
const connectionString = process.env.DATABASE_URL;

// 4. Create the Pool & Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// 5. Initialize Prisma
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;