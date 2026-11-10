const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ទីតាំងថត build របស់ Frontend (ត្រូវនៅក្រោម path និង app)
{
  "name": "library-spd4",
  "private": true,
  "scripts": {
    "build": "cd frontend && npm install && npm run build && cd ../backend && npm install",
    "start": "cd backend && node server.js"
  }
}
// Middleware
app.use(cors());
app.use(express.json());
const verifyAdmin = require('./middleware/authMiddleware');

// Import Routes
const adminRoutes = require('./routes/adminRoutes');
const ebookRoutes = require('./routes/ebookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const progressRoutes = require('./routes/progressRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/ebooks', ebookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/stats', require('./routes/stats'));
app.use('/api/favorites', favoriteRoutes);

// Serve ឯកសារ static របស់ Vue
app.use(express.static(distPath));

// SPA fallback: គ្រប់ route លើកលែង /api
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
