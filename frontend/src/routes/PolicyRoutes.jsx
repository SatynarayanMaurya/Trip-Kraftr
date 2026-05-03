
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";

// 🔥 Lazy imports
const Policies = lazy(() => import("../pages/Policies"));
const AddPolicy = lazy(() => import("../components/Policies/AddPolicy"));

export const PolicyRoutes = (
  <>
    <Route
      path="policies"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <Policies />
        </RoleRoute>
      }
    />

    <Route
      path="policies/add-policy"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddPolicy />
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
// import Policies from '../pages/Policies'
// import AddPolicy from '../components/Policies/AddPolicy'

// export const PolicyRoutes = (
//     <>
//         <Route
//             path="policies"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <Policies />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="policies/add-policy"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <AddPolicy />
//                 </RoleRoute>
//             }
//         />


//     </>
// );