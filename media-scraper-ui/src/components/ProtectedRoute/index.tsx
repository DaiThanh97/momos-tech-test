import { Navigate } from "react-router-dom";
import { userService } from "../../services";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isTokenExpired = userService.isTokenExpired();

  if (isTokenExpired) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
