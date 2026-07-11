import { Navigate } from "react-router-dom";
import { getStoredUser, getToken } from "../utils/authStorage";

function ProtectedRoute({ children, allowedRoles }) {
  const user = getStoredUser();
  const token = getToken();

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return ( <Navigate to="/admin" replace /> );
    }

    if (user.role === "student") {
      return ( <Navigate to="/student" replace /> );
    }

    if (user.role === "teacher") {
      return ( <Navigate to="/teacher" replace /> );
    }

    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;