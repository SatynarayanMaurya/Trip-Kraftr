import { Route } from "react-router-dom"
import RoleRoute from "../utils/RoleRoutes"
import Regions from "../pages/Regions"
import AddRegion from "../components/Regions/AddRegion"

export const regionRoutes = (
  <>
    <Route
      path="regions"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <Regions />
        </RoleRoute>
      }
    />

    <Route
      path="regions/add-region"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddRegion />
        </RoleRoute>
      }
    />

  </>
);