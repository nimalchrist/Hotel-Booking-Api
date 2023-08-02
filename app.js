const express = require("express");
const mongoose = require("mongoose");
const routes = require('./routes/hotels.route');

//middleware sections
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//routes
app.use("/",routes);


mongoose.set("debug", true);

//Database connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://gceInterns:IcanioGCE@gcecluster1.hfhvmqk.mongodb.net/golobe_db", {
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
  const PORT = 7423;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

connectToDatabase();
startServer();