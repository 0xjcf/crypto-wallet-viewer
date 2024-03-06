import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import configurePassport from "./config/passportConfig";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const port = 3000;

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error", err));

app.use(express.json()); // Parse JSON request body

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
); // Session middleware

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

app.get("/", (_req, res) => {
  res.send("Login or register");
});

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("Dashboard");
  } else {
    res.redirect("/login");
  }
});

// Use authRoutes
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
