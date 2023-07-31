// TODO the services of payments collection
const Payment = require('../models/payments.model');
const User = require('../models/users.model');
const Hotel = require('../models/hotels.model');

// Function to add a new payment record
exports.addPayment = async (req, res) => {
  const { userId, hotelId } = req.body;
  console.log("request body:", req.body);

  try {
    // Find the user and hotel documents from their respective collections
    const user = await User.findById(userId);
    const hotel = await Hotel.findById(hotelId);

    if (!user || !hotel) {
      return res.status(404).json({ error: 'User or Hotel not found.' });
    }

    // Assuming 'cards' is an array of card objects in the user document
    const cardsArray = user.addedCards;

    if (!cardsArray || cardsArray.length === 0) {
      console.log("no card details found");
      // If cardsArray is empty, update paymentStatus as 'unpaid'
      await Payment.create({
        userId: user._id, // Store the user's ObjectId in the payment record
        hotelId: hotel._id,
        paymentStatus: 'unpaid', // Payment status set to 'unpaid'
      });

      return res.status(200).json({ status: 'unpaid' });
    }

    // Find existing payment details for the user
    const existingPayment = await Payment.findOne({ userId });

    if (existingPayment) {
      // If user is a regular user with payment details, update the payment status to 'paid'
      existingPayment.paymentStatus = 'paid';
      await existingPayment.save();
      return res.status(200).json({ status: 'paid' });
    }

    // Assuming payment processing is successful, create a new payment record in the database
    await Payment.create({
      userId: user._id, // Store the user's ObjectId in the payment record
      hotelId: hotel._id,
      paymentStatus: 'paid', // Store the hotel's ObjectId in the payment record
    });

    return res.status(200).json({ status: 'paid' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while processing the payment.' });
  }
};
