const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.SERVER_PORT;
// Import routes
const usersRoute = require('./routes/users.route');


//middlewares section
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Connect to MongoDB Atlas
const atlasUri = process.env.MONGODB_ATLAS_URI; // Get the connection string from .env file
mongoose.connect(atlasUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// MongoDB connection event handlers
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
})

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
