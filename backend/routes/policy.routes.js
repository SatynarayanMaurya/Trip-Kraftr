import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addPolicy, deletePolicy, getAllPolicyForRegion, getPolicy, updatePolicy } from "../controllers/policy.controller.js";
const policyRouter = express.Router()


policyRouter.post("/add-policy",authMiddleware,roleMiddleware(["org_admin"]),addPolicy)
policyRouter.get("/get-policy",authMiddleware,roleMiddleware(["org_admin"]),getPolicy)
policyRouter.get("/get-policy-for-region",getAllPolicyForRegion)
policyRouter.put("/update-policy",authMiddleware,roleMiddleware(["org_admin"]),updatePolicy)
policyRouter.put("/delete-policy",authMiddleware,roleMiddleware(["org_admin"]),deletePolicy)

export default policyRouter