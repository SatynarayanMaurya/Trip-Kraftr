import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addRoom, deleteRoomById, getRoomsOfHotels, getRoomsTypeForHotelId, updateRoomById } from "../controllers/room.controller.js";
const roomRouter = express.Router()


roomRouter.post("/add-room",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addRoom)
roomRouter.get("/get-rooms",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getRoomsOfHotels)
roomRouter.get("/get-rooms-type-for-hotelId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getRoomsTypeForHotelId)
roomRouter.put("/update-room-by-id",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateRoomById)
roomRouter.delete("/delete-room-by-id",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteRoomById)

export default roomRouter