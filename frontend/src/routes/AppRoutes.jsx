import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Hotels from '../pages/Hotels'
import { hotelRoutes } from './HotelRoutes'
import {VehicleRoutes} from './VehicleRoutes'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {hotelRoutes}
        {VehicleRoutes}
      </Route>
    </Routes>
  )
}

export default AppRoutes