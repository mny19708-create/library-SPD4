import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import pool from './db.js';

const app = express();
const port = Number(process.env.PORT || 3000);
const jwtSecret = process.env.JWT_SECRET;
const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));

app.use(express.json({ limit: '3mb' }));

function sendError(res, status, message) {
  return res.status(status).json({ message });
}

function issueToken(user) {
  return jwt.sign({ sub: String(user.id), role: user.role ?? 'student' }, jwtSecret, { expiresIn: '7d' });
}

function authenticate(req, res, next) {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) return sendError(res, 401, 'Please sign in to continue.');

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.userId = payload.role === 'admin' ? null : Number(payload.sub);
    req.role = payload.role;
    return next();
  } catch {
    return sendError(res, 401, 'Your sign-in has expired. Please sign in again.');
  }
}

function requireStudent(req, res, next) {
  if (req.role !== 'student') return sendError(res, 403, 'Student access is required.');
  return next();
}

function requireAdmin(req, res, next) {
  if (req.role !== 'admin') return sendError(res, 403, 'Administrator access is required.');
  return next();
}

function validWebUrl(value) {
  if (!value) return true;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function validCoverImage(value) {
  if (!value || validWebUrl(value)) return true;
  const match = /^data:image\/(?:png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) return false;
  const image = Buffer.from(match[1], 'base64');
  return image.length > 0
    && image.length <= 2 * 1024 * 1024
    && image.toString('base64') === match[1];
}

function publicUser(user) {
  return {
    full_name: user.full_name,
    student_id: user.student_id,
    email: user.email,
    faculty: user.faculty,
    year: user.study_year,
    phone: user.phone ?? '',
  };
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/register', async (req, res) => {
  const {
    full_name: fullName,
    student_id: studentId,
    email,
    faculty,
    year,
    phone = '',
    password,
  } = req.body ?? {};

  if (
    typeof fullName !== 'string' || fullName.trim().length < 2 ||
    typeof studentId !== 'string' || !studentId.trim() ||
    typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof faculty !== 'string' || !faculty.trim() ||
    (typeof year !== 'string' && typeof year !== 'number') ||
    typeof password !== 'string' || password.length < 8
  ) {
    return sendError(res, 400, 'Please provide valid registration details.');
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO app_students (full_name, student_id, email, password_hash, faculty, study_year, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, full_name, student_id, email, faculty, study_year, phone`,
      [fullName.trim(), studentId.trim(), email.trim().toLowerCase(), passwordHash, faculty.trim(), String(year), String(phone).trim()],
    );
    const user = result.rows[0];
    return res.status(201).json({ token: issueToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === '23505') {
      return sendError(res, 409, 'This email or student ID is already registered.');
    }
    console.error('Unable to register student:', error);
    return sendError(res, 500, 'Unable to create the account right now.');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return sendError(res, 400, 'Email and password are required.');
  }

  try {
    const result = await pool.query(
      `SELECT id, full_name, student_id, email, faculty, study_year, phone, password_hash
       FROM app_students WHERE email = $1 AND is_active = TRUE`,
      [email.trim().toLowerCase()],
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return sendError(res, 401, 'Email or password is incorrect.');
    }
    return res.json({ token: issueToken({ ...user, role: 'student' }), user: publicUser(user) });
  } catch (error) {
    console.error('Unable to sign in student:', error);
    return sendError(res, 500, 'Unable to sign in right now.');
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, username, password } = req.body ?? {};
  const adminIdentity = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminIdentity || !passwordHash || passwordHash.startsWith('generate-')) {
    return sendError(res, 503, 'Admin login has not been configured on the server.');
  }
  const identity = typeof username === 'string' ? username : email;
  if (typeof identity !== 'string' || typeof password !== 'string') {
    return sendError(res, 400, 'Admin username and password are required.');
  }

  try {
    const identityMatches = identity.trim().toLowerCase() === adminIdentity;
    const passwordMatches = await bcrypt.compare(password, passwordHash);
    if (!identityMatches || !passwordMatches) {
      return sendError(res, 401, 'Admin username or password is incorrect.');
    }
    return res.json({
      token: issueToken({ id: 'admin', role: 'admin' }),
      user: { username: adminIdentity, role: 'admin' },
    });
  } catch (error) {
    console.error('Unable to verify admin credentials:', error);
    return sendError(res, 500, 'Unable to sign in as admin right now.');
  }
});

app.get('/api/books', authenticate, requireStudent, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, author, category, drive_link, cover_image, created_at
       FROM books ORDER BY created_at DESC, id DESC`,
    );
    return res.json(result.rows.map(book => ({
      ...book,
      source: 'library',
      online_url: book.drive_link ?? '',
      digital_url: book.drive_link ?? '',
      cover_url: book.cover_image ?? '',
    })));
  } catch (error) {
    console.error('Unable to load library books:', error);
    return sendError(res, 500, 'Unable to load library books.');
  }
});

app.get('/api/books/search', authenticate, requireStudent, async (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (query.length < 2) return res.json([]);

  try {
    const result = await pool.query(
      `SELECT id, title, author, category, drive_link, cover_image, created_at
       FROM books
       WHERE title ILIKE $1 OR author ILIKE $1 OR COALESCE(category, '') ILIKE $1
       ORDER BY created_at DESC, id DESC
       LIMIT 50`,
      [`%${query}%`],
    );
    return res.json(result.rows.map(book => ({
      ...book,
      source: 'library',
      online_url: book.drive_link ?? '',
      digital_url: book.drive_link ?? '',
      cover_url: book.cover_image ?? '',
    })));
  } catch (error) {
    console.error('Unable to search library books:', error);
    return sendError(res, 500, 'Unable to search library books.');
  }
});

app.get('/api/reading-list', authenticate, requireStudent, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT book_id AS id, title, author, cover_url AS "coverUrl",
              online_url AS "onlineUrl", read_at AS "readAt"
       FROM student_reading_list
       WHERE user_id = $1
       ORDER BY read_at DESC`,
      [req.userId],
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Unable to load reading list:', error);
    return sendError(res, 500, 'Unable to load your reading list.');
  }
});

app.put('/api/reading-list', authenticate, requireStudent, async (req, res) => {
  const book = req.body ?? {};
  if (
    (typeof book.id !== 'string' && typeof book.id !== 'number') ||
    typeof book.title !== 'string' || !book.title.trim()
  ) {
    return sendError(res, 400, 'A book ID and title are required.');
  }

  try {
    const result = await pool.query(
      `INSERT INTO student_reading_list (user_id, book_id, title, author, cover_url, online_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, book_id) DO UPDATE SET
         title = EXCLUDED.title,
         author = EXCLUDED.author,
         cover_url = EXCLUDED.cover_url,
         online_url = EXCLUDED.online_url,
         read_at = NOW()
       RETURNING book_id AS id, title, author, cover_url AS "coverUrl",
                 online_url AS "onlineUrl", read_at AS "readAt"`,
      [req.userId, String(book.id), book.title.trim(), String(book.author ?? 'Unknown author'), String(book.coverUrl ?? ''), String(book.onlineUrl ?? '')],
    );
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Unable to save reading-list book:', error);
    return sendError(res, 500, 'Unable to save this book to your reading list.');
  }
});

app.delete('/api/reading-list', authenticate, requireStudent, async (req, res) => {
  const bookId = typeof req.query.id === 'string' ? req.query.id : '';
  if (!bookId) return sendError(res, 400, 'A book ID is required.');

  try {
    await pool.query(
      'DELETE FROM student_reading_list WHERE user_id = $1 AND book_id = $2',
      [req.userId, bookId],
    );
    return res.status(204).end();
  } catch (error) {
    console.error('Unable to remove reading-list book:', error);
    return sendError(res, 500, 'Unable to remove this book from your reading list.');
  }
});

app.get('/api/admin/books', authenticate, requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, author, category, drive_link, cover_image, views, created_at FROM books ORDER BY created_at DESC, id DESC',
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Unable to load admin books:', error);
    return sendError(res, 500, 'Unable to load books.');
  }
});

app.post('/api/admin/books', authenticate, requireAdmin, async (req, res) => {
  const { title, author, category = '', drive_link: driveLink = '', cover_image: coverImage = '' } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim() || typeof author !== 'string' || !author.trim()) {
    return sendError(res, 400, 'Book title and author are required.');
  }
  if ([category, driveLink, coverImage].some(value => typeof value !== 'string')) {
    return sendError(res, 400, 'Book details must be text values.');
  }
  if (!validWebUrl(driveLink.trim()) || !validCoverImage(coverImage.trim())) {
    return sendError(res, 400, 'The reading link must use http or https, and the cover must be an http(s) URL or a PNG, JPEG, or WebP image up to 2 MB.');
  }

  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, category, drive_link, cover_image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, author, category, drive_link, cover_image, views, created_at`,
      [title.trim(), author.trim(), category.trim(), driveLink.trim(), coverImage.trim()],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Unable to add book:', error);
    return sendError(res, 500, 'Unable to add this book.');
  }
});

app.put('/api/admin/books/:id', authenticate, requireAdmin, async (req, res) => {
  const { title, author, category = '', drive_link: driveLink = '', cover_image: coverImage = '' } = req.body ?? {};
  if (!/^\d+$/.test(req.params.id)) return sendError(res, 400, 'Invalid book ID.');
  if (typeof title !== 'string' || !title.trim() || typeof author !== 'string' || !author.trim()) {
    return sendError(res, 400, 'Book title and author are required.');
  }
  if ([category, driveLink, coverImage].some(value => typeof value !== 'string')) {
    return sendError(res, 400, 'Book details must be text values.');
  }
  if (!validWebUrl(driveLink.trim()) || !validCoverImage(coverImage.trim())) {
    return sendError(res, 400, 'The reading link must use http or https, and the cover must be an http(s) URL or a PNG, JPEG, or WebP image up to 2 MB.');
  }

  try {
    const result = await pool.query(
      `UPDATE books SET title = $1, author = $2, category = $3, drive_link = $4, cover_image = $5
       WHERE id = $6
       RETURNING id, title, author, category, drive_link, cover_image, views, created_at`,
      [title.trim(), author.trim(), category.trim(), driveLink.trim(), coverImage.trim(), req.params.id],
    );
    if (!result.rowCount) return sendError(res, 404, 'Book not found.');
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Unable to update book:', error);
    return sendError(res, 500, 'Unable to update this book.');
  }
});

app.delete('/api/admin/books/:id', authenticate, requireAdmin, async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return sendError(res, 400, 'Invalid book ID.');
  try {
    const result = await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return sendError(res, 404, 'Book not found.');
    return res.status(204).end();
  } catch (error) {
    console.error('Unable to delete book:', error);
    return sendError(res, 500, 'Unable to delete this book.');
  }
});

async function startServer() {
  if (!jwtSecret || jwtSecret.length < 32 || jwtSecret.startsWith('CHANGE_ME')) {
    throw new Error('Set JWT_SECRET to a random secret of at least 32 characters in backend/.env.');
  }
  const databaseConfigExists = process.env.DATABASE_URL
    || (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
  if (!databaseConfigExists) {
    throw new Error('Set DATABASE_URL or DB_HOST, DB_USER, and DB_NAME in backend/.env.');
  }

  await pool.query(await readFile(schemaPath, 'utf8'));
  app.listen(port, () => console.log(`Library API listening on http://localhost:${port}`));
}

startServer().catch(error => {
  console.error('Unable to start the library API:', error);
  process.exitCode = 1;
});
