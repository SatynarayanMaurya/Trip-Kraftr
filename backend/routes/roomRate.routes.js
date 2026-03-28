import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addRoomRate } from "../controllers/roomRate.controller.js";
const roomRateRouter = express.Router()


roomRateRouter.post("/add-room-rate",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addRoomRate)
// roomRateRouter.get("/get-rooms",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getRoomsOfHotels)

export default roomRateRouter