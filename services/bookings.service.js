const Booking = require("../models/booking");

// Function to create a new booking

const createBooking = async (bookingData) => {
  const newBooking = new Booking(bookingData);
  const savedBooking = await newBooking.save();
  return savedBooking;
};

// Function to get hotel bookings

const getHotelBookings = async (hotelId) => {
  const bookings = await Booking.find({ hotelId });
  return bookings;
};
