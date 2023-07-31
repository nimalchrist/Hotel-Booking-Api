const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const hotelRoutes = require("./routes/hotels.route");
const app = express();
const PORT = process.env.SERVER_PORT;
const DB_URI = process.env.DATABASE_URI;

//db connection
async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Db connected Successfully");
  } catch (error) {
    console.log("Error occurred: ", error);
  }
}
connectToDatabase();

//middlewares section
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.error("Error occurred: ", err);
  res.status(500).json({ message: "Internal server error" });
});
app.use("/hotel", hotelRoutes);

//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});