const express = require("express");
const mongoose = require("mongoose");
const routes = require('./routes/routes');

const app = express();
app.use(express.json());
app.use("/",routes);

mongoose.set("debug", true);

const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/booking_hotel", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

const startServer = () => {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

connectToDatabase();
startServer();