import { Route } from "react-router-dom"
import RoleRoute from "../utils/RoleRoutes"
import Regions from "../pages/Regions"
import AddRegion from "../components/Regions/AddRegion"
import MasterRegions from "../pages/MasterRegions";
import AddMasterRegion from "../components/Regions/AddMasterRegion";

export const masterRegionRoutes = (
  <>
    <Route
      path="master-regions"
      element={
        <RoleRoute allowedRoles={["super_admin"]}>
          <MasterRegions />
        </RoleRoute>
      }
    />

    <Route
      path="master-regions/add-master-region"
      element={
        <RoleRoute allowedRoles={["super_admin"]}>
          <AddMasterRegion />
        </RoleRoute>
      }
    />

  </>
);