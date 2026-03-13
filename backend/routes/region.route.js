import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addMasterRegion, addRegion, addRegionImages, fetchRegionImages, getMasterRegions, getRegions, searchMasterCountries, searchMasterRegions, searchMasterRegionsOnly } from "../controllers/region.controller.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
const regionRouter = express.Router()


regionRouter.post("/add-region",authMiddleware,roleMiddleware(["org_admin"]),addRegion)
regionRouter.get("/get-regions",authMiddleware,roleMiddleware(["org_admin"]),getRegions)
regionRouter.get("/search-master-regions",authMiddleware,searchMasterRegions)

regionRouter.get("/fetch-regions-images",authMiddleware,roleMiddleware(["org_admin",'super_admin']),fetchRegionImages)
regionRouter.get("/search-master-countries",authMiddleware,roleMiddleware(["org_admin",'super_admin']),searchMasterCountries)
regionRouter.get("/search-master-regions-only",authMiddleware,roleMiddleware(["org_admin",'super_admin']),searchMasterRegionsOnly)



// Admin Routes 
regionRouter.post("/add-master-region",authMiddleware,roleMiddleware(["super_admin"]),addMasterRegion)
regionRouter.get("/get-master-region",authMiddleware,roleMiddleware(["super_admin"]),getMasterRegions)
regionRouter.post("/add-region-images",authMiddleware,roleMiddleware(["super_admin"]),addRegionImages)

export default regionRouter