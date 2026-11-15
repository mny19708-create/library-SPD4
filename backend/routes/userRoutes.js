const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 // ភ្ជាប់ Middleware សម្រាប់ឆែក Token របស់ User

// 💡 Routes ដែលមានស្រាប់
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);

// 🟢 បន្ថែម Routes សម្រាប់ Profile ទាំងពីរនេះចូលទីនេះ
router.get('/profile/:id', userController.getUserProfile);
router.put('/profile/:id', userController.updateUserProfile);
module.exports = router;