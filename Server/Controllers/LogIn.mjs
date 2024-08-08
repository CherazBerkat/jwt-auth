import User from "../Models/User.mjs";
import jwt from "jsonwebtoken";
import Router from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { comparePassword } from "../utils/HashPW.mjs";
import { check, validationResult } from "express-validator";
import jwtAuth from "../middlewares/jwtAuth.mjs";

const LogInRouter = Router();
dotenv.config();
LogInRouter.use(bodyParser.json());
LogInRouter.use(cookieParser());
LogInRouter.use(
  cors({
    origin: "http://localhost:5173", // Replace with the actual origin of your React app
    credentials: true,
  })
);

LogInRouter.post(
  "/logIn",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.json({ message: "Invalid email" });
      }

      // Check if password matches
      const isMatch = comparePassword(password, user.password);
      if (!isMatch) {
        return res.json({ message: "Password not Correct" });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "secret",
        { expiresIn: 3600 } // 1 hour
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
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

LogInRouter.get("/logIn", jwtAuth, (req, res) => {
  res.send("Logged In");
});

export default LogInRouter;
