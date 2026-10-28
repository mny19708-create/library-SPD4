require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const pool = require('./db');

const app = express();

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
    secret: 'digital-library-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Multer memory storage for direct Base64 image storage in Database
const upload = multer({ storage: multer.memoryStorage() });

// Admin Authentication Middleware
function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin/login');
}

// User Authentication Middleware (Allows both standard users and admin)
function requireUser(req, res, next) {
    if ((req.session && req.session.user) || (req.session && req.session.isAdmin)) {
        return next();
    }
    res.redirect('/login');
}

// Helper Function: Google Drive Embed URL
function getDriveEmbedUrl(url) {
    if (!url) return '';
    const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
}

// ---------------- USER AUTH ROUTES ----------------
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            req.session.user = result.rows[0];
            res.redirect('/');
        } else {
            res.render('login', { error: 'ឈ្មោះគណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ!' });
        }
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'មានបញ្ហាក្នុងការចូលគណនី' });
    }
});

app.get('/signup', (req, res) => {
    res.render('user-signup', { error: null });
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const check = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (check.rows.length > 0) {
            return res.render('user-signup', { error: 'ឈ្មោះគណនីនេះមានរួចហើយ!' });
        }
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('user-signup', { error: 'មានបញ្ហាក្នុងការចុះឈ្មោះ' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// ---------------- USER ROUTES ----------------
app.get('/', requireUser, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
        res.render('index', { books: result.rows, user: req.session.user || { username: 'Admin' } });
    } catch (err) {
        console.error(err);
        res.status(500).send('មានបញ្ហាក្នុងការទាញយកទិន្នន័យសៀវភៅ');
    }
});

// Local API Endpoint for Books
app.get('/api/books', requireUser, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
        res.json({ success: true, books: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// ---------------- BOOK READER ROUTE ----------------
app.get('/books/read/:id', requireUser, async (req, res) => {
    try {
        const bookId = req.params.id;
        const updateQuery = 'UPDATE books SET views = views + 1 WHERE id = $1 RETURNING *';
        const result = await pool.query(updateQuery, [bookId]);

        if (result.rows.length === 0) {
            return res.status(404).send('រកមិនឃើញសៀវភៅនេះទេ');
        }

        const book = result.rows[0];
        const embedUrl = getDriveEmbedUrl(book.drive_link);

        res.send(`
            <!DOCTYPE html>
            <html lang="km">
            <head>
                <meta charset="UTF-8">
                <title>${book.title} - MAKE LIBRARY</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    body { margin: 0; padding: 0; background-color: #121212; color: #e0e0e0; font-family: 'Kantumruy Pro', sans-serif; overflow: hidden; height: 100vh; display: flex; flex-direction: column; }
                    .reader-top-bar { background-color: #212121; color: #ffffff; padding: 8px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; font-size: 0.9rem; z-index: 10; }
                    .reader-top-bar a { color: #e0e0e0; text-decoration: none; }
                    .reader-top-bar a:hover { color: #ffffff; text-decoration: underline; }
                    .reader-body { display: flex; flex: 1; position: relative; height: calc(100vh - 45px); }
                    .reader-sidebar { width: 50px; background-color: #1a1a1a; border-right: 1px solid #333; display: flex; flex-direction: column; align-items: center; padding-top: 15px; gap: 20px; z-index: 5; }
                    .reader-sidebar i { color: #aaa; font-size: 1.2rem; cursor: pointer; }
                    .reader-content { flex: 1; background-color: #000; display: flex; justify-content: center; align-items: center; }
                    iframe { width: 100%; height: 100%; border: none; }
                </style>
            </head>
            <body>
                <div class="reader-top-bar">
                    <div><strong>MAKE LIBRARY READER</strong></div>
                    <div><a href="/"><i class="bi bi-arrow-left me-1"></i> ត្រឡប់ក្រោយវិញ</a></div>
                </div>
                <div class="reader-body">
                    <div class="reader-sidebar">
                        <i class="bi bi-bank" title="Library Home"></i>
                        <i class="bi bi-search" title="Search in Book"></i>
                    </div>
                    <div class="reader-content">
                        <iframe src="${embedUrl}" allow="autoplay"></iframe>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send('មានបញ្ហាក្នុងការបើកសៀវភៅ');
    }
});

// ---------------- ADMIN AUTH ROUTES ----------------
app.get('/admin/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('login', { error: 'ឈ្មោះគណនី ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ!' });
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

// ---------------- PROTECTED ADMIN ROUTES ----------------
app.get('/admin', requireAdmin, async (req, res) => {
    try {
        const booksResult = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
        const books = booksResult.rows;
        const totalBooks = books.length;

        let totalUsers = 0;
        try {
            const userResult = await pool.query('SELECT COUNT(*) FROM users');
            totalUsers = userResult.rows[0].count;
        } catch (e) { totalUsers = 0; }

        let totalViews = 0;
        try {
            const viewResult = await pool.query('SELECT SUM(views) FROM books');
            totalViews = viewResult.rows[0].sum || 0;
        } catch (e) { totalViews = 0; }

        let percentageStat = totalBooks > 0 ? Math.min(100, Math.round((totalViews / (totalBooks * 5)) * 100)) : 0;

        res.render('admin', { 
            books, 
            totalBooks, 
            totalUsers, 
            totalViews,
            percentageStat,
            monthlyBorrowLabels: ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា'],
            monthlyBorrowData: [65, 59, 80, 81, 56, 55, 72, 85, 90, 110]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ Admin');
    }
});

// Add Book Route with Multer Memory Storage & Base64 Insertion into Database
app.post('/admin/books/add', requireAdmin, upload.single('coverImage'), async (req, res) => {
    try {
        const { title, author, category, driveLink } = req.body;
        
        let coverImage = '';
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            coverImage = `data:${req.file.mimetype};base64,${b64}`;
        }

        const query = 'INSERT INTO books (title, author, category, drive_link, cover_image) VALUES ($1, $2, $3, $4, $5)';
        await pool.query(query, [title, author, category, driveLink, coverImage]);
        
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('មិនអាចបន្ថែមសៀវភៅបានទេ៖ ' + err.message);
    }
});

// Edit Book Route
app.post('/admin/books/edit/:id', requireAdmin, upload.single('coverImage'), async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, author, category, driveLink } = req.body;
        
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const coverImage = `data:${req.file.mimetype};base64,${b64}`;
            const query = 'UPDATE books SET title = $1, author = $2, category = $3, drive_link = $4, cover_image = $5 WHERE id = $6';
            await pool.query(query, [title, author, category, driveLink, coverImage, bookId]);
        } else {
            const query = 'UPDATE books SET title = $1, author = $2, category = $3, drive_link = $4 WHERE id = $5';
            await pool.query(query, [title, author, category, driveLink, bookId]);
        }
        
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('មិនអាចកែប្រែសៀវភៅបានទេ៖ ' + err.message);
    }
});

app.post('/admin/books/delete/:id', requireAdmin, async (req, res) => {
    try {
        const bookId = req.params.id;
        await pool.query('DELETE FROM books WHERE id = $1', [bookId]);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('មិនអាចលុបសៀវភៅបានទេ');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server កំពុងដំណើរការលើ http://localhost:${PORT}`);
});