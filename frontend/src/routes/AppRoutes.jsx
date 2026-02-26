import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Hotels from '../pages/Hotels'
import { hotelRoutes } from './HotelRoutes'
import {VehicleRoutes} from './VehicleRoutes'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import { PrivateRoute } from '../utils/PrivateRoute'
import { planRoutes } from './PlanRoutes'


function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<LoginPage />}/>
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        {planRoutes}
        {hotelRoutes}
        {VehicleRoutes}
      </Route>
    </Routes>
  )
}

export default AppRoutes