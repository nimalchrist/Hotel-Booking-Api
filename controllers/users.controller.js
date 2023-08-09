// TODO the controllers of users collection
const localPassport = require("../authentication/localAuthentication");
const googlePassport = require("../authentication/googleAuthentication");
const facebookPassport = require("../authentication/facebookAuthentication");
const userServices = require("../services/users.service");
const utilities = require("../utils/utils");
const Joi = require("joi");

const validateSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 digits",
      "string.empty": "Phone number is required",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  }),
});

// local register controller
exports.localAuthRegistrationController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;
    const { error } = validateSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, "");
      return res.status(400).json({ message: errorMessage });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const userName = `${firstName} ${lastName}`;
    const hashedPassword = utilities.encrypt(password);
    const emailExist = await userServices.findAcountCredentials("email", email);

    if (emailExist) {
      return res
        .status(409)
        .json({ message: "User already exists with the same email id." });
    }
    const phoneExist = await userServices.findAcountCredentials(
      "phoneNumber",
      phoneNumber
    );
    if (phoneExist) {
      return res
        .status(409)
        .json({ message: "User already exists with the same phone number." });
    }
    try {
      const userData = {
        userName,
        email,
        phoneNumber,
        password: hashedPassword,
      };
      await userServices.createUser(userData);
      return res.status(201).json({ message: "Registration successful" });
    } catch (error) {
      console.log("Error occured: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log("Error Occured: ", error);
  }
};

// login controller
exports.loginController = (req, res, next) => {
  const { by } = req.query;
  if (by === "local") {
    localPassport.authenticate("local", (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.login(user, (error) => {
        if (error) {
          return next(error);
        }
        return res
          .status(200)
          .json({ message: "Login successful", clientId: user.id });
      });
    })(req, res, next);
  } else if (by === "google") {
    googlePassport.authenticate("google", (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.redirect(process.env.CLIENT_URL + "/login");
      }
      req.login(user, (error) => {
        if (error) {
          return next(error);
        }
        return res.redirect(
          process.env.CLIENT_URL + "/home?clientId=" + user.id
        );
      });
    })(req, res, next);
  } else if (by === "facebook") {
    facebookPassport.authenticate("facebook", (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.redirect(process.env.CLIENT_URL + "/login");
      }
      req.login(user, (error) => {
        if (error) {
          return next(error);
        }
        return res.redirect(
          process.env.CLIENT_URL + "/home?clientId=" + user.id
        );
      });
    })(req, res, next);
  } else {
    return res.status(400).json({ message: "Invalid access" });
  }
};

// logout controller
exports.logoutController = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout(function (error) {
      if (error) {
        return next(error);
      }
      return res.status(200).json({ message: "Logout successful" });
    });
  } else {
    return res.status(400).json({ message: "Sorry, Bad request" });
  }
};
// To View list of favourite hotels
exports.view = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user_id = req.user;
      const list = await userServices.view(user_id);
      // if favourite list is empty
      if (list[0].favouriteHotels.length == 0) {
        res.status(404).json({ msg: "No hotels are added yet" });
      } else {
        console.log("Total count ", list[0].favouriteHotels.length);
        res.status(200).json(list[0].favouriteHotels);
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};

// To add a hotels to avourites hotels
exports.add = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user_id = req.user;
      const { hotel_id } = req.params;
      const list = await userServices.add(user_id, hotel_id);
      // if list is empty
      if (!list) {
        res.status(404).json({ msg: "Error occured " });
      } else {
        // if success return list of favourites
        res.status(200).json({
          msg: "Hotel added successfully",
          Favorites: list.favouriteHotels,
        });
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};

// to remove a hotel from favourite hotels

exports.remove = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user_id = req.user;
      const { hotel_id } = req.params;
      const list = await userServices.remove(user_id, hotel_id);
      //if list is empty
      if (list == 0) {
        res.status(404).json({ msg: "Hotel not found" });
      } else {
        res.status(200).json({ msg: "Hotel removed successfully" });
        
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};
//recent searches

exports.recent = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user_id = req.user;
      const { hotel_id } = req.params;
      const hotels = await userServices.recent(user_id, hotel_id);
      console.log(hotels);
      res.status(200).json(hotels);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};

// Fetch user details by ID along with decrypted card details
exports.getUserCardDetails = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const userId = req.user;
      const decryptedCards = await userServices.getUserCardDetails(userId);
      if (decryptedCards.length > 0) {
        return res.json(decryptedCards);
      } else {
        return res.json({ message: "No saved cards." });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};

// Function to add new card details to the addedCards field
exports.addNewCard = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const userId = req.user;
      const { error } = Joi.object({
        cardHolder: Joi.string()
          .required()
          .pattern(/^[A-Za-z\s]+$/)
          .message("Card holder must contain only letters and spaces"),
        cardNumber: Joi.string()
          .length(16)
          .pattern(/^[0-9]+$/)
          .required(),
        expirationDate: Joi.string()
          .trim()
          .required()
          .custom((value, helpers) => {
            const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!dateRegex.test(value)) {
              return helpers.message(
                "Expiration date must be in the format MM/YY"
              );
            }

            const [month, year] = value.split("/");
            const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
            const currentMonth = new Date().getMonth() + 1; // Months are zero-based

            if (
              +year < currentYear ||
              (+year === currentYear && +month < currentMonth)
            ) {
              return helpers.message("Expiration date must be in the future");
            }

            return value;
          }),
        cvv: Joi.string()
          .length(3)
          .pattern(/^[0-9]+$/)
          .required(),
      }).validate(req.body);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      // Check if the card number already exists in addedCards for this user
      const userCards = await userServices.getUserCardDetails(userId);
      const cardExists = userCards.some(
        (card) => card.cardNumber === req.body.cardNumber
      );

      if (cardExists) {
        return res.status(409).json({
          error: "Card with the same number already exists for this user.",
        });
      }

      const result = await userServices.addNewCard(userId, req.body);
      if (result.error) {
        return res.status(500).json({ error: result.error });
      }
      return res.json({ message: result.message });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};

//recent searches
exports.recent_search = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user_id = req.user;
      const hotels = await userServices.recent_search1(user_id);
      const output=hotels[0].recentVisitsOfHotels
      console.log(output.length)
      res.status(200).json(output.reverse());
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ message: "Please login to continue" });
  }
};
