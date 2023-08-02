const mongoose = require("mongoose");
const Hotel = require('./hotels.model');
const utils = require('../utils/utils');

const cardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    unique: true,
    sparse: true,
    required: true,
    set: utils.encrypt, // Encrypt the card number before saving
    get: utils.decrypt, 
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
  cardName: {
    type: String,
    enum: ['MasterCard', 'Visa', 'American Express', 'Discover','Unknown'],
    default: 'Unknown',
  },
  cardName: {
    type: String,
    enum: ["MasterCard", "Visa", "American Express", "Unknown"],
    default: "Unknown",
  },
});

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
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
    sparse: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
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
      ref: "Hotel",
    },
  ],
  addedCards: [cardSchema],
  recentVisitsOfHotels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
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