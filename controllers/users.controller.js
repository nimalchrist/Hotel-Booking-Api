const Joi = require('joi');
const userService = require('../services/users.service');

// Fetch all users
exports.getAllUsers = async (_req, res) => {
  try {
    const result = await userService.getAllUsers();
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    return res.json(result.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Fetch user details by ID along with decrypted card details
exports.getUserCardDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const decryptedCards = await userService.getUserCardDetails(userId);
    if (decryptedCards.length > 0) {
      return res.json(decryptedCards);
    } else {
      return res.json({ message: 'No saved cards.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// Fetch all users along with decrypted card details
exports.getAllUsersWithDecryptedCards = async (_req, res) => {
  try {
    const result = await userService.getAllUsersWithDecryptedCards();
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    return res.json(result.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Function to add new card details to the addedCards field
exports.addNewCard = async (req, res) => {
  try {
    const { userId } = req.params;
    const { error } = Joi.object({
      cardHolder: Joi.string().required().pattern(/^[A-Za-z]+$/).message('Card holder must contain only letters'),
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
    }).validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await userService.addNewCard(userId, req.body);
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    return res.json({ message: result.message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
