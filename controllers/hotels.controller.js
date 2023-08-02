// TODO the controllers of hotels collection
const hotelService = require("../services/hotels.service");
const mongoose = require('mongoose');
const User = require("../models/users.model");
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getAllHotels();
    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching all hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.createHotel = async (req, res) => {
    try {
      const {
        hotelName,
        hotelType,
        location: { cityName, latitude, longitude, address },
        ratePerNight,
        overview,
        amenities,
        images,
        locationFeatures,
      } = req.body;
  
      const hotelData = {
        hotelName,
        hotelType,
        location: { cityName, latitude, longitude, address },
        ratePerNight,
        overview,
        amenities,
        images,
        locationFeatures,
      };
  
      const newHotel = await hotelService.createHotel(hotelData);
      res.status(201).json({ message: 'Hotel created successfully', hotel: newHotel });
    } catch (error) {
      console.error('Error creating hotel:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.updateHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const {
      hotelName,
      hotelType,
      location: { cityName, latitude, longitude, address },
      ratePerNight,
      overview,
      amenities,
      images,
      locationFeatures,
    } = req.body;

    const hotelData = {
      hotelName,
      hotelType,
      location: { cityName, latitude, longitude, address },
      ratePerNight,
      overview,
      amenities,
      images,
      locationFeatures,
    };

    const updatedHotel = await hotelService.updateHotel(hotelId, hotelData);
    res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await hotelService.getHotelById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.addReview = async (req, res) => {
    try {
      const { userId, comment, guestRating } = req.body;
      const hotelId = req.params.hotelId;
  
      const hotel = await hotelService.getHotelById(hotelId);
      if (!hotel) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const updatedHotel = await hotelService.addReview(hotelId, userId, comment, guestRating);
  
      res.status(201).json({ message: 'Review added successfully', hotel: updatedHotel });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.deleteReview = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const reviewId = req.params.reviewId;
    const updatedHotel = await hotelService.deleteReview(hotelId, reviewId);
    res.status(200).json({ message: 'Review deleted successfully', hotel: updatedHotel });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.insertRoom = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    console.log(hotelId);

    const { roomType, roomSpecification, roomRate, roomCount } = req.body;
    console.log(roomType);
    const roomData = { roomType, roomSpecification, roomRate, roomCount };
    console.log(roomData);
    const updatedHotel = await hotelService.insertRoom(hotelId, roomData);
    res.status(201).json({ message: 'Room added successfully', hotel: updatedHotel });
  } catch (error) {
    console.error('Error inserting room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};