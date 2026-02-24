import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Hotels from '../pages/Hotels'
import { hotelRoutes } from './HotelRoutes'
import {VehicleRoutes} from './VehicleRoutes'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<LoginPage />}/>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        {hotelRoutes}
        {VehicleRoutes}
      </Route>
    </Routes>
  )
}

export default AppRoutes