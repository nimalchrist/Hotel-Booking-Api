const mongoose=require("mongoose");
const express = require("express");
require("dotenv").config();
const app = express();
const PORT = 3000;

//middlewares section
mongoose.connect('mongodb://127.0.0.1:27017/hotel_management',
 {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});
