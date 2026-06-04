
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";
import SamplePackages from "../pages/SamplePackages";
import AddSamplePackage from "../components/Sample Package/Add Sample Package/AddSamplePackage";
import ViewSamplePackage from "../components/Sample Package/View Sample Package/ViewSamplePackage";
import EditSamplePackage from "../components/Sample Package/Edit Sample Package/EditSamplePackage";


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

    <Route
      path="sample-packages/view/:samplePackageId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewSamplePackage />
        </RoleRoute>
      }
    />

    <Route
      path="sample-packages/edit/:samplePackageId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <EditSamplePackage />
        </RoleRoute>
      }
    />

  </>
);


