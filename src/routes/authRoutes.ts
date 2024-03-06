import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/User";

const router = express.Router();

// Route for user registration
router.post("/register", async (request, response) => {
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
    failureRedirect: "/login", // Redirect to login page if login fails
  })
);

// Route for user logout
router.get("/logout", (request, response) => {
  request.logOut((error) => {
    if (error) {
      console.error("Logout failed due to error:", error);
    }
  }); // Passport logout method
  response.redirect("/"); // Redirect to home page after logout
});

export default router;
