import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {addPlace, deletePlaceById, getPlaces, searchPlaces} from '../controllers/place.controller.js'
const placeRouter = express.Router()


placeRouter.post("/add-place",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addPlace)
placeRouter.get("/get-places",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPlaces)
placeRouter.get("/search-places",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchPlaces)
// placeRouter.put("/update-vehicle/:vehicleId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateVehicleById)
placeRouter.delete("/delete-place/:placeId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deletePlaceById)
// placeRouter.get("/search-vehicles",authMiddleware,searchVehicle)

export default placeRouter