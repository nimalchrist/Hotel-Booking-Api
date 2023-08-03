// TODO the controllers of hotels collection
const Hotel = require("../models/hotels.model");
const hotelServices = require("../services/hotels.service");

const handleSearchRequest = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const checkInDate = new Date(req.query.checkIn);
    const checkOutDate = new Date(req.query.checkOut);
    const numberOfRooms = parseInt(req.query.rooms);
    console.log(searchTerm)
    // Extract the filtering options from query parameters
    const priceRange = req.query.priceRange;
    
    const selectedRating = parseInt(req.query.rating);
    const selectedAmenities = req.query.amenities ? req.query.amenities.split(',') : [];
    console.log(selectedAmenities)
    // Validate check-in and check-out dates
    const parsedCheckInDate = Date.parse(checkInDate);
    const parsedCheckOutDate = Date.parse(checkOutDate);

    if (isNaN(parsedCheckInDate) || isNaN(parsedCheckOutDate)) {
      return res.status(400).json({ error: "Invalid date format. Please provide dates in the format YYYY-MM-DD." });
    }

    // Construct the base query for searching hotels based on the searchTerm and numberOfRooms
    const baseQuery = {
      $or: [
        { hotelName: { $regex: searchTerm, $options: "i" } },
        { "location.cityName": { $regex: searchTerm, $options: "i" } },
        { "location.address": { $regex: searchTerm, $options: "i" } },
      ],
      // availability: { $gte: numberOfRooms },
      totalRooms: { $gte: numberOfRooms },

    };
    console.log(baseQuery)
    const lowercaseSelectedAmenities = selectedAmenities.map((amenity) => amenity.toLowerCase());
    console.log(lowercaseSelectedAmenities);
    // Create an array of regular expressions to match two-word amenities with spaces
    const amenityRegexArray = lowercaseSelectedAmenities.map((amenity) => {
      const regexString = amenity.split(' ').join('\\s+');
      return new RegExp(`^${regexString}$`, 'i'); // Added ^ and $ to match the entire string
    });
    
    console.log(amenityRegexArray)

    // Add additional filters to the base query based on user-selected options
    const additionalFilters = {};

    if (!isNaN(minPrice)) {
      additionalFilters.ratePerNight = { $gte: minPrice };
    }

    if (!isNaN(maxPrice)) {
      additionalFilters.ratePerNight = { ...additionalFilters.price, $lte: maxPrice };
    }

    if (!isNaN(selectedRating)) {
      additionalFilters.rating = { $gte: selectedRating };
    }
    
    console.log(amenityRegexArray);
if (amenityRegexArray.length > 0) {
  additionalFilters.amenities = { $in: amenityRegexArray.map((amenity) => new RegExp(amenity, 'i')) };
  console.log(additionalFilters.amenities);
}

    //console.log(additionalFilters)
    const query = { $and: [baseQuery, additionalFilters] };
    const searchResults = await Hotel.find(query);
    if (searchResults.length > 0) {
      // Return the search results as a JSON response
      res.json(searchResults);
    } else {
      res.json("No hotels found with the provided search term and filters.");
    }
  } catch (error) {
    console.error("Error in handleSearchRequest:", error);
    res.status(500).json({ error: "An error occurred while processing the search." });
  }
};



async function deleteHotelById(req, res) {
  try {
    const hotelId = req.params.id;
    console.log(hotelId);
    const hotel = await hotelServices.findHotelByIdQuery(hotelId);
    console.log(hotel);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found." });
    }

    await hotelServices.deleteHotelByIdQuery(hotelId);

    res.json({ message: "Hotel deleted successfully." });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the hotel." });
  }
}

async function getAllHotels(req, res) {
  try {
    const hotels = await hotelServices.findAllHotelsQuery();
    console.log(hotels);
    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "An error occurred while fetching hotels." });
  }
}

async function getHotelById(req, res) {
  try {

    const hotelId = req.params.id;
    console.log(hotelId);
    const hotel = await hotelServices.findHotelByIdQuery(hotelId);
    console.log(hotel);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found." });
    }

    console.log(hotel);
    res.json(hotel);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "An error occurred while fetching hotel." });
  }
}
module.exports = {
  handleSearchRequest,
  deleteHotelById,
  getAllHotels,
  getHotelById,
};

