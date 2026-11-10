const express = require('express');
const router = express.Router();
const { addCategory, getAllCategories,updateCategory,deleteCategory } = require('../controllers/categoryController');

// Route សម្រាប់ទាញយក Categories ទាំងអស់
router.get('/', getAllCategories);

// Route សម្រាប់បង្កើត Category ថ្មី
router.post('/', addCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
module.exports = router;