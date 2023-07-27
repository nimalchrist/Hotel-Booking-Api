// TODO the services of users collection
const usersModel = require("../models/users.model");


exports.findUserByField = async (field, value) => {
  let query = {};
  query[field] = value;

  try {
    const user = await usersModel.findOne(query);
    return user;
  } catch (error) {
    console.log("Error occurred while finding user: ", error);
    throw error;
  }
};

exports.addUser = async (newUser) => {
  await newUser.save();
}