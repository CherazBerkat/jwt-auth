import Router from "express";
import cors from "cors";
import jwtAuth from "../middlewares/jwtAuth.mjs";
const logOutRouter = Router();
logOutRouter.use(
  cors({
    origin: "http://localhost:5173", // Replace with the actual origin of your React app
    credentials: true,
  })
);
logOutRouter.get("/logOut", jwtAuth, (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

export default logOutRouter;
