const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // ទាញយក Token ពី Bearer <token>

  if (!token) {
    return res.status(403).json({ success: false, message: 'គ្មានសិទ្ធិ Access ទេ (No token provided)' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token មិនត្រឹមត្រូវ ឬអស់សុពលភាព!' });
    }
    req.user = user;
    next(); // អនុញ្ញាតឱ្យរត់ទៅមុខបន្ត (ទៅកាន់ Controller)
  });
};

module.exports = verifyAdmin;