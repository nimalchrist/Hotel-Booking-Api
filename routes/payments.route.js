// TODO all the routes corresponding to the payments controller
const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

// Route to handle adding a new payment
router.route("/payment/:userid/:hotelId/add").post( payments.controller.Controller);

module.exports = router;