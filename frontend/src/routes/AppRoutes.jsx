
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
import { SamplePackageRoutes } from "./SamplePackageRoutes";
import { PrivateTripsRoutes } from "./PrivateTripsRoutes";
import PreviewPdf from "../components/Share/Share Pdf/PreviewPdf";
import { PreviewPdfRoutes } from "./PreviewPdfRoutes";

function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <Routes>
        {/* 🔐 Auth */}
        <Route path="/auth" element={<LoginPage />} />
        {/* <Route path="/tripDetails/:tripId" element={<PreviewPdf />} /> */}
        {PreviewPdfRoutes}

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
          {SamplePackageRoutes}
          {PrivateTripsRoutes}

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
