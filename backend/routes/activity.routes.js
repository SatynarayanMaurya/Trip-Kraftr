import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addActivity, deleteActivityById, getActivities, getActivitiesBySubRegionIds, getActivityById, searchActivity, updateActivityById } from "../controllers/activityController.js";
const activityRouter = express.Router()


activityRouter.post("/add-activity",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addActivity)
activityRouter.get("/get-activities",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getActivities)
activityRouter.get("/get-activities-by-subRegion-Ids",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getActivitiesBySubRegionIds)
activityRouter.get("/search-activities",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchActivity)
activityRouter.get("/get-activity-by-id/:activityId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getActivityById)
activityRouter.delete("/delete-activity/:activityId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteActivityById)
activityRouter.put("/update-activity-by-id/:activityId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateActivityById)

export default activityRouter