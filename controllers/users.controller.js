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
const view = async (req, res) => {
  try {
    await connection();
    const { user_id } = req.params;
    const list = await service.view(user_id); 
    // if favourite list is empty
    if (list[0].favouriteHotels.length == 0) {
      res.status(404).json({ msg: "No hotels are added yet" });
    } 
    else {
      console.log("Total count ",list[0].favouriteHotels.length)
      res.status(200).json(list[0].favouriteHotels);
    }
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// To add a hotels to avourites hotels
const add = async (req, res) => {
  try {
    await connection();
    const {user_id, hotel_id}= req.params;
    const list = await service.add(user_id,hotel_id); 
    // if list is empty
    if (!list) {
      res.status(404).json({ msg: "Error occured " });
      
    } else {
      // if success return list of favourites
      res.status(200).json({ msg: "Hotel added successfully" , Favorites : list.favouriteHotels});
    }
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// to remove a hotel from favourite hotels

const remove = async (req, res) => {
    try {
      await connection();
      const {user_id, hotel_id}= req.params;
      const list = await service.remove(user_id,hotel_id); 
      //if list is empty
      if (list==0) {
        res.status(404).json({ msg: "Hotel not found" });
      } 
      else {
        res.status(200).json({ msg: "Hotel removed successfully" });
        console.log(service.view(user_id));
      }
    } 
    catch (error) {
      console.error('Error fetching hotel details:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
//recent searches

const recent = async (req, res) => {
  try {
    await connection();
    const {user_id, hotel_id}= req.params;
    const hotels = await service.recent(user_id,hotel_id);
    res.status(200).json(hotels.recentVisitsOfHotels);
  } 
  catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
