const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController'); //

// 🟢 បន្ថែម Route សម្រាប់ Admin ទាញយកទិន្នន័យ Reading Progress ទាំងអស់នៅទីនេះ
router.get('/admin/all', progressController.getAllReadingProgress);

router.post('/', progressController.saveReadingProgress); //
router.get('/user/:userId', progressController.getUserAllProgress); //
router.get('/:userId/:ebookId', progressController.getReadingProgress); //

module.exports = router; //