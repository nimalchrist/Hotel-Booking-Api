const Payment = require('../models/payments.model');
const User = require('../models/users.model');
const Hotel = require('../models/hotels.model');

// Function to add a new payment record
exports.addPayment = async (userId, hotelId) => {
  try {
    // Find the user and hotel documents from their respective collections
    const user = await User.findById(userId);

    if (!user) {
      return { status: 'error', message: 'User not found.' };
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return { status: 'error', message: 'Hotel not found.' };
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

      return { status: 'success', paymentStatus: 'unpaid' };
    }

    // Find existing payment details for the user
    const existingPayment = await Payment.findOne({ userId });

    if (existingPayment) {
      // If user is a regular user with payment details, update the payment status to 'paid'
      existingPayment.paymentStatus = 'paid';
      await existingPayment.save();
      return { status: 'success', paymentStatus: 'paid' };
    }

    // Assuming payment processing is successful, create a new payment record in the database
    await Payment.create({
      userId: user._id, // Store the user's ObjectId in the payment record
      hotelId: hotel._id,
      paymentStatus: 'paid', // Store the hotel's ObjectId in the payment record
    });

    return { status: 'success', paymentStatus: 'paid' };
  } catch (err) {
    console.error(err);
    return { status: 'error', message: 'An error occurred while processing the payment.' };
  }
};