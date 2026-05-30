import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { createSamplePackage } from "../controllers/Sample Package/createSamplePackage.controller.js";
import { getSamplePackages } from "../controllers/Sample Package/getSamplePackage.controller.js";
const samplePackageRouter = express.Router()


samplePackageRouter.post("/add-sample-package",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),createSamplePackage)
samplePackageRouter.get("/get-sample-package",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getSamplePackages)
// samplePackageRouter.get("/get-rooms-type-for-hotelId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getRoomsTypeForHotelId)
// samplePackageRouter.put("/update-room-by-id",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateRoomById)
// samplePackageRouter.delete("/delete-room-by-id",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteRoomById)

export default samplePackageRouter