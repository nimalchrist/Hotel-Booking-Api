// TODO all the routes corresponding to the users controller
const express = require("express");
const route = express.Router();
const controller = require("../controller/controller");

route.route("/users/:user_id/favorites").get(controller.view);

route.route("/users/:user_id/favorites/:hotel_id").post(controller.add);

route.route("/users/:user_id/favorites/:hotel_id").delete(controller.remove);

module.exports = route;
