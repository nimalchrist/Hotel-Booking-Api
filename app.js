const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.SERVER_PORT;
// Import routes
const usersRoute = require('./routes/users.route');


//middlewares section
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Use the usersRoute for handling user-related endpoints
app.use("/user", usersRoute);



//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});
