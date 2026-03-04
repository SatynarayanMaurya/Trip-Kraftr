import { useSelector } from "react-redux";
import Unauthorized from "../components/NotFound/Unauthorized";

const RoleRoute = ({ allowedRoles=["super_admin"], children }) => {
    const userDetails = useSelector((state) => state.user.userDetails)
    if (!allowedRoles.includes(userDetails?.role)) {
        return <Unauthorized />
    }

    return children;
};

export default RoleRoute;