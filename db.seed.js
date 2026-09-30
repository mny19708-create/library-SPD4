// db.seed.js - Seed Script សម្រាប់ Library Management System Database
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runLibrarySeed() {
  try {
    await client.connect();
    console.log("🌱 Connecting to Supabase Database for Library System Seeding...");

    // 1. Insert Core Users (Student, Librarian, Admin)
    await client.query(`
      INSERT INTO users (name, email, password_hash, role, total_points) 
      VALUES 
      ('Sokha Chea', 'sokha.student@library.edu.kh', '$2b$10$hashedpassword123', 'STUDENT', 120),
      ('Bora Chan', 'bora.librarian@library.edu.kh', '$2b$10$hashedpassword456', 'LIBRARIAN', 0),
      ('System Admin', 'admin@library.edu.kh', '$2b$10$hashedpassword789', 'ADMIN', 0)
      ON CONFLICT (email) DO NOTHING;
    `);

    // 2. Insert Study Rooms
    await client.query(`
      INSERT INTO rooms (room_number, capacity, map_x, map_y, is_active) 
      VALUES 
      ('Quiet Study Room A', 4, 10, 15, TRUE),
      ('Group Discussion Room B', 8, 35, 40, TRUE),
      ('Multimedia Room C', 6, 60, 20, TRUE)
      ON CONFLICT (room_number) DO NOTHING;
    `);

    // 3. Insert Book Catalog
    await client.query(`
      INSERT INTO books (title, author, isbn, total_copies, available_copies) 
      VALUES 
      ('Introduction to Computer Science & Node.js', 'Dr. Aris Thorne', '978-1-56619-909-4', 5, 4),
      ('Modern Database Systems with PostgreSQL', 'Elena Rostova', '978-0-262-13472-9', 3, 3),
      ('Software Architecture Principles', 'Marcus Vance', '978-1-491-95035-7', 2, 1)
      ON CONFLICT (isbn) DO NOTHING;
    `);

    // 4. Insert Sample Point Audit Trail (Gamification Engine)
    await client.query(`
      INSERT INTO point_transactions (user_id, points, type, reason) 
      VALUES 
      (1, 50, 'EARN', 'Returned borrowed book on time'),
      (1, 70, 'EARN', 'Completed 5 study room check-ins without cancellation');
    `);

    // 5. Insert Sample Certificate Metadata
    await client.query(`
      INSERT INTO certificates (user_id, title, certificate_code, file_url) 
      VALUES 
      (1, 'Top Library Reader - Q3', 'CERT-2026-LIB-001', 'https://supabase.co/storage/v1/object/public/certs/cert_001.pdf')
      ON CONFLICT (certificate_code) DO NOTHING;
    `);

    console.log("✅ Library System Database Seeding Completed Successfully!");
  } catch (err) {
    console.error("❌ Database Seeding Error:", err);
  } finally {
    await client.end();
  }
}

runLibrarySeed();