// TODO the controllers of hotels collection
const Hotel = require("./../models/hotels.model");
const {
  findHotelByIdQuery,
  deleteHotelByIdQuery,
  findAllHotelsQuery,
  searchHotelsQuery,
  filterHotelsQuery
} = require("../services/hotels.service");


async function handleSearchRequest(req, res) {
  try {
    const searchTerm = req.query.q;
    const numberOfRooms = parseInt(req.query.rooms);
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const selectedRating = parseInt(req.query.rating);
    const selectedAmenities = req.query.amenities ? req.query.amenities.split(',') : [];

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is missing.' });
    }

    // Call the searchHotels service function to get search results
    const searchResults = await searchHotelsQuery(searchTerm);

    // Call the filterHotels service function to apply filtering options
    const filteredResults = filterHotelsQuery(
      searchResults,
      numberOfRooms,
      minPrice,
      maxPrice,
      selectedRating,
      selectedAmenities
    );

    if (filteredResults.length > 0) {
      // Return the filtered search results as a JSON response
      res.json(filteredResults);
    } else {
      res.json('No hotels found with available rooms.');
    }
  } catch (error) {
    console.error('Error in handleSearchRequest:', error);
    res.status(500).json({ error: 'An error occurred while processing the search.' });
  }
}


async function deleteHotelById(req, res) {
  try {
    const hotelId = req.params.id;
    console.log(hotelId);
    const hotel = await findHotelByIdQuery(hotelId);
    console.log(hotel);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found." });
    }

    await deleteHotelByIdQuery(hotelId);

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
    const hotels = await findAllHotelsQuery();
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
    const hotel = await findHotelByIdQuery(hotelId);
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

