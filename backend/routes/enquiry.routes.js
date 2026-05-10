import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { searchB2BAccountsForEnquiry, searchB2CAccountsForEnquiry } from "../controllers/Enquiry/getEnquiry.controller.js";
import { addB2BEnquiry, addB2CEnquiry } from "../controllers/Enquiry/createEnquiry.controller.js";
const enquiryRouter = express.Router()


enquiryRouter.post("/add-b2b-enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addB2BEnquiry)
enquiryRouter.post("/add-b2c-enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addB2CEnquiry)
// enquiryRouter.post("/add-b2c-account",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addB2CAccount)
// enquiryRouter.get("/get-b2b-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2BAccounts)
// enquiryRouter.get("/get-b2c-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2CAccounts)
// enquiryRouter.get("/search-b2b-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2BAccounts)
// enquiryRouter.get("/search-b2c-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2CAccounts)
enquiryRouter.get("/get-searched-B2B-Accounts-For-Enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2BAccountsForEnquiry)
enquiryRouter.get("/get-searched-B2C-Accounts-For-Enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2CAccountsForEnquiry)
// enquiryRouter.get("/get-b2c-account-by-id/:accountId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2CAccountById)
// enquiryRouter.put("/update-b2b-account-by-id/:accountId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateB2BAccount)
// enquiryRouter.put("/update-b2c-account-by-id/:accountId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateB2CAccount)
// enquiryRouter.patch("/update-b2b-account-status-by-id/:accountId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateB2BStatus)
// enquiryRouter.patch("/update-b2c-account-status-by-id/:accountId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateB2CStatus)

export default enquiryRouter