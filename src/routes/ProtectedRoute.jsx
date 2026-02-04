import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated, loading , token } = useAuth();
  const location = useLocation();

  if (loading) {
    // Optional: a global loader while we hydrate auth
    return <div className="p-6 text-center">Loading…</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving where the user wanted to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
