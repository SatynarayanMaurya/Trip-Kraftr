import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addHotel, getHotelById, getHotels, searchHotels } from "../controllers/hotel.controller.js";
const hotelRouter = express.Router()


hotelRouter.post("/add-hotel",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addHotel)
hotelRouter.get("/get-hotels",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getHotels)
hotelRouter.get("/get-hotel-by-id/:hotelId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getHotelById)
hotelRouter.get("/search-hotels",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchHotels)
// vehicleRouter.put("/update-vehicle/:vehicleId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateVehicleById)
// vehicleRouter.delete("/delete-vehicle/:vehicleId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteVehicleById)
// vehicleRouter.get("/search-vehicles",authMiddleware,searchVehicle)

export default hotelRouter