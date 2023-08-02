const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// GET user details by ID along with decrypted card details
router.get('/users/user/cards/:userId', usersController.getUserCardDetails);

// POST add new card details to the addedCards field
router.post('/users/user/cards/:userId/saveCard', usersController.addNewCard);

module.exports = router;

