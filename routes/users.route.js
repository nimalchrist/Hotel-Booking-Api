// TODO all the routes corresponding to the users controller
const express = require("express");
usersRoute = express.Router();
usersController = require("../controllers/users.controller");

// auth routes
usersRoute
  .route("/register")
  .post(usersController.localAuthRegistrationController);
usersRoute
  .route("/login")
  .post(usersController.loginController)
  .get(usersController.loginController);
usersRoute.route("/logout").get(usersController.logoutController);

// favourites and recents feature route
usersRoute.route("/users/favourites").get(usersController.view);
usersRoute.route("/users/favourites/:hotel_id").post(usersController.add);
usersRoute.route("/users/favourites/:hotel_id").delete(usersController.remove);
usersRoute.route("/users/recent").get(usersController.recent_search);
usersRoute.route("/users/recent/:hotel_id").put(usersController.recent);

// GET user details by ID along with decrypted card details
usersRoute.get('/users/user/cards', usersController.getUserCardDetails);

// POST add new card details to the addedCards field
usersRoute.post('/users/user/cards/saveCard', usersController.addNewCard);

// profile routes
usersRoute.route("/users/user/profile/update").post(usersController.updateUser);
usersRoute.route("/users/user/profile").get(usersController.getProfileDetails);


module.exports = usersRoute;
