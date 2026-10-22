// const { Pool } = require('pg');

// const pool = new Pool({
//     // សម្រាប់តម្រូវសម្រាប់ Supabase Pooler:
//     connectionString: 'postgresql://postgres.mzpnillwohfexjwbrsls:POBratha##19@aws-0-aws-region.pooler.supabase.com:5432/postgres',
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ ការភ្ជាប់ Database បរាជ័យ (Error):', err.message);
  }
  console.log('✅ បានភ្ជាប់ទៅកាន់ PostgreSQL ដោយជោគជ័យ!');
  release();
});

module.exports = pool;