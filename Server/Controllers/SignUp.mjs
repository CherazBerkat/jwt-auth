import User from "../Models/User.mjs";
import jwt from "jsonwebtoken";
import Router from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { hashPassword } from "../utils/HashPW.mjs";
import { check, validationResult } from "express-validator";
import jwtAuth from "../middlewares/jwtAuth.mjs";
import axios from "axios";

const SignUpRouter = Router();
dotenv.config();
SignUpRouter.use(bodyParser.json());
SignUpRouter.use(cookieParser());
SignUpRouter.use(
  cors({
    origin: "http://localhost:5173", // Replace with the actual origin of your React app
    credentials: true,
  })
);

SignUpRouter.post(
  "/signUp",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(201).send("User already exists");
      }

      // Create a new user instance
      user = new User({
        email,
        password,
        username,
      });

      // Hash the password
      user.password = hashPassword(password);

      // Save the user to the database
      await user.save();

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign JWT token
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "secret",
        "secret",
        { expiresIn: 3600 } // 1 hour
      );

      res.cookie("token", token, {
        maxAge: 3600000, // 1 hour in milliseconds
        path: "/",
        secure: false,
        sameSite: "Lax",
      });

      res.status(200).json({
        userId: user.id,
        message: "User registered successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

SignUpRouter.get("/signUp", jwtAuth, (req, res) => {
  res.send("Signed Up");
});

SignUpRouter.post("/gglSignUp", async (req, res) => {
  const { access_token } = req.body;

  try {
    // Use the access token to get user information from Google's userinfo endpoint
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
    );

    const { email, name } = response.data;

    // Check if the user already exists
    let user = await User.findOne({ email }).exec();
    if (user) {
      return res.status(201).send("User already exists");
    }

    // Create a new user if they don't exist
    user = new User({
      email,
      username: name, // Use the name provided by Google
    });

    // Save the new user to the database
    await user.save();

    // Create JWT payload
    const jwtPayload = {
      user: {
        id: user.id,
      },
    };

    // Sign JWT token
    const token = jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET || "secret",
      { expiresIn: 3600 } // 1 hour
    );

    res.cookie("token", token, {
      maxAge: 3600000, // 1 hour in milliseconds
      path: "/",
      secure: false,
      sameSite: "Lax",
    });

    return res.status(200).json({
      userId: user.id,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default SignUpRouter;
