const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ពិនិត្យផ្ទៀងផ្ទាត់ជាមួយ ADMIN_EMAIL និង ADMIN_PASSWORD ក្នុង .env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      
      const token = jwt.sign(
        { role: 'admin', email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );

      return res.json({
        success: true,
        message: 'Login ជោគជ័យ',
        token: token
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ឬ Password មិនត្រឹមត្រូវឡើយ!' 
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};