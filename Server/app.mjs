import express from "express";
import Routes from "./Routes/Routes.mjs";
import connectDB from "./DB/setDB.mjs";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";

// Load environment variables
dotenv.config();

const app = express();

// Connect to the database
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if you're using HTTPS
  })
);
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Use the router
app.use(Routes);

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
