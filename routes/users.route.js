// TODO all the routes corresponding to the users controller
const express = require("express");
const route = express.Router();
const controller = require("../controllers/users.controller");

route.route("/users/:user_id/favorites").get(controller.view);

route.route("/users/:user_id/favorites/:hotel_id").post(controller.add);

route.route("/users/:user_id/favorites/:hotel_id").delete(controller.remove);

route.route("/users/:user_id/recent/:hotel_id").put(controller.recent);
module.exports = route;
