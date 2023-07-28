const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const userService = require("../services/users.service");
const utilities = require("../utils/utils");

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await userService.findUserByField("email", email);
        if (!user) {
          return done(null, false, {
            message: "the provided email address is not found",
          });
        }
        if (utilities.decrypt(user.password) == password) {
          return done(null, user);
        } else {
          return done(null, false, { message: "sorry wrong password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serialized middleware called: ", user);
  done(null, user);
});
passport.deserializeUser(async (data, done) => {
  try {
    const user = await userService.findUserByField("email", data.email);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
