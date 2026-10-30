import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool(connectionString
  ? {
      connectionString,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT || 5432),
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    });

export default pool;
