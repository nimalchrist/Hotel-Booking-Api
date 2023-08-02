// TODO the services of hotels collection
const Hotel = require("../models/hotels.model");

exports.findHotelByIdQuery = async (id) => {
  console.log(Hotel.findOne({ _id: id }));
  return Hotel.findOne({ _id: id });
};

exports.deleteHotelByIdQuery = async (id) => {
  return Hotel.deleteOne({ _id: id });
};

exports.findAllHotelsQuery = async () => {
  return Hotel.find();
};


// Function to search hotels based on search criteria
exports.searchHotelsQuery = async (searchTerm) => {
  try {
    const searchResults = await Hotel.aggregate([
      {
        $search: {
          index: 'default', 
          text: {
            query: searchTerm,
            path: ['hotelName', 'location.cityName', 'location.address']
          }
        }
      }
    ]).exec();
    console.log(searchResults);
    return searchResults;
  } catch (error) {
    throw new Error('An error occurred while searching hotels.');
  }
};

// Function to filter hotels based on filtering options
exports.filterHotelsQuery = (hotels, numberOfRooms, minPrice, maxPrice, selectedRating, selectedAmenities) => {
  try {
    // Apply filtering options to the search results
    let filteredResults = hotels;

    // Filter by available rooms
    const hasAvailableRooms = filteredResults.some((hotel) => {
      return hotel.totalRooms >= numberOfRooms;
    });

    if (hasAvailableRooms) {
      // Filter by price range if provided
      if (minPrice || maxPrice) {
        filteredResults = filteredResults.filter((hotel) => {
          const hotelPrice = parseFloat(hotel.ratePerNight);
          const isPriceInRange = (!minPrice || hotelPrice >= minPrice) && (!maxPrice || hotelPrice <= maxPrice);
          return isPriceInRange;
        });
      }

      // Filter by selected rating if provided
      if (!isNaN(selectedRating)) {
        filteredResults = filteredResults.filter((hotel) => {
          const hotelRating = Math.round(hotel.rating);
          return hotelRating === selectedRating;
        });
      }

      // Filter by selected amenities if provided
      if (selectedAmenities.length > 0) {
        // Remove whitespace and newline characters from amenity names
        const cleanedSelectedAmenities = selectedAmenities.map((amenity) => amenity.trim());

        filteredResults = filteredResults.filter((hotel) => {
          const hasSelectedAmenities = cleanedSelectedAmenities.some((amenity) => hotel.amenities.includes(amenity));
          return hasSelectedAmenities;
        });
      }

      return filteredResults;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error('An error occurred while filtering hotels.');
  }
};
