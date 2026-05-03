


import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";

// 🔥 Lazy imports (each becomes a separate chunk)
const GroupTrips = lazy(() => import("../pages/GroupTrips"));
const AddGroupTrip = lazy(() => import("../components/Group Trips/AddGroupTrip"));
const ViewGroupTrip = lazy(() => import("../components/Group Trips/View Group Trip/ViewGroupTrip"));
const EditGroupTrip = lazy(() => import("../components/Group Trips/Edit Group Trip/EditGroupTrip"));

export const GroupTripsRoutes = (
  <>
    <Route
      path="group-trips"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <GroupTrips />
        </RoleRoute>
      }
    />

    <Route
      path="group-trips/add-group-trip"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddGroupTrip />
        </RoleRoute>
      }
    />

    <Route
      path="group-trips/view/:groupTripId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewGroupTrip />
        </RoleRoute>
      }
    />

    <Route
      path="group-trips/edit/:groupTripId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <EditGroupTrip />
        </RoleRoute>
      }
    />
  </>
);





// import React from 'react'
// import { Route } from 'react-router-dom'
// import RoleRoute from "../utils/RoleRoutes"

// import GroupTrips from '../pages/GroupTrips'
// import AddGroupTrip from '../components/Group Trips/AddGroupTrip'
// import ViewGroupTrip from '../components/Group Trips/View Group Trip/ViewGroupTrip'
// import EditGroupTrip from '../components/Group Trips/Edit Group Trip/EditGroupTrip'

// export const GroupTripsRoutes = (
//     <>
//         <Route
//             path="group-trips"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <GroupTrips />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="group-trips/add-group-trip"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <AddGroupTrip />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="group-trips/view/:groupTripId"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <ViewGroupTrip />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="group-trips/edit/:groupTripId"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <EditGroupTrip />
//                 </RoleRoute>
//             }
//         />


//     </>
// );