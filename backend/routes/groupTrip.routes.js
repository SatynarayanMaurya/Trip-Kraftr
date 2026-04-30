import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addGroupTrip } from "../controllers/Group Trip/createGroupTrip.controller.js";
import { getGroupTripById, getGroupTrips, searchGroupTrip, suggestionGroupTrip } from "../controllers/Group Trip/getGroupTrip.controller.js";
import { updateGroupTripById, updateGroupTripStatus, updateGroupTripSummaryById } from "../controllers/Group Trip/updateGroupTrip.controller.js";
// import { addGroupTrip, getGroupTripById, getGroupTrips, searchGroupTrip, updateGroupTripById, updateGroupTripSummaryById } from "../controllers/groupTrip.controller.js";
const groupTripRouter = express.Router()


groupTripRouter.post("/add-group-trip",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addGroupTrip)
groupTripRouter.get("/get-group-trips",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getGroupTrips)
groupTripRouter.get("/suggestion-group-trips",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),suggestionGroupTrip)
groupTripRouter.get("/search-group-Trips",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchGroupTrip)
// groupTripRouter.get("/search-places",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchPlaces)
groupTripRouter.get("/get-group-trip-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getGroupTripById)
// groupTripRouter.delete("/delete-place/:placeId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deletePlaceById)
groupTripRouter.put("/update-group-trip-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGroupTripById)
groupTripRouter.put("/update-group-trip-summary-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGroupTripSummaryById)
groupTripRouter.patch("/update-group-trip-status-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGroupTripStatus)

export default groupTripRouter