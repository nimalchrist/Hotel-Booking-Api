const Booking = require("../models/bookings.model");
const Hotel = require("../models/hotels.model");

exports.findHotelRoom = async (roomId, roomType) => {
  try {
    const room = await Hotel.findOne({
      "room._id": roomId,
      "room.roomType": roomType,
    });
    return room;
  } catch (error) {
    return error;
  }
};
exports.updateTheRoomDetails = async (updatedHotel) => {
  try {
    await updatedHotel.save();
  } catch (error) {
    return error;
  }
};
exports.createBooking = async (bookingData) => {
  try {
    console.log(bookingData);
    await bookingData.save();
    console.log(bookingData);
    return bookingData;
  } catch (error) {
    return error;
  }
};
exports.getHotelBookings = async (hotelId) => {
  const bookings = await Booking.find({ hotelId });
  return bookings;
};