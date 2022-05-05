import express from "express";
import logOutUser from "../controllers/logout.js";

const userADRouter = express.Router();

userADRouter.get("/logout", logOutUser);
export default userADRouter;
