import express from "express";
import pickup from "../controllers/pickup.js";

const ftPickupRouter = express.Router();

ftPickupRouter.get("/createPickup", pickup);
export default ftPickupRouter;
