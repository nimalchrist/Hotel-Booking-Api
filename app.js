const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.SERVER_PORT;

//middlewares section
const mongoUri = "mongodb://localhost:27017/auth_db";

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
//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});
