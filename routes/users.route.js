// TODO all the routes corresponding to the users controller
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Endpoint for fetching user details by ID
router.get('/:userId', usersController.getUserDetails);

// Endpoint for saving card details for the logged-in user
router.post('/:userId/saveCard', usersController.saveCardDetails);

module.exports = router;