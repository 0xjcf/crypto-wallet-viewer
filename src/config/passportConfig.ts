import { PassportStatic } from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User";

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept credentials,
// and invoke a callback with a user object.
export const verify: VerifyFunction = async (username, password, done) => {
  // Match user based on username
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
};

function configurePassport(passport: PassportStatic) {
  passport.use(new LocalStrategy(verify));

  // Used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => done(null, user))
      .catch((error) => done(error));
  });
}

export default configurePassport;
