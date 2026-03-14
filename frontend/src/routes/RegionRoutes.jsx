import { Route } from "react-router-dom"
import RoleRoute from "../utils/RoleRoutes"
import Regions from "../pages/Regions"
import AddRegion from "../components/Regions/AddRegion"
import ViewRegion from "../components/Regions/ViewRegion";
import EditRegion from "../components/Regions/EditRegion";

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

    <Route
      path="regions/view-region/:regionId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <ViewRegion />
        </RoleRoute>
      }
    />

    <Route
      path="regions/edit-region/:regionId"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <EditRegion />
        </RoleRoute>
      }
    />

  </>
);