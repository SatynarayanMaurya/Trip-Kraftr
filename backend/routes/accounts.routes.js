import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addB2BAccount, addB2CAccount } from "../controllers/Accounts/createAccount.controller.js";
import { getB2BAccountById, getB2BAccounts, getB2CAccountById, getB2CAccounts, searchB2BAccounts, searchB2CAccounts } from "../controllers/Accounts/getAccounts.controller.js";
const accountsRouter = express.Router()


accountsRouter.post("/add-b2b-account",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addB2BAccount)
accountsRouter.post("/add-b2c-account",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addB2CAccount)
accountsRouter.get("/get-b2b-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2BAccounts)
accountsRouter.get("/get-b2c-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2CAccounts)
// accountsRouter.get("/get-activities-by-subRegion-Ids",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getActivitiesBySubRegionIds)
accountsRouter.get("/search-b2b-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2BAccounts)
accountsRouter.get("/search-b2c-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2CAccounts)
accountsRouter.get("/get-b2b-account-by-id/:accountId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2BAccountById)
accountsRouter.get("/get-b2c-account-by-id/:accountId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2CAccountById)
// accountsRouter.delete("/delete-activity/:activityId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteActivityById)
// accountsRouter.put("/update-activity-by-id/:activityId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateActivityById)

export default accountsRouter