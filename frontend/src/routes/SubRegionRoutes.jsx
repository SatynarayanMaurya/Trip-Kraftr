import { Route } from "react-router-dom"
import RoleRoute from "../utils/RoleRoutes"
import Regions from "../pages/Regions"
import AddRegion from "../components/Regions/AddRegion"
import SubRegions from "../pages/SubRegions";
import AddSubRegion from "../components/Sub Region/AddSubRegion";

export const subRegionRoutes = (
  <>
    <Route
      path="sub-regions"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <SubRegions />
        </RoleRoute>
      }
    />

    <Route
      path="sub-regions/add-sub-region"
      element={
        <RoleRoute allowedRoles={["org_admin"]}>
          <AddSubRegion />
        </RoleRoute>
      }
    />

  </>
);