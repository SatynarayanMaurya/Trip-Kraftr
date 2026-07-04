import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { createPrivateTrip } from "../controllers/Private Trip/createPrivateTrip.controller.js";
import { getPrivateTripById, getPrivateTrips, searchPrivateTrips } from "../controllers/Private Trip/getPrivateTrip.controller.js";
import { AddHotelPayments, updateGuestPayments,  updateGuestPaymentsRowWise,  updateHotelPaymentsRowWise, updatePrivateTrip, updatePrivateTripStatus, updateVehiclePaymentsRowWise, updateVehicleVendorPayments } from "../controllers/Private Trip/updatePrivateTrip.controller.js";
import { deleteGuestPaymentRowWise, deleteHotelVehiclePaymentRowWise, deletePrivateTripById, deleteUnusedHotelOrVehicle } from "../controllers/Private Trip/deletePrivateTrip.controller.js";
const privateTripRouter = express.Router()


privateTripRouter.post("/add-private-trip",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),createPrivateTrip)
privateTripRouter.get("/get-private-trips",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getPrivateTrips)
privateTripRouter.get("/get-private-trip-by-id/:privateTripId",getPrivateTripById)

privateTripRouter.get("/search-private-trip",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchPrivateTrips)

privateTripRouter.put("/update-private-trip-hotel-payments/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),AddHotelPayments)

privateTripRouter.put("/update-private-trip-hotel-payments-row-wise/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateHotelPaymentsRowWise)

privateTripRouter.put("/update-private-trip-vehicle-payments/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateVehicleVendorPayments)

privateTripRouter.put("/update-private-trip-vehicle-payments-row-wise/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateVehiclePaymentsRowWise)

privateTripRouter.put("/update-private-trip-guest-payments/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGuestPayments)

privateTripRouter.put("/update-private-trip-guest-payments-row-wise/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateGuestPaymentsRowWise)

privateTripRouter.put("/delete-hotel-vehicle-payment-row-wise/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteHotelVehiclePaymentRowWise)

privateTripRouter.put("/delete-guest-payment-row-wise/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteGuestPaymentRowWise)

privateTripRouter.put("/update-private-trip/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updatePrivateTrip)

privateTripRouter.put("/update-private-trip-status/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updatePrivateTripStatus)

privateTripRouter.put("/delete-unused-hotel-or-vehicle-private-trip/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteUnusedHotelOrVehicle)

privateTripRouter.delete("/delete-private-trip-by-id/:privateTripId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deletePrivateTripById)

export default privateTripRouter