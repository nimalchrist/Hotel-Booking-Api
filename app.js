const express = require("express");
const route = require('./routes/hotels.route')
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/users.route");
const hotelsRouter = require("./routes/hotels.route");
const paymentsRoutes = require('./routes/payments.route');
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const app = express();
const PORT = process.env.SERVER_PORT;
const DB_URI = process.env.DATABASE_URI;

//db connection
async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Db connected Successfully");
  } catch (error) {
    console.log("Error occurred: ", error);
  }
}
connectToDatabase();

//middlewares section
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.error("Error occurred: ", err);
  res.status(500).json({ message: "Internal server error" });
});
app.use(
  session({
    name: "golobe",
    secret: process.env.ENCRYPTION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.use(hotelsRouter);
app.use('/payment', paymentsRoutes);

//listen section
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("Server started at: ", PORT);
});