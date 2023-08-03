// controllers/payments.controller.js
const paymentService = require("../services/payments.service");

exports.addPaymentController = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const userId = req.user;
      const hotelId = req.params.hotelId;
      const paymentResult = await paymentService.addPayment(userId, hotelId);
      if (paymentResult.status === 'success') {
        return res.status(200).json({ status: paymentResult.paymentStatus });
      } else {
        return res.status(404).json({ error: paymentResult.message });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};
