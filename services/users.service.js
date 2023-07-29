// TODO the services of users collection
const usersModel = require("../models/users.model");

exports.findAcountCredentials = async (field, value) => {
  let query = {};
  query[field] = value;
  try {
    const user = await usersModel.findOne(query, {
      userName: 1,
      email: 1,
      phoneNumber: 1,
      password: 1,
    });
    return user;
  } catch (error) {
    console.log("Error occurred while finding user: ", error);
    throw error;
  }
};

exports.createUser = async (userData) => {
  const newUser = new usersModel(userData);
  await newUser.save();
  return newUser;
};