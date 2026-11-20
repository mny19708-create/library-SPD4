// controllers/progressController.js
const pool = require('../db/test-connection'); // adjust path if needed

// POST /api/progress  — upsert, saved time never goes backwards
exports.saveReadingProgress = async (req, res) => {
  try {
    const { user_id, ebook_id, reading_seconds } = req.body;
    const incoming = Math.max(0, Math.floor(Number(reading_seconds) || 0));
    if (!user_id || !ebook_id) {
      return res.status(400).json({ success: false, message: 'user_id and ebook_id are required' });
    }
    const result = await pool.query(
      `INSERT INTO user_reading_progress
         (user_id, ebook_id, reading_seconds, reading_duration_minutes, last_read_at)
      VALUES ($1::uuid, $2::uuid, $3::int, FLOOR($3::int / 60.0)::int, NOW())
       ON CONFLICT (user_id, ebook_id) DO UPDATE SET
         reading_seconds = GREATEST(COALESCE(user_reading_progress.reading_seconds, 0), EXCLUDED.reading_seconds),
         reading_duration_minutes = FLOOR(
           GREATEST(COALESCE(user_reading_progress.reading_seconds, 0), EXCLUDED.reading_seconds) / 60.0
         )::int,
         last_read_at = NOW()
       RETURNING reading_seconds`,
      [user_id, ebook_id, incoming]
    );
    res.json({ success: true, data: { reading_seconds: result.rows[0].reading_seconds } });
  } catch (err) {
    console.error('Save progress error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/progress/:userId/:ebookId
exports.getReadingProgress = async (req, res) => {
  try {
    const { userId, ebookId } = req.params;
    const result = await pool.query(
      `SELECT COALESCE(reading_seconds, 0) AS reading_seconds, is_completed
       FROM user_reading_progress WHERE user_id = $1 AND ebook_id = $2`,
      [userId, ebookId]
    );
    const row = result.rows[0];
    res.json({ success: true, data: {
      reading_seconds: row ? row.reading_seconds : 0,
      is_completed: row ? row.is_completed : false
    }});
  } catch (err) {
    console.error('Load progress error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/progress/user/:userId  — all rows for the catalog cards
exports.getUserAllProgress = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ebook_id,
              COALESCE(reading_seconds, 0) AS reading_seconds,
              COALESCE(reading_duration_minutes, 0) AS reading_duration_minutes,
              is_completed
       FROM user_reading_progress WHERE user_id = $1`,
      [req.params.userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Load user progress error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
// GET /api/progress/admin/all — for ManageUsers.vue admin table
exports.getAllReadingProgress = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         urp.id,
         urp.user_id,
         urp.ebook_id,
         urp.current_page,
         urp.reading_duration_minutes,
         urp.last_read_at,
         u.username AS user_name,
         e.title AS ebook_title
       FROM user_reading_progress urp
       LEFT JOIN users u ON urp.user_id = u.id
       LEFT JOIN ebooks e ON urp.ebook_id = e.id
       ORDER BY urp.last_read_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching all progress for admin:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};