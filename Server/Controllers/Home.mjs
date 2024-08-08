import Router from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwtAuth from "../middlewares/jwtAuth.mjs";

const HomeRouter = Router();
dotenv.config();
HomeRouter.use(bodyParser.json());
HomeRouter.use(cookieParser());
HomeRouter.get("/home", jwtAuth, async (req, res) => {
  res.send("Authorized");
});

export default HomeRouter;
