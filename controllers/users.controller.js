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
        return res.status(401).json({ message: info.message });
      }
      req.login(user, (error) => {
        if (error) {
          return next(error);
        }
        return res
          .status(200)
          .json({ message: "login successful", clientId: user.id });
      });
    })(req, res, next);
  } else if (by === "facebook") {
    facebookPassport.authenticate("facebook", (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (error) => {
        if (error) {
          return next(error);
        }
        return res
          .status(200)
          .json({ message: "login successful", clientId: user.id });
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
  }else{
    return res.status(400).json({message: "Sorry, Bad request"})
  }
};
