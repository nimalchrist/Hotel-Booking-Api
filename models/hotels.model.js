const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
  hotelType: {
    type: Number,
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
    default: 0,
  },
  overallReview: {
    type: String,
    default: "Not Reviewed",
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  ratePerNight: {
    type: Number,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  locationFeatures: [String],
  rooms: [
    {
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
      roomCount: {
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
      comment: {
        type: String,
        required: true,
      },
      guestRating: {
        type: Number,
        required: true,
      },
    },
  ],
  images: [String],
  totalRooms: {
    type: Number,
    default: 0,
  },
});

// Calculate the average guestRating for the hotel
hotelSchema.methods.calculateAverageRating = function () {
  const totalRatings = this.guestReviews.reduce(
    (total, review) => total + review.guestRating,
    0
  );
  const averageRating = totalRatings / this.guestReviews.length;
  this.rating = averageRating;

  // Set the overallReview based on the rating
  if (averageRating >= 0 && averageRating < 1) {
    this.overallReview = "Not Preferable";
  } else if (averageRating >= 1 && averageRating < 2) {
    this.overallReview = "Poor";
  } else if (averageRating >= 2 && averageRating < 3) {
    this.overallReview = "Fair";
  } else if (averageRating >= 3 && averageRating < 4) {
    this.overallReview = "Good";
  } else if (averageRating >= 4 && averageRating <= 5) {
    this.overallReview = "Very Good";
  }
};

hotelSchema.methods.calculateTotalRooms = function () {
  this.totalRooms = this.rooms.reduce(
    (total, room) => total + room.roomCount,
    0
  );
};

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
