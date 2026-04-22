import React from 'react'
import { Route } from 'react-router-dom'
import RoleRoute from "../utils/RoleRoutes"

import GroupTrips from '../pages/GroupTrips'
import AddGroupTrip from '../components/Group Trips/AddGroupTrip'
import ViewGroupTrip from '../components/Group Trips/View Group Trip/ViewGroupTrip'

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

        {/* <Route
            path="places/view-place/:placeId"
            element={
                <RoleRoute allowedRoles={["org_admin"]}>
                    <ViewPlace />
                </RoleRoute>
            }
        /> */}


    </>
);