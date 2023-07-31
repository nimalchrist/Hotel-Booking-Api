// TODO the definition of payments model
const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "hotels",
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
    required: true,
  },
});

const payments = mongoose.model("payments", paymentSchema);
const pay1=new paymentSchema({
  "userId":"138174863484",
  "hotelId":"123",
  "paymentStatus":"unpaid"
})
const result=pay1.save();
console.timeLog("payment saved :",result);
module.exports = payments;