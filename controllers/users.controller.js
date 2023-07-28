const Joi = require('joi');
const User = require('../models/users.model');
const encryptionUtil = require('../utils/utils');

// Fetch user details by ID
exports.getUserDetails = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.json(user);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Joi schema for card details validation
const cardSchema = Joi.object({
  cardHolder: Joi.string().required(),
  cardNumber: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
  expirationDate: Joi.date().min('now').required().custom((value, helpers) => {
    if (new Date(value) <= new Date()) {
      return helpers.message('Expiration date must be in the future');
    }
    return value;
  }),
  cvv: Joi.string().length(3).pattern(/^[0-9]+$/).required(),
});

// Save new card details for the logged-in user
exports.saveCardDetails = (req, res) => {
  const { error } = cardSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { cardHolder, cardNumber, expirationDate, cvv } = req.body;
  const userId = req.user; // Assuming the user ID is available in req.user

  // Encrypt the CVV and card number before saving
  const encryptedCvv = encryptionUtil.encrypt(cvv);
  const encryptedCardNumber = encryptionUtil.encrypt(cardNumber);
  // Determine the card name based on the first digit of the card number
  let cardName;
  switch (cardNumber.charAt(0)) {
    case '4':
      cardName = 'Visa';
      break;
    case '5':
      cardName = 'MasterCard';
      break;
    case '3':
      cardName = 'American Express';
      break;
    default:
      cardName = 'Unknown';
  }

  // Create the new card object with encrypted data
  const newCard = {
    cardHolder: cardHolder,
    encryptedCardNumber: encryptedCardNumber,
    expirationDate: expirationDate,
    encryptedCvv: encryptedCvv,
    cardName: cardName,
  };

  // Update the user document to append the new card to addedCards array
  User.updateOne({ _id: userId }, { $push: { addedCards: newCard } })
    .then(() => res.json({ message: 'Card details saved successfully.' }))
    .catch((err) => res.status(500).json({ error: err.message }));
};
