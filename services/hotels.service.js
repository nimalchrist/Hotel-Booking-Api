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

// Function to search hotels based on search criteria
// exports.searchHotelsQuery = async (searchTerm) => {
//   try {
//     const searchResults = await Hotel.aggregate([
//       {
//         $search: {
//           index: 'default',
//           text: {
//             query: searchTerm,
//             path: ['hotelName', 'location.cityName', 'location.address']
//           }
//         }
//       }
//     ]).exec();
//     console.log(searchResults);
//     return searchResults;
//   } catch (error) {
//     throw new Error('An error occurred while searching hotels.');
//   }
// };

// // Function to filter hotels based on filtering options
// exports.filterHotelsQuery = (hotels, numberOfRooms, minPrice, maxPrice, selectedRating, selectedAmenities) => {
//   try {
//     // Apply filtering options to the search results
//     let filteredResults = hotels;

//     // Filter by available rooms
//     const hasAvailableRooms = filteredResults.some((hotel) => {
//       return hotel.totalRooms >= numberOfRooms;
//     });

//     if (hasAvailableRooms) {
//       // Filter by price range if provided
//       if (minPrice || maxPrice) {
//         filteredResults = filteredResults.filter((hotel) => {
//           const hotelPrice = parseFloat(hotel.ratePerNight);
//           const isPriceInRange = (!minPrice || hotelPrice >= minPrice) && (!maxPrice || hotelPrice <= maxPrice);
//           return isPriceInRange;
//         });
//       }

//       // Filter by selected rating if provided
//       if (!isNaN(selectedRating)) {
//         filteredResults = filteredResults.filter((hotel) => {
//           const hotelRating = Math.round(hotel.rating);
//           return hotelRating === selectedRating;
//         });
//       }

//       // Filter by selected amenities if provided
//       if (selectedAmenities.length > 0) {
//         // Remove whitespace and newline characters from amenity names
//         const cleanedSelectedAmenities = selectedAmenities.map((amenity) => amenity.trim());

//         filteredResults = filteredResults.filter((hotel) => {
//           const hasSelectedAmenities = cleanedSelectedAmenities.some((amenity) => hotel.amenities.includes(amenity));
//           return hasSelectedAmenities;
//         });
//       }

//       return filteredResults;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     throw new Error('An error occurred while filtering hotels.');
//   }
// }
