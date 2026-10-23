require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { promisify } = require('util');
const pool = require('./db');

// =================== ដំណាក់កាលទី ១: កំណត់ Express App ====================
const app = express();

const PORT = process.env.PORT || 3000;
const scrypt = promisify(crypto.scrypt);
const SESSION_COOKIE = 'library_admin_session';
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const loginFailures = new Map();

function resolveFile(...candidates) {
  for (const filename of candidates) {
    const fullPath = path.join(__dirname, filename);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return path.join(__dirname, candidates[0]);
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});
function getSessionToken(req) {
  const rawCookie = req.headers.cookie;
  if (!rawCookie) return null;
  const cookie = rawCookie.split(';').map(v => v.trim()).find(v => v.startsWith(`${SESSION_COOKIE}=`));
  const token = cookie?.slice(SESSION_COOKIE.length + 1);
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derivedKey = await scrypt(password, salt, 64);
  return { salt, hash: derivedKey.toString('hex') };
}

async function verifyPassword(password, salt, storedHash) {
  const derivedKey = await scrypt(password, salt, 64);
  const expected = Buffer.from(storedHash, 'hex');
  return expected.length === derivedKey.length && crypto.timingSafeEqual(expected, derivedKey);
}

function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DURATION_MS / 1000}${secure}`
  );
}

function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`);
}

async function initializeAuth() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(80) NOT NULL UNIQUE,
      display_name VARCHAR(80) NOT NULL,
      password_salt VARCHAR(64) NOT NULL,
      password_hash VARCHAR(128) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash CHAR(64) PRIMARY KEY,
      admin_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    
    -- 📚 បន្ថែម Table របស់បងត្រង់នេះ
    CREATE TABLE IF NOT EXISTS book_loans (
      id SERIAL PRIMARY KEY,
      book_code VARCHAR(50) NOT NULL,
      book_title VARCHAR(255) NOT NULL,
      student_name VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'កំពុងខ្ចី',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS student_rewards (
      id SERIAL PRIMARY KEY,
      student_name VARCHAR(255) NOT NULL UNIQUE,
      points INT DEFAULT 0,
      rewards_earned INT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const admins = await pool.query('SELECT COUNT(*)::INTEGER AS count FROM admin_users');
  if (admins.rows[0].count > 0) return;

  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD to create the initial admin account.');
  }
  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters long.');
  }

  const credentials = await hashPassword(password);
  await pool.query(
    `INSERT INTO admin_users (username, display_name, password_salt, password_hash)
     VALUES ($1, $1, $2, $3)`,
    [username, credentials.salt, credentials.hash]
  );
  console.log(`Created initial admin account "${username}".`);
}

async function loadAdminSession(req) {
  const token = getSessionToken(req);
  if (!token) return null;
  const result = await pool.query(
    `SELECT admins.id, admins.username, admins.display_name
     FROM admin_sessions
     JOIN admin_users AS admins ON admins.id = admin_sessions.admin_id
     WHERE admin_sessions.token_hash = $1 AND admin_sessions.expires_at > NOW()`,
    [hashToken(token)]
  );
  return result.rows[0] || null;
}

async function requireAdmin(req, res, next) {
  try {
    req.admin = await loadAdminSession(req);
    if (!req.admin) return res.status(401).json({ error: 'Authentication required.' });
    return next();
  } catch (err) {
    console.error('Session lookup error:', err.message);
    return res.status(500).json({ error: 'Unable to verify the admin session.' });
  }
}

async function requireAdminPage(req, res, next) {
  try {
    req.admin = await loadAdminSession(req);
    if (!req.admin) return res.redirect('/login.html');
    return next();
  } catch (err) {
    console.error('Page session lookup error:', err.message);
    return res.status(500).send('Unable to verify the admin session.');
  }
}

// Haversine Formula គណនាចម្ងាយជាម៉ែត្រ
function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = angle => (angle * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ==================== ដំណាក់កាលទី ៤: AUTO WORKER ====================
// រត់រៀងរាល់ ៦០ វិនាទី ដើម្បីពិនិត្យម៉ោង
setInterval(async () => {
  try {
    const now = new Date();

    // ក. Auto-cancel: កក់ហើយតែមិនមកស្កេនក្នុងរង្វង់ ១៥ នាទី
    const cancelRes = await pool.query(`
      UPDATE rooms 
      SET status = 'available', "user" = NULL, start_time = NULL, end_time = NULL
      WHERE status = 'reserved' 
        AND start_time IS NOT NULL 
        AND (start_time + INTERVAL '15 minutes') <= NOW()
      RETURNING id, name
    `);
    if (cancelRes.rowCount) {
      console.log(`[Auto-Cancel] បានលុបចោលការកក់បន្ទប់ ${cancelRes.rows.map(r => r.name).join(', ')} ដោយសារមិនបានស្កេន Check-in លើស ១៥ នាទី`);
    }

    // ខ. Auto-checkout: ដល់ម៉ោងបញ្ចប់ (end_time) ដោះលែងបន្ទប់មកវិញ
    const checkoutRes = await pool.query(`
      UPDATE rooms 
      SET status = 'available', "user" = NULL, start_time = NULL, end_time = NULL
      WHERE status = 'occupied' 
        AND end_time IS NOT NULL 
        AND end_time <= NOW()
      RETURNING id, name
    `);
    if (checkoutRes.rowCount) {
      console.log(`[Auto-Checkout] បន្ទប់ ${checkoutRes.rows.map(r => r.name).join(', ')} បានផុតកំណត់ម៉ោងប្រើប្រាស់ និងដាក់ឱ្យទំនេរវិញ`);
    }
  } catch (err) {
    console.error('Auto Worker Error:', err.message);
  }
}, 60000);

// ==================== API ROUTES ====================

// ទាញយកបន្ទប់ទាំងអស់
app.get('/api/rooms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ដំណាក់កាលទី ១: កក់បន្ទប់ (Booking)
app.post('/api/rooms/book', async (req, res) => {
  const { roomId, studentName, durationHours = 2 } = req.body;
  if (!roomId || !studentName) {
    return res.status(400).json({ error: 'សូមបញ្ចូលឈ្មោះ និងលេខបន្ទប់!' });
  }

  try {
    const check = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
    if (!check.rowCount) return res.status(404).json({ error: 'រកមិនឃើញបន្ទប់នេះទេ!' });

    const room = check.rows[0];
    if (room.status !== 'available') {
      return res.status(400).json({ error: `បន្ទប់ ${room.name} មិនទំនេរទេ (${room.status})!` });
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

    const result = await pool.query(`
      UPDATE rooms 
      SET status = 'reserved', "user" = $1, start_time = $2, end_time = $3
      WHERE id = $4 RETURNING *
    `, [studentName.trim(), startTime, endTime, roomId]);

    res.json({
      message: `បានកក់បន្ទប់ ${result.rows[0].name} ជោគជ័យ! សូមទៅស្កេន Check-in ក្នុងរង្វង់ ១៥ នាទី។`,
      room: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'បរាជ័យក្នុងការកក់បន្ទប់' });
  }
});

// ដំណាក់កាលទី ២ & ៣: ស្កេន QR & GPS Check-in (In-Use)
app.post('/api/rooms/checkin', async (req, res) => {
  const { roomId, studentName, userLat, userLon } = req.body;

  if (!roomId || !studentName) {
    return res.status(400).json({ error: 'សូមបញ្ចូលឈ្មោះ និងលេខបន្ទប់!' });
  }
  if (userLat === undefined || userLon === undefined) {
    return res.status(400).json({ error: 'សូមបើក Location GPS លើទូរស័ព្ទដើម្បីផ្ទៀងផ្ទាត់ទីតាំង!' });
  }

  try {
    const check = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
    if (!check.rowCount) return res.status(404).json({ error: 'រកមិនឃើញបន្ទប់នេះទេ!' });

    const room = check.rows[0];

    // ពិនិត្យចម្ងាយ GPS (អនុញ្ញាតត្រឹម ២៥ ម៉ែត្រ)
    if (room.latitude && room.longitude) {
      const distance = calculateDistanceInMeters(room.latitude, room.longitude, userLat, userLon);
      if (distance > 25) {
        return res.status(403).json({
          error: `អ្នកនៅឆ្ងាយពីបន្ទប់ពេក (${Math.round(distance)} ម៉ែត្រ)! សូមទៅដល់មុខបន្ទប់ដើម្បីស្កេន។`
        });
      }
    }

    if (room.status === 'occupied') {
      return res.status(400).json({ error: `បន្ទប់ ${room.name} កំពុងមានអ្នកប្រើប្រាស់ហើយ!` });
    }

    // ប្តូរទៅ In-Use (occupied)
    const result = await pool.query(`
      UPDATE rooms 
      SET status = 'occupied', "user" = $1, 
          start_time = COALESCE(start_time, NOW()), 
          end_time = COALESCE(end_time, NOW() + INTERVAL '2 hours')
      WHERE id = $2 RETURNING *
    `, [studentName.trim(), roomId]);

    res.json({ message: `Check-in បន្ទប់ ${result.rows[0].name} បានជោគជ័យ!`, room: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'បរាជ័យក្នុងការ Check-in' });
  }
});

app.put('/api/rooms/:id', requireAdmin, async (req, res) => {
  const roomId = Number(req.params.id);
  const { status, user } = req.body || {};
  const validStatuses = ['available', 'reserved', 'occupied'];
  const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : '';

  if (!Number.isSafeInteger(roomId) || roomId <= 0) {
    return res.status(400).json({ error: 'Invalid room ID.' });
  }
  if (!validStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ error: 'Status must be available, reserved, or occupied.' });
  }

  try {
    const result = await pool.query(
      `UPDATE rooms
       SET status = $1,
           "user" = $2,
           start_time = CASE
             WHEN $4 THEN NULL
             ELSE COALESCE(start_time, NOW())
           END,
           end_time = CASE
             WHEN $4 THEN NULL
             ELSE end_time
           END
       WHERE id = $3
       RETURNING *`,
      [
        normalizedStatus,
        typeof user === 'string' && user.trim() ? user.trim() : null,
        roomId,
        normalizedStatus === 'available'
      ]
    );

    if (!result.rowCount) return res.status(404).json({ error: 'Room not found.' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Room status update error:', err.message);
    return res.status(500).json({ error: 'Unable to update the room status.' });
  }
});

// Web Pages
app.get('/', (req, res) => res.redirect('/login.html'));
app.get(['/dashboard.html', '/dasboard.html'], requireAdminPage, (req, res) => {
  res.sendFile(resolveFile('dasboard.html', 'dashboard.html'));
});
app.get(['/rooms.html', '/room.html'], requireAdminPage, (req, res) => res.sendFile(resolveFile('rooms.html', 'room.html')));
app.get(['/setting.html', '/settings.html'], requireAdminPage, (req, res) => {
  res.sendFile(resolveFile('setting.html', 'settings.html'));
});
app.get('/checkin.html', (req, res) => res.sendFile(resolveFile('checkin.html')));
app.get('/login.html', (req, res) => res.sendFile(resolveFile('login.html')));
app.get('/auth.js', (req, res) => res.sendFile(resolveFile('auth.js')));
app.get('/preferences.js', (req, res) => res.sendFile(resolveFile('preferences.js')));

app.post('/api/auth/login', async (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const attemptKey = req.ip;
  const now = Date.now();
  const previousAttempts = loginFailures.get(attemptKey);
  const attempts = previousAttempts && now - previousAttempts.startedAt < LOGIN_WINDOW_MS
    ? previousAttempts
    : { count: 0, startedAt: now };

  if (attempts.count >= LOGIN_MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many sign-in attempts. Please try again in 15 minutes.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, display_name, password_salt, password_hash FROM admin_users WHERE username = $1',
      [username]
    );
    const admin = result.rows[0];
    const passwordMatches = admin
      ? await verifyPassword(password, admin.password_salt, admin.password_hash)
      : false;

    if (!passwordMatches) {
      attempts.count += 1;
      loginFailures.set(attemptKey, attempts);
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    loginFailures.delete(attemptKey);
    const token = crypto.randomBytes(32).toString('hex');
    await pool.query(
      'INSERT INTO admin_sessions (token_hash, admin_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'12 hours\')',
      [hashToken(token), admin.id]
    );
    setSessionCookie(res, token);
    return res.json({ username: admin.username, displayName: admin.display_name });
  } catch (err) {
    console.error('Admin login error:', err.message);
    return res.status(500).json({ error: 'Unable to sign in right now.' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const token = getSessionToken(req);
  try {
    if (token) await pool.query('DELETE FROM admin_sessions WHERE token_hash = $1', [hashToken(token)]);
    clearSessionCookie(res);
    return res.status(204).end();
  } catch (err) {
    console.error('Admin logout error:', err.message);
    return res.status(500).json({ error: 'Unable to sign out right now.' });
  }
});

app.get('/api/auth/session', requireAdmin, (req, res) => {
  res.json({
    username: req.admin.username,
    displayName: req.admin.display_name
  });
});

app.patch('/api/admin/profile', requireAdmin, async (req, res) => {
  const displayName = typeof req.body?.displayName === 'string' ? req.body.displayName.trim() : '';
  if (!displayName || displayName.length > 80) {
    return res.status(400).json({ error: 'Display name must be between 1 and 80 characters.' });
  }

  try {
    const result = await pool.query(
      'UPDATE admin_users SET display_name = $1 WHERE id = $2 RETURNING display_name',
      [displayName, req.admin.id]
    );
    return res.json({ displayName: result.rows[0].display_name });
  } catch (err) {
    console.error('Admin profile update error:', err.message);
    return res.status(500).json({ error: 'Unable to update the admin profile.' });
  }
});

app.put('/api/admin/password', requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    return res.status(400).json({ error: 'Current and new passwords are required.' });
  }
  if (newPassword.length < 12) {
    return res.status(400).json({ error: 'New password must be at least 12 characters long.' });
  }

  try {
    const result = await pool.query(
      'SELECT password_salt, password_hash FROM admin_users WHERE id = $1',
      [req.admin.id]
    );
    const admin = result.rows[0];
    if (!admin || !(await verifyPassword(currentPassword, admin.password_salt, admin.password_hash))) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const credentials = await hashPassword(newPassword);
    await pool.query(
      'UPDATE admin_users SET password_salt = $1, password_hash = $2 WHERE id = $3',
      [credentials.salt, credentials.hash, req.admin.id]
    );

    const currentToken = getSessionToken(req);
    await pool.query(
      'DELETE FROM admin_sessions WHERE admin_id = $1 AND token_hash <> $2',
      [req.admin.id, currentToken ? hashToken(currentToken) : '']
    );
    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Admin password update error:', err.message);
    return res.status(500).json({ error: 'Unable to update the admin password.' });
  }
});

initializeAuth()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Library System is running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Server startup error:', err.message);
    process.exitCode = 1;
  });


// =========================================================================
// ==================== 📚 SOT MOUYCHHENG: BOOK BORROWING & REWARDS=========
// =========================================================================

// 📚 Book borrowing & rewards (admin only)
const borrowRoutes = require('./src/borrowRoutes');
app.use('/api/borrow', requireAdmin, borrowRoutes);

const rewardRoutes = require('./src/rewardRoutes');
app.use('/api/rewards', requireAdmin, rewardRoutes);