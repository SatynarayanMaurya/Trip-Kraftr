import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addMasterRegion, addRegion, getMasterRegions, getRegions, searchMasterRegions } from "../controllers/region.controller.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
const regionRouter = express.Router()


regionRouter.post("/add-region",authMiddleware,roleMiddleware(["org_admin"]),addRegion)
regionRouter.get("/get-regions",authMiddleware,roleMiddleware(["org_admin"]),getRegions)
regionRouter.get("/search-master-regions",authMiddleware,searchMasterRegions)




// Admin Routes 
regionRouter.post("/add-master-region",authMiddleware,roleMiddleware(["super_admin"]),addMasterRegion)
regionRouter.get("/get-master-region",authMiddleware,roleMiddleware(["super_admin"]),getMasterRegions)

export default regionRouter