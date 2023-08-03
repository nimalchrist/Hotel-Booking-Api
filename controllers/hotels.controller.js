const hotelService = require("../services/hotels.service");
const mongoose = require("mongoose");
const User = require("../models/users.model");

exports.handleSearchRequest = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const checkInDate = new Date(req.query.checkIn);
    const checkOutDate = new Date(req.query.checkOut);
    const numberOfRooms = parseInt(req.query.rooms);
    console.log(searchTerm);
    // Extract the filtering options from query parameters
    const priceRange = req.query.priceRange;
    let minPrice, maxPrice;
    if(priceRange&& priceRange.length==2){
    minPrice = parseFloat(priceRange[0]);
    maxPrice = parseFloat(priceRange[1]);
  }
    const selectedRating = parseInt(req.query.rating);
    const selectedAmenities = req.query.amenities
      ? req.query.amenities.split(",")
      : [];
    console.log(selectedAmenities);
    // Validate check-in and check-out dates
    const parsedCheckInDate = Date.parse(checkInDate);
    const parsedCheckOutDate = Date.parse(checkOutDate);

    if (isNaN(parsedCheckInDate) || isNaN(parsedCheckOutDate)) {
      return res.status(400).json({
        error:
          "Invalid date format. Please provide dates in the format YYYY-MM-DD.",
      });
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
    console.log(baseQuery);
    const lowercaseSelectedAmenities = selectedAmenities.map((amenity) =>
      amenity.toLowerCase()
    );
    console.log(lowercaseSelectedAmenities);
    // Create an array of regular expressions to match two-word amenities with spaces
    const amenityRegexArray = lowercaseSelectedAmenities.map((amenity) => {
      const regexString = amenity.split(" ").join("\\s+");
      return new RegExp(`^${regexString}$`, "i"); // Added ^ and $ to match the entire string
    });

    console.log(amenityRegexArray);

    // Add additional filters to the base query based on user-selected options
    const additionalFilters = {};

    if (!isNaN(minPrice)) {
      additionalFilters.ratePerNight = { $gte: minPrice };
    }

    if (!isNaN(maxPrice)) {
      additionalFilters.ratePerNight = {
        ...additionalFilters.price,
        $lte: maxPrice,
      };
    }

    if (!isNaN(selectedRating)) {
      additionalFilters.rating = { $gte: selectedRating };
    }

    console.log(amenityRegexArray);
    if (amenityRegexArray.length > 0) {
      additionalFilters.amenities = {
        $in: amenityRegexArray.map((amenity) => new RegExp(amenity, "i")),
      };
      console.log(additionalFilters.amenities);
    }

    const query = { $and: [baseQuery, additionalFilters] };
    console.log(query);
    const searchResults = await hotelService.findSearchResults(query);
    if (searchResults.length > 0) {
      // Return the search results as a JSON response
      return res.status(200).json(searchResults);
    } else {
      return res.json(
        "No hotels found with the provided search term and filters."
      );
    }
  } catch (error) {
    console.error("Error in handleSearchRequest:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the search." });
  }
};

exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await hotelService.findAllHotelsQuery();
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "An error occurred while fetching hotels." });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const {
      hotelName,
      hotelType,
      location: { cityName, latitude, longitude, address },
      ratePerNight,
      overview,
      amenities,
      images,
      locationFeatures,
    } = req.body;

    const hotelData = {
      hotelName,
      hotelType,
      location: { cityName, latitude, longitude, address },
      ratePerNight,
      overview,
      amenities,
      images,
      locationFeatures,
    };

    const newHotel = await hotelService.createHotel(hotelData);
    res
      .status(201)
      .json({ message: "Hotel created successfully", hotel: newHotel });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const {
      hotelName,
      hotelType,
      location: { cityName, latitude, longitude, address },
      ratePerNight,
      overview,
      amenities,
      images,
      locationFeatures,
    } = req.body;

    const hotelData = {
      hotelName,
      hotelType,
      location: { cityName, latitude, longitude, address },
      ratePerNight,
      overview,
      amenities,
      images,
      locationFeatures,
    };

    const updatedHotel = await hotelService.updateHotel(hotelId, hotelData);
    res
      .status(200)
      .json({ message: "Hotel updated successfully", hotel: updatedHotel });
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteHotelById = async (req, res) => {
  try {
    const hotelId = req.params.id;
    console.log(hotelId);
    const hotel = await hotelServices.findHotelByIdQuery(hotelId);
    console.log(hotel);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found." });
    }

    await hotelService.deleteHotelByIdQuery(hotelId);

    res.json({ message: "Hotel deleted successfully." });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the hotel." });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await hotelService.getHotelById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addReview = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const userId = req.user;
      const { comment, guestRating } = req.body;
      const hotelId = req.params.hotelId;

      const hotel = await hotelService.getHotelById(hotelId);
      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedHotel = await hotelService.addReview(
        hotelId,
        userId,
        comment,
        guestRating
      );

      res
        .status(201)
        .json({ message: "Review added successfully", hotel: updatedHotel });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ message: "Please login to add review" });
  }
};

exports.deleteReview = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const hotelId = req.params.hotelId;
      const reviewId = req.params.reviewId;
      const updatedHotel = await hotelService.deleteReview(hotelId, reviewId);
      res
        .status(200)
        .json({ message: "Review deleted successfully", hotel: updatedHotel });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.insertRoom = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const { roomType, roomSpecification, roomRate, roomCount } = req.body;
    const roomData = { roomType, roomSpecification, roomRate, roomCount };
    const updatedHotel = await hotelService.insertRoom(hotelId, roomData);
    res
      .status(201)
      .json({ message: "Room added successfully", hotel: updatedHotel });
  } catch (error) {
    console.error("Error inserting room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getGuestReviews = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await hotelService.getGuestReviews(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.status(200).json(hotel.guestReviews);
  } catch (error) {
    console.error("Error fetching guest reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
