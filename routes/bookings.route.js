const express = require("express");
const bookingController = require("../controllers/bookings.controller");
const router = express.Router();

router.route("/booking/addbooking").post(bookingController.createBooking);
router.route("/booking/:hotelId").get(bookingController.getHotelBookings);

module.exports = router;
