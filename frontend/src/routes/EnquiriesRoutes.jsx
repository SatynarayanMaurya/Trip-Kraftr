



import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";
import Enquiries from "../pages/Enquiries";
import AddEnquiry from "../components/Enquiries/Add Enquiry/AddEnquiry";
import ViewB2BEnquiry from "../components/Enquiries/View Enquiry/ViewB2BEnquiry";
import ViewB2CEnquiry from "../components/Enquiries/View Enquiry/ViewB2CEnquiry";
import EditB2BEnquiry from "../components/Enquiries/Edit Enquiry/EditB2BEnquiry";
import EditB2CEnquiry from "../components/Enquiries/Edit Enquiry/EditB2CEnquiry";

// 🔥 Lazy imports
const Accounts = lazy(() => import("../pages/Accounts"));
const AddAccount = lazy(() => import("../components/Accounts/AddAccount"));

export const EnquiriesRoutes = (
  <>
    <Route
      path="enquiries"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <Enquiries />
        </RoleRoute>
      }
    />

    <Route
      path="enquiries/add-enquiry"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddEnquiry />
        </RoleRoute>
      }
    />

    <Route
      path="enquiries/view-b2b/:enquiryId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewB2BEnquiry />
        </RoleRoute>
      }
    />

    <Route
      path="enquiries/view-b2c/:enquiryId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewB2CEnquiry />
        </RoleRoute>
      }
    />

    <Route
      path="enquiries/edit-b2b/:enquiryId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <EditB2BEnquiry />
        </RoleRoute>
      }
    />

    <Route
      path="enquiries/edit-b2c/:enquiryId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <EditB2CEnquiry />
        </RoleRoute>
      }
    />

  </>
);


