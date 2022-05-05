import express from "express";
import authenticateUser from "../controllers/passport.js";

const passportADRouter = express.Router();

passportADRouter.post("/login", authenticateUser);
export default passportADRouter;
