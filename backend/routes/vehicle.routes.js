import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addVehicle } from "../controllers/vehicle.controller.js";
const vehicleRouter = express.Router()


vehicleRouter.post("/add-vehicle",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addVehicle)
// vehicleRouter.get("/get-regions",authMiddleware,roleMiddleware(["org_admin"]),getRegions)
// vehicleRouter.get("/get-region-by-id/:regionId",authMiddleware,roleMiddleware(["org_admin"]),getRegionById)

export default vehicleRouter