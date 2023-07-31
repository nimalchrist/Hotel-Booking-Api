// TODO all the routes corresponding to the hotels controller

const express = require("express");
const hotelController = require("../controllers/hotels.controller");

const router = express.Router();

router.get("/search", hotelController.handleSearchRequest);
//router.get("/search", hotelController.searchHotels);

router.get("/delete/:id", hotelController.deleteHotelById);
router.get("/findAll", hotelController.getAllHotels);
router.get("/findById/:id", hotelController.getHotelById);
module.exports = router;