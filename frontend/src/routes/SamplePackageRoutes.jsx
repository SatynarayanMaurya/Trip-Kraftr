
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";
import SamplePackages from "../pages/SamplePackages";
import AddSamplePackage from "../components/Sample Package/Add Sample Package/AddSamplePackage";


export const SamplePackageRoutes = (
  <>
    <Route
      path="sample-packages"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <SamplePackages />
        </RoleRoute>
      }
    />

    <Route
      path="sample-packages/add-sample-package"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddSamplePackage />
        </RoleRoute>
      }
    />

  </>
);


