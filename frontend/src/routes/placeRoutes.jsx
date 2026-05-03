

import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";

// 🔥 Lazy imports
const Places = lazy(() => import("../pages/Places"));
const AddPlace = lazy(() => import("../components/Places/AddPlace"));
const UpdatePlace = lazy(() => import("../components/Places/UpdatePlace"));
const ViewPlace = lazy(() => import("../components/Places/ViewPlace"));

export const PlaceRoutes = (
  <>
    <Route
      path="places"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <Places />
        </RoleRoute>
      }
    />

    <Route
      path="places/add-place"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddPlace />
        </RoleRoute>
      }
    />

    <Route
      path="places/update-place/:placeId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <UpdatePlace />
        </RoleRoute>
      }
    />

    <Route
      path="places/view-place/:placeId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewPlace />
        </RoleRoute>
      }
    />
  </>
);















// import React from 'react'
// import { Route } from 'react-router-dom'
// import RoleRoute from "../utils/RoleRoutes"

// import Places from '../pages/Places'
// import AddPlace from '../components/Places/AddPlace'
// import UpdatePlace from '../components/Places/UpdatePlace'
// import ViewPlace from '../components/Places/ViewPlace'

// export const PlaceRoutes = (
//     <>
//         <Route
//             path="places"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <Places />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="places/add-place"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <AddPlace />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="places/update-place/:placeId"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <UpdatePlace />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="places/view-place/:placeId"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <ViewPlace />
//                 </RoleRoute>
//             }
//         />


//     </>
// );