import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import configurePassport from "./config/passportConfig";
import authRoutes from "./controllers/authController";
import walletRoutes from "./controllers/walletController";
import dashboardRoutes from "./controllers/dashboardController";

dotenv.config();

// Connect to MongoDB

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB\n"))
  .catch((err) => console.log("MongoDB connection error\n", err));

// Create Express server

const app = express();
const port = 3000;

app.use(express.json()); // Parse JSON request body

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // In production, set to true to ensure cookies are only sent over HTTPS
  })
); // Session middleware

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

app.get("/", (_request, response) => {
  response.send("Login or register"); // this will display the home page
});

// Use authRoutes to authenticate users
app.use("/auth", authRoutes);
// Use dashboardRoutes
app.use("/dashboard", dashboardRoutes);
// Use walletRoutes
app.use("/wallet", walletRoutes);

app.listen(port, () => {
  console.log(`\nExpress server is running at http://localhost:${port}`);
});
