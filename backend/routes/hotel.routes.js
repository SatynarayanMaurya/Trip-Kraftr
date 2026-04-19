import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addHotel, deleteHotelById, getHotelById, getHotels, getHotelsBySubRegionIds, searchHotels, updateHotelById } from "../controllers/hotel.controller.js";
const hotelRouter = express.Router()


hotelRouter.post("/add-hotel",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addHotel)
hotelRouter.get("/get-hotels",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getHotels)
hotelRouter.get("/get-hotel-by-subRegion-id",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getHotelsBySubRegionIds)
hotelRouter.get("/get-hotel-by-id/:hotelId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getHotelById)
hotelRouter.put("/update-hotel-by-id/:hotelId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateHotelById)
hotelRouter.get("/search-hotels",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchHotels)
hotelRouter.delete("/delete-hotel",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteHotelById)

export default hotelRouter