import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addRoom, getRoomsOfHotels } from "../controllers/room.controller.js";
const roomRouter = express.Router()


roomRouter.post("/add-room",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addRoom)
roomRouter.get("/get-rooms",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getRoomsOfHotels)
// hotelRouter.get("/get-hotels",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getHotels)
// hotelRouter.get("/get-hotel-by-id/:hotelId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getHotelById)
// hotelRouter.put("/update-hotel-by-id/:hotelId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateHotelById)
// hotelRouter.get("/search-hotels",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchHotels)

export default roomRouter