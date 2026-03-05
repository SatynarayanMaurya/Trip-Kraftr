import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addRegion } from "../controllers/region.controller.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
const regionRouter = express.Router()


regionRouter.post("/add-region",authMiddleware,roleMiddleware(["org_admin"]),addRegion)

export default regionRouter