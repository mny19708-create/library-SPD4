const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ការតភ្ជាប់ទៅកាន់ PostgreSQL របស់ Supabase ដោយប្រើ Object Config
const pool = new Pool({
    user: 'postgres',
    password: 'POBratha##19',
    host: 'db.mzpnillwohfexjwbrsls.supabase.co',
    database: 'postgres',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});
// ១. API សម្រាប់ទំព័រដើម (Dashboard Data)
app.get('/api/dashboard', async (req, res) => {
    try {
        const roomsCount = await pool.query('SELECT COUNT(*) FROM study_rooms');
        const activeUsage = await pool.query("SELECT COUNT(*) FROM study_rooms WHERE status = 'Occupied'");
        const logs = await pool.query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 5');
        
        res.json({
            totalRooms: roomsCount.rows[0].count,
            activeUsage: activeUsage.rows[0].count,
            activities: logs.rows
        });
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ២. API សម្រាប់ទំព័រការខ្ចីសៀវភៅ
app.get('/api/borrowed-books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM borrowed_books ORDER BY borrow_date DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ៣. API សម្រាប់ទំព័រកក់បន្ទប់សិក្សា
app.get('/api/study-rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM study_rooms ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ៤. API សម្រាប់ប្រព័ន្ធពិនិត្យ (Audit Logs)
app.get('/api/audit-logs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ៥. API សម្រាប់និស្សិតកក់បន្ទប់តាមរយៈការ Scan QR Code
app.post('/api/book-room', async (req, res) => {
    const { roomId, studentName } = req.body;

    try {
        // ធ្វើបច្ចុប្បន្នភាពស្ថានភាពបន្ទប់ទៅជា 'Occupied' និងដាក់ឈ្មោះនិស្សិត
        const query = `
            UPDATE study_rooms 
            SET status = 'Occupied', booked_by = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2 RETURNING *;
        `;
        const result = await pool.query(query, [studentName, roomId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'រកមិនឃើញបន្ទប់នេះទេ!' });
        }

        const updatedRoom = result.rows[0];

        // កែសម្រួលត្រង់នេះពី result.rows.number មកជា updatedRoom.room_number វិញឱ្យបានត្រឹមត្រូវ
        await pool.query(
            'INSERT INTO activity_logs (description) VALUES ($1)',
            [`${updatedRoom.room_number} booked by ${studentName}`]
        );

        res.json({ success: true, message: 'កក់បន្ទប់បានដោយជោគជ័យ!', room: updatedRoom });
    } catch (err) {
        console.error("Booking Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});