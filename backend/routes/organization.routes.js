
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { superAdminMiddleware } from "../middlewares/superAdmin.middleware.js";
import { addOrganization, addOrganizationAdmin, getAllOrganizationForSuperAdmin } from "../controllers/organization.controller.js";
const organizationRouter = express.Router()


organizationRouter.post("/add-organization",authMiddleware,superAdminMiddleware,addOrganization)
organizationRouter.post("/add-organization-admin",authMiddleware,superAdminMiddleware,addOrganizationAdmin)
organizationRouter.get("/get-all-organization-for-super-admin",authMiddleware,superAdminMiddleware,getAllOrganizationForSuperAdmin)

export default organizationRouter