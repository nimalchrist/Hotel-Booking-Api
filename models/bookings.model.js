// TODO the definition of bookings model
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

  hotelId: {
    type:mongoose.Schema.Types.ObjectId ,
    ref:'hotels',
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'users',
    required: true,
  },

  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payments',
    required:true,
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
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel.rooms',
      required: true,
    },

    numberOfRooms: {
      type: Number,
      required: true,
    },
  },
});

const booking=mongoose.model("book",bookingSchema);
module.exports=booking;