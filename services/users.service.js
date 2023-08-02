// TODO the services of users collection
const User = require('../models/users.model');
const encryptionUtil = require('../utils/utils');
const { decrypt } = require('../utils/utils');

// Fetch all users
exports.getAllUsers = async () => {
  try {
    const users = await User.find();
    return { data: users };
  } catch (err) {
    return { error: err.message };
  }
};

// Fetch user details by ID along with decrypted card details
exports.getUserCardDetails = async (userId) => {
  try {
    // Find the user by user ID and project only the addedCards field
    const user = await User.findOne({ _id: userId }, { addedCards: 1 });

    if (!user) {
      return { error: 'User not found.' };
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

      return decryptedCards;
    } else {
      // If the user has no saved cards, return a message
      return { message: 'No saved cards.' };
    }
  } catch (err) {
    return { error: err.message };
  }
};

// Fetch all users along with decrypted card details
exports.getAllUsersWithDecryptedCards = async () => {
  try {
    const users = await User.find();

    // Decrypt the card details in the addedCards field for all users
    const usersWithDecryptedCards = users.map((user) => ({
      ...user.toObject(),
      addedCards: user.addedCards.map((addedCard) => ({
        cardHolder: addedCard.cardHolder,
        cardNumber: decrypt(addedCard.cardNumber),
        expirationDate: addedCard.expirationDate,
        cvv: decrypt(addedCard.cvv),
        cardName: addedCard.cardName,
      })),
    }));

    return { data: usersWithDecryptedCards };
  } catch (err) {
    return { error: err.message };
  }
};

// Function to add new card details to the addedCards field
exports.addNewCard = async (userId, cardDetails) => {
  const { cardHolder, cardNumber, expirationDate, cvv } = cardDetails;

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
      cardName = 'Discover';
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
    if (!existingUser) {
      return { error: 'User not found.' };
    }

    // Update the user document to append the new card to addedCards array
    existingUser.addedCards.push(newCard);
    await existingUser.save();

    return { message: 'Card details saved successfully.' };
  } catch (err) {
    return { error: err.message };
  }
};
