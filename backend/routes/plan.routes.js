
import express from "express";
import { createPlan } from "../controllers/plan.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const planRouter = express.Router()


planRouter.post("/create-plan",authMiddleware,createPlan)

export default planRouter