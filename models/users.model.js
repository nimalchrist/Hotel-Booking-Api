// TODO the definition of users model
const mongoose = require("mongoose");
const utils = require('../utils/utils');
const cardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    unique: true,
    set: utils.encrypt, // Encrypt the card number before saving
    get: utils.decrypt, // Decrypt the card number when accessed
  },
  cardHolder: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
    set: utils.encrypt, // Encrypt the cvv before saving
    get: utils.decrypt, // Decrypt the cvv when accessed
  },
});

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function (value) {
        return value < new Date();
      },
      message: "Date of birth must be in the past",
    },
  },
  faceBookId: {
    type: String,
    unique: true,
  },
  googleId: {
    type: String,
    unique: true,
  },
  profilePicture: {
    type: String,
  },
  coverPicture: {
    type: String,
  },
  favouriteHotels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotels",
    },
  ],
  addedCards: [cardSchema],
  recentVisitsOfHotels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotels",
    },
  ],
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  verificationCode: {
    type: String,
  },
});

const users = mongoose.model("users", userSchema);
module.exports = users;
