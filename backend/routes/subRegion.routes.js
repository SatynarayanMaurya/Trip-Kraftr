import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { 
    addSubRegion, 
    getSubRegionById, 
    getSubRegions, 
    searchRegionForOrganization, 
    searchSubRegions, 
    updateSubRegionById } 
from "../controllers/subregion.controller.js";

const subRegionRouter = express.Router()


subRegionRouter.post("/add-sub-regions",authMiddleware,roleMiddleware(["org_admin","travel_consultant"]),addSubRegion)
subRegionRouter.get("/search-regions-for-org",authMiddleware,roleMiddleware(["org_admin","travel_consultant"]),searchRegionForOrganization)
subRegionRouter.get("/get-sub-regions",authMiddleware,roleMiddleware(["org_admin","travel_consultant"]),getSubRegions)
subRegionRouter.get("/search-sub-regions",authMiddleware,roleMiddleware(["org_admin","travel_consultant"]),searchSubRegions)
subRegionRouter.get("/get-sub-regions-by-id/:subRegionId",authMiddleware,roleMiddleware(["org_admin","travel_consultant"]),getSubRegionById)
subRegionRouter.put("/update-sub-regions-by-id/:subRegionId",authMiddleware,roleMiddleware(["org_admin","travel_consultant"]),updateSubRegionById)


export default subRegionRouter