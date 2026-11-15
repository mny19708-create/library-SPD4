const pool = require('../db/test-connection'); // អាស្រ័យលើ File ភ្ជាប់ Database របស់អ្នក
const bcrypt = require('bcrypt'); // សម្រាប់เข้ารหัส Password

// យកទិន្នន័យ User ទាំងអស់
exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, created_at FROM users');
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// បន្ថែម User ថ្មី (Register / Add User)
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់!' });
        }

        // ពិនិត្យមើលថាតើ Email មានរួចរាល់ហើយឬยัง
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Email នេះត្រូវបានប្រើប្រាស់រួចហើយ!' });
        }

        // Hash Password មុនរក្សាទុកក្នុង Database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const queryText = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at;
        `;
        const values = [username, email, hashedPassword];
        const result = await pool.query(queryText, values);

        res.status(201).json({
            success: true,
            message: 'បានបង្កើត User ជោគជ័យ!',
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// មុខងារ Login សម្រាប់ផ្ទៀងផ្ទាត់គណនី
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'សូមបញ្ចូល Email និង Password!' });
        }

        // រកមើល User តាម Email
        const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Email ឬ Password មិនត្រឹមត្រូវ!' });
        }

        const user = userQuery.rows[0];

        // ផ្ទៀងផ្ទាត់ Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Email ឬ Password មិនត្រឹមត្រូវ!' });
        }

        res.status(200).json({
            success: true,
            message: 'Login ជោគជ័យ!',
            user: {
                id: user.id,        // ID សម្រាប់យកទៅប្រើប្រាស់
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ទាញយកទិន្នន័យ Profile តាម ID (URL Params)
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; // ទទួល ID ពី URL
        const result = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'រកមិនឃើញគណនីនេះទេ!' });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// កែប្រែព័ត៌មាន Profile តាម ID (URL Params)
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; // ទទួល ID ពី URL
        const { username, email, password } = req.body;

        if (!username || !email) {
            return res.status(400).json({ success: false, message: 'Username និង Email មិនអាចទទេបានទេ!' });
        }

        // ឆែកមើល Email ជាន់ជាមួយ User ផ្សេង
        const checkEmail = await pool.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2', 
            [email, userId]
        );
        
        if (checkEmail.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Gmail/Email នេះមានគេប្រើប្រាស់រួចហើយ!' });
        }

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await pool.query(
                'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4',
                [username, email, hashedPassword, userId]
            );
        } else {
            await pool.query(
                'UPDATE users SET username = $1, email = $2 WHERE id = $3',
                [username, email, userId]
            );
        }

        res.status(200).json({ success: true, message: 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានជោគជ័យ!' });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};