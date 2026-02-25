import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    localStorage.clear();
    return <Navigate to="/auth" replace />
  }

  try {
    const decoded = jwtDecode(token);

    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return <Navigate to="/auth" replace />;
    }

    return children;

  } catch (error) {
    localStorage.clear();
    return <Navigate to="/auth" replace />;
  }
};