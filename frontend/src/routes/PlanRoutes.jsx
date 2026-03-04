

import { Route} from "react-router-dom";
import Plans from "../pages/Plans";
import CreatePlan from "../components/Plans/CreatePlan";
import RoleRoute from "../utils/RoleRoutes";

export const planRoutes = (
  <>
    <Route
      path="plans"
      element={
        <RoleRoute allowedRoles={["super_admin"]}>
          <Plans />
        </RoleRoute>
      }
    />

    <Route
      path="plans/add-plan"
      element={
        <RoleRoute allowedRoles={["super_admin"]}>
          <CreatePlan />
        </RoleRoute>
      }
    />
  </>
);
