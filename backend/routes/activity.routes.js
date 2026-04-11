import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addActivity, getActivities, searchActivity } from "../controllers/activityController.js";
const activityRouter = express.Router()


activityRouter.post("/add-activity",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addActivity)
activityRouter.get("/get-activities",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getActivities)
activityRouter.get("/search-activities",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchActivity)
// activityRouter.get("/get-place-by-id/:placeId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPlaceById)
// activityRouter.delete("/delete-place/:placeId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deletePlaceById)
// activityRouter.put("/update-place-by-id/:placeId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updatePlaceById)

export default activityRouter