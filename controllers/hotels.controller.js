// TODO the controllers of hotels collection
const Hotel = require("./model");


async function handleSearchRequest(req, res) {
  try {
    //await connectToDatabase();

    const searchTerm = req.query.q; 
      console.log(searchTerm);
      
    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is missing." });
    }

    const searchCriteria = searchTerm.split(" ");
    const searchResults = await Hotel.aggregate([
      {
        $search: {
          index: "default",
          autocomplete: {
            query: searchCriteria.join(" "),
            path: ["hotelName", "location.cityName", "location.address"],
            fuzzy: {
              maxEdits: 2, 
            },
          },
        },
      },
    ]).exec();
    //       text: {
    //         query: searchCriteria.join(" "), // Join the search terms with space to form the query
    //         path: ["hotelName", "location.cityName", "location.address"], // Fields to search in
    //       },
    //     },
    //   },
    // ]).exec();
    console.log(searchResults);
    res.json(searchResults);
  } catch (error) {
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

