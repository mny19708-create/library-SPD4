const express = require('express');
const router = express.Router();
const { 
    addEbook, 
    getAllEbooks, 
    getEbookById, // 🟢 បន្ថែម getEbookById ចូលទីនេះ
    updateEbook, 
    deleteEbook 
} = require('../controllers/ebookController');

// 🔗 Route តាមលំដាប់លំដោយត្រឹមត្រូវ
router.get('/', getAllEbooks);
router.get('/:id', getEbookById); // 🟢 ប្រើប្រាស់ដោយផ្ទាល់មិនបាច់មាន ebookController ខាងមុខទេ
router.post('/add', addEbook);
router.put('/:id', updateEbook);
router.delete('/:id', deleteEbook);

module.exports = router;