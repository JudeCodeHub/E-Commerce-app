import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless'; // 1. Import Pool
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
// Enable querying over fetch for Edge environments
neonConfig.poolQueryViaFetch = true;

const connectionString = `${process.env.DATABASE_URL}`;

// 2. Create the Pool first
const pool = new Pool({ connectionString });

// 3. Pass the pool to the adapter
const adapter = new PrismaNeon(pool);

// 4. Initialize Prisma with the adapter
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;