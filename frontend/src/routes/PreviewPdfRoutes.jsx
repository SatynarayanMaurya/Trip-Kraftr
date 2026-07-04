

import React, { lazy } from "react";
import { Route } from "react-router-dom";
import RoleRoute from "../utils/RoleRoutes";
import PreviewPdf from "../components/Share/Share Pdf/PreviewPdf";


export const PreviewPdfRoutes = (
  <>
    <Route
      path="private-trip/:tripId"
      element={<PreviewPdf /> }
    />
    <Route
      path="sample-package/:tripId"
      element={<PreviewPdf /> }
    />
  </>
);