// routes/stats.js
// GET /api/stats  ->  { success, data: { total_ebooks, total_users, total_certificates } }

const express = require('express')
const router = express.Router()
const pool = require('../db/test-connection')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM ebooks)::int AS total_ebooks,
        (SELECT COUNT(*) FROM users)::int AS total_users,
        (SELECT COUNT(*) FROM user_reading_progress WHERE is_completed = TRUE)::int AS total_certificates
    `)

    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Stats error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router