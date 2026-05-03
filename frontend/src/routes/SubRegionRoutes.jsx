

import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";

// 🔥 Lazy imports
const SubRegions = lazy(() => import("../pages/SubRegions"));
const AddSubRegion = lazy(() => import("../components/Sub Region/AddSubRegion"));
const UpdateSubRegion = lazy(() => import("../components/Sub Region/UpdateSubRegion"));
const ViewSubRegion = lazy(() => import("../components/Sub Region/ViewSubRegion"));

export const subRegionRoutes = (
  <>
    <Route
      path="sub-regions"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <SubRegions />
        </RoleRoute>
      }
    />

    <Route
      path="sub-regions/add-sub-region"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddSubRegion />
        </RoleRoute>
      }
    />

    <Route
      path="sub-regions/update-sub-region/:subRegionId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <UpdateSubRegion />
        </RoleRoute>
      }
    />

    <Route
      path="sub-regions/view-sub-region/:subRegionId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewSubRegion />
        </RoleRoute>
      }
    />
  </>
);











// import { Route } from "react-router-dom"
// import RoleRoute from "../utils/RoleRoutes"
// import Regions from "../pages/Regions"
// import AddRegion from "../components/Regions/AddRegion"
// import SubRegions from "../pages/SubRegions";
// import AddSubRegion from "../components/Sub Region/AddSubRegion";
// import UpdateSubRegion from "../components/Sub Region/UpdateSubRegion";
// import ViewSubRegion from "../components/Sub Region/ViewSubRegion";

// export const subRegionRoutes = (
//   <>
//     <Route
//       path="sub-regions"
//       element={
//         <RoleRoute allowedRoles={["org_admin"]}>
//           <SubRegions />
//         </RoleRoute>
//       }
//     />

//     <Route
//       path="sub-regions/add-sub-region"
//       element={
//         <RoleRoute allowedRoles={["org_admin"]}>
//           <AddSubRegion />
//         </RoleRoute>
//       }
//     />

//     <Route
//       path="sub-regions/update-sub-region/:subRegionId"
//       element={
//         <RoleRoute allowedRoles={["org_admin"]}>
//           <UpdateSubRegion />
//         </RoleRoute>
//       }
//     />

//     <Route
//       path="sub-regions/view-sub-region/:subRegionId"
//       element={
//         <RoleRoute allowedRoles={["org_admin"]}>
//           <ViewSubRegion />
//         </RoleRoute>
//       }
//     />

//   </>
// );