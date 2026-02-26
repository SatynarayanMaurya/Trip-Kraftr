import { Route } from "react-router-dom"
import CreatePlan from "../components/Plans/CreatePlan"

export const planRoutes = (
  <Route path="add-plan">
    <Route index element={<CreatePlan />} />
  </Route>
)