const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const userService = require("../services/users.service");
require("dotenv").config();

passport.use(
  "google",
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3200/auth/login?by=google",
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userService.findAcountCredentials(
          "email",
          profile.emails[0].value
        );

        if (existingUser) {
          return done(null, existingUser);
        } else {
          const userData = {
            userName: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture:
              profile.photos && profile.photos.length
                ? profile.photos[0].value
                : null,
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
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    done(null, id);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
