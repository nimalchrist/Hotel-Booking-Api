// TODO the services of payments collection
const Payment = require('../models/payment');
const User = require('../models/user');
const Hotel = require('../models/hotel');

// Function to add a new payment record
exports.addPayment = async (req, res) => {
  const {userId,hotelId}= req.params;
  
  console.log("request body:",req.params);

  try {
    // Find the user and hotel documents from their respective collections
    const user = await User.findById(userId);
    const hotel = await Hotel.findById(hotelId);

    if (!user || !hotel) {
      return res.status(404).json({ error: 'User or Hotel not found.' });
    }

     // Assuming 'cards' is an array of card objects in the user document
     const cardsArray=user.cards;
     
     if(!cardsArray  || cardsArray.length==0){

      console.log("no card details found");
      return res.status(400).json({error:'no card deatils found'});
     }
     //checking if al the fields in card has value
     const isAllCardFieldsPresent=(cardsArray)=>{
       for(const card of cardsArray){
        if(
          !card.cardNumber ||
          !card.cardHolder ||
          !card.expirationDate ||
          !card.Cvv
        ){
          return false;
        }
       }
        return true;
     };

      // Check if all fields in each card object have values
    const isAllCardComplete = isAllCardFieldsPresent(cardsArray);

    // Find existing payment details for the user
    const existingPayment = await Payment.findOne({ userId });

    if (existingPayment && isAllCardComplete) {
      // If user is a regular user with payment details, update the payment status to 'paid'
      existingPayment.paymentStatus = 'paid';
      await existingPayment.save();
      return res.status(200).json({ status: 'paid' });
    }


    // Assuming payment processing is successful, create a new payment record in the database
    const payment = new Payment({
      userId:user._id,// Store the user's ObjectId in the payment record
      hotelId:hotel._id,
      paymentStatus: isAllCardComplete? 'paid':'unpaid', // Store the hotel's ObjectId in the payment record
    });

    //..... i recenlty added
    await payment.save();

    return res.status(200).json({ status: 'paid'});
 } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while processing the payment.' });
  }
};

