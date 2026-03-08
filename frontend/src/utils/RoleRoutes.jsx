import { useSelector } from "react-redux";
import Unauthorized from "../components/NotFound/Unauthorized";
import { jwtDecode } from "jwt-decode";

const RoleRoute = ({ allowedRoles=["super_admin"], children }) => {
    const userDetails = useSelector((state) => state.user.userDetails)
    const isProduction = useSelector((state)=>state.user.isProduction)
    const token = localStorage.getItem("token")
    let role ;
    try{
        const decodedToken = jwtDecode(token)
        role = decodedToken?.role
    }
    catch(error){
        if (!isProduction) {
          console.log("========= ERROR DEBUG START =========");
          console.log("Error:", error);
          console.log("Response:", error?.response);
          console.log("========= ERROR DEBUG END =========");
        }
        toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
      }

    if (!userDetails && allowedRoles?.includes(role)) {
        return children; 
    }
    if (!allowedRoles.includes(userDetails?.role)) {
        return <Unauthorized />
    }
    
    return children;
};

export default RoleRoute;