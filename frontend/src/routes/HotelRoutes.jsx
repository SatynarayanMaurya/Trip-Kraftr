
import React from 'react'
import { Route } from 'react-router-dom'
import RoleRoute from "../utils/RoleRoutes"
import ViewHotel from "../components/Hotels/View Hotel/ViewHotel"
import Hotels from '../pages/Hotels';
import AddHotel from '../components/Hotels/AddHotel';

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

        <Route
            path="hotels/view-hotel/:hotelId"
            element={
                <RoleRoute allowedRoles={["org_admin"]}>
                    <ViewHotel />
                </RoleRoute>
            }
        />


    </>
);