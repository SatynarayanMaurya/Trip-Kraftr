import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { getB2BEnquiry, getB2BEnquiryById, getB2CEnquiry, getB2CEnquiryById, searchB2BAccountsForEnquiry, searchB2BEnquiry, searchB2CAccountsForEnquiry, searchB2CEnquiry } from "../controllers/Enquiry/getEnquiry.controller.js";
import { addB2BEnquiry, addB2CEnquiry } from "../controllers/Enquiry/createEnquiry.controller.js";
import { updateB2BEnquiryById, updateB2CEnquiryById } from "../controllers/Enquiry/updateEnquiry.controller.js";
import { deleteB2BEnquiryById, deleteB2CEnquiryById } from "../controllers/Enquiry/deleteEnquiry.controller.js";
const enquiryRouter = express.Router()


enquiryRouter.post("/add-b2b-enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addB2BEnquiry)
enquiryRouter.post("/add-b2c-enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addB2CEnquiry)
// enquiryRouter.post("/add-b2c-account",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),addB2CAccount)
enquiryRouter.get("/get-b2b-enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2BEnquiry)
enquiryRouter.get("/get-b2c-enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2CEnquiry)
// enquiryRouter.get("/get-b2c-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2CAccounts)
enquiryRouter.get("/search-b2b-enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2BEnquiry)
enquiryRouter.get("/search-b2c-enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2CEnquiry)
// enquiryRouter.get("/search-b2c-accounts",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2CAccounts)
enquiryRouter.get("/get-searched-B2B-Accounts-For-Enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2BAccountsForEnquiry)
enquiryRouter.get("/get-searched-B2C-Accounts-For-Enquiry",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),searchB2CAccountsForEnquiry)
enquiryRouter.get("/get-b2b-enquiry-by-id/:enquiryId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2BEnquiryById)
enquiryRouter.get("/get-b2c-enquiry-by-id/:enquiryId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),getB2CEnquiryById)
enquiryRouter.put("/update-b2b-enquiry-by-id/:enquiryId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateB2BEnquiryById)
enquiryRouter.put("/update-b2c-enquiry-by-id/:enquiryId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),updateB2CEnquiryById)
enquiryRouter.delete("/delete-b2b-enquiry-by-id/:enquiryId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteB2BEnquiryById)
enquiryRouter.delete("/delete-b2c-enquiry-by-id/:enquiryId",authMiddleware,roleMiddleware(["org_admin","operational_consultant"]),deleteB2CEnquiryById)

export default enquiryRouter