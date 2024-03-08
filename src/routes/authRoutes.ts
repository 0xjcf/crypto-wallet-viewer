import express, { Request } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/User";

const router = express.Router();

type RegisterRequest = Request<{}, {}, { username: string; password: string }>;

// Route for user registration
router.post("/register", async (request: RegisterRequest, response) => {
  const { username, password } = request.body;

  // Check if username and password are provided
  if (!username || !password) {
    return response
      .status(400)
      .json({ message: "Please provide both username and password" });
  }

  // Hash password before saving to database
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create a new user
  try {
    const newUser = await User.create({ username, password: hashedPassword });
    return response
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return response.status(500).json({ message: "Error creating user", error });
  }
});

// Route for user login
// Use passport.authenticate middleware to authenticate user
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard", // Redirect to dashboard if login is successful
    failureRedirect: "/", // Redirect to login screen if login fails
  })
);

// Route for user logout
router.get("/logout", (request, response) => {
  request.logOut((error: Error) => {
    if (error)
      return response.status(500).json({ message: "Error logging out" });
  }); // Passport logout method
  response.redirect("/"); // Redirect to home page after logout
});

export default router;
