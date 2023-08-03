const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotels.controller');

// fency's routes
router.get("/delete/:id", hotelController.deleteHotelById);
router.get("/search", hotelController.handleSearchRequest);
router.get("/findAll", hotelController.getAllHotels);

// kannan's routes
router.post('/', hotelController.createHotel);
router.get('/:hotelId', hotelController.getHotelById);
router.put('/:hotelId', hotelController.updateHotel);
router.post('/:hotelId/reviews', hotelController.addReview);
router.delete('/:hotelId/reviews/:reviewId', hotelController.deleteReview);
router.post('/:hotelId/rooms', hotelController.insertRoom);
router.get("/:hotelId/guest-reviews", hotelController.getGuestReviews);

module.exports = router;
