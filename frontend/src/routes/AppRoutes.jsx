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
import NotFound from '../components/NotFound/NotFound'
import Unauthorized from '../components/NotFound/Unauthorized'
import { regionRoutes } from './RegionRoutes'
import { subRegionRoutes } from './SubRegionRoutes'
import { masterRegionRoutes } from './MasterRegionRoutes'
import { regionImagesRoutes } from './RegionImagesRoutes'
import { PlaceRoutes } from './placeRoutes'
import { ActivityRoutes } from './ActivityRoutes'


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
        {regionRoutes}
        {masterRegionRoutes}
        {regionImagesRoutes}
        {subRegionRoutes}
        {PlaceRoutes}
        {ActivityRoutes}

        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}

export default AppRoutes