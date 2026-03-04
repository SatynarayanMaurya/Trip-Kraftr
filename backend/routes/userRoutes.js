import express from "express";
import { getUserDetails } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authMiddlewareWithAllChecks } from "../middlewares/authMiddlewareWithAllChecks.js";
const userRouter = express.Router()


userRouter.get("/get-user-details",authMiddlewareWithAllChecks,getUserDetails)

export default userRouter