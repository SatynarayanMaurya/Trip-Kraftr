import { Route } from "react-router-dom"
import Hotels from "../pages/Hotels"
import AddHotel from "../components/Hotels/AddHotel"
import ChooseHotelType from "../components/Hotels/ChooseHotelType"
import Plans from "../pages/Plans"
import CreatePlan from "../components/Plans/CreatePlan"
import Organizations from "../pages/Organizations"
import AddOrganization from "../components/Organization/AddOrganization"
import AddOrganizationAdmin from "../components/Organization/AddOrganizationAdmin"

export const organizationRoutes = (
  <Route path="organizations">
    <Route index element={<Organizations />} />
    <Route path="add-organization" element={<AddOrganization/>}></Route>
    <Route path="add-org-admin" element={<AddOrganizationAdmin/>}></Route>
  </Route>
)