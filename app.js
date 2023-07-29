const express = require("express");
const route = require('./routes/users.route')
require("dotenv").config();
const app = express();
const PORT = process.env.SERVER_PORT;

//middlewares section
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/",route);
//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});