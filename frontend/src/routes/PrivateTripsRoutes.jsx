



import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";
import PrivateTrips from "../pages/PrivateTrips";
import AddPrivateTrip from "../components/Private Trips/Add Private Trip/AddPrivateTrip";
import ViewPrivateTrip from "../components/Private Trips/View Private Trip/ViewPrivateTrip";
import EditPrivateTrips from "../components/Private Trips/Edit Private Trip/EditPrivateTrips";


export const PrivateTripsRoutes = (
  <>
    <Route
      path="private-trips"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <PrivateTrips />
        </RoleRoute>
      }
    />

    <Route
      path="private-trips/add-private-trip"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddPrivateTrip />
        </RoleRoute>
      }
    />

    <Route
      path="private-trips/view/:privateTripId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewPrivateTrip />
        </RoleRoute>
      }
    />

    <Route
      path="private-trips/edit/:privateTripId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <EditPrivateTrips />
        </RoleRoute>
      }
    />

  </>
);


