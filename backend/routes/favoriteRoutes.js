const express = require('express');
const router = express.Router();
const { 
  addFavorite, 
  getFavoritesByUser, 
  removeFavorite 
} = require('../controllers/favoriteController');

router.post('/add', addFavorite);
router.get('/user/:userId', getFavoritesByUser);
router.delete('/remove', removeFavorite);

module.exports = router;