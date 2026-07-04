import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addMasterRegion, addRegion, addRegionImages, deleteRegionById, fetchOrgRegionImages, fetchRegionImages, getCountryForOrg, getMasterRegions, getRegionById, getRegionForOrg, getRegions, searchMasterCountries, searchMasterRegions, searchMasterRegionsOnly, updateRegionById } from "../controllers/region.controller.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
const regionRouter = express.Router()


regionRouter.post("/add-region",authMiddleware,roleMiddleware(["org_admin"]),addRegion)
regionRouter.get("/get-regions",authMiddleware,roleMiddleware(["org_admin"]),getRegions)
regionRouter.get("/get-regions-for-org",authMiddleware,getRegionForOrg)
regionRouter.get("/get-region-by-id/:regionId",authMiddleware,roleMiddleware(["org_admin"]),getRegionById)
regionRouter.put("/update-region-by-id/:regionId",authMiddleware,roleMiddleware(["org_admin"]),updateRegionById)
regionRouter.delete("/delete-region-by-id/:regionId",authMiddleware,roleMiddleware(["org_admin"]),deleteRegionById)
regionRouter.get("/search-master-regions",authMiddleware,searchMasterRegions)
regionRouter.get("/get-country-for-org",authMiddleware,getCountryForOrg)  // For country suggestions


regionRouter.get("/fetch-regions-images",authMiddleware,roleMiddleware(["org_admin",'super_admin']),fetchRegionImages)
regionRouter.get("/fetch-org-regions-images",fetchOrgRegionImages)
regionRouter.get("/search-master-countries",authMiddleware,roleMiddleware(["org_admin",'super_admin']),searchMasterCountries)
regionRouter.get("/search-master-regions-only",authMiddleware,roleMiddleware(["org_admin",'super_admin']),searchMasterRegionsOnly)



// Admin Routes 
regionRouter.post("/add-master-region",authMiddleware,roleMiddleware(["super_admin"]),addMasterRegion)
regionRouter.get("/get-master-region",authMiddleware,roleMiddleware(["super_admin"]),getMasterRegions)
regionRouter.post("/add-region-images",authMiddleware,roleMiddleware(["super_admin"]),addRegionImages)

export default regionRouter