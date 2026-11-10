const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const path = require('path');
// Middleware
app.use(cors());
app.use(express.json());
const verifyAdmin = require('./middleware/authMiddleware');

// Import Routes ផ្សេងៗ (យើងនឹងបង្កើតវាជាបន្តបន្ទាប់)
const adminRoutes = require('./routes/adminRoutes');
const ebookRoutes = require('./routes/ebookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
// const certificateRoutes = require('./routes/certificateRoutes');
app.use('/api/admin', adminRoutes);
app.use('/api/ebooks', ebookRoutes);
// app.use('/api/certificates', certificateRoutes);
app.use('/api/categories', categoryRoutes);
// ហៅ User Routes មកប្រើ

app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);

const progressRoutes = require('./routes/progressRoutes'); // អាស្រ័យលើទីតាំង file របស់អ្នក
app.use('/api/progress', progressRoutes);
app.use('/api/stats', require('./routes/stats'))

app.use('/api/favorites', favoriteRoutes);
// 1. បញ្ជាក់ទីតាំងថត build របស់ Frontend (dist)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 2. SPA Fallback (ប្រើ Regular Expression)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});