// TODO all the routes corresponding to the hotels controller
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/hotels.controller');

router.get('/hotels', controllers.getAllHotels);
router.post('/hotels', controllers.createHotel);
router.put('/hotels/:hotelId', controllers.updateHotel);
router.get('/hotels/:hotelId', controllers.getHotelById);
router.post('/hotels/:hotelId/reviews', controllers.addReview);
router.delete('/hotels/:hotelId/reviews/:reviewId', controllers.deleteReview);
router.post('/hotels/:hotelId/rooms', controllers.insertRoom);

module.exports = router;