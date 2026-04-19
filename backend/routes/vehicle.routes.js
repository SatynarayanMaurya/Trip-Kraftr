import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addVehicle, deleteVehicleById, getVehicle, getVehiclesByRegionIds, searchVehicle, updateVehicleById } from "../controllers/vehicle.controller.js";
const vehicleRouter = express.Router()


vehicleRouter.post("/add-vehicle",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addVehicle)
vehicleRouter.get("/get-vehicles",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getVehicle)
vehicleRouter.get("/get-vehicles-by-regionIds",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getVehiclesByRegionIds)
vehicleRouter.put("/update-vehicle/:vehicleId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateVehicleById)
vehicleRouter.delete("/delete-vehicle/:vehicleId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteVehicleById)
vehicleRouter.get("/search-vehicles",authMiddleware,searchVehicle)

export default vehicleRouter