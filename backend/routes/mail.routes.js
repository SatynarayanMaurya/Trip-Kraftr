import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { sendMail } from "../controllers/mailController.js";
const mailRouter = express.Router()

mailRouter.post("/send-mail",authMiddleware, sendMail);

export default mailRouter