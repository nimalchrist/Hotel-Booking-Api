// TODO all the routes corresponding to the users controller
const express = require("express");
usersRoute = express.Router();
usersController = require("../controllers/users.controller");

usersRoute
  .route("/register")
  .post(usersController.localAuthRegistrationController);
usersRoute
  .route("/login")
  .post(usersController.loginController)
  .get(usersController.loginController);
usersRoute.route("/logout").get(usersController.logoutController);

usersRoute.route("/users/favorites").get(usersController.view);

usersRoute.route("/users/favorites/:hotel_id").post(usersController.add);

usersRoute.route("/users/favorites/:hotel_id").delete(usersController.remove);

usersRoute.route("/users/recent/:hotel_id").put(usersController.recent);
module.exports = usersRoute;
