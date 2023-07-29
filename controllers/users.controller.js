// TODO the controllers of users collection
const localPassport = require("../authentication/localAuthentication");
const googlePassport = require("../authentication/googleAuthentication");
const userServices = require("../services/users.service");
const utilities = require("../utils/utils");
const joi = require("joi");

// joi validation for the registration input
validateSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().email().required(),
  phoneNumber: joi
    .string()
    .pattern(/^\d{10}$/)
    .required(),
  password: joi.string().required(),
  confirmPassword: joi.ref("password"),
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
    console.log(req.body);
    const { error } = validateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const userName = `${firstName}_${lastName}`;
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
        hashedPassword,
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
  } else {
    return res.status(400).json({ message: "Invalid access" });
  }
};

// logout controller
exports.logout = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout(function (error) {
      if (error) {
        return next(error);
      }
      return res.status(200).json({ message: "Logout successful" });
    });
  }
};
