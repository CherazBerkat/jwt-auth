import passport from "passport";
import User from "../Models/User.mjs";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "CLIENT_ID",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "CLIENT_SECRET",
      callbackURL: "/signUp/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ github: profile.id });
        if (!user) {
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null; // Use a fallback if email is not available
          // If user doesn't exist, create a new user
          user = await User.create({
            github: profile.id,
            username: profile.username,
            email: email,
          });
          await user.save();
        }
        return done(null, user);
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
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
