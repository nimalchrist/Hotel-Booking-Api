const service = require('../services/users.service')
const connection = require('../services/connection')

// To View list of favourite hotels
const view = async (req, res) => {
  try {
    await connection();
    const { user_id } = req.params;
    const list = await service.view(user_id); 
    // if favourite list is empty
    if (list[0].favouriteHotels.length == 0) {
      res.status(404).json({ msg: "No hotels are added yet" });
    } 
    else {
      console.log("Total count ",list[0].favouriteHotels.length)
      res.status(200).json(list[0].favouriteHotels);
    }
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// To add a hotels to avourites hotels
const add = async (req, res) => {
  try {
    await connection();
    const {user_id, hotel_id}= req.params;
    const list = await service.add(user_id,hotel_id); 
    // if list is empty
    if (!list) {
      res.status(404).json({ msg: "Error occured " });
      
    } else {
      // if success return list of favourites
      res.status(200).json({ msg: "Hotel added successfully" , Favorites : list.favouriteHotels});
    }
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// to remove a hotel from favourite hotels

const remove = async (req, res) => {
    try {
      await connection();
      const {user_id, hotel_id}= req.params;
      const list = await service.remove(user_id,hotel_id); 
      //if list is empty
      if (list==0) {
        res.status(404).json({ msg: "Hotel not found" });
      } 
      else {
        res.status(200).json({ msg: "Hotel removed successfully" });
        console.log(service.view(user_id));
      }
    } 
    catch (error) {
      console.error('Error fetching hotel details:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

//recent searches

const recent = async (req, res) => {
  try {
    await connection();
    const {user_id, hotel_id}= req.params;
    const hotels = await service.recent(user_id,hotel_id);
    res.status(200).json(hotels.recentVisitsOfHotels);
  } 
  catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {view, add, remove,recent };
