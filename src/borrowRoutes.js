const express = require('express');
const router = express.Router();
const pool = require('../db');

const STATUS_RETURNED = 'បានសងរួច';
const STATUS_BORROWED = 'កំពុងខ្ចី';

// Format a date as YYYY-MM-DD in Cambodia time (UTC+7)
const toLocalDate = (d) =>
  new Date(d || Date.now()).toLocaleDateString('en-CA', { timeZone: 'Asia/Phnom_Penh' });

// One formatter for GET, POST and PUT so the frontend always gets the same shape
const formatLoan = (row) => ({
  id: row.id,
  code: row.book_code,
  title: row.book_title,
  student: row.student_name,
  date: toLocalDate(row.created_at),
  status: row.status === STATUS_RETURNED ? 'returned' : 'borrowed',
});

// ១. ទាញយកទិន្នន័យពី Supabase (GET)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM book_loans ORDER BY id DESC');
    res.json(result.rows.map(formatLoan));
  } catch (err) {
    console.error('Error fetching book loans:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ២. ទទួលទិន្នន័យពី Frontend មកបញ្ចូលក្នុង Supabase (POST)
router.post('/', async (req, res) => {
  const bookCode = String(req.body.code || req.body.bookCode || req.body.book_code || '').trim();
  const bookTitle = String(req.body.title || req.body.bookTitle || req.body.book_title || '').trim();
  const studentName = String(req.body.student || req.body.studentName || req.body.student_name || '').trim();
  const status = req.body.status === 'returned' ? STATUS_RETURNED : STATUS_BORROWED;

  if (!bookCode || !bookTitle || !studentName) {
    return res.status(400).json({ error: 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់!' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO book_loans (book_code, book_title, student_name, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [bookCode, bookTitle, studentName, status]
    );
    res.status(201).json(formatLoan(rows[0]));
  } catch (err) {
    console.error('Error inserting book loan:', err.message);
    res.status(500).json({ error: 'មិនអាចបញ្ចូលទិន្នន័យបានទេ' });
  }
});

// ៣. អាប់ដេតស្ថានភាពសៀវភៅជា "បានសងរួច" (PUT)
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'ID មិនត្រឹមត្រូវ' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE book_loans SET status = $1 WHERE id = $2 RETURNING *',
      [STATUS_RETURNED, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'រកមិនឃើញទិន្នន័យ' });
    }

    res.json(formatLoan(rows[0]));
  } catch (err) {
    console.error('Error updating status:', err.message);
    res.status(500).json({ error: 'មិនអាចអាប់ដេតស្ថានភាពបានទេ' });
  }
});

module.exports = router;