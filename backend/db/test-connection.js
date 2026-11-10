// require('dotenv').config();
// const { createClient } = require('@supabase/supabase-js');

// // ទាញយក URL និង KEY ពី .env file
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   console.error('❌ Error: សូមពិនិត្យមើល SUPABASE_URL ឬ SUPABASE_KEY ក្នុងឯកសារ .env របស់អ្នក!');
//   process.exit(1);
// }

// // បង្កើត Supabase Client
// const supabase = createClient(supabaseUrl, supabaseKey);

// async function testConnection() {
//   console.log('🔄 កំពុងសាកល្បងតភ្ជាប់ទៅកាន់ Supabase...');

//   try {
//     // ធ្វើការ Query តេស្តដើម្បីពិនិត្យការតភ្ជាប់
//     const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1);

//     // ប្រសិនបើគ្មាន Table _prisma_migrations ទេ ព្យាយាមធ្វើ Healthcheck ឬ Query ផ្សេងទៀត
//     if (error && error.code === 'PGRST204') {
//       // PGRST204 មានន័យថា API ដំណើរការធម្មតា ប៉ុន្តែរកមិនឃើញ Table នោះទេ (ចាត់ទុកថា Connect ជោគជ័យ)
//       console.log('✅ ការតភ្ជាប់ទៅកាន់ Supabase ជោគជ័យ! (Supabase API is working)');
//       return;
//     }

//     if (error) {
//       console.log('✅ ការតភ្ជាប់ទៅកាន់ Supabase API ជោគជ័យ!');
//     } else {
//       console.log('✅ ការតភ្ជាប់ទៅកាន់ Supabase ជោគជ័យខ្លាំង!');
//     }
//   } catch (err) {
//     console.error('❌ បរាជ័យក្នុងការតភ្ជាប់:', err.message);
//   }
// }

// testConnection();
// module.exports = supabase;

// // const { Pool } = require('pg');
// // require('dotenv').config();

// // const connectionString = process.env.DATABASE_URL;

// // console.log('🔍 កំពុងពិនិត្យមើល Connection String...');
// // console.log('URL ៖', connectionString ? connectionString.substring(0, 35) + '...' : '❌ គ្មានតម្លៃ (Undefined)!');

// // const pool = new Pool({
// //   connectionString: connectionString,
// //   ssl: {
// //     rejectUnauthorized: false
// //   }
// // });

// // // ពិនិត្យការតភ្ជាប់យ៉ាងលម្អិត
// // pool.query('SELECT NOW()', (err, res) => {
// //   if (err) {
// //     console.error('❌ ព័ត៌មានលម្អិតនៃ Error ពេលតភ្ជាប់:', err);
// //   } else {
// //     console.log('✅ ការតភ្ជាប់ទៅកាន់ PostgreSQL Database ជោគជ័យ! ពេលវេលា Database:', res.rows[0].now);
// //   }
// //   pool.end();
// // });

// // module.exports = pool;
// ហៅកញ្ចប់ dotenv និង pg
require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

// បង្កើតការតភ្ជាប់ដោយប្រើ DATABASE_URL ពី .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // តម្រូវឱ្យមានសម្រាប់ Supabase Cloud Database
  }
});

async function testDatabaseConnection() {
  try {
    // សាកល្បង query ម៉ោងបច្ចុប្បន្នពី Database
    const res = await pool.query('SELECT NOW()');
    console.log('🎉 ការតភ្ជាប់ទៅ Database ຜ່ານ DATABASE_URL គឺជោគជ័យ!');
    console.log('🕒 ម៉ោងក្នុង Database:', res.rows[0].now);
  } catch (err) {
    console.error('⚠️ មានបញ្ហាក្នុងការតភ្ជាប់ Database:', err.message);
  } 
}

testDatabaseConnection();
 module.exports = pool;