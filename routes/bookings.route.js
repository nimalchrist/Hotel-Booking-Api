const express = require('express');
const controller=require("../controllers/controller");
const router = express.Router();

router.route("/booking").post(controller.createBooking);
router.route("/booking/:hotelId").get(controller.getHotelBookings);

module.exports = router;