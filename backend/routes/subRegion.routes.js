import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { 
    addSubRegion, 
    deleteSubRegionById, 
    getSubRegionById, 
    getSubRegions, 
    searchRegionForOrganization, 
    searchSubRegions, 
    updateSubRegionById,
    getSubRegionsForOrg } 
from "../controllers/subregion.controller.js";

const subRegionRouter = express.Router()


subRegionRouter.post("/add-sub-regions",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addSubRegion)
subRegionRouter.get("/search-regions-for-org",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchRegionForOrganization)
subRegionRouter.get("/get-sub-regions",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getSubRegions)
subRegionRouter.get("/get-sub-regions-for-org/:regionId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getSubRegionsForOrg)
subRegionRouter.get("/search-sub-regions",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchSubRegions)
subRegionRouter.get("/get-sub-regions-by-id/:subRegionId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getSubRegionById)
subRegionRouter.put("/update-sub-regions-by-id/:subRegionId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateSubRegionById)
subRegionRouter.delete("/delete-sub-regions-by-id/:subRegionId",authMiddleware,roleMiddleware(["org_admin"]),deleteSubRegionById)


export default subRegionRouter