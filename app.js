const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.SERVER_PORT;
const mongoose = require("mongoose");
const hotelRoutes = require("./routes/hotels.route");
//middlewares section
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/app", hotelRoutes);
const uri =
  "mongodb+srv://fencyj854:fencyj854@hotel.idlmgx6.mongodb.net/?retryWrites=true&w=majority";
async function connectToDatabase() {
  try {
    // Connect to the MongoDB Atlas cluster using Mongoose
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connectToDatabase();
//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});
