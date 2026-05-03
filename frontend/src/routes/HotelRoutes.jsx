

import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";

// 🔥 Lazy imports (code splitting happens here)
const Hotels = lazy(() => import("../pages/Hotels"));
const AddHotel = lazy(() => import("../components/Hotels/AddHotel"));
const UpdateHotel = lazy(() => import("../components/Hotels/Update Hotel/UpdateHotel"));
const ViewHotel = lazy(() => import("../components/Hotels/View Hotel/ViewHotel"));
const Rooms = lazy(() => import("../components/Hotels/Rooms/Rooms"));
const RoomRates = lazy(() => import("../components/Hotels/Rooms/RoomRates"));

export const hotelRoutes = (
  <>
    <Route
      path="hotels"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <Hotels />
        </RoleRoute>
      }
    />

    <Route
      path="hotels/add-hotel"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddHotel />
        </RoleRoute>
      }
    />

    {/* Parent route */}
    <Route path="hotels/view-hotel/:hotelId">
      
      {/* Default: hotel details */}
      <Route
        index
        element={
          <RoleRoute allowedRoles={["org_admin"]}>
            <ViewHotel />
          </RoleRoute>
        }
      />

      {/* Rooms */}
      <Route path="manage-rooms">
        <Route
          index
          element={
            <RoleRoute allowedRoles={["org_admin"]}>
              <Rooms />
            </RoleRoute>
          }
        />

        <Route
          path="manage-rates"
          element={
            <RoleRoute allowedRoles={["org_admin"]}>
              <RoomRates />
            </RoleRoute>
          }
        />
      </Route>
    </Route>

    <Route
      path="hotels/update-hotel/:hotelId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <UpdateHotel />
        </RoleRoute>
      }
    />
  </>
);










// import React from 'react'
// import { Route } from 'react-router-dom'
// import RoleRoute from "../utils/RoleRoutes"
// import ViewHotel from "../components/Hotels/View Hotel/ViewHotel"
// import Hotels from '../pages/Hotels';
// import AddHotel from '../components/Hotels/AddHotel';
// import UpdateHotel from '../components/Hotels/Update Hotel/UpdateHotel';
// import Rooms from '../components/Hotels/Rooms/Rooms';
// import RoomRates from '../components/Hotels/Rooms/RoomRates';

// export const hotelRoutes = (
//     <>
//         <Route
//             path="hotels"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <Hotels />
//                 </RoleRoute>
//             }
//         />

//         <Route
//             path="hotels/add-hotel"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <AddHotel />
//                 </RoleRoute>
//             }
//         />

//         {/* ✅ Parent route */}
//         <Route
//             path="hotels/view-hotel/:hotelId"

//         >
//             {/* 👇 default = hotel details */}
//             <Route index element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <ViewHotel />
//                 </RoleRoute>
//             } />

//             {/* 👇 rooms list */}
//             <Route path="manage-rooms"  >
//                 <Route index element={
//                     <RoleRoute allowedRoles={["org_admin"]}>
//                         <Rooms />
//                     </RoleRoute>
//                 } />
//                 <Route path='manage-rates' element={
//                     <RoleRoute allowedRoles={["org_admin"]}>
//                         <RoomRates />
//                     </RoleRoute>
//                 } />

//             </Route>

//         </Route>

//         <Route
//             path="hotels/update-hotel/:hotelId"
//             element={
//                 <RoleRoute allowedRoles={["org_admin"]}>
//                     <UpdateHotel />
//                 </RoleRoute>
//             }
//         />


//     </>
// );