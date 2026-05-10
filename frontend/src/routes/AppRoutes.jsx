
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 🔹 Lazy load only top-level pages/layouts
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const NotFound = lazy(() => import("../components/NotFound/NotFound"));
const Unauthorized = lazy(() => import("../components/NotFound/Unauthorized"));

// 🔹 Keep these normal (lightweight wrappers)
import { PrivateRoute } from "../utils/PrivateRoute";

// 🔹 Route modules (keep as is)
import { hotelRoutes } from "./HotelRoutes";
import { VehicleRoutes } from "./VehicleRoutes";
import { dashboardRoutes } from "./DashboardRoutes";
import { planRoutes } from "./PlanRoutes";
import { organizationRoutes } from "./OrganizationRoutes";
import { regionRoutes } from "./RegionRoutes";
import { subRegionRoutes } from "./SubRegionRoutes";
import { masterRegionRoutes } from "./MasterRegionRoutes";
import { regionImagesRoutes } from "./RegionImagesRoutes";
import { PlaceRoutes } from "./placeRoutes";
import { ActivityRoutes } from "./ActivityRoutes";
import { PolicyRoutes } from "./PolicyRoutes";
import { GroupTripsRoutes } from "./GroupTripsRoutes";
import { AccountRoutes } from "./AccountRoutes";
import { EnquiriesRoutes } from "./EnquiriesRoutes";

function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <Routes>
        {/* 🔐 Auth */}
        <Route path="/auth" element={<LoginPage />} />

        {/* 🔐 Protected */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* default redirect */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* ✅ Modular routes (correct pattern) */}
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
          {PolicyRoutes}
          {GroupTripsRoutes}
          {AccountRoutes}
          {EnquiriesRoutes}

          {/* fallback */}
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* global fallback */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;







// import { Routes, Route } from 'react-router-dom'
// import MainLayout from '../layouts/MainLayout'
// import { hotelRoutes } from './HotelRoutes'
// import {VehicleRoutes} from './VehicleRoutes'
// import LoginPage from '../pages/LoginPage'
// import { PrivateRoute } from '../utils/PrivateRoute'
// import { dashboardRoutes } from './DashboardRoutes'
// import { Navigate } from 'react-router-dom'
// import { planRoutes } from './PlanRoutes'
// import { organizationRoutes } from './OrganizationRoutes'
// import NotFound from '../components/NotFound/NotFound'
// import Unauthorized from '../components/NotFound/Unauthorized'
// import { regionRoutes } from './RegionRoutes'
// import { subRegionRoutes } from './SubRegionRoutes'
// import { masterRegionRoutes } from './MasterRegionRoutes'
// import { regionImagesRoutes } from './RegionImagesRoutes'
// import { PlaceRoutes } from './placeRoutes'
// import { ActivityRoutes } from './ActivityRoutes'
// import { PolicyRoutes } from './PolicyRoutes'
// import { GroupTripsRoutes } from './GroupTripsRoutes'


// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/auth" element={<LoginPage />}/>
//       <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
//       <Route index element={<Navigate to="/dashboard" replace />} />

//         {dashboardRoutes}
//         {hotelRoutes}
//         {VehicleRoutes}
//         {organizationRoutes}
//         {planRoutes}
//         {regionRoutes}
//         {masterRegionRoutes}
//         {regionImagesRoutes}
//         {subRegionRoutes}
//         {PlaceRoutes}
//         {ActivityRoutes}
//         {PolicyRoutes}
//         {GroupTripsRoutes}

//         <Route path="*" element={<NotFound />} />
//       </Route>
//       <Route path="*" element={<Navigate to="/auth" replace />} />
//     </Routes>
//   )
// }

// export default AppRoutes