import express from "express";
import SignUpRouter from "../Controllers/SignUp.mjs";
import Router from "express";
import HomeRouter from "../Controllers/Home.mjs";
import logOutRouter from "../Controllers/LogOut.mjs";
const Routes = Router();
Routes.use(express.json());
Routes.use(SignUpRouter);
Routes.use(HomeRouter);
Routes.use(logOutRouter);

export default Routes;
