



import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";

// 🔥 Lazy imports
const Activities = lazy(() => import("../pages/Activities"));
const AddActivity = lazy(() => import("../components/Activities/AddActivity"));
const UpdateActivity = lazy(() => import("../components/Activities/UpdateActivity"));
const ViewActivity = lazy(() => import("../components/Activities/ViewActivity"));

export const ActivityRoutes = (
  <>
    <Route
      path="activities"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <Activities />
        </RoleRoute>
      }
    />

    <Route
      path="activities/add-activity"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddActivity />
        </RoleRoute>
      }
    />

    <Route
      path="activities/update-activity/:activityId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <UpdateActivity />
        </RoleRoute>
      }
    />

    <Route
      path="activities/view-activity/:activityId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewActivity />
        </RoleRoute>
      }
    />
  </>
);














// import React from 'react'
// import { Route } from 'react-router-dom'
// import RoleRoute from "../utils/RoleRoutes"

// import Activities from '../pages/Activities'
// import AddActivity from '../components/Activities/AddActivity'
// import UpdateActivity from '../components/Activities/UpdateActivity'
// import ViewActivity from '../components/Activities/ViewActivity'

// export const ActivityRoutes = (
//     <>
//         <Route
//             path="activities"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <Activities />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="activities/add-activity"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <AddActivity />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="activities/update-activity/:activityId"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <UpdateActivity />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="activities/view-activity/:activityId"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <ViewActivity />
//                 </RoleRoute>
//             }
//         />


//     </>
// );