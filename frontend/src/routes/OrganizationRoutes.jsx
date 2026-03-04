import { Route } from "react-router-dom"
import Organizations from "../pages/Organizations"
import AddOrganization from "../components/Organization/AddOrganization"
import AddOrganizationAdmin from "../components/Organization/AddOrganizationAdmin"
import RoleRoute from "../utils/RoleRoutes"

export const organizationRoutes = (
  <>
    <Route
      path="organizations"
      element={
        <RoleRoute allowedRoles={["super_admin"]}>
          <Organizations />
        </RoleRoute>
      }
    />

    <Route
      path="organizations/add-organization"
      element={
        <RoleRoute allowedRoles={["super_admin"]}>
          <AddOrganization />
        </RoleRoute>
      }
    />

    <Route
      path="organizations/add-org-admin"
      element={
        <RoleRoute allowedRoles={["super_admin"]}>
          <AddOrganizationAdmin />
        </RoleRoute>
      }
    />
  </>
);