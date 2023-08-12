const Hotel = require("../models/hotels.model");

exports.findSearchResults = async (query) => {
  try {
    return Hotel.find(query);
  } catch (error) {
    throw new Error("Error fetching all hotels");
  }
};

exports.findAllHotelsQuery = async () => {
  try {
    return Hotel.find();
  } catch (error) {
    throw new Error("Error fetching all hotels");
  }
};

exports.createHotel = async (hotelData) => {
  try {
    const newHotel = new Hotel(hotelData);
    await newHotel.save();
    return newHotel;
  } catch (error) {
    throw new Error("Error creating hotel");
  }
};

exports.updateHotel = async (hotelId, hotelData) => {
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    Object.assign(hotel, hotelData);
    await hotel.save();
    return hotel;
  } catch (error) {
    throw new Error("Error updating hotel");
  }
};

exports.deleteHotelByIdQuery = async (id) => {
  try {
    return Hotel.deleteOne({ _id: id });
  } catch (error) {
    throw new Error("Error updating hotel");
  }
};

exports.getHotelById = async (hotelId) => {
  try {
    const hotel = await Hotel.findById(hotelId);
    return hotel;
  } catch (error) {
    throw new Error("Error fetching hotel by ID");
  }
};

exports.addReview = async (hotelId, userId, comment, guestRating) => {
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    hotel.guestReviews.push({ user: userId, comment, guestRating });
    hotel.numReviews = hotel.guestReviews.length;

    // Recalculate the average rating and set the overallReview based on the rating
    hotel.calculateAverageRating();

    await hotel.save();
    return hotel;
  } catch (error) {
    throw new Error("Error adding review");
  }
};

exports.deleteReview = async (hotelId, reviewId) => {
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    hotel.guestReviews = hotel.guestReviews.filter(
      (review) => review._id.toString() !== reviewId
    );
    hotel.numReviews = hotel.guestReviews.length;
    hotel.calculateAverageRating();
    await hotel.save();
    return hotel;
  } catch (error) {
    throw new Error("Error deleting review");
  }
};

exports.insertRoom = async (hotelId, roomData) => {
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    hotel.rooms.push(roomData);
    hotel.calculateTotalRooms();
    await hotel.save();
    return hotel;
  } catch (error) {
    throw new Error("Error inserting room");
  }
};
exports.getGuestReviews = async (hotelId) => {
  try {
    const hotel = await Hotel.findById(hotelId)
      .populate({
        path: "guestReviews.user",
        select: "userName profilePicture",
      })
      .select("guestReviews.comment guestReviews.guestRating");
    hotel.guestReviews.reverse();
    return hotel;
  } catch (error) {
    return [];
  }
};