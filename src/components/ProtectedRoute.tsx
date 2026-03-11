import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, Role } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Or a loader

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.requiresPasswordChange && location.pathname !== "/profile") {
    return (
      <Navigate to="/profile" replace state={{ forcedPasswordChange: true }} />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if they try to access something else
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
};
