import express from "express";
import { signup } from "../controllers/Authentication/auth.controller.js";
const authRouter = express.Router()


authRouter.post("/signup",signup)

export default authRouter