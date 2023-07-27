// TODO the controllers of users collection
const service = require('../services/user.service')

const connection = require('../services/connection')

// To View list of favourite hotels
const view = async (req, res) => {
  try {
    await connection();
    const { user_id } = req.params;
    console.log(user_id);
    const hotels = await service.view(user_id); 
    console.log(hotels);
    if (!hotels || hotels[0].favouriteHotels.length === 0) {
      res.status(404).json({ msg: "No hotels are added yet" });
    } else {
      res.status(200).json(hotels);
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
    console.log(user_id,hotel_id);
    const hotels = await service.add(user_id,hotel_id); 
    console.log(hotels);
    if (hotels==0) {
      res.status(404).json({ msg: "Hotel not found" });
      
    } else {
      res.status(200).json({ msg: "Hotel added successfully" });
      console.log(service.view(user_id));
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
    console.log(user_id,hotel_id);
    const hotels = await service.remove(user_id,hotel_id); // Await the result here
    console.log(hotels);
    if (hotels==0) {
      res.status(404).json({ msg: "Hotel not found" });
      
    } else {
      res.status(200).json({ msg: "Hotel removed successfully" });
      console.log(service.view(user_id));
    }
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {view, add, remove, };
