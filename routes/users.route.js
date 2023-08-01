const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// GET user details by ID
router.get('/:userId', usersController.getUserDetails)

// POST add new card details
router.post('/:userId/saveCard', usersController.addNewCard);

module.exports = router;

