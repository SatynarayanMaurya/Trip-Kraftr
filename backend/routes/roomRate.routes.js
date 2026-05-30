import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addRoomRate, deleteRoomRate, getRoomRateBy_HotelId_RoomId_date, getRoomRates, updateRoomRate } from "../controllers/roomRate.controller.js";
const roomRateRouter = express.Router()


roomRateRouter.post("/add-room-rate",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addRoomRate)
roomRateRouter.get("/get-room-rates/:hotelId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getRoomRates)
roomRateRouter.put("/update-room-rates/:hotelId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateRoomRate)
roomRateRouter.delete("/delete-room-rate",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteRoomRate)
roomRateRouter.get("/get-room-rate-by-hotelId-roomId-date",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getRoomRateBy_HotelId_RoomId_date)

export default roomRateRouter