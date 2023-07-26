const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.SERVER_PORT;

//middlewares section

//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});
