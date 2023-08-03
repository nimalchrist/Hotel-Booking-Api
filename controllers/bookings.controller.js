const services = require("../services/bookings.service");
const Hotel = require("../models/hotels.model");
const Booking = require("../models/bookings.model");

exports.createBooking = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      // Extract the data from the request body
      userId = req.user;
      const { hotelId, paymentId, reservation } = req.body;

      // Find the hotel to update the room count and total rooms
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }

      // Find the room in the hotel with the specified roomType and roomId
      const room = Hotel.find({
        "room._id": reservation.roomId,
        "room.roomType": reservation.roomType,
      });
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Check if there are enough available rooms
      if (room.roomCount < reservation.numberOfRooms) {
        return res
          .status(400)
          .json({ error: "Not enough available rooms for booking" });
      }

      //update the room count
      hotel.updateRoomCountAfterBooking(
        reservation.roomType,
        reservation.numberOfRooms
      );

      // Save the updated hotel
      await hotel.save();

      // Create the new booking
      const newBooking = new Booking({
        hotelId,
        userId,
        paymentId,
        reservation,
      });

      // Save the booking to the database
      await newBooking.save();

      res
        .status(201)
        .json({ msg: "Booking created successfully", booking: newBooking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};

exports.getHotelBookings = async (req, res) => {
  const { hotelId } = req.params;

  try {
    // Call the getHotelBookings function from services.js
    const bookings = await services.getHotelBookings(hotelId);

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
