import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { createSamplePackage } from "../controllers/Sample Package/createSamplePackage.controller.js";
import { getSamplePackageById, getSamplePackages, searchSamplePackage } from "../controllers/Sample Package/getSamplePackage.controller.js";
import {  updateSamplePackageById } from "../controllers/Sample Package/updateSamplePackage.controller.js";
const samplePackageRouter = express.Router()


samplePackageRouter.post("/add-sample-package",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),createSamplePackage)
samplePackageRouter.get("/get-sample-package",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getSamplePackages)
samplePackageRouter.get("/get-sample-package-by-id/:samplePackageId",getSamplePackageById)
samplePackageRouter.put("/update-sample-package-by-id/:samplePackageId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateSamplePackageById)
samplePackageRouter.get("/search-sample-package",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchSamplePackage)
// samplePackageRouter.put("/update-room-by-id",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateRoomById)
// samplePackageRouter.delete("/delete-room-by-id",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteRoomById)

export default samplePackageRouter