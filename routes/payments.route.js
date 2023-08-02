// TODO all the routes corresponding to the payments controller
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments.controller');

// Route to handle adding a new payment
router.route("/payment/:userId/:hotelId/add").post( paymentController.Controller);

module.exports = router;