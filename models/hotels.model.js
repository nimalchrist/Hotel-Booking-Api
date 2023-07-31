// TODO the definition of hotels model
const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
  hotelType: {
    type: String,
    required: true,
  },
  location: {
    cityName: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  rating: {
    type: Number,
    required: true,
  },
  normalReview: {
    type: String,
    required: true,
  },
  numReviews: {
    type: Number,
    required: true,
  },
  ratePerNight: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  locationFeatures: {
    type: String,
  },
  totalRooms: {
    type: Number,
  },
  rooms: [
    {
      availability: {
        type: Number,
      },
      roomType: {
        type: String,
        required: true,
      },
      roomSpecification: {
        type: String,
        required: true,
      },
      roomRate: {
        type: Number,
        required: true,
      },
    },
  ],
  amenities: [String],
  guestReviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      review: {
        type: String,
        required: true,
      },
    },
  ],
  interiorImages: [String],
});

const hotels = mongoose.model("hotels", hotelSchema);
module.exports = hotels;