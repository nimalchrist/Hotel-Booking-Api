const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.SERVER_PORT;
const mongoose = require('mongoose');
const Routes = require('./routes/payments.route');
const User = require('./models/users.model');
const Hotel = require('./models/hotels.model');
//middlewares section
app.use(express.json());

// Set up payment routes
app.use('/', Routes);
//db connection 
const mongodbUri = 'mongodb+srv://gceInterns:IcanioGCE@gcecluster1.hfhvmqk.mongodb.net/golobe_db';

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});