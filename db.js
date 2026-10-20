const { Pool } = require('pg');

const pool = new Pool({
    // សម្រាប់តម្រូវសម្រាប់ Supabase Pooler:
    connectionString: 'postgresql://postgres.mzpnillwohfexjwbrsls:POBratha##19@aws-0-aws-region.pooler.supabase.com:5432/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;