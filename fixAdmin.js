require('dotenv').config();
const crypto = require('crypto');
const { promisify } = require('util');
const pool = require('./db');

const scrypt = promisify(crypto.scrypt);

async function fix() {
  try {
    console.log('--- កំពុងពិនិត្យមើល Database ---');
    
    // ១. មើលថាបច្ចុប្បន្នមាន User អ្វីខ្លះក្នុង Table
    const currentUsers = await pool.query('SELECT id, username FROM admin_users');
    console.log('User ដែលមានស្រាប់ក្នុង Database:', currentUsers.rows);

    // ២. យក Username និង Password ពី .env
    const targetUser = (process.env.ADMIN_USERNAME || 'roth').trim();
    const targetPass = process.env.ADMIN_PASSWORD || 'povratha19@@2026';

    // ៣. Hash Password ថ្មី
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await scrypt(targetPass, salt, 64);
    const hash = derivedKey.toString('hex');

    // ៤. លុបចោលទាំងអស់ ហើយបង្កើត User ថ្មីភ្លាមៗ
    await pool.query('DELETE FROM admin_sessions');
    await pool.query('DELETE FROM admin_users');
    
    await pool.query(
      `INSERT INTO admin_users (username, display_name, password_salt, password_hash)
       VALUES ($1, $1, $2, $3)`,
      [targetUser, salt, hash]
    );

    console.log('\n✅ ជោគជ័យហើយ! បានកំណត់គណនីថ្មីចូល Database រួចរាល់៖');
    console.log(`👉 Username សម្រាប់ Login: ${targetUser}`);
    console.log(`👉 Password សម្រាប់ Login: ${targetPass}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

fix();