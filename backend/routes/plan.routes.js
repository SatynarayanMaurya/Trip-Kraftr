
import express from "express";
import { createPlan } from "../controllers/plan.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { superAdminMiddleware } from "../middlewares/superAdmin.middleware.js";
const planRouter = express.Router()


planRouter.post("/create-plan",authMiddleware,superAdminMiddleware,createPlan)

export default planRouter