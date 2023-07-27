const Booking = require('../models/booking');
const users = require('../models/user');
const hotel = require('../models/hotel');
const payments = require('../models/payment');


exports.createBooking = async (req, res) => {
  try {
    // Extract the data from the request body
    const { userId, hotelId, paymentId, reservation } = req.body;

    const user = await users.findById(userId);
    const hotels = await hotel.findById(hotelId);
    const payment = await payments.findById(paymentId);

    if (!user || !hotels || !payment) {
      return res.status(404).json({ message: 'User, hotel, or payment not found.' });
    }

    // Create a new booking 
    const newBooking = await Booking.create({
      user: user._id, 
      hotel: hotels._id, 
      payment: payment._id,
      reservation,
    });

    res.status(201).json({ msg: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getHotelBookings = async (req, res) => {
  const { hotelId } = req.params;

  try {
    const bookings = await Booking.find({ hotelId });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};