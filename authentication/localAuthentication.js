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
        const user = await userService.findAcountCredentials("email", email);
        if (!user) {
          return done(null, false, {
            message: "The provided email address is not found",
          });
        }
        if (utilities.decrypt(user.password) == password) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Sorry wrong password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("local serialisation");
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    console.log("local deserialisation");
    done(null, id);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
