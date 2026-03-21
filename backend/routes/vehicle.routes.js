import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addVehicle, getVehicle, searchVehicle } from "../controllers/vehicle.controller.js";
const vehicleRouter = express.Router()


vehicleRouter.post("/add-vehicle",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addVehicle)
vehicleRouter.get("/get-vehicles",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getVehicle)
vehicleRouter.get("/search-vehicles",authMiddleware,searchVehicle)

export default vehicleRouter