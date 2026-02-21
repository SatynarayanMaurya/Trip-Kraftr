import React from 'react'
import Vehicle from '../pages/Vehicle'
import { Route } from 'react-router-dom'
export const VehicleRoutes= (
    <>
        <Route path="/vehicles" element={<Vehicle/>}/>
    </>
  )

