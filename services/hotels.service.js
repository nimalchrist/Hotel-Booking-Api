// TODO the services of hotels collection
const Hotel = require("./model");

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