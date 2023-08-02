const Joi = require('joi');
const User = require('../models/users.model');
const encryptionUtil = require('../utils/utils');
const { decrypt } = require('../utils/utils');

// Fetch user details by ID along with decrypted card details
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    // Find the user by user ID and project only the addedCards field
    const user = await User.findOne({ _id: userId }, { addedCards: 1 });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user has saved cards
    if (user.addedCards.length > 0) {
      // Decrypt the card details in the addedCards field
      const decryptedCards = user.addedCards.map((addedCard) => ({
        cardHolder: addedCard.cardHolder,
        cardNumber: decrypt(addedCard.cardNumber),
        expirationDate: addedCard.expirationDate,
        cvv: decrypt(addedCard.cvv),
        cardName: addedCard.cardName,
      }));

      // Return only the decrypted card details in the response
      return res.json(decryptedCards);
    } else {
      // If the user has no saved cards, return a message
      return res.json({ message: 'No saved cards.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Joi schema for card details validation
const cardSchema = Joi.object({
  cardHolder: Joi.string().required(),
  cardNumber: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
  expirationDate: Joi.string().trim().required().custom((value, helpers) => {
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!dateRegex.test(value)) {
      return helpers.message('Expiration date must be in the format MM/YY');
    }

    const [month, year] = value.split('/');
    const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
    const currentMonth = new Date().getMonth() + 1; // Months are zero-based

    if (+year < currentYear || (+year === currentYear && +month < currentMonth)) {
      return helpers.message('Expiration date must be in the future');
    }

    return value;
  }),
  cvv: Joi.string().length(3).pattern(/^[0-9]+$/).required(),
});

// Function to add new card details to the addedCards field
exports.addNewCard = async (req, res) => {
  const { error } = cardSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { cardHolder, cardNumber, expirationDate, cvv } = req.body;
  const userId = req.params.userId; // Assuming the user ID is available in req.user
  console.log("userId", userId);

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
    case '6':
      cardName='Discover';
      break;
    default:
      cardName = 'Unknown';
  }

  // Create the new card object with encrypted data
  const newCard = {
    cardHolder: cardHolder,
    cardNumber: encryptedCardNumber,
    expirationDate: expirationDate,
    cvv: encryptedCvv,
    cardName: cardName,
  };

  try {

    // Find the existing user by user ID
    const existingUser = await User.findOne({ _id: userId });
    console.log(existingUser);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    // Update the user document to append the new card to addedCards array
    existingUser.addedCards.push(newCard);
    await existingUser.save();
  
    return res.json({ message: 'Card details saved successfully.' });
  
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
  