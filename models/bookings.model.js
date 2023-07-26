// TODO the definition of bookings model
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "hotels",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payments",
    required: true,
  },
  reservation: {
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
  },
});

const bookings = mongoose.model("booking", bookingSchema);
module.exports = bookings;