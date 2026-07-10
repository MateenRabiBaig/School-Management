import { Navigate } from "react-router-dom";
import { getStoredUser, getToken } from "../utils/authStorage";

function ProtectedRoute({ children, allowedRoles }) {
  const user = getStoredUser();
  const role = user?.role || localStorage.getItem("role");
  const token = getToken();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (role !== "teacher" && !token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") {
      return ( <Navigate to="/admin" replace /> );
    }

    if (role === "student") {
      return ( <Navigate to="/student" replace /> );
    }

    if (role === "teacher") {
      return ( <Navigate to="/teacher" replace /> );
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;