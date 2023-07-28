// TODO the controllers of hotels collection
const Hotel = require("./model");


async function handleSearchRequest(req, res) {
    try {
      const searchTerm = req.query.q;
      const checkInDate = req.query.checkIn;
      const checkOutDate = req.query.checkOut;
      const numberOfRooms = parseInt(req.query.rooms);
      //const numberOfGuests = parseInt(req.query.guests);
  
      if (!searchTerm) {
        return res.status(400).json({ error: "Search term is missing." });
      }
  
      // Parse the search query to identify different search criteria (hotel name, location, city)
      const searchCriteria = searchTerm.split(" ");
      console.log(searchCriteria);
      // Construct the Atlas Search query to search indexed fields for the search criteria
      const searchResults = await Hotel.aggregate([
        {
          $search: {
            //index: "default",
            text: {
              query: searchCriteria.join(" "), // Join the search terms with space to form the query
              path: ["hotelName", "location.cityName", "location.address"], // Fields to search in
            },
          },
        },
        // Optional: Add more aggregation stages if needed for filtering, sorting, etc.
      ]).exec();
      console.log(searchResults);
      // Check if there are hotels with available rooms
      const hasAvailableRooms = searchResults.some(hotel => {
        return hotel.totalRooms >= numberOfRooms;
      });
      console.log(hasAvailableRooms);
      if (hasAvailableRooms) {
        // Filter search results based on available rooms
        const filteredResults = searchResults.filter(hotel => {
          return hotel.rooms.some(room => {
            return room.availability >= numberOfRooms;
          });
        });
        console.log(filteredResults)
        // Return the filtered search results as a JSON response
        res.json(filteredResults);
    }
  else{
    res.json("no hotels fount");
    console.log("no hotels found");
  }}
     catch (error) {
      console.error("Error in handleSearchRequest:", error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the search." });
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

