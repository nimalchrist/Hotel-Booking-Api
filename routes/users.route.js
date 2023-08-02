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

route.route("/users/:user_id/favorites").get(controller.view);

route.route("/users/:user_id/favorites/:hotel_id").post(controller.add);

route.route("/users/:user_id/favorites/:hotel_id").delete(controller.remove);

route.route("/users/:user_id/recent/:hotel_id").put(controller.recent);
module.exports = usersRoute;
