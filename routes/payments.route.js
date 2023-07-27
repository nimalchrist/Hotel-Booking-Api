// TODO all the routes corresponding to the payments controller
const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

// Route to handle adding a new payment
router.route("/add").post( paymentController.addPayment);

module.exports = router;