import React from 'react'
import Vehicle from '../pages/Vehicle'
import { Route } from 'react-router-dom'
import RoleRoute from "../utils/RoleRoutes"
import AddVehicle from '../components/Vehicles/AddVehicle'
import UpdateVehicle from '../components/Vehicles/UpdateVehicle'

export const VehicleRoutes = (
    <>
        <Route
            path="vehicles"
            element={
                <RoleRoute allowedRoles={["org_admin"]}>
                    <Vehicle />
                </RoleRoute>
            }
        />

        <Route
            path="vehicles/add-vehicle"
            element={
                <RoleRoute allowedRoles={["org_admin"]}>
                    <AddVehicle />
                </RoleRoute>
            }
        />

        <Route
            path="vehicles/update-vehicle/:vehicleId"
            element={
                <RoleRoute allowedRoles={["org_admin"]}>
                    <UpdateVehicle />
                </RoleRoute>
            }
        />


    </>
);