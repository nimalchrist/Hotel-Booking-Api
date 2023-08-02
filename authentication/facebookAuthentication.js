const passport = require("passport");
const userService = require("../services/users.service");
const faceBookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();

passport.use(
  "facebook",
  new faceBookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3200/auth/login?by=facebook",
      profileFields: ["id", "displayName", "photos"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userService.findFacebookAccountCredentials(
          profile.id
        );
        if (existingUser) {
          return done(null, existingUser);
        } else {
          const userData = {
            userName: profile.displayName,
            faceBookId: profile.id,
            profilePicture: profile.photos[0].value,
          };
          const newUser = await userService.createUser(userData);
          return done(null, newUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("facebook serialisation");
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("facebook deserialisation");
    done(null, id);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
