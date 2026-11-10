const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

router.post('/claim', certificateController.claimCertificate);
router.get('/user/:userId', certificateController.getUserCertificates);
router.post('/generate', certificateController.generateCertificate);

module.exports = router;