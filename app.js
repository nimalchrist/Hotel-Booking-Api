const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.SERVER_PORT;

const mongoose = require("mongoose");
const hotelsRouter = require("./routes/hotels.route");

//middlewares section
const mongoUri = "mongodb+srv://gceInterns:IcanioGCE@gcecluster1.hfhvmqk.mongodb.net/golobe_db";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

connectToMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(hotelsRouter);


//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});
