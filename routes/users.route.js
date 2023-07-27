// TODO all the routes corresponding to the users controller
const express = require("express");
usersRoute = express.Router();
usersController = require("../controllers/users.controller");

usersRoute
  .route("/register")
  .post(usersController.localAuthRegistrationController);

module.exports = usersRoute;