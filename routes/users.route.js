// TODO all the routes corresponding to the users controller
const express = require("express");
const multer = require("multer");
usersRoute = express.Router();
usersController = require("../controllers/users.controller");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../profiles"));
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /\.(jpg|jpeg|png)$/;
    if (!file.originalname.match(allowedFileTypes)) {
      return cb(new Error("Please upload a valid file type"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1000000,
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: imageStorage });

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
usersRoute.get("/users/user/cards", usersController.getUserCardDetails);
usersRoute.post("/users/user/cards/saveCard", usersController.addNewCard);

// profile routes
usersRoute.route("/users/user/profile/update").post(usersController.updateUser);
usersRoute.route("/users/user/profile").get(usersController.getProfileDetails);
usersRoute.route("/users/user/islogined").get(usersController.getNavbarDetails);
usersRoute
  .route("/users/user/profile/upload")
  .post(upload.single("picture"), usersController.uploadOrEditPicture);
usersRoute
  .route("/users/user/profile/getpicture")
  .post(usersController.getImageController);
module.exports = usersRoute;
