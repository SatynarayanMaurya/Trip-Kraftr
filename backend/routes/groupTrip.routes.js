import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addGroupTrip, addGroupTripParticipant } from "../controllers/Group Trip/createGroupTrip.controller.js";
import { getAllGroupTripParticipant, getGroupTripById, getGroupTrips, searchGroupTrip, suggestionGroupTrip } from "../controllers/Group Trip/getGroupTrip.controller.js";
import { updateGroupTripById, updateGroupTripParticipantById, updateGroupTripStatus, updateGroupTripSummaryById } from "../controllers/Group Trip/updateGroupTrip.controller.js";
import { deleteGroupTrip, deleteGroupTripParticipantById } from "../controllers/Group Trip/deleteGroupTrip.controller.js";
// import { addGroupTrip, getGroupTripById, getGroupTrips, searchGroupTrip, updateGroupTripById, updateGroupTripSummaryById } from "../controllers/groupTrip.controller.js";
const groupTripRouter = express.Router()


groupTripRouter.post("/add-group-trip",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addGroupTrip)
groupTripRouter.post("/add-group-trip-participant",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addGroupTripParticipant)
groupTripRouter.get("/get-group-trip-participants/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getAllGroupTripParticipant)
groupTripRouter.get("/get-group-trips",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getGroupTrips)
groupTripRouter.get("/suggestion-group-trips",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),suggestionGroupTrip)
groupTripRouter.get("/search-group-Trips",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchGroupTrip)
groupTripRouter.get("/get-group-trip-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getGroupTripById)
groupTripRouter.put("/update-group-trip-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGroupTripById)
groupTripRouter.put("/update-group-trip-summary-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGroupTripSummaryById)
groupTripRouter.put("/update-group-trip-participant-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGroupTripParticipantById)
groupTripRouter.patch("/update-group-trip-status-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGroupTripStatus)
groupTripRouter.delete("/delete-group-trip-participant-by-id/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteGroupTripParticipantById)
groupTripRouter.delete("/delete-group-trip/:groupTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteGroupTrip)

export default groupTripRouter