const bookingService = require("../services/bookings.service");
const hotelService = require("../services/hotels.service");
const Booking = require("../models/bookings.model");

exports.createBooking = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      userId = req.user;
      const { hotelId, paymentId, reservation } = req.body;

      const hotel = await hotelService.getHotelById(hotelId);
      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }
      const room = bookingService.findHotelRoom(
        reservation.roomId,
        reservation.roomType
      );
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      if (room.roomCount < reservation.numberOfRooms) {
        return res
          .status(400)
          .json({ error: "Not enough available rooms for booking" });
      }
      hotel.updateRoomCountAfterBooking(
        reservation.roomType,
        reservation.numberOfRooms
      );

      await bookingService.updateTheRoomDetails(hotel);

      const newBooking = new Booking({
        hotelId,
        userId,
        paymentId,
        reservation,
      });
      const bookedData = await bookingService.createBooking(newBooking);
      console.log(bookedData);
      res
        .status(201)
        .json({ msg: "Booking created successfully", booking: bookedData });
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
    const bookings = await bookingService.getHotelBookings(hotelId);
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
