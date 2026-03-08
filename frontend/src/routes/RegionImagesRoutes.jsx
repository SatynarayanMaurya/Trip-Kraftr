import { Route } from "react-router-dom"
import RoleRoute from "../utils/RoleRoutes"
import Regions from "../pages/Regions"
import AddRegion from "../components/Regions/AddRegion"
import SubRegions from "../pages/SubRegions";
import AddSubRegion from "../components/Sub Region/AddSubRegion";
import RegionImages from "../pages/RegionImages";
import AddRegionImage from "../components/Regions/AddRegionImage";

export const regionImagesRoutes = (
  <>
    <Route
      path="regions-images"
      element={
        <RoleRoute allowedRoles={["super_admin"]}>
          <RegionImages />
        </RoleRoute>
      }
    />

    <Route
      path="regions-images/add-region-image"
      element={
        <RoleRoute allowedRoles={["super_admin"]}>
          <AddRegionImage />
        </RoleRoute>
      }
    />

  </>
);