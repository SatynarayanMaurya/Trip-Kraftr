import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { createPrivateTrip } from "../controllers/Private Trip/createPrivateTrip.controller.js";
import { getPrivateTripById, getPrivateTrips } from "../controllers/Private Trip/getPrivateTrip.controller.js";
import { updateGuestPayments, updateHotelPayments, updateVehicleVendorPayments } from "../controllers/Private Trip/updatePrivateTrip.controller.js";
const privateTripRouter = express.Router()


privateTripRouter.post("/add-private-trip",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),createPrivateTrip)
privateTripRouter.get("/get-private-trips",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPrivateTrips)
privateTripRouter.get("/get-private-trip-by-id/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPrivateTripById)
privateTripRouter.put("/update-private-trip-hotel-payements/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateHotelPayments)
privateTripRouter.put("/update-private-trip-vehicle-payements/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateVehicleVendorPayments)
privateTripRouter.put("/update-private-trip-guest-payements/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGuestPayments)
// privateTripRouter.get("/search-sample-package",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchSamplePackage)

export default privateTripRouter