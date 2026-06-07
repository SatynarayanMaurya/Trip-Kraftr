import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { createPrivateTrip } from "../controllers/Private Trip/createPrivateTrip.controller.js";
import { getPrivateTrips } from "../controllers/Private Trip/getPrivateTrip.controller.js";
const privateTripRouter = express.Router()


privateTripRouter.post("/add-private-trip",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),createPrivateTrip)
privateTripRouter.get("/get-private-trips",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPrivateTrips)
// privateTripRouter.get("/get-sample-package-by-id/:samplePackageId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getSamplePackageById)
// privateTripRouter.put("/update-sample-package-by-id/:samplePackageId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateSamplePackageById)
// privateTripRouter.get("/search-sample-package",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchSamplePackage)

export default privateTripRouter