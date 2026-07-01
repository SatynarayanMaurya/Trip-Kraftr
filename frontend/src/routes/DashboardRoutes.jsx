import { Route } from "react-router-dom"
import CreatePlan from "../components/Plans/CreatePlan"
import Dashboard from "../pages/Dashboard"
import React from "react";
export const dashboardRoutes = (
  <Route path="dashboard">
    <Route index element={<Dashboard />} />
    <Route path="add-plan" element={<CreatePlan />} />
  </Route>
)