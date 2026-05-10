



import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";
import ViewB2BAccount from "../components/Accounts/View Account/ViewB2BAccount";
import ViewB2CAccount from "../components/Accounts/View Account/ViewB2CAccount";
import EditB2BAccount from "../components/Accounts/Edit Account/EditB2BAccount";
import EditB2CAccount from "../components/Accounts/Edit Account/EditB2CAccount";
import Enquiries from "../pages/Enquiries";
import AddEnquiry from "../components/Enquiries/Add Enquiry/AddEnquiry";

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

    {/* <Route
      path="accounts/view-b2b/:accountId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewB2BAccount />
        </RoleRoute>
      }
    />

    <Route
      path="accounts/view-b2c/:accountId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewB2CAccount />
        </RoleRoute>
      }
    />

    <Route
      path="accounts/update-b2b/:accountId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <EditB2BAccount />
        </RoleRoute>
      }
    />

    <Route
      path="accounts/update-b2c/:accountId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <EditB2CAccount />
        </RoleRoute>
      }
    /> */}

  </>
);


