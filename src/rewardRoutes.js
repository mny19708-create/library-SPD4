const express = require('express');
const router = express.Router();
const pool = require('../db');

const formatReward = (row) => ({
  id: row.id,
  studentName: row.student_name,
  points: row.points,
  rewardsEarned: row.rewards_earned,
  updatedAt: row.updated_at,
});

// ក. ទាញយកបញ្ជីពិន្ទុរង្វាន់របស់សិស្ស (GET)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, student_name, points, rewards_earned, updated_at
      FROM student_rewards
      ORDER BY points DESC
    `);
    res.json(rows.map(formatReward));
  } catch (err) {
    console.error('Fetch rewards error:', err.message);
    res.status(500).json({ error: 'មិនអាចទាញយកទិន្នន័យពិន្ទុរង្វាន់បានទេ' });
  }
});

// ខ. បន្ថែម ឬកាត់ពិន្ទុរង្វាន់ (POST)
router.post('/add', async (req, res) => {
  const studentName = String(req.body.studentName || '').trim();
  const points = Number(req.body.pointsToAdd);

  if (!studentName || !Number.isInteger(points) || points === 0 || Math.abs(points) > 1000) {
    return res.status(400).json({ error: 'សូមបញ្ជាក់ឈ្មោះសិស្ស និងចំនួនពិន្ទុឱ្យត្រឹមត្រូវ!' });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO student_rewards (student_name, points, updated_at)
      VALUES ($1, GREATEST(0, $2::int), NOW())
      ON CONFLICT (student_name)
      DO UPDATE SET
        points = GREATEST(0, student_rewards.points + $2::int),
        updated_at = NOW()
      RETURNING *
      `,
      [studentName, points]
    );

    res.json({ message: 'បានកែប្រែពិន្ទុជោគជ័យ!', reward: formatReward(rows[0]) });
  } catch (err) {
    console.error('Update points error:', err.message);
    res.status(500).json({ error: 'បរាជ័យក្នុងការកែប្រែពិន្ទុរង្វាន់' });
  }
});

module.exports = router;