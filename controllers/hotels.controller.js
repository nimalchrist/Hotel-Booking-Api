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

module.exports = {
  handleSearchRequest,
};
