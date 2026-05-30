import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {addPlace, deletePlaceById, getPlaceById, getPlaces, getPlacesBySubRegionIds, getPlacesBySubRegionNames, searchPlaces, updatePlaceById} from '../controllers/place.controller.js'
const placeRouter = express.Router()


placeRouter.post("/add-place",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addPlace)
placeRouter.get("/get-places",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPlaces)
placeRouter.get("/get-places-by-subRegion-ids",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPlacesBySubRegionIds)
placeRouter.get("/get-places-by-subRegion-names",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPlacesBySubRegionNames)
placeRouter.get("/search-places",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchPlaces)
placeRouter.get("/get-place-by-id/:placeId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPlaceById)
placeRouter.delete("/delete-place/:placeId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deletePlaceById)
placeRouter.put("/update-place-by-id/:placeId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updatePlaceById)

export default placeRouter