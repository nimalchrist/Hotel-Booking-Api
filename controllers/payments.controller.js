// TODO the controllers of payments collection
const paymentServices = require("../services/payments.service");

exports.addPaymentController = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      await paymentServices.addPayment(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};
