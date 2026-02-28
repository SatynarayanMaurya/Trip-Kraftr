import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { hotelRoutes } from './HotelRoutes'
import {VehicleRoutes} from './VehicleRoutes'
import LoginPage from '../pages/LoginPage'
import { PrivateRoute } from '../utils/PrivateRoute'
import { dashboardRoutes } from './DashboardRoutes'
import { Navigate } from 'react-router-dom'
import { planRoutes } from './PlanRoutes'
import { organizationRoutes } from './OrganizationRoutes'


function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<LoginPage />}/>
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
      <Route index element={<Navigate to="/dashboard" replace />} />

        {dashboardRoutes}
        {hotelRoutes}
        {VehicleRoutes}
        {organizationRoutes}
        {planRoutes}
      </Route>
    </Routes>
  )
}

export default AppRoutes