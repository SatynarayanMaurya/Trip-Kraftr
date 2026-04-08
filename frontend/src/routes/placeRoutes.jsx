import React from 'react'
import { Route } from 'react-router-dom'
import RoleRoute from "../utils/RoleRoutes"

import Places from '../pages/Places'
import AddPlace from '../components/Places/AddPlace'
import UpdatePlace from '../components/Places/UpdatePlace'

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


    </>
);